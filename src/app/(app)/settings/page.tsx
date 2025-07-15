
"use client"
import { SettingsPanel } from "@/components/settings-panel";
import { createClient } from "@/utils/supabase/client";
import type { Profile } from "@/types";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
              const { data, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', user.id)
                  .single();
              
              if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
                  console.error('Error fetching profile:', error);
              } else {
                  setProfile(data);
              }
            }
            setLoading(false);
        }
        getProfile();
    }, []);


    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-24 w-full" />
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <SettingsPanel initialProfile={profile} />
        </div>
    );
}
