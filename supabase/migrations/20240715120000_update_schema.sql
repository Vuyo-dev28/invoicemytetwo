-- Create the profiles table to store user-specific data
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text,
  business_type text,
  currency text,
  first_name text,
  last_name text,
  company_address text,
  logo_url text,
  accent_color text
);

-- Create the clients table
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  address text,
  vat_number text,
  created_at timestamptz default now()
);

-- Create the items table
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  description text not null,
  rate numeric not null default 0,
  created_at timestamptz default now()
);

-- Create the invoices table
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
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
create table if not exists invoice_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  invoice_id uuid not null references invoices(id) on delete cascade,
  item_id uuid references items(id), -- Can be null if it's a custom item
  description text not null,
  quantity numeric not null,
  rate numeric not null,
  created_at timestamptz default now()
);

-- Function to create a profile for a new user
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, company_name, business_type, currency, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'business_type',
    new.raw_user_meta_data->>'currency',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute the function on new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Enable Row Level Security (RLS) for all tables
alter table profiles enable row level security;
alter table clients enable row level security;
alter table items enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;

-- Policies for profiles table
drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Policies for clients table
drop policy if exists "Users can view their own clients" on clients;
create policy "Users can view their own clients" on clients for select using (auth.uid() = user_id);
drop policy if exists "Users can insert their own clients" on clients;
create policy "Users can insert their own clients" on clients for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update their own clients" on clients;
create policy "Users can update their own clients" on clients for update using (auth.uid() = user_id);
drop policy if exists "Users can delete their own clients" on clients;
create policy "Users can delete their own clients" on clients for delete using (auth.uid() = user_id);

-- Policies for items table
drop policy if exists "Users can view their own items" on items;
create policy "Users can view their own items" on items for select using (auth.uid() = user_id);
drop policy if exists "Users can insert their own items" on items;
create policy "Users can insert their own items" on items for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update their own items" on items;
create policy "Users can update their own items" on items for update using (auth.uid() = user_id);
drop policy if exists "Users can delete their own items" on items;
create policy "Users can delete their own items" on items for delete using (auth.uid() = user_id);

-- Policies for invoices table
drop policy if exists "Users can view their own invoices" on invoices;
create policy "Users can view their own invoices" on invoices for select using (auth.uid() = user_id);
drop policy if exists "Users can insert their own invoices" on invoices;
create policy "Users can insert their own invoices" on invoices for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update their own invoices" on invoices;
create policy "Users can update their own invoices" on invoices for update using (auth.uid() = user_id);
drop policy if exists "Users can delete their own invoices" on invoices;
create policy "Users can delete their own invoices" on invoices for delete using (auth.uid() = user_id);

-- Policies for invoice_items table
drop policy if exists "Users can view their own invoice_items" on invoice_items;
create policy "Users can view their own invoice_items" on invoice_items for select using (auth.uid() = user_id);
drop policy if exists "Users can insert their own invoice_items" on invoice_items;
create policy "Users can insert their own invoice_items" on invoice_items for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update their own invoice_items" on invoice_items;
create policy "Users can update their own invoice_items" on invoice_items for update using (auth.uid() = user_id);
drop policy if exists "Users can delete their own invoice_items" on invoice_items;
create policy "Users can delete their own invoice_items" on invoice_items for delete using (auth.uid() = user_id);
