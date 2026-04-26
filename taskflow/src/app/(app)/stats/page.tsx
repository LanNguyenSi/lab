'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Task } from '@/types';

interface StatsOverview {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  totalProjects: number;
  completionRate: number;
  totalTimeTracked: number;
}

interface PriorityStat {
  priority: string;
  count: number;
}

interface StatsResponse {
  overview?: StatsOverview;
  productivity?: {
    tasksByPriority?: PriorityStat[];
    recentTasks?: Task[];
  };
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = (await res.json()) as StatsResponse;
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const overview = stats?.overview || {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    totalProjects: 0,
    completionRate: 0,
    totalTimeTracked: 0,
  };
  const priorityStats = stats?.productivity?.tasksByPriority ?? [];
  const recentTasks = stats?.productivity?.recentTasks ?? [];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('stats.title')}</h1>
          <p className="text-muted-foreground">{t('stats.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('stats.title')}</h1>
        <p className="text-muted-foreground">{t('stats.description')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.totalTasks')}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.completed')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {overview.completionRate}% {t('stats.completionRate')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.inProgress')}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.inProgressTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.timeTracked')}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(overview.totalTimeTracked)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('stats.tasksByPriority')}</CardTitle>
          </CardHeader>
          <CardContent>
            {priorityStats.length > 0 ? (
              <div className="space-y-2">
                {priorityStats.map((item) => (
                  <div
                    key={item.priority}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{item.priority}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.count} {t('stats.tasks')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">{t('stats.noData')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('stats.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-2">
                {recentTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {task.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {task.project?.name || t('stats.noProject')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {t('stats.noRecentActivity')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
