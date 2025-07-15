-- Create the clients table
create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  address text,
  vat_number text,
  created_at timestamptz default now()
);

-- Create the items table
create table items (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  rate numeric not null default 0,
  created_at timestamptz default now()
);

-- Create the invoices table
create table invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null,
  issue_date date not null,
  due_date date,
  client_id uuid references clients(id),
  status text not null default 'draft', -- e.g., 'draft', 'sent', 'paid', 'overdue'
  notes text,
  tax_percent numeric default 0,
  discount_percent numeric default 0,
  created_at timestamptz default now()
);

-- Create the invoice_items join table
create table invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  item_id uuid references items(id), -- Can be null if it's a custom item
  description text not null,
  quantity numeric not null,
  rate numeric not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) for all tables
alter table clients enable row level security;
alter table items enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;

-- Create policies to allow public access for now
-- In a real app, you'd restrict this based on authenticated users
create policy "Allow public read access" on clients for select using (true);
create policy "Allow public insert access" on clients for insert with check (true);
create policy "Allow public update access" on clients for update using (true);
create policy "Allow public delete access" on clients for delete using (true);

create policy "Allow public read access" on items for select using (true);
create policy "Allow public insert access" on items for insert with check (true);
create policy "Allow public update access" on items for update using (true);
create policy "Allow public delete access" on items for delete using (true);

create policy "Allow public read access" on invoices for select using (true);
create policy "Allow public insert access" on invoices for insert with check (true);
create policy "Allow public update access" on invoices for update using (true);
create policy "Allow public delete access" on invoices for delete using (true);

create policy "Allow public read access" on invoice_items for select using (true);
create policy "Allow public insert access" on invoice_items for insert with check (true);
create policy "Allow public update access" on invoice_items for update using (true);
create policy "Allow public delete access" on invoice_items for delete using (true);
