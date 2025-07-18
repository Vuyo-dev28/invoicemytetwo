
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Logo className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold">InvoiceMyte</span>
        </Link>
        <nav className="ml-auto hidden lg:flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Invoice app
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Templates
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Products
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Resources
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Support
          </Link>
          <Link className="text-sm font-medium" href="/login">
            Log in
          </Link>
          <Button asChild>
            <Link href="/login">Get started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Level up your workflow with <span className="text-primary">AI-powered business management tools</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  360° integrated platform – from invoicing and receiving payment, to managing rosters and electronic signatures
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/login">Get started</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
