-- Drop existing policies if they exist, to prevent conflicts
DROP POLICY IF EXISTS "Public access for clients" ON public.clients;
DROP POLICY IF EXISTS "Public access for items" ON public.items;
DROP POLICY IF EXISTS "Public access for invoices" ON public.invoices;
DROP POLICY IF EXISTS "Public access for invoice_items" ON public.invoice_items;
DROP POLICY IF EXISTS "Public read access to expenses" ON public.expenses;

-- Enable Row Level Security on all tables
alter table public.clients enable row level security;
alter table public.items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.expenses enable row level security;

-- Create policies for public read access
create policy "Public access for clients" on public.clients for select using (true);
create policy "Public access for items" on public.items for select using (true);
create policy "Public access for invoices" on public.invoices for select using (true);
create policy "Public access for invoice_items" on public.invoice_items for select using (true);
create policy "Public read access to expenses" on public.expenses for select using (true);

-- Create policies for public write access
create policy "Public write access for clients" on public.clients for insert with check (true);
create policy "Public write access for items" on public.items for insert with check (true);
create policy "Public write access for invoices" on public.invoices for all with check (true);
create policy "Public write access for invoice_items" on public.invoice_items for insert with check (true);
create policy "Public write access for expenses" on public.expenses for insert with check (true);
