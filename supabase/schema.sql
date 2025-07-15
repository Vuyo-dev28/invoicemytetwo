-- Create the "clients" table
create table clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  address text,
  vat_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create the "items" table
create table items (
  id uuid default gen_random_uuid() primary key,
  description text not null,
  rate numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create the "invoices" table
create table invoices (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references clients (id),
  invoice_number text not null,
  issue_date date not null,
  due_date date,
  status text not null default 'draft', -- 'draft', 'sent', 'paid', 'overdue'
  notes text,
  tax_percent numeric default 0,
  discount_percent numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create the "invoice_items" table
create table invoice_items (
  id uuid default gen_random_uuid() primary key,
  invoice_id uuid references invoices (id) on delete cascade not null,
  item_id uuid references items (id) on delete set null,
  description text not null,
  quantity numeric not null,
  rate numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security for all tables
alter table clients enable row level security;
alter table items enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;

-- Create policies to allow public access, since there are no users.
-- THIS IS FOR DEVELOPMENT ONLY. For production, you would want user-based policies.
create policy "Allow all access to clients" on clients for all using (true) with check (true);
create policy "Allow all access to items" on items for all using (true) with check (true);
create policy "Allow all access to invoices" on invoices for all using (true) with check (true);
create policy "Allow all access to invoice_items" on invoice_items for all using (true) with check (true);
