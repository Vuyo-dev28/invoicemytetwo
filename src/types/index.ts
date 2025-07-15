
export type Profile = {
  id: string; // Corresponds to auth.users.id
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  company_address: string | null;
  business_type: string | null;
  currency: string | null;
  logo_url: string | null;
  accent_color: string | null;
};

export type Client = {
  id: string;
  name: string;
  email: string | null;
  address: string | null;
  vat_number: string | null;
  created_at: string;
};

export type Item = {
  id: string;
  description: string;
  rate: number;
  created_at: string;
};

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export type Invoice = {
  id: string;
  client_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string | null;
  status: InvoiceStatus;
  notes: string | null;
  tax_percent: number;
  discount_percent: number;
  created_at: string;
  paid_at: string | null;
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  item_id: string | null;
  description: string;
  quantity: number;
  rate: number;
  created_at: string;
};

// Type for invoice with client name and total amount for list view
export type ExpandedInvoice = Invoice & {
  client_name: string;
  total: number;
  invoice_items: { quantity: number; rate: number }[];
};

export type CashflowData = {
  month: string;
  income: number;
};
