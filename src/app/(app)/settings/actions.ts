'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  full_name: z.string().optional(),
  business_name: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  street: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
});

export async function updateUserAction(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to update your profile.' };
  }

  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    full_name: formData.get('full_name'),
    business_name: formData.get('business_name'),
    website: formData.get('website'),
    street: formData.get('street'),
    city: formData.get('city'),
    country: formData.get('country'),
    postal_code: formData.get('postal_code'),
    currency: formData.get('currency'),
    timezone: formData.get('timezone'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields provided.', details: validatedFields.error.flatten() };
  }

  const {
    full_name,
    business_name,
    street,
    city,
    country,
    postal_code,
    ...otherProfileData
  } = validatedFields.data;

  const profileUpdate: { [key: string]: any } = { ...otherProfileData, full_name };

  if (business_name) {
    profileUpdate.company_name = business_name;
  }
  
  const addressParts = [street, city, country, postal_code].filter(Boolean);
  if (addressParts.length > 0) {
    profileUpdate.company_address = addressParts.join(', ');
  } else {
    profileUpdate.company_address = ''; 
  }

  Object.keys(profileUpdate).forEach(key => profileUpdate[key] === undefined && delete profileUpdate[key]);
  
  const { error: profileError } = await supabase
    .from('profiles')
    .update(profileUpdate)
    .eq('id', user.id);

  if (profileError) {
    return { error: `Error updating profile: ${profileError.message}` };
  }

  if (validatedFields.data.email && validatedFields.data.email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email: validatedFields.data.email });
    if (emailError) {
      return { error: `Error updating email: ${emailError.message}` };
    }
  }

  return { success: true };
}
