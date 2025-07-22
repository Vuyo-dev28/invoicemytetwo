'use client';
export const dynamic = "force-dynamic";

import { useState, Suspense, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, Send, Check, Settings, X, Info } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { DashboardStats } from '@/types'; 
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/use-local-storage';

const WelcomeBanner = () => {
    const searchParams = useSearchParams();
    const isNewUser = searchParams.get('new_user') === 'true';
    const [showBanner, setShowBanner] = useLocalStorage('showWelcomeBanner', isNewUser);
    
    // Always display the banner
    // if (!showBanner) {
    //     return null;
    // }

    return (
        <Alert className="mb-6 bg-primary/10 border-primary/20 text-primary-foreground">
             <Info className="h-4 w-4 text-primary" />
            <div className="flex items-center justify-between">
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
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:bg-primary/20 hover:text-primary"
                        onClick={() => setShowBanner(false)}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Dismiss</span>
                    </Button>
                </div>
            </div>
        </Alert>
    );
};

function DashboardPageContent() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchUserAndStats = async () => {
          const supabase = createClient();
          
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Fetch total amount
                const { data: amountData, error: amountError } = await supabase
                    .from('invoices')
                    .select('total')
                    .eq('status', 'paid')
                    .eq('user_id', user.id);
                if (amountError) console.error('Error fetching total amount:', amountError.message);
                const totalAmount = amountData?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;

                // Fetch total clients
                const { count: clientCount, error: clientError } = await supabase
                    .from('clients')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);
                if (clientError) console.error('Error fetching client count:', clientError.message);

                // Fetch paid invoices count
                const { count: paidInvoicesCount, error: paidInvoicesError } = await supabase
                    .from('invoices')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'paid')
                    .eq('user_id', user.id);
                if (paidInvoicesError) console.error('Error fetching paid invoices count:', paidInvoicesError.message);

                // Fetch pending invoices count
                const { count: pendingInvoicesCount, error: pendingInvoicesError } = await supabase
                    .from('invoices')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'sent')
                    .eq('user_id', user.id);
                if (pendingInvoicesError) console.error('Error fetching pending invoices count:', pendingInvoicesError.message);

                setStats({
                    totalAmount,
                    totalClients: clientCount || 0,
                    paidInvoices: paidInvoicesCount || 0,
                    pendingInvoices: pendingInvoicesCount || 0
                });

            } else {
                router.push('/login');
            }
        }
        fetchUserAndStats();
    }, [router]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="space-y-8">
            <WelcomeBanner />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
