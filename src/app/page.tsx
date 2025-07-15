import { redirect } from 'next/navigation';

export default async function Home() {
  // Redirect to the main invoices page by default.
  redirect('/invoices');
}
