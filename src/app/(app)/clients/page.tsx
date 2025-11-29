import { ClientList } from "@/components/client-list";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching clients:', error.message || error);
    return <ClientList initialClients={[]} />;
  }

  return <ClientList initialClients={data || []} />;
}
