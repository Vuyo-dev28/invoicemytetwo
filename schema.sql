
-- Enable the UUID extension
create extension if not exists "uuid-ossp" with schema "extensions";

-- Clients Table
create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique,
  address text,
  vat_number text,
  created_at timestamp with time zone default now()
);

-- Items Table
create table if not exists public.items (
  id uuid primary key default uuid_generate_v4(),
  description text not null,
  rate numeric not null,
  created_at timestamp with time zone default now()
);

-- Invoices Table
create table if not exists public.invoices (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete set null,
  invoice_number text not null,
  issue_date date not null,
  due_date date,
  status text not null check (status in ('draft', 'sent', 'paid', 'overdue')),
  notes text,
  tax_percent numeric default 0,
  discount_percent numeric default 0,
  created_at timestamp with time zone default now()
);

-- Invoice Items Table
create table if not exists public.invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references public.invoices(id) on delete cascade not null,
  description text not null,
  quantity numeric not null,
  rate numeric not null,
  created_at timestamp with time zone default now()
);

-- Expenses Table
create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  description text not null,
  amount numeric not null,
  date date not null,
  category text,
  created_at timestamp with time zone default now()
);
