'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle2,
  Clock,
  FolderKanban,
  TrendingUp,
  ArrowRight,
  Zap,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Priority, Task } from '@/types';
import { PriorityTasksClient } from './components/priority-tasks-client';
import { useI18n } from '@/lib/i18n';

interface DashboardStats {
  overview?: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    totalProjects: number;
    completionRate?: number;
  };
}

async function getStats(): Promise<DashboardStats | null> {
  try {
    const res = await fetch('/api/stats', {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return (await res.json()) as DashboardStats;
  } catch {
    return null;
  }
}

async function getPriorityTasks() {
  try {
    const res = await fetch(
      '/api/tasks?status=TODO&status=IN_PROGRESS&limit=100',
      {
        cache: 'no-store',
      }
    );
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const response = (await res.json()) as { data?: Task[] };
    const tasks = response.data || [];

    const priorityOrder: Record<Priority, number> = {
      [Priority.URGENT]: 0,
      [Priority.HIGH]: 1,
      [Priority.MEDIUM]: 2,
      [Priority.LOW]: 3,
    };
    const sortedTasks = tasks.sort((a: Task, b: Task) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return sortedTasks.slice(0, 5);
  } catch (error) {
    console.error('Error fetching priority tasks:', error);
    return [];
  }
}

export default function DashboardPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [priorityTasks, setPriorityTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const statsData = await getStats();
      const tasksData = await getPriorityTasks();
      setStats(statsData);
      setPriorityTasks(tasksData);
    };
    loadData();
  }, []);

  const overview = stats?.overview || {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    totalProjects: 0,
  };

  const statCards = [
    {
      title: t('dashboard.totalTasks'),
      value: overview.totalTasks,
      description: t('dashboard.allTasks'),
      icon: CheckCircle2,
      color: 'from-blue-500/20 to-blue-600/5',
      iconColor: 'text-blue-600',
      href: '/tasks',
    },
    {
      title: t('dashboard.inProgress'),
      value: overview.inProgressTasks,
      description: t('dashboard.activeTasks'),
      icon: Clock,
      color: 'from-amber-500/20 to-amber-600/5',
      iconColor: 'text-amber-600',
      href: '/tasks?status=IN_PROGRESS',
    },
    {
      title: t('dashboard.projects'),
      value: overview.totalProjects,
      description: t('dashboard.activeProjects'),
      icon: FolderKanban,
      color: 'from-purple-500/20 to-purple-600/5',
      iconColor: 'text-purple-600',
      href: '/projects',
    },
    {
      title: t('dashboard.completionRate'),
      value: `${overview.completionRate || 0}%`,
      description: t('dashboard.tasksCompleted'),
      icon: TrendingUp,
      color: 'from-green-500/20 to-green-600/5',
      iconColor: 'text-green-600',
      href: '/tasks?status=DONE',
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground">{t('dashboard.welcome')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="block">
              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] cursor-pointer h-full">
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                    card.color
                  )}
                />
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <div
                    className={cn('p-2 rounded-full bg-muted', card.iconColor)}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold tracking-tight">
                    {card.value}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <PriorityTasksClient
          key={priorityTasks.length}
          initialTasks={priorityTasks}
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              {t('dashboard.quickStart')}
            </CardTitle>
            <CardDescription>{t('dashboard.quickStartDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                1
              </div>
              <div>
                <p className="font-medium">{t('dashboard.step1Title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.step1Desc')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                2
              </div>
              <div>
                <p className="font-medium">{t('dashboard.step2Title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.step2Desc')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                3
              </div>
              <div>
                <p className="font-medium">{t('dashboard.step3Title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.step3Desc')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              {t('dashboard.tipsTricks')}
            </CardTitle>
            <CardDescription>{t('dashboard.tipsTricksDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="font-medium">{t('dashboard.tip1Title')}</p>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.tip1Desc')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">{t('dashboard.tip2Title')}</p>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.tip2Desc')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">{t('dashboard.tip3Title')}</p>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.tip3Desc')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
