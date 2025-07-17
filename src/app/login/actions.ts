
'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const signIn = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
        if (error.message.includes('Invalid login credentials')) {
            return redirect('/login?message=Invalid email or password. Please try again.');
        }
      return redirect('/login?message=Could not authenticate user. Please try again.');
    }

    // FIX: Redirect to dashboard/home after login
    return redirect('/');
  };

export const signUp = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error(error);
       if (error.message.includes('User already registered')) {
        return redirect('/login?message=An account with this email already exists.');
      }
      return redirect('/login?message=Could not sign up user. Please try again.');
    }
    
    return redirect('/signup/company-name');
  };

