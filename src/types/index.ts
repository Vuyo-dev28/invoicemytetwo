
export type Profile = {
  id: string; // This is a UUID from auth.users.id
  company_name: string | null;
  company_address: string | null;
  logo_url: string | null;
  accent_color: string | null;
  business_type?: string | null;
  currency?: string | null;
  first_name?: string | null;
  last_name?: string | null;
};

export type Client = {
  id: string; // UUID
  user_id: string; // from auth.users.id
  name: string;
  email: string | null;
  address: string | null;
  vat_number: string | null;
  created_at: string;
};

export type Item = {
  id: string; // UUID
  // No user_id, items are public
  description: string;
  rate: number;
  created_at: string;
};

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export type Invoice = {
  id: string; // UUID
  user_id: string;
  client_id: string;
  invoice_number: string;
  issue_date: string; // Should be YYYY-MM-DD
  due_date: string | null; // Should be YYYY-MM-DD
  status: InvoiceStatus;
  notes: string | null;
  tax_percent: number;
  discount_percent: number;
  total: number;
  created_at: string;
};

export type InvoiceItem = {
  id: string; // UUID
  user_id: string;
  invoice_id: string; // UUID
  item_id: string | null; // UUID
  description: string;
  quantity: number;
  rate: number;
  created_at: string;
};

// Type for invoice with client name and total amount for list view
export type ExpandedInvoice = Invoice & {
  client_name: string;
  invoice_items: InvoiceItem[];
};

export type CashflowData = {
  month: string;
  income: number;
};
