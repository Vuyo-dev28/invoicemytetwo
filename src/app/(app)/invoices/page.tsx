import { DocumentList } from "@/components/document-list";
import { getDocuments } from "../getDocuments";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const documents = await getDocuments('invoices');
  return <DocumentList initialDocuments={documents} documentType="Invoice" />;
}
