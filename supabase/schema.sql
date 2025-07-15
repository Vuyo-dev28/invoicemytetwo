-- Create Clients Table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    address TEXT,
    vat_number TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Items Table
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Invoices Table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'draft', -- e.g., 'draft', 'sent', 'paid', 'overdue'
    notes TEXT,
    tax_percent NUMERIC(5, 2) DEFAULT 0,
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Invoice Items Table
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE SET NULL, -- optional link to a predefined item
    description TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies to allow full public access since there is no authentication
CREATE POLICY "Allow public access to clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to items" ON public.items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to invoice_items" ON public.invoice_items FOR ALL USING (true) WITH CHECK (true);
