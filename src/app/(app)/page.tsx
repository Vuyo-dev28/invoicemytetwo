
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, Send } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

type DashboardStats = {
  totalAmount: number;
  totalClients: number;
  paidInvoices: number;
  pendingInvoices: number;
};

async function getDashboardStats(): Promise<DashboardStats> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fetch total amount from paid invoices
  const { data: amountData, error: amountError } = await supabase
    .from('invoices')
    .select('total')
    .eq('status', 'paid');

  if (amountError) {
    console.error('Error fetching total amount:', amountError.message);
  }
  const totalAmount = amountData?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;

  // Fetch total clients
  const { count: clientCount, error: clientError } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });
  
  if (clientError) {
    console.error('Error fetching client count:', clientError.message);
  }

  // Fetch paid invoices count
  const { count: paidInvoicesCount, error: paidInvoicesError } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'paid');

  if (paidInvoicesError) {
    console.error('Error fetching paid invoices count:', paidInvoicesError.message);
  }

  // Fetch pending (sent) invoices count
  const { count: pendingInvoicesCount, error: pendingInvoicesError } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'sent');

  if (pendingInvoicesError) {
    console.error('Error fetching pending invoices count:', pendingInvoicesError.message);
  }

  return {
    totalAmount,
    totalClients: clientCount || 0,
    paidInvoices: paidInvoicesCount || 0,
    pendingInvoices: pendingInvoicesCount || 0
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}
