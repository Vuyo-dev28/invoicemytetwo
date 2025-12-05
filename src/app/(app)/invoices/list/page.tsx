import { DocumentList } from "@/components/document-list";
import { createClient } from "@/utils/supabase/server";
import { deleteDocumentAction } from "@/app/(app)/documents/actions"; // or wherever your server action is
import { cookies } from "next/headers";
import { ExpandedInvoice } from "@/types";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getInvoices(): Promise<ExpandedInvoice[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error fetching user:", userError.message);
    redirect("/login");
  }

  if (!user) redirect("/login");

  // Fetch invoices for this user
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching invoices:", error.message);
    return [];
  }

  if (!data) return [];

  // Map data to ExpandedInvoice type
  return data.map(invoice => ({
    ...invoice,
    client_name: invoice.client_name || "N/A", // use existing client_name column
  })) as unknown as ExpandedInvoice[];
}

export default async function InvoiceListPage() {
  const invoices = await getInvoices();
  return <DocumentList initialDocuments={invoices} documentType="Invoice" />;
}
