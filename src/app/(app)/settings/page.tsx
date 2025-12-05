
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/settings-form';

export default async function SettingsPage() {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, business_name, company_name, website, street, city, country, postal_code, currency, timezone')
    .eq('id', user.id)
    .maybeSingle();
  
  // Map to business_name for the form (prefer business_name, fallback to company_name)
  const profileWithBusinessName = profile ? {
    ...profile,
    business_name: profile.business_name || profile.company_name || ''
  } : null;

  if (profileError && profileError.code !== 'PGRST116') {
    console.error('Error fetching profile:', profileError.message || profileError);
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <SettingsForm user={user} profile={profileWithBusinessName || {}} />
    </div>
  );
}
