-- Create the clients table with a user_id
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  address text,
  vat_number text,
  business_type text,
  currency text,
  created_at timestamptz default now()
);

-- Create the items table with a user_id
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  description text not null,
  rate numeric not null default 0,
  created_at timestamptz default now()
);

-- Create the invoices table with a user_id
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  invoice_number text not null,
  issue_date date not null,
  due_date date,
  client_id uuid references clients(id) on delete set null,
  status text not null default 'draft', -- e.g., 'draft', 'sent', 'paid', 'overdue'
  notes text,
  tax_percent numeric default 0,
  discount_percent numeric default 0,
  created_at timestamptz default now()
);

-- Create the invoice_items join table
create table if not exists invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  item_id uuid references items(id) on delete set null, -- Can be null if it's a custom item
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

-- Drop existing policies to ensure the script is re-runnable
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert their own clients" ON clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;

DROP POLICY IF EXISTS "Users can view their own items" ON items;
DROP POLICY IF EXISTS "Users can insert their own items" ON items;
DROP POLICY IF EXISTS "Users can update their own items" ON items;
DROP POLICY IF EXISTS "Users can delete their own items" ON items;

DROP POLICY IF EXISTS "Users can view their own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can insert their own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can update their own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON invoices;

DROP POLICY IF EXISTS "Users can view their own invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Users can insert their own invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Users can update their own invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Users can delete their own invoice_items" ON invoice_items;


-- Policies for clients
create policy "Users can view their own clients" on clients for select using (auth.uid() = user_id);
create policy "Users can insert their own clients" on clients for insert with check (auth.uid() = user_id);
create policy "Users can update their own clients" on clients for update using (auth.uid() = user_id);
create policy "Users can delete their own clients" on clients for delete using (auth.uid() = user_id);

-- Policies for items
create policy "Users can view their own items" on items for select using (auth.uid() = user_id);
create policy "Users can insert their own items" on items for insert with check (auth.uid() = user_id);
create policy "Users can update their own items" on items for update using (auth.uid() = user_id);
create policy "Users can delete their own items" on items for delete using (auth.uid() = user_id);

-- Policies for invoices
create policy "Users can view their own invoices" on invoices for select using (auth.uid() = user_id);
create policy "Users can insert their own invoices" on invoices for insert with check (auth.uid() = user_id);
create policy "Users can update their own invoices" on invoices for update using (auth.uid() = user_id);
create policy "Users can delete their own invoices" on invoices for delete using (auth.uid() = user_id);

-- Policies for invoice_items
-- Users can manage invoice_items if they own the parent invoice.
create policy "Users can view their own invoice_items" on invoice_items for select using (
  exists (
    select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
create policy "Users can insert their own invoice_items" on invoice_items for insert with check (
  exists (
    select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
create policy "Users can update their own invoice_items" on invoice_items for update using (
  exists (
    select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
create policy "Users can delete their own invoice_items" on invoice_items for delete using (
  exists (
    select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);


-- Function to create a client for a new user
-- Drop the function and trigger if they exist to make the script re-runnable
DROP TRIGGER if exists on_auth_user_created on auth.users;
DROP FUNCTION if exists handle_new_user;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.clients (user_id, name, business_type, currency)
  values (
    new.id,
    new.raw_user_meta_data->>'companyName',
    new.raw_user_meta_data->>'businessType',
    new.raw_user_meta_data->>'currency'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();