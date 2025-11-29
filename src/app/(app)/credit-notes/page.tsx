import { DocumentList } from "@/components/document-list";
import { getDocuments } from "../getDocuments";

export const dynamic = "force-dynamic";

export default async function CreditNotesPage() {
  const documents = await getDocuments('credit_notes');
  return <DocumentList initialDocuments={documents} documentType="Credit note" />;
}
