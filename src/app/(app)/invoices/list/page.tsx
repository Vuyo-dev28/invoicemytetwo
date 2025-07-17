
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
    .eq('document_type', 'Invoice') // Filter for only invoices
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
    // Check if invoice.clients exists and is not null
    const clientName = invoice.clients && !Array.isArray(invoice.clients) ? invoice.clients.name : "N/A";

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
