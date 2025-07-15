
-- Add logo_url and accent_color columns to the clients table
alter table public.clients
  add column logo_url text,
  add column accent_color text;

-- Update the RLS policy to allow updating these new columns
drop policy if exists "Users can update their own clients" on public.clients;
create policy "Users can update their own clients"
  on public.clients for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

-- Update the trigger function to handle accent_color on signup
drop function if exists public.handle_new_user();
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.clients (user_id, name, email, business_type, currency, accent_color)
  values (
    new.id,
    new.raw_user_meta_data->>'company_name',
    new.email,
    new.raw_user_meta_data->>'business_type',
    new.raw_user_meta_data->>'currency',
    'hsl(210 40% 60%)' -- Default accent color
  );
  return new;
end;
$$;
    