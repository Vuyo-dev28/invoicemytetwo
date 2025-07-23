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

const features = [
  { href: '/dashboard', label: 'Dashboard', icon: Activity },
  { href: '/cashflow', label: 'Cashflow', icon: LineChart },
  { href: '/invoices/list', label: 'Invoices', icon: Receipt },
  { href: '/estimates', label: 'Estimates', icon: FileScan },
  { href: '/credit-notes', label: 'Credit Notes', icon: FileDiff },
  { href: '/delivery-notes', label: 'Delivery Notes', icon: Truck },
  { href: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/items', label: 'Items', icon: Package },
  { href: '/subscription', label: 'Subscription', icon: CreditCard },
];

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
        What’s Inside the App
      </h1>
      <p className="text-center text-gray-600 mb-10">
        Powerful tools to manage your finances and documents with ease.
      </p>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {features.map(({ label, href, icon: Icon }) => (
          <div
            key={href}
            className="bg-white shadow-md hover:shadow-xl transition rounded-xl p-6 border flex flex-col items-start gap-4"
          >
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <Icon size={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
            <a
              href={href}
              className="text-sm text-blue-600 hover:underline"
            >
              View {label}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
