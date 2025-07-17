import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and anonymous key must be provided.");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
