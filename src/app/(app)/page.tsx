export const dynamic = "force-dynamic";

'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, Send, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { usePaystackPayment } from 'react-paystack';
import type { DashboardStats } from '@/types'; // Assuming you'll create this type
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const plans = {
  monthly: [
    {
      name: 'Free',
      price: '0',
      description: 'Explore and experience.',
      tagline: 'Dive into the possibilities.',
      buttonText: 'Current',
      isCurrent: true,
      features: ['Up to 3 free', 'Up to 2 free', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Beta access'],
    },
    {
      name: 'Starter',
      price: '9.99',
      description: 'Start small, dream big.',
      tagline: 'Unleash your potential.',
      buttonText: 'Upgrade',
      mostValued: true,
      features: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Beta access'],
    },
    {
      name: 'Professional',
      price: '52.00',
      description: 'Seize infinite growth.',
      tagline: 'Elevate your journey.',
      buttonText: 'Upgrade',
      features: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Beta access'],
    },
  ],
  yearly: [
    {
      name: 'Free',
      price: '0',
      description: 'Explore and experience.',
      tagline: 'Dive into the possibilities.',
      buttonText: 'Current',
      isCurrent: true,
       features: ['Up to 3 free', 'Up to 2 free', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Beta access'],
    },
    {
      name: 'Starter',
      price: '7.60',
      originalPrice: '9.99',
      discount: '24',
      description: 'Start small, dream big.',
      tagline: 'Unleash your potential.',
      buttonText: 'Upgrade',
      mostValued: true,
       features: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Beta access'],
    },
    {
      name: 'Professional',
      price: '39.00',
      originalPrice: '52.00',
      discount: '25',
      description: 'Seize infinite growth.',
      tagline: 'Elevate your journey.',
      buttonText: 'Upgrade',
      features: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Beta access'],
    },
  ],
};

const featureNames = ['Invoice', 'Proposals', 'eSign', 'Estimate', 'Credit note', 'Delivery note', 'Purchase order', 'Custom documents', 'Create website'];
const addOnFeatures = ['Custom fonts and colors', 'Custom domain', 'Multi page', 'Remove Bookipi branding'];

const addOn = {
    monthly: {
        price: '13.00',
    },
    yearly: {
        price: '9.99',
        originalPrice: '13.00',
        discount: '23'
    }
}

// Dummy table component for styling
const Table = ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <table className="w-full text-left" {...props}>{children}</table>
)

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isYearly, setIsYearly] = useState(true);
    const [userEmail, setUserEmail] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchUserAndStats = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUserEmail(user.email || '');

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

    const handleSuccess = (reference: any) => {
        console.log(reference);
        toast({
            title: "Payment Successful",
            description: "Your subscription has been updated.",
        });
    };

    const handleClose = () => {
        toast({
            title: "Payment Closed",
            description: "The payment popup was closed.",
            variant: 'destructive'
        });
    };

    const PaystackButton = ({ planName, amount }: { planName: string; amount: number }) => {
        const initializePayment = usePaystackPayment({
            reference: (new Date()).getTime().toString(),
            email: userEmail,
            amount: amount * 100, // Paystack amount is in kobo
            publicKey: 'pk_test_53ea257a8d594133643d86ff00277f6b5ff86d7f',
            metadata: {
                plan: planName,
                billing_cycle: isYearly ? 'yearly' : 'monthly'
            }
        });

        return (
            <Button onClick={() => initializePayment(handleSuccess, handleClose)} className="w-full">
                Upgrade
            </Button>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };
    
    const currentPlans = isYearly ? plans.yearly : plans.monthly;
    const currentAddOn = isYearly ? addOn.yearly : addOn.monthly;

    return (
        <div className="space-y-8">
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

            <div className="container mx-auto py-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">Select a plan</h1>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Label htmlFor="billing-cycle">Monthly</Label>
                  <Switch id="billing-cycle" checked={isYearly} onCheckedChange={setIsYearly} />
                  <Label htmlFor="billing-cycle">Yearly discount</Label>
                  {isYearly && <span className="text-primary font-semibold">You've saved 25%!</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {currentPlans.map((plan, index) => (
                  <Card key={index} className={`flex flex-col ${plan.mostValued ? 'border-primary border-2' : ''}`}>
                    {plan.mostValued && <div className="bg-primary text-primary-foreground text-center text-sm font-semibold py-1 rounded-t-lg">Most value</div>}
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground mb-4">{plan.tagline}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        {plan.originalPrice && <span className="text-muted-foreground line-through">${plan.originalPrice}</span>}
                      </div>
                      {plan.discount && <p className="text-sm text-green-600 font-semibold">Save {plan.discount}%</p>}
                      <p className="text-xs text-muted-foreground mt-1">Per month, billed {isYearly ? 'yearly' : 'monthly'}</p>
                    </CardContent>
                    <CardFooter>
                        {plan.isCurrent ? (
                             <Button variant="outline" disabled className="w-full">Current</Button>
                        ) : (
                            <PaystackButton planName={plan.name} amount={parseFloat(plan.price) * (isYearly ? 12 : 1)} />
                        )}
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div>
                <Table>
                  <thead>
                    <tr>
                      <th className="text-left py-4"></th>
                      {currentPlans.map(plan => <th key={plan.name} className="text-center font-bold py-4">{plan.name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {featureNames.map((featureName, featureIndex) => (
                      <tr key={featureName} className="border-b">
                        <td className="py-3 font-medium">{featureName}</td>
                        {currentPlans.map(plan => (
                          <td key={plan.name} className="text-center py-3">
                            {plan.features[featureIndex] === 'Unlimited' ? <Check className="mx-auto text-primary" /> : plan.features[featureIndex]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-2">Add-ons</h2>
                <Card className="flex flex-col md:flex-row items-center justify-between p-6">
                    <div className="flex-1 mb-4 md:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md">NEW</span>
                            <h3 className="text-lg font-semibold">AI Website Builder Pro</h3>
                        </div>
                        <p className="text-muted-foreground mb-4">Professional tools to empower your website</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            {addOnFeatures.map(f => <div key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{f}</div>)}
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                         <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">${currentAddOn.price}</span>
                            {currentAddOn.originalPrice && <span className="text-muted-foreground line-through">${currentAddOn.originalPrice}</span>}
                         </div>
                         {currentAddOn.discount && <p className="text-sm text-green-600 font-semibold">Save {currentAddOn.discount}%</p>}
                         <p className="text-xs text-muted-foreground mt-1 mb-4">Per month, billed {isYearly ? 'yearly' : 'monthly'}</p>
                         <PaystackButton planName="AI Website Builder Pro" amount={parseFloat(currentAddOn.price) * (isYearly ? 12 : 1)} />
                    </div>
                </Card>
              </div>
              
               <div className="text-center text-muted-foreground text-sm mt-8">
                    <p>Automatically renews. Subscription is per company. Cancel anytime.</p>
                </div>
            </div>
        </div>
    );
}