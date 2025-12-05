'use client';
export const dynamic = "force-dynamic";

import { useState, Suspense, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, Send, Check, Settings, X, Info, TrendingUp, FileText } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { DashboardStats } from '@/types'; 
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/use-local-storage';
import EmailConfirmationBanner from '@/components/EmailConfirmationBanner';
import { RevenueTrendChart } from '@/components/dashboard/revenue-trend-chart';
import { StatusDistributionChart } from '@/components/dashboard/status-distribution-chart';
import { TopClientsChart } from '@/components/dashboard/top-clients-chart';
import { GrowthMetrics } from '@/components/dashboard/growth-metrics';

const WelcomeBanner = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isNewUser = searchParams.get('new_user') === 'true';
    const [showBanner, setShowBanner] = useLocalStorage('showWelcomeBanner', isNewUser);
    const handleStartTrial = () => {
        router.push('/subscription');
    };

    return (
        <Alert className="mb-6 bg-primary/10 border-primary/20 text-primary-foreground">
             <Info className="h-4 w-4 text-primary" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div>
                    <AlertTitle className="font-bold text-primary">Welcome to InvoiceMyte!</AlertTitle>
                    <AlertDescription className="text-primary/90">
                        Get started by setting up your company details. This will auto-fill your documents.
                    </AlertDescription>
                </div>
                <div className="flex items-center gap-4">
                    <Button asChild variant="link" className="text-primary hover:text-primary/80">
                        <Link href="/settings">
                            Go to Settings <Settings className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>

                    <Button 
                        variant="default" 
                        className="bg-primary text-white hover:bg-primary/90"
                        onClick={handleStartTrial}
                    >
                        Start Free Trial
                    </Button>
                </div>
            </div>
        </Alert>
    );
};

