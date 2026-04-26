'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/lib/i18n';
import {
  LayoutDashboard,
  CheckCircle2,
  FolderKanban,
  BarChart3,
  Settings,
  Plus,
  Tag,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.tasks'), href: '/tasks', icon: CheckCircle2 },
    { name: t('nav.projects'), href: '/projects', icon: FolderKanban },
    { name: t('nav.tags'), href: '/tags', icon: Tag },
    { name: t('nav.statistics'), href: '/stats', icon: BarChart3 },
  ];

  return (
    <div className="hidden border-r border-border/70 bg-card/80 backdrop-blur md:flex md:w-72 md:flex-col">
      <div className="flex h-16 items-center border-b border-border/70 px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm ring-1 ring-primary/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <span className="text-lg">TaskFlow</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <div className="rounded-3xl border border-border/60 bg-background/55 p-2 shadow-sm">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link key={item.name} href={item.href} className="block">
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'h-11 w-full justify-start gap-3 rounded-2xl px-4',
                    isActive &&
                      'bg-secondary text-secondary-foreground shadow-sm ring-1 ring-border/60'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>

        <Separator className="my-5" />

        <div className="rounded-3xl border border-border/60 bg-linear-to-br from-secondary/60 to-accent/50 p-4 shadow-sm">
          <p className="px-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            {t('sidebar.quickActions')}
          </p>
          <Link href="/tasks?new=true" className="mt-3 block">
            <Button className="w-full justify-start gap-2 rounded-2xl">
              <Plus className="h-4 w-4" />
              {t('sidebar.newTask')}
            </Button>
          </Link>
        </div>
      </ScrollArea>

      <div className="border-t border-border/70 p-4">
        <Link href="/settings" className="block">
          <Button variant="ghost" className="h-11 w-full justify-start gap-2 rounded-2xl">
            <Settings className="h-4 w-4" />
            {t('nav.settings')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
