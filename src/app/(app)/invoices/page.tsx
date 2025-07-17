
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

// Redirect to the list page by default.
export default async function InvoicesPage() {
  redirect('/invoices/list');
}
