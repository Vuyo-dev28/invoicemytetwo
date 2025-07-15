import { ClientList } from "@/components/client-list";
import { Client } from "@/types";

// Mock data since we have no database connection without a user
const mockClients: Client[] = [
    { id: '1', user_id: '1', name: 'Global Tech Inc.', email: 'contact@globaltech.com', address: '123 Tech Park, Silicon Valley', vat_number: 'GT12345', created_at: new Date().toISOString() },
    { id: '2', user_id: '1', name: 'Creative Solutions', email: 'hello@creativesolutions.com', address: '456 Design Ave, Arts District', vat_number: 'CS67890', created_at: new Date().toISOString() },
];


export default async function ClientsPage() {
  return <ClientList initialClients={mockClients} />;
}
