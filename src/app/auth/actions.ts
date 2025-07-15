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
    company_name: formData.get('company_name') as string,
    business_type: formData.get('business_type') as string,
    currency: formData.get('currency') as string,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
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
      .insert({
        id: user.id, // Use the user's ID from the signup response
        company_name: data.company_name,
        business_type: data.business_type,
        currency: data.currency,
        first_name: data.first_name,
        last_name: data.last_name,
      });
    
    if (profileError) {
        console.error("Profile creation error:", profileError);
        return redirect(`/signup?message=Could not create user profile. ${profileError.message}`);
    }
  }

  return redirect('/login?message=Check your email to confirm your account and sign in.');
}
