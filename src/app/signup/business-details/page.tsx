import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveBusinessDetails } from './actions';

export default async function BusinessDetailsPage({ searchParams }: { searchParams: { message: string } }) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-center">Business Details</h1>
        <p className='text-center'>This information will be used to automatically populate your invoices and other documents.</p>
        <form action={saveBusinessDetails} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" name="businessName" type="text" required/>
            </div>
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Input id="businessType" name="businessType" type="text" />
            </div>
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" type="url" />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input name="street" placeholder="Street" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input name="city" placeholder="City" />
              <Input name="postalCode" placeholder="Postal Code" />
              <Input name="country" placeholder="Country" />
            </div>
          </div>
          {searchParams.message && (
            <p className="p-4 bg-foreground/10 text-foreground text-center text-sm">{searchParams.message}</p>
          )}
          <Button type="submit" className="w-full">Save and Continue</Button>
        </form>
      </div>
    </div>
  );
}
