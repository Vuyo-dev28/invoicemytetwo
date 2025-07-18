import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { BarChart3, FileCheck, Users, Wallet, PenSquare, FileStack } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingIcon = ({ icon: Icon, className, color }: { icon: React.ElementType, className?: string, color: string }) => (
    <div className={cn('absolute rounded-lg shadow-lg p-3', className)} style={{ backgroundColor: color }}>
        <Icon className="h-6 w-6 text-white" />
    </div>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-20">
        <div className="bg-card/80 backdrop-blur-sm shadow-lg rounded-full px-6 py-2 flex items-center">
            <Link href="/" className="flex items-center justify-center" prefetch={false}>
            <Logo className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold text-primary">InvoiceMyte</span>
            </Link>
            <nav className="ml-auto hidden lg:flex gap-6 items-center">
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                Invoice app
            </Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                Templates
            </Link>
            <Link className="text-sm font-medium text-primary" href="#">
                Products
            </Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                Resources
            </Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                Pricing
            </Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                Support
            </Link>
            <Link className="text-sm font-medium" href="/login">
                Log in
            </Link>
            <Button asChild>
                <Link href="/login">Get started</Link>
            </Button>
            </nav>
        </div>
      </header>
       <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div aria-hidden="true" className="floating-items-container">
            <FloatingIcon icon={FileCheck} className="item-1" color="#63d8b1" />
            <FloatingIcon icon={BarChart3} className="item-2" color="#80a3ff" />
            <FloatingIcon icon={Users} className="item-3" color="#ffb380" />
            <FloatingIcon icon={FileStack} className="item-4" color="#fcd464" />
            <FloatingIcon icon={PenSquare} className="item-5" color="#b392f0" />
            <FloatingIcon icon={Wallet} className="item-6" color="#ff89b3" />
        </div>
        <div className="container px-4 md:px-6 z-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Level up your workflow with <br /> <span className="text-primary">AI-powered business management tools</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                360° integrated platform – from invoicing and receiving payment, to managing rosters and electronic signatures
              </p>
            </div>
            <div className="w-full max-w-2xl mx-auto pt-8">
              <form>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Input type="text" placeholder="*First name" className="bg-muted/50 border-0" />
                  <Input type="text" placeholder="Last name" className="bg-muted/50 border-0" />
                  <Input type="email" placeholder="*Email" className="bg-muted/50 border-0" />
                  <Input type="text" placeholder="*Company name" className="bg-muted/50 border-0" />
                  <Input type="text" placeholder="ZAR - South African Rand" className="bg-muted/50 border-0" />
                  <Input type="text" placeholder="*Industry (type to search)" className="bg-muted/50 border-0" />
                </div>
                <Button type="submit" className="w-full" size="lg">Get started</Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
