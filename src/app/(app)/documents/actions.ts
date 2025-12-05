// app/(app)/documents/actions.ts
'use server';

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

type DocumentType = "invoices" | "quotes" | "estimates"; // add all allowed tables

export async function deleteDocumentAction(documentType: DocumentType, documentId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "You must be logged in to delete a document." };
  }

  // Delete the document if it belongs to the user
  const { error } = await supabase
    .from(documentType)
    .delete()
    .eq("id", documentId)
    .eq("user_id", user.id);

  if (error) {
    return { error: `Failed to delete ${documentType.slice(0, -1)}: ${error.message}` };
  }

  return { success: true };
}
