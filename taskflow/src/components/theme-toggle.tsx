'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';

function ThemeToggleClient() {
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex items-center gap-3">
      <Sun
        className={`h-4 w-4 ${isDark ? 'text-muted-foreground' : 'text-amber-500'}`}
      />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        aria-label="Toggle dark mode"
      />
      <Moon
        className={`h-4 w-4 ${isDark ? 'text-indigo-400' : 'text-muted-foreground'}`}
      />
    </div>
  );
}

export const ThemeToggle = dynamic(async () => ThemeToggleClient, {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch disabled />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  ),
});
