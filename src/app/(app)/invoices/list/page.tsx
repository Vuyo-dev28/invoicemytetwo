
import { InvoiceList } from "@/components/invoice-list";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ExpandedInvoice } from "@/types";

async function getInvoices(): Promise<ExpandedInvoice[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      clients ( name ),
      invoice_items ( quantity, rate )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
  
  // We need to shape the data to match ExpandedInvoice
  return data.map(invoice => {
    const total = invoice.invoice_items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    const clientName = Array.isArray(invoice.clients) ? invoice.clients[0].name : invoice.clients.name;

    return {
      ...invoice,
      client_name: clientName,
      total: total,
    }
  }) as unknown as ExpandedInvoice[];
}

export default async function InvoiceListPage() {
  const invoices = await getInvoices();
  return <InvoiceList initialInvoices={invoices} />;
}
