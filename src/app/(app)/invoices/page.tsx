
import { InvoiceForm } from '@/components/invoice-form';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import type { Client } from '@/types';

async function getClients(): Promise<Client[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
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
