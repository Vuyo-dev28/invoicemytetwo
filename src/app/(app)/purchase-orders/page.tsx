import { DocumentList } from "@/components/document-list";
import { getDocuments } from "../getDocuments";

export const dynamic = "force-dynamic";

export default async function PurchaseOrdersPage() {
  const documents = await getDocuments('purchase_orders');
  return <DocumentList initialDocuments={documents} documentType="Purchase order" />;
}
