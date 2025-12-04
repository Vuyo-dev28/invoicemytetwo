import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { ExpandedInvoice } from "@/types";

type DocumentType = "Invoice" | "Estimate" | "Credit note" | "Delivery note" | "Purchase order";

export async function getDocuments(documentType: DocumentType): Promise<ExpandedInvoice[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let query = supabase
    .from('invoices')
    .select(`
      *,
      clients ( name )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (documentType === "Invoice") {
    query = query.or('document_type.is.null,document_type.eq.Invoice');
  } else {
    query = query.eq('document_type', documentType);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching ${documentType} documents:`, error.message || error);
    return [];
  }

  if (!data) return [];

  return data.map(doc => {
    let clientName = "N/A";
    const clientRelation = (doc as any).clients;
    if (Array.isArray(clientRelation) && clientRelation.length > 0) {
      clientName = clientRelation[0]?.name ?? "N/A";
    } else if (clientRelation && typeof clientRelation === 'object') {
      clientName = clientRelation.name ?? "N/A";
    }

    return {
      ...doc,
      client_name: clientName,
    };
  }) as unknown as ExpandedInvoice[];
}
