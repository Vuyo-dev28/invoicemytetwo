'use server';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

// Schema for validation
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

export async function updateUserAction(values: any) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'You must be logged in to update your profile.' };

  const validated = schema.safeParse(values);
  if (!validated.success) return { error: 'Invalid fields provided.', details: validated.error.flatten() };

  const data = validated.data;

  // Build profile update/insert object
  const profileData: { [key: string]: any } = {
    id: user.id,
    email: data.email || user.email,
    full_name: data.full_name || null,
    business_name: data.business_name || null,
    company_name: data.business_name || null, // Support both fields
    website: data.website || null,
    currency: data.currency || 'USD',
    timezone: data.timezone || 'GMT',
    updated_at: new Date().toISOString(),

    // Individual address fields
    street: data.street || null,
    city: data.city || null,
    country: data.country || null,
    postal_code: data.postal_code || null,
  };

  // Optional combined company address
  const addressParts = [data.street, data.city, data.country, data.postal_code].filter(Boolean);
  profileData.company_address = addressParts.length > 0 ? addressParts.join(', ') : null;

  // Use upsert to insert if doesn't exist, or update if it does
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(profileData, {
      onConflict: 'id'
    });

  if (profileError) {
    console.error('Profile upsert error:', profileError);
    return { error: `Error saving profile: ${profileError.message}` };
  }

  // Update email in auth.users separately if it changed
  if (data.email && data.email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email: data.email });
    if (emailError) {
      console.error('Email update error:', emailError);
      return { error: `Error updating email: ${emailError.message}` };
    }
  }

  return { success: true };
}
