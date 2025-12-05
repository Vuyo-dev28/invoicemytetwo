import { TourStep } from './guided-tour';

export const appTourSteps: TourStep[] = [
  {
    id: 'dashboard',
    target: 'dashboard',
    title: 'Welcome to InvoiceMyte! 👋',
    content: 'This is your dashboard where you can see an overview of your business performance, revenue trends, and key metrics at a glance.',
    position: 'center',
    route: '/dashboard',
  },
  {
    id: 'dashboard-stats',
    target: 'dashboard-stats',
    title: 'Key Metrics Cards',
    content: 'These cards show your total revenue from paid invoices, number of clients, paid invoices count, and pending invoices. They update in real-time as you create and manage invoices.',
    position: 'bottom',
    route: '/dashboard',
  },
  {
    id: 'dashboard-charts',
    target: 'dashboard-charts',
    title: 'Analytics & Trends',
    content: 'The charts below show your revenue trends over the past 12 months, invoice status distribution (draft, sent, paid, overdue), and your top 5 clients by revenue. Use these insights to understand your business performance.',
    position: 'top',
    route: '/dashboard',
  },
  {
    id: 'search',
    target: 'nav a[href="/search"]',
    title: 'Global Search Feature',
    content: 'Click on "Search" in the sidebar (or press Ctrl/Cmd + K) to quickly find any document, item, or client across your entire account. This makes it easy to locate what you need instantly.',
    position: 'right',
    route: '/dashboard',
  },
  {
    id: 'invoices',
    target: 'nav a[href="/invoices/list"]',
    title: 'Invoices Menu',
    content: 'Click here to access your invoices. You can create new invoices, view existing ones, track their status (draft, sent, paid, overdue), edit them, and download as PDFs.',
    position: 'right',
    route: '/dashboard',
  },
  {
    id: 'clients',
    target: 'nav a[href="/clients"]',
    title: 'Clients Menu',
    content: 'Click here to manage your client database. You can add new clients, edit their information, view all invoices associated with each client, and delete clients if needed.',
    position: 'right',
    route: '/dashboard',
  },
  {
    id: 'items',
    target: 'nav a[href="/items"]',
    title: 'Items & Services Menu',
    content: 'Click here to manage your products and services library. Create items with descriptions and rates that can be quickly added to invoices, saving you time when creating new documents.',
    position: 'right',
    route: '/dashboard',
  },
  {
    id: 'settings',
    target: 'a[href="/settings"]',
    title: 'Settings Menu',
    content: 'Click here to configure your company details, business information, currency preferences, and timezone settings. This information will automatically populate in your documents.',
    position: 'right',
    route: '/dashboard',
  },
];

