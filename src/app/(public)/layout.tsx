import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { FileText, Calendar, CreditCard, User } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background relative">
       <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-20">
        <div className="bg-card/80 backdrop-blur-sm shadow-lg rounded-full px-6 py-2 flex items-center">
            <Link href="/" className="flex items-center justify-center" prefetch={false}>
            <Logo className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold text-primary">InvoiceMyte</span>
            </Link>
            <nav className="ml-auto hidden lg:flex gap-6 items-center">
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="/">
                Home
            </Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                Templates
            </Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                Products
            </Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="/about">
                About
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
       <div aria-hidden="true" className="aurora-background">
            <div className="aurora-shape shape-1"></div>
            <div className="aurora-shape shape-2"></div>
            <div className="aurora-shape shape-3"></div>
            <div className="aurora-shape shape-4"></div>
            <div className="aurora-document">
                <FileText className="w-48 h-48" />
            </div>
            <div className="aurora-document-2">
                <Calendar className="w-32 h-32" />
            </div>
            <div className="aurora-document-3">
                <CreditCard className="w-40 h-40" />
            </div>
            <div className="aurora-document-4">
                <User className="w-36 h-36" />
            </div>
        </div>
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  )
}
