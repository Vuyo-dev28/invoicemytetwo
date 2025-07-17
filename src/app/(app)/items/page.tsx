
import { ItemList } from "@/components/item-list";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getItems() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Items are public, no user filter needed
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
