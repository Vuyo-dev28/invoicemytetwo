-- Create Clients Table
CREATE TABLE clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  address TEXT,
  vat_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Items Table
CREATE TABLE items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  rate NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Invoices Table
CREATE TABLE invoices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'draft', -- e.g., draft, sent, paid, overdue
  notes TEXT,
  tax_percent NUMERIC(5, 2) DEFAULT 0,
  discount_percent NUMERIC(5, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Invoice Items Table
CREATE TABLE invoice_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  item_id uuid REFERENCES items(id) ON DELETE SET NULL, -- Optional link to an item
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  rate NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Expenses Table
CREATE TABLE expenses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;


-- Create policies to allow public access (since there is no authentication)
CREATE POLICY "Allow public read access" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON clients FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON items FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON invoices FOR UPDATE USING (true);


CREATE POLICY "Allow public read access" ON invoice_items FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON invoice_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON expenses FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON expenses FOR INSERT WITH CHECK (true);
