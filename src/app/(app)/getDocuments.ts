import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { ExpandedInvoice } from "@/types";

export async function getDocuments(tableName: string): Promise<ExpandedInvoice[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching documents from ${tableName}:`, error.message || error);
    return [];
  }

  if (!data) return [];

  return data.map(doc => ({
    ...doc,
    client_name: (doc as any).client_name || "N/A",
  })) as unknown as ExpandedInvoice[];
}
