// // import { createBrowserClient } from "@supabase/ssr";

import { createBrowserClient } from "@supabase/ssr";

// // export const createClient = () => {
// //   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// //   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON;

// //   // if (!supabaseUrl || !supabaseAnonKey) {
// //   //   throw new Error("Supabase URL and anonymous key must be provided.");
// //   // }

// //   // return createBrowserClient(supabaseUrl, supabaseAnonKey);
// // };
// import { createBrowserClient } from "@supabase/ssr";

// export const createClient = (supabaseUrl: string, supabaseAnon: string) => {
//   return createBrowserClient(supabaseUrl, supabaseAnon);
// };
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON;

  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key:', supabaseAnonKey);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and anonymous key must be provided.");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
