'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { signUpAction } from './actions';
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState("");

  const validateBeforeSubmit = (e: any) => {
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      e.preventDefault();
      setLocalError("Passwords do not match");
    }
  };

  return (
    <div
      className="relative flex flex-col min-h-screen items-center justify-center p-4 
      before:absolute before:inset-0 before:-z-10 
      before:bg-gradient-to-br before:from-primary/30 before:via-primary/20 before:to-transparent 
      before:blur-3xl before:opacity-40 overflow-hidden"
    >
      {/* Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-20">
        <div className="bg-card/80 backdrop-blur-sm shadow-lg rounded-full px-6 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center" prefetch={false}>
            <Logo className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold text-primary">InvoiceMyte</span>
          </Link>

          <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            {/* <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/products">Products</Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/about">About</Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/Pricing">Pricing</Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/Support">Support</Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/login">Log In</Link>
            <Button asChild><Link href="/signup">Get started</Link></Button> */}
          </nav>
        </div>
      </header>

      {/* Signup Card */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800 z-10">
        <h1 className="text-3xl font-bold text-center">Create an Account</h1>

        <form action={signUpAction} onSubmit={validateBeforeSubmit} className="space-y-6">
          
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" type="text" required />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Client-side error */}
          {localError && (
            <p className="p-3 bg-red-100 text-red-600 text-center text-sm rounded">
              {localError}
            </p>
          )}



          {/* Server-side error */}
          {message && (
            <p className="p-3 bg-red-100 text-red-600 text-center text-sm rounded">
              {message}
            </p>
          )}

          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
        
      </div>
      <div className="mt-5 text-center text-xs text-muted-foreground relative z-10">
            By signing up or signing in, you agree to our{" "}
            <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline hover:text-primary">
              Terms
            </Link>.
        </div>
    </div>
  );
}
