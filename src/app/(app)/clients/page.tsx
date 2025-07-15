
import { ClientList } from "@/components/client-list";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function getClients() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
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
