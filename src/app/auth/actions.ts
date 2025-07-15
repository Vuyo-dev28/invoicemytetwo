
'use server'
 
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
 
export async function login(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
 
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
 
  const { error } = await supabase.auth.signInWithPassword(data)
 
  if (error) {
    return redirect(`/login?message=${error.message}`)
  }
 
  revalidatePath('/', 'layout')
  redirect('/')
}
 
export async function logout() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  await supabase.auth.signOut()
  return redirect('/login')
}

export async function signup(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return redirect(`/signup?message=${error.message}`);
  }

  // Supabase sends a confirmation email by default.
  // The user will be redirected to a page that tells them to check their email.
  return redirect('/login?message=Check your email to confirm your account and sign in.');
}
