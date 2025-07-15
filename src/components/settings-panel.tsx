
"use client";

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';

const colors = [
  'hsl(210 40% 60%)',
  'hsl(0 84.2% 60.2%)',
  'hsl(48 95.1% 64.9%)',
  'hsl(142.1 76.2% 36.3%)',
  'hsl(262.1 83.3% 57.8%)',
];

type Profile = {
  company_name: string;
  company_address: string;
  logo_url: string;
  accent_color: string;
}

export function SettingsPanel() {
  const [profile, setProfile] = useState<Profile>({
    company_name: 'Your Company',
    company_address: '123 Main St, Anytown, USA',
    logo_url: 'https://placehold.co/100x100.png',
    accent_color: 'hsl(210 40% 60%)'
  });
  const { toast } = useToast();
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);


  const handleUpdate = (field: keyof Profile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdate('logo_url', reader.result as string)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    // In a real app, you'd save this to a backend or localStorage.
    // For now, we'll just show a toast notification.
    toast({ title: 'Settings saved', description: 'Your company details have been updated.' });
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
             
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                Upload
              </Button>
               <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator />

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

      <div className="flex justify-end">
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </div>
  );
}
