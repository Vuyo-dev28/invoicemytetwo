import { ClientList } from "@/components/client-list";
import { supabase } from "@/lib/supabase";
import { Client } from "@/types";

async function getClients(): Promise<Client[]> {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }
    return data;
}

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientList initialClients={clients} />;
}
