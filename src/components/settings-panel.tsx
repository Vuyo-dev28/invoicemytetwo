
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import Image from 'next/image';
import { Upload, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Profile } from '@/types';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

const colors = [
  'hsl(210 40% 60%)',
  'hsl(0 84.2% 60.2%)',
  'hsl(48 95.1% 64.9%)',
  'hsl(142.1 76.2% 36.3%)',
  'hsl(262.1 83.3% 57.8%)',
];

const defaultProfile: Omit<Profile, 'id'> = {
    company_name: 'Your Company',
    company_address: '123 Main St, Anytown, USA',
    logo_url: null,
    accent_color: 'hsl(210 40% 60%)'
}

export function SettingsPanel({ initialProfile }: { initialProfile: Profile | null }) {
  const [profile, setProfile] = useState<Omit<Profile, 'id'>>(initialProfile || defaultProfile);
  const [user, setUser] = useState<User | null>(null);
  const [isUploading, setUploading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();
  }, [supabase.auth]);

  const handleUpdate = (field: keyof Omit<Profile, 'id' | 'created_at'>, value: string | null) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

    if (error) {
        toast({ title: 'Logo Upload Failed', description: error.message, variant: 'destructive' });
        setUploading(false);
        return;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(data.path);

    handleUpdate('logo_url', publicUrl);
    setUploading(false);
  };

  const handleSaveChanges = async () => {
    if (!user) {
      toast({ title: 'Error saving settings', description: 'You must be logged in to save settings.', variant: 'destructive' });
      return;
    }
    
    const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...profile }, { onConflict: 'id' });

    if (error) {
        toast({ title: 'Error saving settings', description: error.message, variant: 'destructive' });
    } else {
        toast({ title: 'Settings saved', description: 'Your company details have been updated.' });
    }
  };

  useEffect(() => {
    if (profile?.accent_color) {
      document.documentElement.style.setProperty('--primary', profile.accent_color);
      document.documentElement.style.setProperty('--ring', profile.accent_color);
    }
  }, [profile?.accent_color]);
  
  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>Update your company information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={profile?.company_name || ''}
                onChange={(e) => handleUpdate('company_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address">Company Address</Label>
              <Input
                id="company-address"
                value={profile?.company_address || ''}
                onChange={(e) => handleUpdate('company_address', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div className="flex items-center gap-4">
                {profile?.logo_url ? (
                   <Image src={profile.logo_url} alt="Company Logo" width={64} height={64} className="rounded-md object-cover" data-ai-hint="logo" />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                    <Upload />
                  </div>
                )}
               
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
                 <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                />
              </div>
            </div>
          </CardContent>
           <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
            </Button>
           </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label>Accent Color</Label>
            <div className="flex gap-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${profile?.accent_color === color ? 'border-foreground' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleUpdate('accent_color', color)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
