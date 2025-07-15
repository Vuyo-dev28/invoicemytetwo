"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { Separator } from './ui/separator';

const colors = [
  'hsl(210 40% 60%)',
  'hsl(0 84.2% 60.2%)',
  'hsl(48 95.1% 64.9%)',
  'hsl(142.1 76.2% 36.3%)',
  'hsl(262.1 83.3% 57.8%)',
];

export function SettingsPanel() {
  const [companyName, setCompanyName] = useLocalStorage('companyName', 'Your Company Inc.');
  const [companyAddress, setCompanyAddress] = useLocalStorage('companyAddress', '123 Business Rd, Suite 100, Business City, 12345');
  const [companyLogo, setCompanyLogo] = useLocalStorage('companyLogo', '');
  const [accentColor, setAccentColor] = useLocalStorage('accentColor', 'hsl(210 40% 60%)');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    document.documentElement.style.setProperty('--primary', accentColor as string);
    document.documentElement.style.setProperty('--ring', accentColor as string);
  }, [accentColor]);

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
              value={companyName as string}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-address">Company Address</Label>
            <Input
              id="company-address"
              value={companyAddress as string}
              onChange={(e) => setCompanyAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-4">
              {companyLogo ? (
                 <Image src={companyLogo as string} alt="Company Logo" width={64} height={64} className="rounded-md object-cover" />
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
                className={`w-8 h-8 rounded-full border-2 ${accentColor === color ? 'border-foreground' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
                onClick={() => setAccentColor(color)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
