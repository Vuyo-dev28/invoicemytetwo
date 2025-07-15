-- Drop existing policies, triggers, and functions to ensure a clean slate.
DROP POLICY IF EXISTS "Users can view their own profiles." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;

-- Drop tables in reverse order of dependency to avoid foreign key constraints.
DROP TABLE IF EXISTS public.invoice_items;
DROP TABLE IF EXISTS public.invoices;
DROP TABLE IF EXISTS public.items;
DROP TABLE IF EXISTS public.clients;
DROP TABLE IF EXISTS public.profiles;

-- PROFILES TABLE
-- This table stores user-specific information that doesn't belong in auth.users.
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  company_name text,
  company_address text,
  business_type text,
  currency text,
  logo_url text,
  accent_color text
);
COMMENT ON TABLE public.profiles IS 'Profile data for each user.';

-- CLIENTS TABLE
-- This table stores the customers of each user.
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  address text,
  vat_number text,
  created_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.clients IS 'Stores client information for each user.';

-- ITEMS TABLE
-- This table stores the products or services each user sells.
CREATE TABLE public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description text NOT NULL,
  rate numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.items IS 'Stores items or services for each user.';

-- INVOICES TABLE
-- This table stores invoice records for each user.
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  invoice_number text NOT NULL,
  issue_date date NOT NULL,
  due_date date,
  status text NOT NULL DEFAULT 'draft',
  notes text,
  tax_percent numeric DEFAULT 0,
  discount_percent numeric DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.invoices IS 'Stores invoice information for each user.';

-- INVOICE_ITEMS TABLE
-- This is the join table between invoices and items.
CREATE TABLE public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  item_id uuid REFERENCES public.items(id) ON DELETE SET NULL,
  description text NOT NULL,
  quantity numeric NOT NULL,
  rate numeric NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.invoice_items IS 'Stores line items for each invoice.';

-- FUNCTION: handle_new_user
-- This function is triggered when a new user signs up.
-- It inserts a new row into the public.profiles table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, company_name, business_type, currency)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'company_name',
    new.raw_user_meta_data ->> 'business_type',
    new.raw_user_meta_data ->> 'currency'
  );
  RETURN new;
END;
$$;
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates a profile for a new user.';

-- TRIGGER: on_auth_user_created
-- This trigger calls the handle_new_user function after a new user is created.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS for all tables.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Policies for PROFILES table
CREATE POLICY "Users can view their own profiles." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for CLIENTS table
CREATE POLICY "Users can manage their own clients." ON public.clients FOR ALL USING (auth.uid() = user_id);

-- Policies for ITEMS table
CREATE POLICY "Users can manage their own items." ON public.items FOR ALL USING (auth.uid() = user_id);

-- Policies for INVOICES table
CREATE POLICY "Users can manage their own invoices." ON public.invoices FOR ALL USING (auth.uid() = user_id);

-- Policies for INVOICE_ITEMS table
CREATE POLICY "Users can manage their own invoice items." ON public.invoice_items FOR ALL USING (auth.uid() = user_id);
