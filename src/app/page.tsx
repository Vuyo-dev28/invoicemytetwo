import { InvoiceForm } from '@/components/invoice-form';
import { UserNav } from '@/components/user-nav';
import { FileText } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SettingsPanel } from '@/components/settings-panel';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Sidebar variant="inset" collapsible="offcanvas" side="right">
        <SidebarHeader>
          <h2 className="text-lg font-semibold">Settings</h2>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="p-4">
           <SettingsPanel />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="bg-card border-b sticky top-0 z-40 no-print">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="text-primary h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Invoice Ease</h1>
            </div>
            <div className="flex items-center gap-2">
              <UserNav />
              <SidebarTrigger />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <InvoiceForm />
        </main>
      </SidebarInset>
    </div>
  );
}
