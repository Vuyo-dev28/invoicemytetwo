import { DocumentList } from "@/components/document-list";
import { getDocuments } from "../getDocuments";

export const dynamic = "force-dynamic";

export default async function DeliveryNotesPage() {
  const documents = await getDocuments('delivery_notes');
  return <DocumentList initialDocuments={documents} documentType="Delivery note" />;
}
