-- Create Clients Table
CREATE TABLE clients (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    address TEXT,
    vat_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Disable RLS for clients table
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;


-- Create Items Table
CREATE TABLE items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    description TEXT NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Disable RLS for items table
ALTER TABLE public.items DISABLE ROW LEVEL SECURITY;


-- Create Invoices Table
CREATE TABLE invoices (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE,
    status TEXT DEFAULT 'draft'::text NOT NULL, -- draft, sent, paid, overdue
    notes TEXT,
    tax_percent NUMERIC(5, 2) DEFAULT 0,
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Disable RLS for invoices table
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;


-- Create Invoice Items Table
CREATE TABLE invoice_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
    item_id uuid REFERENCES items(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Disable RLS for invoice_items table
ALTER TABLE public.invoice_items DISABLE ROW LEVEL SECURITY;
