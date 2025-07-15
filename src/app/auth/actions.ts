
'use server'
 
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Profile } from '@/types'
 
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
    company_name: formData.get('company_name') as string,
  };

  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (signUpError) {
    return redirect(`/signup?message=${signUpError.message}`);
  }

  if (user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        id: user.id,
        company_name: data.company_name,
      })
      .eq('id', user.id)
    
    if (profileError) {
        // If profile update fails, we should probably handle this case.
        // For now, redirect with a generic error.
        console.error("Profile creation error:", profileError);
        return redirect(`/signup?message=Could not create user profile. ${profileError.message}`);
    }
  }

  return redirect('/login?message=Check your email to confirm your account and sign in.');
}
