"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { FileText, Calendar, CreditCard, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen relative">
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-20">
        <div className="bg-card/80 backdrop-blur-sm shadow-lg rounded-full px-6 py-2 flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Nav */}
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
              href="/#pricing"
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-card/95 backdrop-blur-md shadow-lg rounded-xl p-4 flex flex-col gap-4 z-10"
          >
            <Link href="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/products" onClick={() => setIsOpen(false)}>
              Products
            </Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/#pricing" onClick={() => setIsOpen(false)}>
              Pricing
            </Link>
            <Link href="/support" onClick={() => setIsOpen(false)}>
              Support
            </Link>
            <Link href="/login" onClick={() => setIsOpen(false)}>
              Log in
            </Link>
            <Button asChild>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Get started
              </Link>
            </Button>
          </div>
        )}

      </header>

      {/* Aurora Background */}
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

      {/* Main */}
      <main className="flex-grow flex items-center justify-center animate-fade-in-up">
        {children}
      </main>
    </div>
  );
}
