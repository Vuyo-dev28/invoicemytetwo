
import { ClientList } from "@/components/client-list";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function getClients() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase.from('clients').select('*').eq('profile_id', user.id);

  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  return data || [];
}

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientList initialClients={clients} />;
}
