
import { DeliveryNoteForm } from '@/components/delivery-note-form';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import type { Client, Item, ExpandedInvoice } from '@/types';
import { notFound, redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

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
  return data || [];
}

async function getItems(): Promise<Item[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from('items').select('*');

  if (error) {
    console.error('Error fetching items:', error);
    return [];
  }
  return data || [];
}

async function getDocument(id: string): Promise<ExpandedInvoice | null> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data, error } = await supabase
        .from('invoices')
        .select(`
            *,
            clients ( name ),
            invoice_items ( * )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error || !data) {
        console.error('Error fetching document for edit:', error);
        return null;
    }

    const clientName = Array.isArray(data.clients) ? data.clients[0].name : data.clients.name;

    return {
        ...data,
        client_name: clientName,
    } as unknown as ExpandedInvoice;
}


export default async function EditDeliveryNotePage({ params }: { params: { id: string } }) {
  const clients = await getClients();
  const items = await getItems();
  const document = await getDocument(params.id);

  if (!document) {
    notFound();
  }
  
  if (document.status !== 'draft') {
    return (
        <div className="text-center p-8">
            <h1 className="text-2xl font-bold">Cannot Edit Delivery Note</h1>
            <p className="text-muted-foreground">This delivery note is not a draft and cannot be edited.</p>
        </div>
    )
  }
  
  return (
    <DeliveryNoteForm 
        clients={clients} 
        items={items} 
        initialDocument={document} 
    />
  );
}
