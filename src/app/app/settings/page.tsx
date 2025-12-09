import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// import ProfileForm from '@/components/profile-form';
// import { SettingsPanel } from '@/components/settings-panel';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export default async function SettingsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    // Handle the case where the profile doesn't exist, maybe redirect or show an error
    // For now, we'll redirect to the dashboard.
    redirect('/dashboard');
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ProfileForm user={user} profile={profile} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <SettingsPanel company={profile} />
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Theme</h2>
            {/* <ThemeSwitcher /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
