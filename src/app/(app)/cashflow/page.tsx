
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CashflowChart } from '@/components/cashflow-chart';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import type { CashflowData, Invoice } from '@/types';
import { subMonths, format, parse, startOfMonth } from 'date-fns';
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

async function getCashflowData(): Promise<CashflowData[]> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const twelveMonthsAgo = subMonths(new Date(), 12);

    const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select(`*`)
        .eq('status', 'paid')
        .eq('user_id', user.id)
        .gte('issue_date', twelveMonthsAgo.toISOString());
    
    if (invoicesError) {
        console.error('Error fetching paid invoices:', invoicesError);
        return [];
    }
    
    if (!invoices) {
        return [];
    }

    const monthlyData: { [key: string]: { income: number } } = {};

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
        const month = format(subMonths(new Date(), i), 'MMM yyyy');
        monthlyData[month] = { income: 0 };
    }
    
    invoices.forEach(invoice => {
        const month = format(new Date(invoice.issue_date), 'MMM yyyy');
        if (monthlyData[month]) {
            monthlyData[month].income += invoice.total;
        }
    });

    return Object.entries(monthlyData)
        .map(([month, { income }]) => ({
            month,
            income,
        }))
        .sort((a, b) => {
            const dateA = parse(a.month, 'MMM yyyy', new Date());
            const dateB = parse(b.month, 'MMM yyyy', new Date());
            return dateA.getTime() - dateB.getTime();
        })
        .map(item => ({
            ...item,
            month: item.month.split(' ')[0], // Format to just 'MMM' after sorting
        }));
}


export default async function CashflowPage() {
  const chartData = await getCashflowData();

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold">Cashflow</h1>

      <CashflowChart initialData={chartData} />
      
    </div>
  );
}
