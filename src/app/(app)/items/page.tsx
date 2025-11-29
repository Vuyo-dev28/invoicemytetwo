import { ItemList } from "@/components/item-list";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ItemsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('items')
    .select('*');

  if (error) {
    console.error('Error fetching items:', error.message || error);
    return <ItemList initialItems={[]} />;
  }

  return <ItemList initialItems={data || []} />;
}
