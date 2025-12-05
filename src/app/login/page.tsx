'use client';
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "./actions";
import { Logo } from "@/components/logo";
import Link from "next/link";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center p-4 
    before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/30 before:via-primary/20 before:to-transparent before:blur-3xl before:opacity-40 overflow-hidden">

      {/* Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-20">
        <div className="bg-card/80 backdrop-blur-sm shadow-lg rounded-full px-6 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center" prefetch={false}>
            <Logo className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold text-primary">
              InvoiceMyte
            </span>
          </Link>

          <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/products">Products</Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/about">About</Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/Pricing">Pricing</Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/Support">Support</Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/login">Log In</Link>
            <Button asChild><Link href="/signup">Get started</Link></Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <Card className="w-full max-w-sm bg-card/90 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/reset-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>

              {message && (
                <p className="p-4 bg-foreground/10 text-foreground text-center text-sm">{message}</p>
              )}
              <div className="flex flex-col space-y-2">
                <Button formAction={signIn} className="w-full">Sign In</Button>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/signup">Create an account</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-5 text-center text-xs text-muted-foreground relative z-10">
          <a href="/privacy" className="underline">Privacy</a> - <a href="/privacy" className="underline">Terms</a>
        </div>
      </div>
    </div>
  );
}


export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
