import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Client, Item } from '@/types';

type ReferenceData = {
  clients: Client[];
  items: Item[];
};

export async function getClientsAndItems(): Promise<ReferenceData> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const [clientsResult, itemsResult] = await Promise.all([
    supabase
      .from('clients')
      .select('id, user_id, name, email, address, vat_number, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('items')
      .select('id, description, rate, created_at')
      .order('created_at', { ascending: false }),
  ]);

  if (clientsResult.error) {
    console.error('Error fetching clients:', clientsResult.error);
  }
  if (itemsResult.error) {
    console.error('Error fetching items:', itemsResult.error);
  }

  return {
    clients: clientsResult.data ?? [],
    items: itemsResult.data ?? [],
  };
}

