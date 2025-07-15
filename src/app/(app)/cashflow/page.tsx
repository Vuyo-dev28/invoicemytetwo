
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CashflowChart } from '@/components/cashflow-chart';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import type { CashflowData, Invoice, InvoiceItem, Expense } from '@/types';
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns';

async function getCashflowData(): Promise<CashflowData[]> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const twelveMonthsAgo = subMonths(new Date(), 12);

    const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select(`*, invoice_items ( quantity, rate )`)
        .eq('status', 'paid')
        .gte('issue_date', twelveMonthsAgo.toISOString());

    if (invoicesError) {
        console.error('Error fetching paid invoices:', invoicesError);
        return [];
    }
    
    const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', twelveMonthsAgo.toISOString());

    if (expensesError) {
        console.error('Error fetching expenses:', expensesError);
        return [];
    }

    const monthlyData: { [key: string]: { income: number, expense: number } } = {};

    // Initialize last 12 months
    for (let i = 0; i < 12; i++) {
        const month = format(subMonths(new Date(), i), 'MMM yyyy');
        monthlyData[month] = { income: 0, expense: 0 };
    }
    
    invoices.forEach(invoice => {
        const total = invoice.invoice_items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
        const month = format(new Date(invoice.issue_date), 'MMM yyyy');
        if (monthlyData[month]) {
            monthlyData[month].income += total;
        }
    });

    expenses.forEach(expense => {
        const month = format(new Date(expense.date), 'MMM yyyy');
        if (monthlyData[month]) {
            monthlyData[month].expense += expense.amount;
        }
    });

    return Object.entries(monthlyData)
        .map(([month, { income, expense }]) => ({
            month,
            income,
            expense,
            net: income - expense,
        }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()); // Sort by month
}


export default async function CashflowPage() {
  const chartData = await getCashflowData();

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold">Cashflow</h1>

      <CashflowChart initialData={chartData} />
      
      <Card>
        <CardHeader>
           <div className="flex items-center justify-between">
            <CardTitle>Expenses</CardTitle>
           </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center h-48 text-center">
                 <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <BarChart className="h-8 w-8 text-muted-foreground"/>
                 </div>
                <p className="text-muted-foreground">No expenses recorded for this period yet.</p>
                <Button variant="link" asChild>
                    <a href="/expenses">Add an expense</a>
                </Button>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
