
import { ExpenseList } from "@/components/expense-list";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function getExpenses() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from('expenses').select('*');

  if (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
  return data;
}

export default async function ExpensesPage() {
  const expenses = await getExpenses();
  return <ExpenseList initialExpenses={expenses} />;
}
