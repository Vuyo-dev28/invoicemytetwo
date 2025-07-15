
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
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .single();
            
            if (error) {
                console.error('Error fetching profile:', error);
                // It might be the first run, so return a default structure
                setProfile({
                    id: '1',
                    company_name: 'Your Company',
                    company_address: '123 Main St, Anytown, USA',
                    logo_url: null,
                    accent_color: 'hsl(210 40% 60%)'
                });
            } else {
                 setProfile(data);
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
        <SettingsPanel initialProfile={profile} />
    );
}
