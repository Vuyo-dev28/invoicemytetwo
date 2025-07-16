import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Gift } from 'lucide-react';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/');
  };

  const signUp = async (formData: FormData) => {
    'use server';

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
      return redirect('/login?message=Could not sign up user');
    }

    // Redirect to the company name step after successful sign up
    return redirect('/signup/company-name');
  };

  const signInWithGoogle = async () => {
    'use server';
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      return redirect('/login?message=Could not sign in with Google');
    }

    return redirect(data.url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20">
      <div className="mb-8 flex flex-col items-center text-center">
        <Gift className="h-12 w-12 text-primary" />
        <h1 className="text-2xl font-bold mt-2">InvoiceMe</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {searchParams?.message && (
                <p className="p-4 bg-foreground/10 text-foreground text-center text-sm">
                    {searchParams.message}
                </p>
            )}
            <Button formAction={signIn} className="w-full">Sign in</Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
             <form action={signInWithGoogle}>
                <Button variant="outline" className="w-full">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" fill="#4285F4"/><path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" fill="url(#paint0_linear)"/> <defs><linearGradient id="paint0_linear" x1="45" y1="2" x2="2" y2="45"><stop stop-color="#4285F4"/><stop offset="1" stop-color="#34A853"/></linearGradient></defs></svg>
                    Sign in with Google
                </Button>
            </form>
            <Button variant="outline" className="w-full bg-black text-white hover:bg-black/90 hover:text-white">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.152,12.199c-0.02,0.151-0.033,0.306-0.033,0.463c0,3.206,2.297,4.823,5.52,4.823 c0.132,0,0.26-0.005,0.385-0.015c-0.626,1.868-2.22,3.13-4.144,3.13c-0.41,0-0.813-0.066-1.204-0.188 c-1.543,0.857-3.23,1.3-4.996,1.32c-0.566-0.003-1.12-0.076-1.664-0.211c-0.126-0.031-0.25-0.068-0.372-0.108 c-0.848-0.283-1.656-0.729-2.399-1.309c-2.348-1.815-3.55-4.524-3.55-7.742c0-3.327,1.383-6.02,3.953-7.924 c1.23-0.912,2.63-1.425,4.062-1.455c0.443-0.009,0.884,0.046,1.316,0.158c1.373,0.354,2.648,1.063,3.811,2.05 c-1.54,0.923-2.483,2.56-2.483,4.433C12.119,11.892,12.132,12.046,12.152,12.199z M16.208,2.052 c2.03-1.026,3.876-0.372,4.686,0.562c-0.78,1.01-1.893,2.578-2.883,3.967c-1.146-0.915-2.505-1.564-4.01-1.612 C14.545,4.896,15.176,3.37,16.208,2.052z"/></svg>
                Sign in with Apple
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="#" className="underline" onClick={(e) => { 
            e.preventDefault(); 
            // This is a simplified way to trigger the sign-up form.
            // A more robust solution might use state.
            const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value;
            const password = (document.querySelector('input[name="password"]') as HTMLInputElement)?.value;
            if (email && password) {
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
                signUp(formData);
            } else {
                alert('Please enter email and password to sign up.');
            }
        }}>
          Sign up
        </Link>
      </div>
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <Link href="#" className="underline">Privacy</Link>
        {' - '}
        <Link href="#" className="underline">Terms</Link>
      </div>
    </div>
  );
}
