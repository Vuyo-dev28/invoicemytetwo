
'use client';
import Link from 'next/link';
import { 
    Activity,
    Users, 
    Package, 
    Settings, 
    PanelLeft, 
    Receipt,
    FileScan, 
    FileDiff, 
    Truck, 
    ShoppingCart, 
    LineChart,
    Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { UserNav } from '@/components/user-nav';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Skeleton } from '@/components/ui/skeleton';

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
  }, []);

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: Activity },
    { href: '/cashflow', label: 'Cashflow', icon: LineChart },
    { href: '/invoices/list', label: 'Invoices', icon: Receipt },
    { href: '/estimates', label: 'Estimates', icon: FileScan },
    { href: '/credit-notes', label: 'Credit Notes', icon: FileDiff },
    { href: '/delivery-notes', label: 'Delivery Notes', icon: Truck },
    { href: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/items', label: 'Items', icon: Package },
    { href: '/settings', label: 'Settings', icon: Settings, className: 'mt-auto' },
  ];

  const getHref = (href: string) => {
    if(href === '/invoices') return '/invoices/list';
    return href;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Gift className="h-6 w-6 text-primary" />
              <span className="">InvoiceMe</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {menuItems.map(item => (
                 <Link
                  key={item.href}
                  href={getHref(item.href)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === getHref(item.href) ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Gift className="h-6 w-6 text-primary" />
                  <span className="sr-only">InvoiceMe</span>
                </Link>
                {menuItems.map(item => (
                  <Link
                    key={item.href}
                    href={getHref(item.href)}
                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all hover:text-foreground ${pathname === getHref(item.href) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
           {loading ? <Skeleton className="h-8 w-8 rounded-full" /> : <UserNav userEmail={user?.email} />}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
