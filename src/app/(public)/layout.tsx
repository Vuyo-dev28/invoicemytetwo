
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { FileText, Calendar, CreditCard, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Footer from "@/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div className="bg-background min-h-screen relative">
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-30">
        <div className="bg-card/80 backdrop-blur-sm shadow-lg rounded-full px-6 py-2 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center justify-center"
            prefetch={false}
          >
            <Logo className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold text-primary">
              InvoiceMyte
            </span>
          </Link>

          <nav className="ml-auto hidden lg:flex gap-6 items-center">
            <Link className="text-sm font-medium hover:text-primary" href="/">
              Home
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary"
              href="/products"
            >
              Products
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary"
              href="/about"
            >
              About
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary"
              href="/pricing"
            >
              Pricing
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary"
              href="/support"
            >
              Support
            </Link>
            <Link className="text-sm font-medium" href="/login">
              Log in
            </Link>
            <Button asChild>
              <Link href="/login">Get started</Link>
            </Button>
          </nav>

          <button
            className="lg:hidden p-2 rounded-md text-primary"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <Link
              href="/"
              className="flex items-center justify-center"
              prefetch={false}
              onClick={() => setIsOpen(false)}
            >
              <Logo className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-semibold text-primary">
                InvoiceMyte
              </span>
            </Link>
            <button
              className="p-2 rounded-md text-primary"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] gap-8 text-xl">
            <Link href="/" className="hover:text-primary" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/products" className="hover:text-primary" onClick={() => setIsOpen(false)}>
              Products
            </Link>
            <Link href="/about" className="hover:text-primary" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/#pricing" className="hover:text-primary" onClick={() => setIsOpen(false)}>
              Pricing
            </Link>
            <Link href="/support" className="hover:text-primary" onClick={() => setIsOpen(false)}>
              Support
            </Link>
            <hr className="w-1/2 border-border"/>
            <Link href="/login" className="hover:text-primary" onClick={() => setIsOpen(false)}>
              Log in
            </Link>
            <Button asChild size="lg">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Get started
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div aria-hidden="true" className="aurora-background pointer-events-none">
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

      <main className="flex-grow flex items-center justify-center animate-fade-in-up pt-28">
        {children}
      </main>
      <Footer />
    </div>
  );
}
