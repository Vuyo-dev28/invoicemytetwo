// "use client";
// import { useState, Suspense } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Eye, EyeOff, FileText, Calendar, CreditCard, User, Menu, X } from 'lucide-react';
// import { Progress } from '@/components/ui/progress';
// import { signIn, signUp } from './actions';
// import { Logo } from '@/components/logo';
// import Link from 'next/link';

// const getPasswordStrength = (password: string) => {
//   let strength = 0;
//   if (password.length > 7) strength++;
//   if (password.length > 10) strength++;
//   if (/[A-Z]/.test(password)) strength++;
//   if (/[0-9]/.test(password)) strength++;
//   if (/[^A-Za-z0-9]/.test(password)) strength++;
//   return strength;
// };

// function LoginPageContent() {
//   const searchParams = useSearchParams();
//   const message = searchParams.get('message');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
//   const passwordStrength = getPasswordStrength(password);

//   const strengthColors = [
//     'bg-destructive',
//     'bg-destructive',
//     'bg-yellow-500',
//     'bg-orange-500',
//     'bg-lime-500',
//     'bg-green-500',
//   ];

//   const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

//   return (
//     <div className="flex flex-col min-h-screen bg-background items-center justify-center">
//       {/* Header */}
//       <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-20">
//         <div className="bg-card/80 backdrop-blur-sm shadow-lg rounded-full px-6 py-2 flex items-center justify-between">
//           {/* Logo */}
//           <Link href="/" className="flex items-center justify-center" prefetch={false}>
//             <Logo className="h-6 w-6 text-primary" />
//             <span className="ml-2 text-lg font-semibold text-primary">InvoiceMyte</span>
//           </Link>

//           {/* Desktop Menu */}
//           <nav className="ml-auto hidden lg:flex gap-6 items-center">
//             <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/">Home</Link>
//             <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/products">Products</Link>
//             <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/about">About</Link>
//             <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/#pricing">Pricing</Link>
//             <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/support">Support</Link>
//             <Link className="text-sm font-medium" href="/login">Log in</Link>
//             <Button asChild><Link href="/login">Get started</Link></Button>
//           </nav>

//           {/* Mobile Menu Toggle */}
//           <button
//             className="lg:hidden p-2 text-primary"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* Mobile Dropdown */}
//         <div
//           className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-card/95 backdrop-blur-md shadow-lg rounded-xl p-4 flex flex-col gap-4 z-10 transition-all duration-300 ease-in-out ${
//             isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
//           }`}
//         >
//           <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
//           <Link href="/products" onClick={() => setIsOpen(false)}>Products</Link>
//           <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
//           <Link href="/#pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
//           <Link href="/support" onClick={() => setIsOpen(false)}>Support</Link>
//           <Link href="/login" onClick={() => setIsOpen(false)}>Log in</Link>
//           <Button asChild>
//             <Link href="/login" onClick={() => setIsOpen(false)}>Get started</Link>
//           </Button>
//         </div>
//       </header>

//       {/* Background Decorations */}
//       <div aria-hidden="true" className="aurora-background">
//         <div className="aurora-shape shape-1"></div>
//         <div className="aurora-shape shape-2"></div>
//         <div className="aurora-shape shape-3"></div>
//         <div className="aurora-shape shape-4"></div>
//         <div className="aurora-document"><FileText className="w-48 h-48" /></div>
//         <div className="aurora-document-2"><Calendar className="w-32 h-32" /></div>
//         <div className="aurora-document-3"><CreditCard className="w-40 h-40" /></div>
//         <div className="aurora-document-4"><User className="w-36 h-36" /></div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 flex flex-col items-center w-full">
//         <div className="mb-8 flex flex-col items-center text-center">
//           <Logo className="h-12 w-12 text-primary" />
//           <h1 className="text-2xl font-bold mt-2">InvoiceMyte</h1>
//         </div>
//         <Card className="w-full max-w-sm">
//           <CardHeader>
//             <CardTitle className="text-2xl text-center">Sign in</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" name="email" type="email" placeholder="you@example.com" required />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Input 
//                     id="password" 
//                     name="password" 
//                     type={showPassword ? "text" : "password"} 
//                     required 
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   <button 
//                     type="button" 
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//                 {password.length > 0 && (
//                   <div className="space-y-1">
//                     <Progress value={(passwordStrength / 5) * 100} className={`h-1 ${strengthColors[passwordStrength]}`} />
//                     <p className="text-xs text-muted-foreground">{strengthLabels[passwordStrength]}</p>
//                   </div>
//                 )}
//               </div>

