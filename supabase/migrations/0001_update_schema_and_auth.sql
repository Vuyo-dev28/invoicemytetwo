
-- Drop existing tables and policies if they exist to avoid conflicts
-- Be careful, this will delete all existing data.
DROP POLICY IF EXISTS "Allow public delete access" ON "public"."invoice_items";
DROP POLICY IF EXISTS "Allow public update access" ON "public"."invoice_items";
DROP POLICY IF EXISTS "Allow public insert access" ON "public"."invoice_items";
DROP POLICY IF EXISTS "Allow public read access" ON "public"."invoice_items";
DROP POLICY IF EXISTS "Allow public delete access" ON "public"."invoices";
DROP POLICY IF EXISTS "Allow public update access" ON "public"."invoices";
DROP POLICY IF EXISTS "Allow public insert access" ON "public"."invoices";
DROP POLICY IF EXISTS "Allow public read access" ON "public"."invoices";
DROP POLICY IF EXISTS "Allow public delete access" ON "public"."items";
DROP POLICY IF EXISTS "Allow public update access" ON "public"."items";
DROP POLICY IF EXISTS "Allow public insert access" ON "public"."items";
DROP POLICY IF EXISTS "Allow public read access" ON "public"."items";
DROP POLICY IF EXISTS "Allow public delete access" ON "public"."clients";
DROP POLICY IF EXISTS "Allow public update access" ON "public"."clients";
DROP POLICY IF EXISTS "Allow public insert access" ON "public"."clients";
DROP POLICY IF EXISTS "Allow public read access" ON "public"."clients";

DROP TABLE IF EXISTS "public"."invoice_items";
DROP TABLE IF EXISTS "public"."invoices";
DROP TABLE IF EXISTS "public"."items";
DROP TABLE IF EXISTS "public"."clients";


-- Create the clients table with a user_id
create table clients (
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
create table items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  description text not null,
  rate numeric not null default 0,
  created_at timestamptz default now()
);

-- Create the invoices table with a user_id
create table invoices (
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
create table invoice_items (
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


-- Create a function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.clients (user_id, name, business_type, currency)
  values (new.id, new.raw_user_meta_data->>'company_name', new.raw_user_meta_data->>'business_type', new.raw_user_meta_data->>'currency');
  return new;
end;
$$;

-- Create a trigger to call the function when a new user is created in auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Secure RLS policies for clients
create policy "Users can view their own clients" on clients for select using (auth.uid() = user_id);
create policy "Users can insert their own clients" on clients for insert with check (auth.uid() = user_id);
create policy "Users can update their own clients" on clients for update using (auth.uid() = user_id);
create policy "Users can delete their own clients" on clients for delete using (auth.uid() = user_id);

-- Secure RLS policies for items
create policy "Users can view their own items" on items for select using (auth.uid() = user_id);
create policy "Users can insert their own items" on items for insert with check (auth.uid() = user_id);
create policy "Users can update their own items" on items for update using (auth.uid() = user_id);
create policy "Users can delete their own items" on items for delete using (auth.uid() = user_id);

-- Secure RLS policies for invoices
create policy "Users can view their own invoices" on invoices for select using (auth.uid() = user_id);
create policy "Users can insert their own invoices" on invoices for insert with check (auth.uid() = user_id);
create policy "Users can update their own invoices" on invoices for update using (auth.uid() = user_id);
create policy "Users can delete their own invoices" on invoices for delete using (auth.uid() = user_id);

-- Secure RLS policies for invoice_items
-- We check ownership via the parent invoice
create policy "Users can view their own invoice items" on invoice_items for select using (
  exists (
    select 1
    from invoices
    where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
create policy "Users can insert their own invoice items" on invoice_items for insert with check (
  exists (
    select 1
    from invoices
    where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
create policy "Users can update their own invoice items" on invoice_items for update using (
  exists (
    select 1
    from invoices
    where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
create policy "Users can delete their own invoice items" on invoice_items for delete using (
  exists (
    select 1
    from invoices
    where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
