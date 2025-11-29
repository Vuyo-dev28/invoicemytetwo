import { DocumentList } from "@/components/document-list";
import { getDocuments } from "../getDocuments";

export const dynamic = "force-dynamic";

export default async function EstimatesPage() {
  const documents = await getDocuments('estimates');
  return <DocumentList initialDocuments={documents} documentType="Estimate" />;
}
