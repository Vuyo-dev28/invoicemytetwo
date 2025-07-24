'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure hydration safety
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Prevent mismatch during SSR

  return (
    <Switch
      checked={theme === 'dark'}
      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
    />
  );
}
