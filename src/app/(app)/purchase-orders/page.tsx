import { DocumentList } from "@/components/document-list";
import { getDocuments } from "../getDocuments";

export const dynamic = "force-dynamic";

export default async function PurchaseOrdersPage() {
  const documents = await getDocuments('Purchase order');
  return <DocumentList initialDocuments={documents} documentType="Purchase order" />;
}
