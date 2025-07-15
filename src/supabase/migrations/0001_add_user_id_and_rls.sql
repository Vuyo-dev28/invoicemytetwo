-- This script assumes you have already run the previous migration to create the base tables.
-- If not, you should run that first. This script modifies existing tables and adds RLS.

-- Add user_id column to relevant tables
alter table clients add column if not exists user_id uuid references auth.users(id);
alter table items add column if not exists user_id uuid references auth.users(id);
alter table invoices add column if not exists user_id uuid references auth.users(id);

-- Add business_type and currency to clients table to store signup info
alter table clients add column if not exists business_type text;
alter table clients add column if not exists currency text;


-- Drop existing public policies before creating specific ones
-- Note: This will temporarily block access until new policies are created.
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


-- Create policies for 'clients' table
create policy "Users can view their own clients." on clients for select using (auth.uid() = user_id);
create policy "Users can insert their own clients." on clients for insert with check (auth.uid() = user_id);
create policy "Users can update their own clients." on clients for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own clients." on clients for delete using (auth.uid() = user_id);

-- Create policies for 'items' table
create policy "Users can view their own items." on items for select using (auth.uid() = user_id);
create policy "Users can insert their own items." on items for insert with check (auth.uid() = user_id);
create policy "Users can update their own items." on items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own items." on items for delete using (auth.uid() = user_id);

-- Create policies for 'invoices' table
create policy "Users can view their own invoices." on invoices for select using (auth.uid() = user_id);
create policy "Users can insert their own invoices." on invoices for insert with check (auth.uid() = user_id);
create policy "Users can update their own invoices." on invoices for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own invoices." on invoices for delete using (auth.uid() = user_id);

-- Create policies for 'invoice_items' table
-- This policy ensures users can only access invoice_items for invoices they own.
create policy "Users can view their own invoice items." on invoice_items for select using (
  exists (
    select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
create policy "Users can insert their own invoice items." on invoice_items for insert with check (
  exists (
    select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
create policy "Users can update their own invoice items." on invoice_items for update using (
  exists (
    select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);
create policy "Users can delete their own invoice items." on invoice_items for delete using (
  exists (
    select 1 from invoices where invoices.id = invoice_items.invoice_id and invoices.user_id = auth.uid()
  )
);

-- Function and Trigger to create a client for a new user
-- This function correctly extracts metadata from the new user object
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.clients (user_id, name, business_type, currency, email)
  values (
    new.id,
    new.raw_user_meta_data->>'companyName',
    new.raw_user_meta_data->>'businessType',
    new.raw_user_meta_data->>'currency',
    new.email
  );
  return new;
end;
$$;


-- the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