//               {message && (
//                 <p className="p-4 bg-foreground/10 text-foreground text-center text-sm">{message}</p>
//               )}
//               <div className="flex flex-col space-y-2">
//                 <Button formAction={signIn} className="w-full">Sign in</Button>
//                 <Button formAction={signUp} variant="secondary" className="w-full">Sign up</Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>

//         <Link href="/reset-password" className="text-sm text-primary hover:underline text-right block mt-4">
//           Forgot password?
//         </Link>
        
//         <div className="mt-8 text-center text-xs text-muted-foreground">
//           <a href="#" className="underline">Privacy</a> - <a href="#" className="underline">Terms</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function LoginPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <LoginPageContent />
//     </Suspense>
//   );
// }
"use client";
import { useState, Suspense } from "react";
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
import {
  Eye,
  EyeOff,
  FileText,
  Calendar,
  CreditCard,
  User,
  Menu,
  X,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { signIn, signUp } from "./actions";
import { Logo } from "@/components/logo";
import Link from "next/link";

const getPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length > 7) strength++;
  if (password.length > 10) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

function LoginPageContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [isSignUp, setIsSignUp] = useState(false); // Toggle for Sign Up
  const passwordStrength = getPasswordStrength(password);

  const strengthColors = [
    "bg-destructive",
    "bg-destructive",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-lime-500",
    "bg-green-500",
  ];

  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very Strong",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center">
      {/* Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-20">
        <div className="bg-card/80 backdrop-blur-sm shadow-lg rounded-full px-6 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center" prefetch={false}>
            <Logo className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold text-primary">
              InvoiceMyte
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="ml-auto hidden lg:flex gap-6 items-center">
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/">Home</Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/products">Products</Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/about">About</Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/#pricing">Pricing</Link>
            <Link className="text-sm font-medium text-muted-foreground hover:text-primary" href="/support">Support</Link>
            <Link className="text-sm font-medium" href="/login">Log in</Link>
            <Button asChild><Link href="/login">Get started</Link></Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-card/95 backdrop-blur-md shadow-lg rounded-xl p-4 flex flex-col gap-4 z-10 transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setIsOpen(false)}>Products</Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/#pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link href="/support" onClick={() => setIsOpen(false)}>Support</Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>Log in</Link>
          <Button asChild>
            <Link href="/login" onClick={() => setIsOpen(false)}>Get started</Link>
          </Button>
        </div>
      </header>

      {/* Background Decorations */}
      <div aria-hidden="true" className="aurora-background">
        <div className="aurora-shape shape-1"></div>
        <div className="aurora-shape shape-2"></div>
        <div className="aurora-shape shape-3"></div>
        <div className="aurora-shape shape-4"></div>
        <div className="aurora-document"><FileText className="w-48 h-48" /></div>
        <div className="aurora-document-2"><Calendar className="w-32 h-32" /></div>
        <div className="aurora-document-3"><CreditCard className="w-40 h-40" /></div>
        <div className="aurora-document-4"><User className="w-36 h-36" /></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold mt-2">InvoiceMyte</h1>
        </div>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isSignUp ? "Sign Up" : "Sign In"}
            </CardTitle>
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
                    <Progress
                      value={(passwordStrength / 5) * 100}
                      className={`h-1 ${strengthColors[passwordStrength]}`}
                    />
                    <p className="text-xs text-muted-foreground">
                      {strengthLabels[passwordStrength]}
                    </p>
                  </div>
                )}
              </div>

              {message && (
                <p className="p-4 bg-foreground/10 text-foreground text-center text-sm">{message}</p>
              )}
              <div className="flex flex-col space-y-2">
                <Button
                  formAction={isSignUp ? signUp : signIn}
                  className="w-full"
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "Already have an account? Sign In" : "Create an account"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Link
          href="/reset-password"
          className="text-sm text-primary hover:underline text-right block mt-4"
        >
          Forgot password?
        </Link>

        <div className="mt-5 text-center text-xs text-muted-foreground">
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
