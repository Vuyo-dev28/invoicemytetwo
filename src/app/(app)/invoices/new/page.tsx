
import { InvoiceForm } from '@/components/invoice-form';
import { getClientsAndItems } from '../../reference-data';

export const dynamic = "force-dynamic";


export default async function NewInvoicePage() {
  const { clients, items } = await getClientsAndItems();
  
  return (
    <InvoiceForm clients={clients} items={items} documentType="Invoice" />
  );
}
