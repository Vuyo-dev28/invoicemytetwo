
import { InvoiceForm } from '@/components/invoice-form';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import type { Client, Item } from '@/types';
import { redirect } from 'next/navigation';

async function getClients(): Promise<Client[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data, error } = await supabase.from('clients').select('*').eq('user_id', user.id);

  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  return data;
}

async function getItems(): Promise<Item[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from('items').select('*');

  if (error) {
    console.error('Error fetching items:', error);
    return [];
  }
  return data;
}


export default async function NewDeliveryNotePage() {
  const clients = await getClients();
  const items = await getItems();
  
  return (
    <InvoiceForm clients={clients} items={items} documentType="Delivery note" />
  );
}
