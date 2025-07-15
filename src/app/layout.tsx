import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, FileText, Users, Box, Settings, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';

export const metadata: Metadata = {
  title: 'Invoice Ease',
  description: 'Create and manage invoices with ease.',
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <AppWithSidebar>{children}</AppWithSidebar>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}


function AppWithSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40">
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <FileText className="text-primary h-8 w-8" />
            </Button>
            <h1 className="text-xl font-bold">Invoice Ease</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton tooltip="Dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/invoices">
                <SidebarMenuButton tooltip="Invoices">
                  <FileText />
                  <span>Invoices</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/clients">
                <SidebarMenuButton tooltip="Clients">
                  <Users />
                  <span>Clients</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/items">
                <SidebarMenuButton tooltip="Items">
                  <Box />
                  <span>Items</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/settings">
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="md:pl-[5rem]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
            <Button variant="ghost" size="icon" className="md:hidden">
                <PanelLeft />
                <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="ml-auto flex items-center gap-2">
                <UserNav />
            </div>
        </header>
        <div className="p-4 sm:px-6 sm:py-0">{children}</div>
      </main>
    </div>
  );
}
