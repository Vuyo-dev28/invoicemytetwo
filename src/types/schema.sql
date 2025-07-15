-- Create Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    first_name TEXT,
    last_name TEXT,
    company_name TEXT,
    company_address TEXT,
    business_type TEXT,
    currency TEXT,
    logo_url TEXT,
    accent_color TEXT
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);


-- Create Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    address TEXT,
    vat_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert clients" ON clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update clients" ON clients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete clients" ON clients FOR DELETE TO authenticated USING (true);
CREATE POLICY "Allow anon users to insert clients" ON clients FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon users to update clients" ON clients FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon users to delete clients" ON clients FOR DELETE TO anon USING (true);


-- Create Items table
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to items" ON items FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage items" ON items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon users to manage items" ON items FOR ALL TO anon USING (true);

-- Create Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    issue_date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'draft',
    notes TEXT,
    tax_percent NUMERIC(5, 2) DEFAULT 0,
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage invoices" ON invoices FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon users to manage invoices" ON invoices FOR ALL TO anon USING (true);


-- Create InvoiceItems table
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to invoice items" ON invoice_items FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage invoice items" ON invoice_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon users to manage invoice items" ON invoice_items FOR ALL TO anon USING (true);


-- Create Expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to expenses" ON expenses FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage expenses" ON expenses FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon users to manage expenses" ON expenses FOR ALL TO anon USING (true);
