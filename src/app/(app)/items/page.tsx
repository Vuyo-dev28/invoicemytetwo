
import { ItemList } from "@/components/item-list";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

async function getItems() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  // Items are public in this schema, no profile_id filter
  const { data, error } = await supabase
    .from('items')
    .select('*');


  if (error) {
    console.error('Error fetching items:', error);
    return [];
  }
  return data || [];
}

export default async function ItemsPage() {
  const items = await getItems();
  return <ItemList initialItems={items} />;
}
