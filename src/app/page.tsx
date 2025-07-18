import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { FileText } from 'lucide-react';

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
        <div aria-hidden="true" className="aurora-background">
            <div className="aurora-shape shape-1"></div>
            <div className="aurora-shape shape-2"></div>
            <div className="aurora-shape shape-3"></div>
            <div className="aurora-shape shape-4"></div>
            <div className="aurora-document">
                <FileText className="w-48 h-48" />
            </div>
        </div>
        <div className="container px-4 md:px-6 z-10">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Level up your workflow with <br /> <span className="text-primary">AI-powered business management tools</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                360° integrated platform – from invoicing and receiving payment, to managing rosters and electronic signatures
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/login">Get started</Link>
              </Button>
               <Button asChild variant="secondary" size="lg">
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
