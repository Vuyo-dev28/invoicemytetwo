
import { InvoiceList } from "@/components/invoice-list";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ExpandedInvoice } from "@/types";
import { redirect } from 'next/navigation';

async function getInvoices(): Promise<ExpandedInvoice[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      clients ( name )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }

  if (!data) {
    return [];
  }
  
  // We need to shape the data to match ExpandedInvoice
  return data.map(invoice => {
    const clientName = Array.isArray(invoice.clients) ? invoice.clients[0].name : invoice.clients.name;

    return {
      ...invoice,
      client_name: clientName,
    }
  }) as unknown as ExpandedInvoice[];
}

export default async function InvoiceListPage() {
  const invoices = await getInvoices();
  return <InvoiceList initialInvoices={invoices} />;
}
