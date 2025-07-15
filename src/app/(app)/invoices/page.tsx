
import { redirect } from 'next/navigation';

// Redirect to the list page by default.
export default async function InvoicesPage() {
  redirect('/invoices/list');
}
