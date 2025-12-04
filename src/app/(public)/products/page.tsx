'use client';

import {
  Activity,
  LineChart,
  Receipt,
  FileScan,
  FileDiff,
  Truck,
  ShoppingCart,
  Users,
  Package,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';

const featureCategories = [
  {
    category: 'Financial Management',
    description: 'Monitor and control your finances with powerful tracking tools.',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: Activity, description: 'Get a real-time overview of your business performance and key metrics.' },
      { href: '/cashflow', label: 'Cashflow', icon: LineChart, description: 'Track your income and expenses to maintain a healthy cash flow.' },
      { href: '/subscription', label: 'Subscription', icon: CreditCard, description: 'Manage your subscription plan, view billing history, and update payment details.' },
    ]
  },
  {
    category: 'Document Creation',
    description: 'Create, customize, and manage all your business documents in one place.',
    items: [
      { href: '/invoices/list', label: 'Invoices', icon: Receipt, description: 'Create, send, and track professional invoices to get paid faster.' },
      { href: '/estimates', label: 'Estimates', icon: FileScan, description: 'Provide clients with detailed project estimates and quotes.' },
      { href: '/credit-notes', label: 'Credit Notes', icon: FileDiff, description: 'Issue credit notes for refunds or to correct invoice errors.' },
      { href: '/delivery-notes', label: 'Delivery Notes', icon: Truck, description: 'Generate and manage delivery notes for your shipments.' },
      { href: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart, description: 'Create and manage purchase orders for your suppliers.' },
    ]
  },
  {
    category: 'Business Management',
    description: 'Organize your client and item data for streamlined operations.',
    items: [
      { href: '/clients', label: 'Clients', icon: Users, description: 'Keep all your client information organized and easily accessible.' },
      { href: '/items', label: 'Items', icon: Package, description: 'Manage your products and services for quick addition to documents.' },
    ]
  }
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative text-primary-foreground text-center py-20 px-6">
        <div className="absolute inset-0 opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">Explore Our Powerful Features</h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            InvoiceMyte is packed with tools designed to streamline your workflow, giving you more time to focus on what you do best.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {featureCategories.map((category, index) => (
          <div key={index} className="mb-16">
            <div className="text-center md:text-left mb-10">
              <h2 className="text-3xl font-bold text-foreground">{category.category}</h2>
              <p className="text-muted-foreground mt-2">{category.description}</p>
            </div>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {category.items.map(({ label, href, icon: Icon, description }) => (
                <Link href={href} key={href}>
                  <div className="group bg-card/50 rounded-xl p-6 border border-border hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-primary/10 text-primary p-3 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon size={28} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">{label}</h3>
                    <p className="text-muted-foreground text-sm flex-grow">{description}</p>
                    <div className="mt-4 text-sm font-medium text-primary group-hover:underline">
                      Learn More &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
