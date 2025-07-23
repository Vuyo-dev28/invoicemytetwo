'use server';

import { cookies } from 'next/headers';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const signIn = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const cookieStore = cookies();
  const supabase = createServerClient({
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return redirect('/login?message=Invalid email or password. Please try again.');
    }
    return redirect('/login?message=Could not authenticate user. Please try again.');
  }

  return redirect('/dashboard');
};

export const signUp = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const cookieStore = cookies();

  const supabase = createServerClient({
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error(error);
    if (error.message.includes('User already registered')) {
      return redirect('/login?message=An account with this email already exists.');
    }
    return redirect('/signup?message=Could not sign up user. Please try again.');
  }

  // Set a cookie to indicate a new user
  cookieStore.set('new_user', 'true', { path: '/', maxAge: 3600 }); // Expires in 1 hour

  return redirect('/dashboard');
};


export const resetPassword = async (formData: FormData) => {
  const email = formData.get('email') as string;

  const cookieStore = cookies();

  const supabase = createServerClient({
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`, // Make sure this route exists
  });

  if (error) {
    console.error("Password reset error:", error.message);
    return redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  return redirect(`/login?message=${encodeURIComponent("If that email exists, a reset link has been sent.")}`);
};



