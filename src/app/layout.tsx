import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export const metadata: Metadata = {
  title: 'InvoiceMyte | Free Invoice Generator & Billing Software for Businesses',
  description: 'Create professional invoices, manage clients, and track payments with InvoiceMyte. The best invoicing app for freelancers, entrepreneurs, and small businesses worldwide.',
  keywords: [
    'invoice generator',
    'free invoice maker',
    'billing software',
    'online invoicing app',
    'create invoice online',
    'invoice creator',
    'invoice template',
    'small business invoicing',
    'freelancer invoicing tool',
    'best invoicing software',
    'automated billing system',
    'digital invoicing solution',
    'recurring invoices',
    'estimate and quotes tool',
    'tax-compliant invoices',
    'invoice with payment links',
    'cloud invoicing software',
    'invoice management system',
    'professional invoice generator',
    'business accounting app'
  ],
  icons: {
    icon: '/logo.png', // ✅ Your real logo
  },
  openGraph: {
    title: 'InvoiceMyte | Professional Online Invoice Generator',
    description: 'Generate invoices instantly, manage payments, and grow your business with InvoiceMyte.',
    url: 'https://www.invoicemyte.online',
    siteName: 'InvoiceMyte',
    images: [
      {
        url: '/logo.png', // ✅ Your real logo
        width: 1200,
        height: 630,
        alt: 'InvoiceMyte Dashboard Preview'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvoiceMyte | Free Invoice Generator & Billing Software',
    description: 'Create invoices in minutes and manage clients with ease. Perfect for businesses and freelancers.',
    images: ['/logo.png'],
  }
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