function DashboardPageContent() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [statusData, setStatusData] = useState<any[]>([]);
    const [topClientsData, setTopClientsData] = useState<any[]>([]);
    const [growthMetrics, setGrowthMetrics] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();
    const [userEmail, setUserEmail] = useState('');
    const [isEmailConfirmed, setIsEmailConfirmed] = useState(true);
    const [userCurrency, setUserCurrency] = useState<string>('USD');

    useEffect(() => {
        const fetchUserAndStats = async () => {
          const supabase = createClient();
          setIsLoading(true);
          
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUserEmail(user.email || '');
                setIsEmailConfirmed(!!user.email_confirmed_at);
                
                // Fetch user's currency preference
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('currency')
                    .eq('id', user.id)
                    .maybeSingle();
                
                if (profileData?.currency) {
                    setUserCurrency(profileData.currency);
                }

                // Fetch invoices with limit for better performance
                const { data: allInvoices, error: invoicesError } = await supabase
                    .from('invoices')
                    .select('id, total, status, issue_date, client_id, clients(name)')
                    .eq('user_id', user.id)
                    .order('issue_date', { ascending: false })
                    .limit(1000);

                if (invoicesError) {
                    console.error('Error fetching invoices:', invoicesError.message);
                    setIsLoading(false);
                    return;
                }

                // Fetch client count in parallel
                const clientCountPromise = supabase
                    .from('clients')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                // Calculate basic stats efficiently (single pass)
                let totalAmount = 0;
                let paidInvoicesCount = 0;
                let pendingInvoicesCount = 0;
                
                if (allInvoices) {
                    for (const invoice of allInvoices) {
                        if (invoice.status === 'paid') {
                            totalAmount += invoice.total || 0;
                            paidInvoicesCount++;
                        } else if (invoice.status === 'sent') {
                            pendingInvoicesCount++;
                        }
                    }
                }

                // Wait for client count
                const { count: clientCount } = await clientCountPromise;

                setStats({
                    totalAmount,
                    totalClients: clientCount || 0,
                    paidInvoices: paidInvoicesCount,
                    pendingInvoices: pendingInvoicesCount
                });

                // Use requestIdleCallback for heavy calculations if available
                const calculateAnalytics = () => {
                    // Calculate revenue trend (last 12 months)
                    const now = new Date();
                    const months: Array<{ month: string; revenue: number; invoices: number }> = [];
                    const monthMap = new Map<string, { revenue: number; invoices: number }>();
                    
                    for (let i = 11; i >= 0; i--) {
                        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        months.push({
                            month: date.toISOString(),
                            revenue: 0,
                            invoices: 0
                        });
                        monthMap.set(monthKey, months[months.length - 1]);
                    }

                    if (allInvoices) {
                        for (const invoice of allInvoices) {
                            if (invoice.status === 'paid' && invoice.issue_date) {
                                const invoiceDate = new Date(invoice.issue_date);
                                const monthKey = `${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}`;
                                const monthData = monthMap.get(monthKey);
                                if (monthData) {
                                    monthData.revenue += invoice.total || 0;
                                    monthData.invoices += 1;
                                }
                            }
                        }
                    }

                    setRevenueData(months);

                    // Calculate status distribution
                    const statusCounts: Record<string, number> = {};
                    if (allInvoices) {
                        for (const invoice of allInvoices) {
                            statusCounts[invoice.status] = (statusCounts[invoice.status] || 0) + 1;
                        }
                    }

                    const statusColors: Record<string, string> = {
                        draft: 'hsl(var(--muted))',
                        sent: 'hsl(var(--chart-2))',
                        paid: 'hsl(var(--chart-1))',
                        overdue: 'hsl(var(--destructive))',
                    };

                    const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        value,
                        color: statusColors[name] || 'hsl(var(--muted))'
                    }));

                    setStatusData(statusChartData);

                    // Calculate top clients by revenue
                    const clientRevenue: Record<string, { name: string; revenue: number; invoices: number }> = {};
                    if (allInvoices) {
                        for (const invoice of allInvoices) {
                            // Support both object and array shapes for joined client
                            const clientName =
                                (invoice as any)?.clients?.name ??
                                (Array.isArray((invoice as any)?.clients) ? (invoice as any)?.clients?.[0]?.name : undefined);

                            if (invoice.status === 'paid' && clientName) {
                                if (!clientRevenue[clientName]) {
                                    clientRevenue[clientName] = { name: clientName, revenue: 0, invoices: 0 };
                                }
                                clientRevenue[clientName].revenue += invoice.total || 0;
                                clientRevenue[clientName].invoices += 1;
                            }
                        }
                    }

                    const topClients = Object.values(clientRevenue)
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 5);

                    setTopClientsData(topClients);
                };

                // Defer heavy calculations
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(calculateAnalytics, { timeout: 2000 });
                } else {
                    setTimeout(calculateAnalytics, 0);
                }

                // Calculate growth metrics (this month vs last month)
                const now = new Date();
                const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

                const thisMonthInvoices = allInvoices?.filter(inv => {
                    const invDate = new Date(inv.issue_date);
                    return invDate >= currentMonth && inv.status === 'paid';
                }) || [];

                const lastMonthInvoices = allInvoices?.filter(inv => {
                    const invDate = new Date(inv.issue_date);
                    return invDate >= lastMonth && invDate <= lastMonthEnd && inv.status === 'paid';
                }) || [];

                const thisMonthRevenue = thisMonthInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
                const lastMonthRevenue = lastMonthInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

                const thisMonthCount = thisMonthInvoices.length;
                const lastMonthCount = lastMonthInvoices.length;

                // Calculate client growth
                const thisMonthClients = new Set(
                    thisMonthInvoices.map(inv => inv.client_id).filter(Boolean)
                ).size;
                const lastMonthClients = new Set(
                    lastMonthInvoices.map(inv => inv.client_id).filter(Boolean)
                ).size;

                setGrowthMetrics([
                    {
                        label: 'This Month Revenue',
                        current: thisMonthRevenue,
                        previous: lastMonthRevenue,
                        isCurrency: true,
                        icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
                    },
                    {
                        label: 'This Month Invoices',
                        current: thisMonthCount,
                        previous: lastMonthCount,
                        isCurrency: false,
                        icon: <FileText className="h-4 w-4 text-muted-foreground" />
                    },
                    {
                        label: 'Active Clients',
                        current: thisMonthClients,
                        previous: lastMonthClients,
                        isCurrency: false,
                        icon: <Users className="h-4 w-4 text-muted-foreground" />
                    },
                    {
                        label: 'Average Invoice',
                        current: thisMonthCount > 0 ? thisMonthRevenue / thisMonthCount : 0,
                        previous: lastMonthCount > 0 ? lastMonthRevenue / lastMonthCount : 0,
                        isCurrency: true,
                        icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    }
                ]);

                setIsLoading(false);
            } else {
                router.push('/login');
            }
        }
        fetchUserAndStats();
    }, [router]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: userCurrency }).format(amount);
    };

    return (
        <div className="space-y-8" data-tour="dashboard">
            {!isEmailConfirmed && <EmailConfirmationBanner email={userEmail} />}
            <WelcomeBanner />
            
            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-tour="dashboard-stats">
                {stats ? (
                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
                                <p className="text-xs text-muted-foreground">From all paid invoices</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{stats.totalClients}</div>
                                <p className="text-xs text-muted-foreground">Total clients managed</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{stats.paidInvoices}</div>
                                <p className="text-xs text-muted-foreground">Successfully completed invoices</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                                <Send className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{stats.pendingInvoices}</div>
                                <p className="text-xs text-muted-foreground">Invoices awaiting payment</p>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-5 w-3/4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-1/2 mb-2" />
                                <Skeleton className="h-4 w-full" />
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Growth Metrics */}
            {!isLoading && growthMetrics.length > 0 && (
                <GrowthMetrics metrics={growthMetrics} currency={userCurrency} />
            )}

            {/* Charts Section */}
            {!isLoading && (
                <div className="grid gap-4 md:grid-cols-2" data-tour="dashboard-charts">
                    {revenueData.length > 0 && (
                        <RevenueTrendChart data={revenueData} currency={userCurrency} />
                    )}
                    {statusData.length > 0 && (
                        <StatusDistributionChart data={statusData} />
                    )}
                </div>
            )}

            {/* Top Clients Chart */}
            {!isLoading && topClientsData.length > 0 && (
                <TopClientsChart data={topClientsData} currency={userCurrency} />
            )}

            {/* Loading State for Charts */}
            {isLoading && (
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-1/3" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-[300px] w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}


export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardPageContent />
        </Suspense>
    )
}
