-- Drop existing tables and types if they exist to ensure a clean slate.
DROP TABLE IF EXISTS "public"."invoice_items";
DROP TABLE IF EXISTS "public"."invoices";
DROP TABLE IF EXISTS "public"."items";
DROP TABLE IF EXISTS "public"."clients";
DROP TABLE IF EXISTS "public"."profiles";
DROP TYPE IF EXISTS "public"."invoice_status";

-- Recreate the invoice_status type
CREATE TYPE "public"."invoice_status" AS ENUM ('draft', 'sent', 'paid', 'overdue');

-- Create the profiles table to store user-specific data
CREATE TABLE "public"."profiles" (
    "id" "uuid" NOT NULL,
    "company_name" "text",
    "business_type" "text",
    "currency" "text",
    "first_name" "text",
    "last_name" "text",
    "company_address" "text",
    "logo_url" "text",
    "accent_color" "text"
);
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY USING INDEX "profiles_pkey";
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create the clients table
CREATE TABLE "public"."clients" (
    "id" "uuid" NOT NULL DEFAULT "gen_random_uuid"(),
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text",
    "address" "text",
    "vat_number" "text",
    "created_at" "timestamp with time zone" NOT NULL DEFAULT "now"()
);
ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX clients_pkey ON public.clients USING btree (id);
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_pkey" PRIMARY KEY USING INDEX "clients_pkey";
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create the items table
CREATE TABLE "public"."items" (
    "id" "uuid" NOT NULL DEFAULT "gen_random_uuid"(),
    "user_id" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "rate" "numeric" NOT NULL DEFAULT 0,
    "created_at" "timestamp with time zone" NOT NULL DEFAULT "now"()
);
ALTER TABLE "public"."items" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX items_pkey ON public.items USING btree (id);
ALTER TABLE "public"."items" ADD CONSTRAINT "items_pkey" PRIMARY KEY USING INDEX "items_pkey";
ALTER TABLE "public"."items" ADD CONSTRAINT "items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


-- Create the invoices table
CREATE TABLE "public"."invoices" (
    "id" "uuid" NOT NULL DEFAULT "gen_random_uuid"(),
    "user_id" "uuid" NOT NULL,
    "invoice_number" "text" NOT NULL,
    "issue_date" "date" NOT NULL,
    "due_date" "date",
    "client_id" "uuid",
    "status" "public"."invoice_status" NOT NULL DEFAULT 'draft',
    "notes" "text",
    "tax_percent" "numeric" DEFAULT 0,
    "discount_percent" "numeric" DEFAULT 0,
    "created_at" "timestamp with time zone" NOT NULL DEFAULT "now"()
);
ALTER TABLE "public"."invoices" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX invoices_pkey ON public.invoices USING btree (id);
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_pkey" PRIMARY KEY USING INDEX "invoices_pkey";
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;


-- Create the invoice_items table
CREATE TABLE "public"."invoice_items" (
    "id" "uuid" NOT NULL DEFAULT "gen_random_uuid"(),
    "user_id" "uuid" NOT NULL,
    "invoice_id" "uuid" NOT NULL,
    "item_id" "uuid",
    "description" "text" NOT NULL,
    "quantity" "numeric" NOT NULL,
    "rate" "numeric" NOT NULL,
    "created_at" "timestamp with time zone" NOT NULL DEFAULT "now"()
);
ALTER TABLE "public"."invoice_items" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX invoice_items_pkey ON public.invoice_items USING btree (id);
ALTER TABLE "public"."invoice_items" ADD CONSTRAINT "invoice_items_pkey" PRIMARY KEY USING INDEX "invoice_items_pkey";
ALTER TABLE "public"."invoice_items" ADD CONSTRAINT "invoice_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE "public"."invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;
ALTER TABLE "public"."invoice_items" ADD CONSTRAINT "invoice_items_item_id_fkey" FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE SET NULL;


-- Policies for profiles
CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));
CREATE POLICY "Users can update their own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));
CREATE POLICY "Users can view their own profile." ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));

-- Policies for clients
CREATE POLICY "Users can manage their own clients" ON "public"."clients" FOR ALL USING (("auth"."uid"() = "user_id"));

-- Policies for items
CREATE POLICY "Users can manage their own items" ON "public"."items" FOR ALL USING (("auth"."uid"() = "user_id"));

-- Policies for invoices
CREATE POLICY "Users can manage their own invoices" ON "public"."invoices" FOR ALL USING (("auth"."uid"() = "user_id"));

-- Policies for invoice_items
CREATE POLICY "Users can manage their own invoice items" ON "public"."invoice_items" FOR ALL USING (("auth"."uid"() = "user_id"));


-- Trigger function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION "public"."handle_new_user"()
RETURNS "trigger"
LANGUAGE "plpgsql"
SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, company_name, business_type, currency, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'company_name',
    NEW.raw_user_meta_data ->> 'business_type',
    NEW.raw_user_meta_data ->> 'currency',
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it's there
DROP TRIGGER IF EXISTS "on_auth_user_created" ON "auth"."users";
-- Create the trigger
CREATE TRIGGER "on_auth_user_created"
AFTER INSERT ON "auth"."users"
FOR EACH ROW EXECUTE PROCEDURE "public"."handle_new_user"();
