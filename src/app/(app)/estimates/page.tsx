
import { DocumentList } from "@/components/document-list";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ExpandedInvoice } from "@/types";
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

async function getDocuments(): Promise<ExpandedInvoice[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      clients ( name )
    `)
    .eq('user_id', user.id)
    .eq('document_type', 'Estimate') 
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }

  if (!data) {
    return [];
  }
  
  return data.map(doc => {
    const clientName = doc.clients && !Array.isArray(doc.clients) ? doc.clients.name : "N/A";

    return {
      ...doc,
      client_name: clientName,
    }
  }) as unknown as ExpandedInvoice[];
}

export default async function EstimatesListPage() {
  const documents = await getDocuments();
  return <DocumentList initialDocuments={documents} documentType="Estimate" />;
}
