-- Drop tables if they exist
drop table if exists public.invoice_items;
drop table if exists public.invoices;
drop table if exists public.items;
drop table if exists public.clients;
drop table if exists public.expenses;

-- Create clients table
create table public.clients (
  id uuid not null default gen_random_uuid (),
  name text not null,
  email text null,
  address text null,
  vat_number text null,
  created_at timestamp with time zone null default now(),
  constraint clients_pkey primary key (id)
);
-- Create items table
create table public.items (
  id uuid not null default gen_random_uuid (),
  description text not null,
  rate numeric(10, 2) not null,
  created_at timestamp with time zone null default now(),
  constraint items_pkey primary key (id)
);

-- Create invoices table
create table public.invoices (
  id uuid not null default gen_random_uuid (),
  client_id uuid null,
  invoice_number text not null,
  issue_date date not null,
  due_date date null,
  status text not null default 'draft'::text,
  notes text null,
  tax_percent numeric(5, 2) null default 0,
  discount_percent numeric(5, 2) null default 0,
  total numeric(10, 2) null default 0,
  created_at timestamp with time zone null default now(),
  constraint invoices_pkey primary key (id),
  constraint invoices_client_id_fkey foreign KEY (client_id) references clients (id)
);
-- Create invoice_items table
create table public.invoice_items (
  id uuid not null default gen_random_uuid (),
  invoice_id uuid not null,
  item_id uuid null,
  description text not null,
  quantity integer not null,
  rate numeric(10, 2) not null,
  created_at timestamp with time zone null default now(),
  constraint invoice_items_pkey primary key (id),
  constraint invoice_items_invoice_id_fkey foreign key (invoice_id) references invoices (id) on delete cascade,
  constraint invoice_items_item_id_fkey foreign key (item_id) references items (id) on delete set null
);


-- RLS Policies
-- These policies are examples and should be configured based on your application's needs.
-- For a quick start without authentication, you might grant public access.
-- WARNING: The following policies allow public access. Secure this for production.
alter table public.clients enable row level security;
alter table public.items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

-- Allow public read access to all tables
create policy "Allow public read access on clients" on public.clients for select using (true);
create policy "Allow public read access on items" on public.items for select using (true);
create policy "Allow public read access on invoices" on public.invoices for select using (true);
create policy "Allow public read access on invoice_items" on public.invoice_items for select using (true);

-- Allow all operations for authenticated users
-- create policy "Allow all operations for authenticated users on clients" on public.clients for all using (auth.role() = 'authenticated');
-- create policy "Allow all operations for authenticated users on items" on public.items for all using (auth.role() = 'authenticated');
-- create policy "Allow all operations for authenticated users on invoices" on public.invoices for all using (auth.role() = 'authenticated');
-- create policy "Allow all operations for authenticated users on invoice_items" on public.invoice_items for all using (auth.role() = 'authenticated');
