import { InvoiceForm } from '@/components/invoice-form';
import { supabase } from '@/lib/supabase';
import { Client } from '@/types';

export const revalidate = 0;

async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase.from('clients').select('*');

  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  return data;
}

export default async function InvoicesPage() {
  const clients = await getClients();
  return (
    <InvoiceForm clients={clients} />
  );
}
