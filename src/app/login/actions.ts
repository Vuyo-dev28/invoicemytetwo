
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Use NEXT_PUBLIC_APP_URL which should be defined in your environment
  const origin = process.env.NEXT_PUBLIC_APP_URL

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Signup Error:', error);
    return redirect('/login?message=Could not sign up user. Please try again.')
  }
  
  // Redirect to a page that tells the user to check their email
  return redirect('/login?message=Check your email to continue the sign up process')
}
