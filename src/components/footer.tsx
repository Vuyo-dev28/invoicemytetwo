'use client';

import Link from 'next/link';
import ContactForm from './contact-form';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">InvoiceMyte</h3>
            <p className="text-muted-foreground">Simple invoicing for freelancers and small businesses.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ContactForm />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary"><Github /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Twitter /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} InvoiceMyte. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/about" className="text-muted-foreground hover:text-primary">About</Link>
            <Link href="/products" className="text-muted-foreground hover:text-primary">Products</Link>
            <Link href="/support" className="text-muted-foreground hover:text-primary">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
