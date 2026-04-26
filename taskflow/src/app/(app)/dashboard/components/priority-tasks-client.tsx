'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Play,
  Square,
  Pencil,
  ArrowRight,
  AlertCircle,
  Undo2,
  CheckCircle2,
  Circle,
  Clock,
  FolderKanban,
} from 'lucide-react';
import { cn, formatShortDate } from '@/lib/utils';
import { Task, Priority, Status } from '@/types';
import { useI18n } from '@/lib/i18n';

interface CompletedTask {
  taskId: string;
  originalStatus: Status;
  timeoutId: NodeJS.Timeout;
}

interface PriorityTasksClientProps {
  initialTasks: Task[];
}

export function PriorityTasksClient({
  initialTasks,
}: PriorityTasksClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTimeEntry, setActiveTimeEntry] = useState<string | null>(() => {
    const active = initialTasks.find((t) =>
      t.timeEntries?.some((te) => !te.endedAt)
    );
    return active?.id || null;
  });
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [removingTasks, setRemovingTasks] = useState<Set<string>>(new Set());
  const { t } = useI18n();

  // Sync tasks when initialTasks changes (after data loading)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return 'bg-red-500';
      case Priority.HIGH:
        return 'bg-orange-500';
      case Priority.MEDIUM:
        return 'bg-blue-500';
      case Priority.LOW:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusStyles = (status: Status) => {
    switch (status) {
      case Status.TODO:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-300',
          icon: Circle,
          label: t('tasks.statusTodo'),
        };
      case Status.IN_PROGRESS:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-300',
          icon: Clock,
          label: t('tasks.statusInProgress'),
        };
      case Status.DONE:
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-300',
          icon: CheckCircle2,
          label: t('tasks.statusDone'),
        };
      case Status.CANCELLED:
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-300',
          icon: AlertCircle,
          label: t('tasks.statusCancelled'),
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-300',
          icon: Circle,
          label: status,
        };
    }
  };

  const removeTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setCompletedTasks((prev) => prev.filter((c) => c.taskId !== taskId));
    setRemovingTasks((prev) => {
      const next = new Set(prev);
      next.delete(taskId);
      return next;
    });
  }, []);

  const handleComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (task.status === 'DONE') {
      await handleUndo(taskId);
      return;
    }

    try {
      if (activeTimeEntry === taskId) {
        await fetch(`/api/tasks/${taskId}/time`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'stop' }),
        });
        setActiveTimeEntry(null);
      }

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DONE' }),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: 'DONE' as Status } : t
          )
        );

        const timeoutId = setTimeout(() => {
          setRemovingTasks((prev) => {
            const next = new Set(prev);
            next.add(taskId);
            return next;
          });

          setTimeout(() => {
            removeTask(taskId);
          }, 300);
        }, 2000);

        setCompletedTasks((prev) => [
          ...prev,
          { taskId, originalStatus: task.status, timeoutId },
        ]);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleUndo = async (taskId: string) => {
    const completed = completedTasks.find((c) => c.taskId === taskId);
    if (!completed) return;

    clearTimeout(completed.timeoutId);
    setCompletedTasks((prev) => prev.filter((c) => c.taskId !== taskId));
    setRemovingTasks((prev) => {
      const next = new Set(prev);
      next.delete(taskId);
      return next;
    });

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: completed.originalStatus }),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: completed.originalStatus } : t
          )
        );
      }
    } catch (error) {
      console.error('Error undoing task completion:', error);
    }
  };

  const handleStart = async (taskId: string) => {
    try {
      // Stop any currently tracked task first
      if (activeTimeEntry && activeTimeEntry !== taskId) {
        await fetch(`/api/tasks/${activeTimeEntry}/time`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'stop' }),
        });
      }

      const res = await fetch(`/api/tasks/${taskId}/time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });

      if (res.ok) {
        setActiveTimeEntry(taskId);
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: 'IN_PROGRESS' as Status } : t
          )
        );
      }
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  const handleStop = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' }),
      });

      if (res.ok) {
        setActiveTimeEntry(null);
      }
    } catch (error) {
      console.error('Error stopping task:', error);
    }
  };

  useEffect(() => {
    return () => {
      completedTasks.forEach((c) => clearTimeout(c.timeoutId));
    };
  }, [completedTasks]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('dashboard.priorityTasks')}</CardTitle>
            <CardDescription>
              {t('dashboard.tasksRequiringAttention')}
            </CardDescription>
          </div>
          <Link href="/tasks">
            <div className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('dashboard.viewAll')}
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{t('priorityTasks.noActiveTasks')}</p>
            <p className="text-sm">{t('priorityTasks.createFirstTask')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => {
              const statusStyle = getStatusStyles(task.status);
              const StatusIcon = statusStyle.icon;
              const isActive = activeTimeEntry === task.id;
              const isDone = task.status === 'DONE';
              const isCompleted = completedTasks.some(
                (c) => c.taskId === task.id
              );
              const isRemoving = removingTasks.has(task.id);
              const isOverdue =
                task.dueDate && new Date(task.dueDate) < new Date() && !isDone;

              return (
                <div
                  key={task.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-all duration-300',
                    isDone ? 'opacity-60 bg-muted/50' : 'hover:bg-muted/50',
                    isRemoving && 'translate-x-full opacity-0'
                  )}
                >
                  <Checkbox
                    checked={isDone}
                    onCheckedChange={() => handleComplete(task.id)}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <Link href={`/tasks`}>
                      <p
                        className={cn(
                          'font-medium truncate hover:text-primary transition-colors',
                          isDone && 'line-through text-muted-foreground'
                        )}
                      >
                        {task.title}
                      </p>
                    </Link>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border font-medium flex items-center gap-1`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusStyle.label}
                      </Badge>

                      {isActive && (
                        <Badge className="bg-red-100 text-red-700 border-red-300 animate-pulse flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t('priorityTasks.tracking')}
                        </Badge>
                      )}

                      <Badge
                        variant="secondary"
                        className={`${getPriorityColor(task.priority)} text-white`}
                      >
                        {t(
                          `tasks.priority${task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}`
                        )}
                      </Badge>

                      {task.tags && task.tags.length > 0 && (
                        <div className="flex gap-1">
                          {task.tags.map(
                            (tagRelation) =>
                              tagRelation?.tag && (
                                <Badge
                                  key={tagRelation.tag.id}
                                  variant="outline"
                                  style={{
                                    borderColor: tagRelation.tag.color,
                                    color: tagRelation.tag.color,
                                  }}
                                  className="text-xs"
                                >
                                  {tagRelation.tag.name}
                                </Badge>
                              )
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      {task.project && (
                        <span
                          className="inline-flex items-center gap-1 font-medium"
                          style={{ color: task.project.color }}
                        >
                          <FolderKanban className="h-3 w-3" />
                          {task.project.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span
                          className={`flex items-center gap-1 ${
                            isOverdue ? 'text-red-500 font-medium' : ''
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          {t('dashboard.due')}{' '}
                          {formatShortDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isCompleted && !isRemoving ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUndo(task.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                      >
                        <Undo2 className="h-4 w-4 mr-1" />
                        {t('priorityTasks.undo')}
                      </Button>
                    ) : (
                      <>
                        {isActive ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStop(task.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <Square className="h-4 w-4 mr-1" />
                            {t('priorityTasks.stop')}
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStart(task.id)}
                            disabled={isDone}
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            {t('priorityTasks.start')}
                          </Button>
                        )}
                        <Link href={`/tasks?edit=${task.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            title={t('tasks.edit')}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
