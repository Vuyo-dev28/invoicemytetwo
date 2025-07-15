-- Create the clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    address TEXT,
    vat_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the items table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'draft', -- e.g., draft, sent, paid, overdue
    notes TEXT,
    tax_percent NUMERIC(5, 2) DEFAULT 0,
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE SET NULL, -- Optional link to an item
    description TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for public access (since there is no user authentication)

-- Enable RLS for all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for anonymous users
CREATE POLICY "Allow public access to clients" ON clients FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to items" ON items FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to invoices" ON invoices FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to invoice_items" ON invoice_items FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to expenses" ON expenses FOR ALL TO anon USING (true) WITH CHECK (true);
