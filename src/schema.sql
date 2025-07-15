-- Create the clients table
CREATE TABLE clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  address TEXT,
  vat_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow all access for authenticated users" ON clients FOR ALL USING (auth.role() = 'authenticated');


-- Create the items table
CREATE TABLE items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON items FOR SELECT USING (true);
CREATE POLICY "Allow all access for authenticated users" ON items FOR ALL USING (auth.role() = 'authenticated');


-- Create the invoices table
CREATE TABLE invoices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES clients(id),
  invoice_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  tax_percent NUMERIC DEFAULT 0,
  discount_percent NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow all access for authenticated users" ON invoices FOR ALL USING (auth.role() = 'authenticated');


-- Create the invoice_items table
CREATE TABLE invoice_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  item_id uuid REFERENCES items(id),
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  rate NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON invoice_items FOR SELECT USING (true);
CREATE POLICY "Allow all access for authenticated users" ON invoice_items FOR ALL USING (auth.role() = 'authenticated');


-- Create the expenses table
CREATE TABLE expenses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date DATE NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON expenses FOR SELECT USING (true);
CREATE POLICY "Allow all access for authenticated users" ON expenses FOR ALL USING (auth.role() = 'authenticated');
