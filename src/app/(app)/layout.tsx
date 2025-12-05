
'use client';
export const dynamic = "force-dynamic";

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
  LogOut,
  CreditCard,
  Moon,
  Sun,
  Mail,
  Sparkles,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Logo } from '@/components/logo';
import { useEffect, useState } from 'react';
import { GuidedTour } from '@/components/tour/guided-tour';
import { appTourSteps } from '@/components/tour/tour-steps';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const [openMobile, setOpenMobile] = useState(false);

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/cashflow', label: 'Cashflow', icon: LineChart },
    { href: '/invoices/list', label: 'Invoices', icon: Receipt },
    { href: '/estimates', label: 'Estimates', icon: FileScan },
    { href: '/credit_notes', label: 'Credit Notes', icon: FileDiff },
    { href: '/delivery_notes', label: 'Delivery Notes', icon: Truck },
    { href: '/purchase_orders', label: 'Purchase Orders', icon: ShoppingCart },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/items', label: 'Items', icon: Package },
    { href: '/subscription', label: 'Subscription', icon: CreditCard },
  ];

  const aiMenuItems = [
    { href: '/ai-email', label: 'AI Email Assistant', icon: Mail },
    { href: '/ask-ai', label: 'Ask AI', icon: Sparkles },
    { href: '/ai-planner', label: 'AI Calendar Planner', icon: CalendarDays },
  ];

  const getIsActive = (href: string) => {
    if (href === '/invoices/list') {
      return pathname.startsWith('/invoices');
    }
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    if (href === '/search') {
      return pathname === '/search';
    }
    return pathname === href;
  };

  useEffect(() => {
    const timer = setTimeout(() => {}, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        router.push('/search');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <>
      <GuidedTour 
        steps={appTourSteps}
        storageKey="invoicemyte_tour_completed"
        onComplete={() => {
          // Tour completed
        }}
        onSkip={() => {
          // Tour skipped
        }}
      />
      <div className="min-h-screen w-full">
      <div className={`hidden md:block fixed left-0 top-0 h-full border-r bg-card z-20 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-[280px] lg:w-[350px]'}`}>
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="" className="flex items-center gap-2 font-semibold">
              <Logo className="h-6 w-6 text-primary" />
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'}`}>InvoiceMyte</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
              {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {menuItems.map(item => {
                const tourId = item.href === '/dashboard' ? 'dashboard' : 
                              item.href === '/search' ? 'search' : 
                              item.href === '/invoices/list' ? 'invoices' : 
                              item.href === '/clients' ? 'clients' : 
                              item.href === '/items' ? 'items' : undefined;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    {...(tourId ? { 'data-tour': tourId } : {})}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${getIsActive(item.href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className={`${isSidebarCollapsed ? 'hidden' : 'block'}`}>{item.label}</span>
                  </Link>
                );
              })}
              <div className="my-2 border-t -mx-2"></div>
              {aiMenuItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${getIsActive(item.href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className={`${isSidebarCollapsed ? 'hidden' : 'block'}`}>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Link
              href="/settings"
              data-tour="settings"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === '/settings' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              <Settings className="h-4 w-4" />
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'}`}>Settings</span>
            </Link>

            <div className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                id="desktop-theme-switch"
                className={`${isSidebarCollapsed ? 'hidden' : 'block'}`}
              />
              <Moon className="h-4 w-4" />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 justify-start ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <LogOut className="h-4 w-4" />
                  <span className={`${isSidebarCollapsed ? 'hidden' : 'block'}`}>Log Out</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be signed out and redirected to the login page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      <div className={`flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-[280px] lg:ml-[350px]'}`}>
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10 no-print">
          <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col max-h-screen overflow-y-auto p-0">
              <div className="flex flex-col h-full">
                <div className="flex-none border-b px-4 py-3">
                  <Link href="" className="flex items-center gap-2 text-lg font-semibold">
                    <Logo className="h-6 w-6 text-primary" />
                    <span>InvoiceMyte</span>
                  </Link>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-2">
                  <nav className="grid gap-2 text-lg font-medium">
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenMobile(false)}
                        className={`-mx-2 flex items-center gap-4 rounded-xl px-3 py-2 sm:px-4 transition-all hover:text-foreground ${getIsActive(item.href) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    ))}
                    <div className="my-2 border-t -mx-2" />
                    {aiMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`-mx-2 flex items-center gap-4 rounded-xl px-3 py-2 sm:px-4 transition-all hover:text-foreground ${getIsActive(item.href) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="flex-none border-t px-4 py-3 space-y-2">
                  <Link
                    href="/settings"
                    className={`flex items-center gap-4 rounded-xl px-3 py-2 transition-all hover:text-foreground ${pathname === "/settings" ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>

                  <div className="flex items-center gap-4 text-muted-foreground">
                    <Sun className="h-5 w-5" />
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                      id="mobile-theme-switch"
                    />
                    <Moon className="h-5 w-5" />
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full flex items-center gap-4 rounded-xl px-3 py-2 justify-start"
                      >
                        <LogOut className="h-5 w-5" />
                        Log Out
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You will be signed out and redirected to the login page.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
        </header>

        <main className="flex-1 px-4 py-2 sm:p-4 lg:p-6 bg-muted/40 overflow-y-auto h-[calc(100vh-60px)] pt-16">
          {children}
        </main>
      </div>
    </div>
    </>
  );
}

export default AppLayout;
