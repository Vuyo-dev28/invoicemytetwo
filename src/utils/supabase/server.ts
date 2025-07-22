import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookies) => {
        for (const cookie of cookies) {
          cookieStore.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });
};
