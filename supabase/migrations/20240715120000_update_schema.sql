-- Drop existing trigger and function to ensure idempotency
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user;

-- Add user_id to clients, items, and invoices
alter table clients add column if not exists user_id uuid references auth.users(id);
alter table items add column if not exists user_id uuid references auth.users(id);
alter table invoices add column if not exists user_id uuid references auth.users(id);

-- Add signup data columns to clients table
alter table clients add column if not exists business_type text;
alter table clients add column if not exists currency text;


-- Drop old public policies if they exist
-- Note: Supabase might name policies differently if created via UI. 
-- This is a best-effort attempt to clean up.
drop policy if exists "Allow public read access" on clients;
drop policy if exists "Allow public insert access" on clients;
drop policy if exists "Allow public update access" on clients;
drop policy if exists "Allow public delete access" on clients;

drop policy if exists "Allow public read access" on items;
drop policy if exists "Allow public insert access" on items;
drop policy if exists "Allow public update access" on items;
drop policy if exists "Allow public delete access" on items;

drop policy if exists "Allow public read access" on invoices;
drop policy if exists "Allow public insert access" on invoices;
drop policy if exists "Allow public update access" on invoices;
drop policy if exists "Allow public delete access" on invoices;

drop policy if exists "Allow public read access" on invoice_items;
drop policy if exists "Allow public insert access" on invoice_items;
drop policy if exists "Allow public update access" on invoice_items;
drop policy if exists "Allow public delete access" on invoice_items;

-- Secure RLS policies based on user_id

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
-- This policy assumes that if a user can see an invoice, they can see its items.
create policy "Users can view their own invoice items" on invoice_items for select using (
  exists (
    select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
create policy "Users can insert their own invoice items" on invoice_items for insert with check (
  exists (
    select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
create policy "Users can update their own invoice items" on invoice_items for update using (
  exists (
    select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
create policy "Users can delete their own invoice items" on invoice_items for delete using (
  exists (
    select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);


-- Function to create a client for a new user
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.clients (id, user_id, name, business_type, currency, email)
  values (
    gen_random_uuid(),
    new.id,
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'business_type',
    new.raw_user_meta_data->>'currency',
    new.email
  );
  return new;
end;
$$;

-- Trigger to call the function when a new user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();