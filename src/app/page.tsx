
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-20 flex items-center justify-center">
        <div className="bg-card shadow-lg rounded-full px-6 py-2 flex items-center w-full max-w-7xl">
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
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        <div aria-hidden="true" className="floating-items-container">
            <div className="floating-item item-1" />
            <div className="floating-item item-2" />
            <div className="floating-item item-3" />
            <div className="floating-item item-4" />
            <div className="floating-item item-5" />
            <div className="floating-item item-6" />
            <div className="floating-item item-7" />
        </div>
        <div className="flex flex-col items-center space-y-4 text-center z-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Invoicing & payments for small businesses
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
              Invoicing software that saves you time
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2 mx-auto">
            <form className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-lg flex-1"
              />
              <Button type="submit">Get started for free</Button>
            </form>
            <p className="text-xs text-muted-foreground">
              Free forever. No credit card needed.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
