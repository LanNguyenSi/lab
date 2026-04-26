'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  LayoutDashboard,
  CheckCircle2,
  FolderKanban,
  BarChart3,
  Menu,
  Plus,
  Tag,
  Settings,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.tasks'), href: '/tasks', icon: CheckCircle2 },
    { name: t('nav.projects'), href: '/projects', icon: FolderKanban },
    { name: t('nav.tags'), href: '/tags', icon: Tag },
    { name: t('nav.statistics'), href: '/stats', icon: BarChart3 },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex items-center md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-xl">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-border/70 bg-card/95 p-0 backdrop-blur">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex h-16 items-center border-b border-border/70 px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm ring-1 ring-primary/20">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-lg">TaskFlow</span>
            </Link>
          </div>
          <div className="space-y-3 p-4">
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
            <Link href="/tasks?new=true" className="block">
              <Button className="mt-2 h-11 w-full justify-start gap-2 rounded-2xl">
                <Plus className="h-4 w-4" />
                {t('sidebar.newTask')}
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
