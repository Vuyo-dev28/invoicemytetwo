import { InvoiceForm } from '@/components/invoice-form';
import { UserNav } from '@/components/user-nav';
import { FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-card border-b sticky top-0 z-40 no-print">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="text-primary h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Invoice Ease</h1>
          </div>
          <UserNav />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <InvoiceForm />
      </main>
    </div>
  );
}
