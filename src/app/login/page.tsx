
"use client";
import { useState } from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Eye, EyeOff } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
        if (error.message.includes('Invalid login credentials')) {
            return redirect('/login?message=Invalid email or password. Please try again.');
        }
      return redirect('/login?message=Could not authenticate user. Please try again.');
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
       if (error.message.includes('User already registered')) {
        return redirect('/login?message=An account with this email already exists.');
      }
      return redirect('/login?message=Could not sign up user. Please try again.');
    }
    
    return redirect('/signup/company-name');
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length > 7) strength++;
    if (password.length > 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = getPasswordStrength(password);

  const strengthColors = [
    'bg-destructive',
    'bg-destructive',
    'bg-yellow-500',
    'bg-orange-500',
    'bg-lime-500',
    'bg-green-500',
  ];

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

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
                <div className="relative">
                    <Input 
                        id="password" 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {password.length > 0 && (
                    <div className="space-y-1">
                        <Progress value={(passwordStrength / 5) * 100} className={`h-1 ${strengthColors[passwordStrength]}`} />
                        <p className="text-xs text-muted-foreground">{strengthLabels[passwordStrength]}</p>
                    </div>
                )}
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
        <a href="#" className="underline">Privacy</a>
        {' - '}
        <a href="#" className="underline">Terms</a>
      </div>
    </div>
  );
}

