
export type Profile = {
  id: string; // This is a UUID
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
  name: string;
  email: string | null;
  address: string | null;
  vat_number: string | null;
  created_at: string;
};

export type Item = {
  id: string; // UUID
  description: string;
  rate: number;
  created_at: string;
};

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export type Invoice = {
  id: string; // UUID
  profile_id: string; // UUID of the owner
  client_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string | null;
  status: InvoiceStatus;
  notes: string | null;
  tax_percent: number;
  discount_percent: number;
  total: number;
  created_at: string;
};

export type InvoiceItem = {
  id: string; // UUID
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
