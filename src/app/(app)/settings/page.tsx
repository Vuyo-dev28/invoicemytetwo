import { SettingsPanel } from "@/components/settings-panel";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import type { Profile } from "@/types";

async function getProfile(): Promise<Profile | null> {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .single();
    
    if (error) {
        console.error('Error fetching profile:', error);
        // It might be the first run, so return a default structure
        return null;
    }
    return data;
}

export default async function SettingsPage() {
    const profile = await getProfile();
    return <SettingsPanel initialProfile={profile} />;
}
