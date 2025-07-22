'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';


export const signUp = async (_: any, formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const cookieStore = cookies();
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Signup error:', error.message);
    if (error.message.includes('User already registered')) {
      redirect('/signup?message=Account already exists.');
    }
    redirect('/signup?message=Could not sign up. Please try again.');
  }

  // Optional: Redirect to email confirmation page or login
  redirect('/login?message=Please check your email to confirm your account.');
};
