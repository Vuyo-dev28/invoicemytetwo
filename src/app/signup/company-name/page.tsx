import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Logo } from '@/components/logo';
import { FileText, Calendar, CreditCard, User } from 'lucide-react';

export default function CompanyNamePage() {
  
  const updateCompanyName = async (formData: FormData) => {
    'use server';
    const companyName = formData.get('company-name') as string;

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // First, check if a profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: no rows found
        console.error('Error checking for profile:', fetchError);
        return redirect('/signup/company-name?error=Could not verify profile');
      }

      const payload = { id: user.id, company_name: companyName };

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', user.id);
        
        if (error) {
          console.error('Error updating company name:', error);
          return redirect('/signup/company-name?error=Could not save company name');
        }
      } else {
         // Insert new profile
         const { error } = await supabase
            .from('profiles')
            .insert(payload);

         if (error) {
            console.error('Error creating profile:', error);
            return redirect('/signup/company-name?error=Could not create profile');
         }
      }
    }
    
    // Redirect to the next step or dashboard
    return redirect('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
        <header className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-20">
            <div className="bg-card/80 backdrop-blur-sm shadow-lg rounded-full px-6 py-2 flex items-center">
                <Link href="/" className="flex items-center justify-center" prefetch={false}>
                <Logo className="h-6 w-6 text-primary" />
                <span className="ml-2 text-lg font-semibold text-primary">InvoiceMyte</span>
                </Link>
                <nav className="ml-auto hidden lg:flex gap-6 items-center">
                <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                    Invoice app
                </Link>
                <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                    Templates
                </Link>
                <Link className="text-sm font-medium text-primary" href="#">
                    Products
                </Link>
                <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                    Resources
                </Link>
                <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                    Pricing
                </Link>
                <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">
                    Support
                </Link>
                <Link className="text-sm font-medium" href="/login">
                    Log in
                </Link>
                <Button asChild>
                    <Link href="/login">Get started</Link>
                </Button>
                </nav>
            </div>
        </header>
        <div aria-hidden="true" className="aurora-background">
            <div className="aurora-shape shape-1"></div>
            <div className="aurora-shape shape-2"></div>
            <div className="aurora-shape shape-3"></div>
            <div className="aurora-shape shape-4"></div>
            <div className="aurora-document">
                <FileText className="w-48 h-48" />
            </div>
            <div className="aurora-document-2">
                <Calendar className="w-32 h-32" />
            </div>
            <div className="aurora-document-3">
                <CreditCard className="w-40 h-40" />
            </div>
            <div className="aurora-document-4">
                <User className="w-36 h-36" />
            </div>
        </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg relative z-10">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 h-12 w-12 text-primary"><path d="M12 18.535a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path><path d="M22 12a10 10 0 1 0-20 0 10 10 0 0 0 20 0Z"></path><path d="M12 12a6 6 0 1 0-6-6"></path></svg>
          <h1 className="text-2xl font-bold">Tell us about your company. 👋</h1>
          <p className="text-muted-foreground">Please enter your company name here.</p>
        </div>
        
        <Progress value={33} className="w-full" />
        
        <form action={updateCompanyName} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="company-name" className="text-sm font-medium">Company name</label>
            <Input
              id="company-name"
              name="company-name"
              placeholder="e.g. Bookipi Pty Ltd."
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>

        <div className="text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
