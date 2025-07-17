
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
    Gift,
    LogOut,
    CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  }

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
    { href: '/subscription', label: 'Subscription', icon: CreditCard },
  ];

  const getHref = (href: string) => {
    if(href === '/invoices') return '/invoices/list';
    return href;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr] lg:grid-cols-[350px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Gift className="h-6 w-6 text-primary" />
              <span className="">InvoiceMe</span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {menuItems.map(item => (
                 <Link
                  key={item.href}
                  href={getHref(item.href)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === getHref(item.href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <nav className="mt-auto grid items-start px-2 text-sm font-medium lg:px-4 mb-2">
               <Link
                  href="/settings"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === '/settings' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2 justify-start text-muted-foreground hover:text-primary">
                    <LogOut className="h-4 w-4" />
                    Log Out
                </Button>
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
              <div className="mt-auto">
                 <Link
                    href="/settings"
                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all hover:text-foreground ${pathname === '/settings' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                  <Button variant="ghost" onClick={handleLogout} className="mx-[-0.65rem] w-full flex items-center gap-4 rounded-xl px-3 py-2 justify-start text-muted-foreground hover:text-foreground">
                    <LogOut className="h-5 w-5" />
                    Log Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
