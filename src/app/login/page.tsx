
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      return redirect('/login?message=Could not sign up user. Please try again.');
    }

    // Redirect to the company name step after successful sign up
    return redirect('/signup/company-name');
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
            <div className="flex flex-col space-y-2">
                <Button formAction={signIn} className="w-full">Sign in</Button>
                <Button formAction={signUp} variant="secondary" className="w-full">Sign up</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <Link href="#" className="underline">Privacy</Link>
        {' - '}
        <Link href="#" className="underline">Terms</Link>
      </div>
    </div>
  );
}
