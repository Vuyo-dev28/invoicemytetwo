export type Profile = {
  id: string;
  company_name: string | null;
  business_type: string | null;
  currency: string | null;
  first_name: string | null;
  last_name: string | null;
  company_address: string | null;
  logo_url: string | null;
  accent_color: string | null;
};

export type Client = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  address: string | null;
  vat_number: string | null;
  created_at: string;
};

export type Item = {
  id: string;
  user_id: string;
  description: string;
  rate: number;
  created_at: string;
};

export type Invoice = {
  id: string;
  user_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string | null;
  client_id: string | null;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes: string | null;
  tax_percent: number;
  discount_percent: number;
  created_at: string;
};

export type InvoiceItem = {
  id: string;
  user_id: string;
  invoice_id: string;
  item_id: string | null;
  description: string;
  quantity: number;
  rate: number;
  created_at: string;
};
