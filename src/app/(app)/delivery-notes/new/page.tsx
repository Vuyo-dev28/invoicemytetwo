
import { DeliveryNoteForm } from '@/components/delivery-note-form';
import { getClientsAndItems } from '../../reference-data';

export const dynamic = "force-dynamic";

export default async function NewDeliveryNotePage() {
  const { clients, items } = await getClientsAndItems();
  
  return (
    <DeliveryNoteForm clients={clients} items={items} />
  );
}
