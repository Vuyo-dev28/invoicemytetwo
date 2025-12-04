'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const saveBusinessDetails = async (formData: FormData) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    const businessName = formData.get('businessName') as string;
    const businessType = formData.get('businessType') as string;
    const website = formData.get('website') as string;
    const street = formData.get('street') as string;
    const city = formData.get('city') as string;
    const country = formData.get('country') as string;
    const postalCode = formData.get('postalCode') as string;

    const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name,
        business_name: businessName,
        business_type: businessType,
        website,
        street,
        city,
        country,
        postal_code: postalCode,
    });

    if (error) {
        console.error('Error saving business details:', error);
        const errorMessage = encodeURIComponent(error.message);
        return redirect(`/signup/business-details?message=${errorMessage}`);
    }

    return redirect('/dashboard?new_user=true');
};
