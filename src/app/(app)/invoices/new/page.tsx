
import { InvoiceForm } from '@/components/invoice-form';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import type { Client, Item } from '@/types';

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

async function getItems(): Promise<Item[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from('items').select('*');

  if (error) {
    console.error('Error fetching items:', error);
    return [];
  }
  return data;
}


export default async function NewInvoicePage() {
  const clients = await getClients();
  const items = await getItems();
  
  return (
    <InvoiceForm clients={clients} items={items} documentType="Invoice" />
  );
}
