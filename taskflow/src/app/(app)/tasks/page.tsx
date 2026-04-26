'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Task,
  Project,
  Tag,
  Status,
  Priority,
  CreateTaskInput,
  TimeEntry,
} from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Play,
  X,
  FolderKanban,
  Clock,
  CheckCircle2,
  Circle,
  Pause,
  AlertCircle,
  Timer,
  MoreVertical,
} from 'lucide-react';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { useToast } from '@/components/ui/toast';
import {
  formatDuration,
  calculateTotalDuration,
  formatShortDate,
  truncateText,
  cn,
} from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import { useI18n } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PaginationControls } from '@/components/ui/pagination-controls';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTimeEntry, setActiveTimeEntry] = useState<{
    taskId: string;
    startedAt: Date;
  } | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [tagFilter, setTagFilter] = useState<string>('ALL');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { toast } = useToast();
  const { t } = useI18n();

  const searchParams = useSearchParams();
  const editTaskId = searchParams.get('edit');
  const shouldOpenNewDialog = searchParams.get('new') === 'true';

  // Read URL params and set filters
  useEffect(() => {
    const projectIdFromUrl = searchParams.get('projectId');
    if (projectIdFromUrl) {
      setProjectFilter(projectIdFromUrl);
    }
    const tagIdFromUrl = searchParams.get('tagId');
    if (tagIdFromUrl) {
      setTagFilter(tagIdFromUrl);
    }
    const statusFromUrl = searchParams.get('status') as Status | null;
    if (
      statusFromUrl &&
      ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'].includes(statusFromUrl)
    ) {
      setStatusFilter(statusFromUrl);
    }
  }, [searchParams]);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    statusFilter,
    priorityFilter,
    projectFilter,
    tagFilter,
    debouncedSearch,
    hideCompleted,
  ]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);
      if (projectFilter !== 'ALL') params.append('projectId', projectFilter);
      if (tagFilter !== 'ALL') params.append('tagIds', tagFilter);
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (hideCompleted) params.append('hideCompleted', 'true');

      const res = await fetch(`/api/tasks?${params.toString()}`);
      if (res.ok) {
        const { data, meta } = await res.json();
        setTasks(data);
        setTotalPages(meta.totalPages);

        // Check for active time entry logic...
        const active = data.find((t: Task) =>
          t.timeEntries?.some((te: TimeEntry) => !te.endedAt)
        );
        if (active) {
          const entry = active.timeEntries?.find(
            (te: TimeEntry) => !te.endedAt
          );
          if (entry) {
            setActiveTimeEntry({
              taskId: active.id,
              startedAt: new Date(entry.startedAt),
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    statusFilter,
    priorityFilter,
    projectFilter,
    tagFilter,
    debouncedSearch,
    hideCompleted,
  ]);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects?limit=100');
      if (res.ok) {
        const json = await res.json();
        setProjects(json.data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch('/api/tags?limit=100');
      if (res.ok) {
        const json = await res.json();
        setTags(json.data || []);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }, []);

  // Fetch tasks when filters or page change
  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    void fetchProjects();
    void fetchTags();

    if (shouldOpenNewDialog) {
      setDialogOpen(true);
    }
  }, [fetchProjects, fetchTags, shouldOpenNewDialog]);

  useEffect(() => {
    if (!editTaskId || tasks.length === 0) return;

    const taskToEdit = tasks.find((task) => task.id === editTaskId);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setDialogOpen(true);
    }
  }, [editTaskId, tasks]);

  const handleCreateTask = async (data: CreateTaskInput) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        void fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (data: CreateTaskInput) => {
    if (!editingTask) return;
    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        void fetchTasks();
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm(t('tasks.deleteConfirm'))) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        void fetchTasks();
        toast({
          title: t('tasks.deleteSuccess'),
          description: t('tasks.deleteSuccessDesc'),
          variant: 'success',
        });
      } else {
        toast({
          title: t('tasks.deleteError'),
          description: t('tasks.deleteErrorDesc'),
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: t('tasks.deleteError'),
        description: t('tasks.deleteErrorGeneric'),
        variant: 'error',
      });
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === Status.DONE ? Status.TODO : Status.DONE;
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        void fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleTimeTracking = async (taskId: string) => {
    const isActive = activeTimeEntry?.taskId === taskId;
    try {
      // If starting a new task and another task is being tracked, stop it first
      if (!isActive && activeTimeEntry) {
        await fetch(`/api/tasks/${activeTimeEntry.taskId}/time`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'stop' }),
        });
      }

      const res = await fetch(`/api/tasks/${taskId}/time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isActive ? 'stop' : 'start' }),
      });
      if (res.ok) {
        if (isActive) {
          setActiveTimeEntry(null);
        } else {
          setActiveTimeEntry({ taskId, startedAt: new Date() });
        }
        void fetchTasks();
      }
    } catch (error) {
      console.error('Error toggling time tracking:', error);
    }
  };

  const openCreateDialog = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('tasks.title')}</h1>
          <p className="text-muted-foreground">{t('tasks.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('tasks.title')}</h1>
          <p className="text-muted-foreground">{t('tasks.description')}</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          {t('tasks.newTask')}
        </Button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('tasks.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 h-4 w-4" />
          {t('tasks.filter')}
        </Button>
      </div>

      {showFilters && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('tasks.status')}
                </label>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => setStatusFilter(v as Status | 'ALL')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('tasks.allStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t('tasks.allStatus')}</SelectItem>
                    <SelectItem value={Status.TODO}>
                      {t('tasks.statusTodo')}
                    </SelectItem>
                    <SelectItem value={Status.IN_PROGRESS}>
                      {t('tasks.statusInProgress')}
                    </SelectItem>
                    <SelectItem value={Status.DONE}>
                      {t('tasks.statusDone')}
                    </SelectItem>
                    <SelectItem value={Status.CANCELLED}>
                      {t('tasks.statusCancelled')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('tasks.priority')}
                </label>
                <Select
                  value={priorityFilter}
                  onValueChange={(v) =>
                    setPriorityFilter(v as Priority | 'ALL')
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('tasks.allPriorities')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">
                      {t('tasks.allPriorities')}
                    </SelectItem>
                    <SelectItem value={Priority.LOW}>
                      {t('tasks.priorityLow')}
                    </SelectItem>
                    <SelectItem value={Priority.MEDIUM}>
                      {t('tasks.priorityMedium')}
                    </SelectItem>
                    <SelectItem value={Priority.HIGH}>
                      {t('tasks.priorityHigh')}
                    </SelectItem>
                    <SelectItem value={Priority.URGENT}>
                      {t('tasks.priorityUrgent')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('tasks.project')}
                </label>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('tasks.allProjects')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">
                      {t('tasks.allProjects')}
                    </SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('tasks.tag')}
                </label>
                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('tasks.allTags')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t('tasks.allTags')}</SelectItem>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hideCompleted"
                  checked={hideCompleted}
                  onCheckedChange={(checked) =>
                    setHideCompleted(checked === true)
                  }
                />
                <label
                  htmlFor="hideCompleted"
                  className="text-sm font-medium cursor-pointer"
                >
                  {t('tasks.hideCompleted')}
                </label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL');
                  setProjectFilter('ALL');
                  setTagFilter('ALL');
                  setHideCompleted(false);
                }}
              >
                <X className="mr-2 h-4 w-4" />
                {t('tasks.clearFilters')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aktive Filter Anzeige */}
      {(statusFilter !== 'ALL' ||
        priorityFilter !== 'ALL' ||
        projectFilter !== 'ALL' ||
        tagFilter !== 'ALL' ||
        hideCompleted) && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-muted-foreground">
            {t('tasks.activeFilters')}:
          </span>
          {statusFilter !== 'ALL' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {t('tasks.status')}:{' '}
              {t(
                `tasks.status${statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase().replace('_', '')}`
              )}
              <button
                onClick={() => setStatusFilter('ALL')}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {priorityFilter !== 'ALL' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {t('tasks.priority')}:{' '}
              {t(
                `tasks.priority${priorityFilter.charAt(0) + priorityFilter.slice(1).toLowerCase()}`
              )}
              <button
                onClick={() => setPriorityFilter('ALL')}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {projectFilter !== 'ALL' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {t('tasks.project')}:{' '}
              {projects.find((p) => p.id === projectFilter)?.name ||
                projectFilter}
              <button
                onClick={() => setProjectFilter('ALL')}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {tagFilter !== 'ALL' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {t('tasks.tag')}:{' '}
              {tags.find((t) => t.id === tagFilter)?.name || tagFilter}
              <button
                onClick={() => setTagFilter('ALL')}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {hideCompleted && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {t('tasks.hideCompleted')}
              <button
                onClick={() => setHideCompleted(false)}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusFilter('ALL');
              setPriorityFilter('ALL');
              setProjectFilter('ALL');
              setTagFilter('ALL');
              setHideCompleted(false);
            }}
          >
            <X className="h-3 w-3 mr-1" />
            {t('tasks.clearAll')}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent>
              <EmptyState
                icon={CheckCircle2}
                title={t('tasks.noTasks')}
                description={t('tasks.createFirstTask')}
                action={{
                  label: t('tasks.createTask'),
                  onClick: openCreateDialog,
                  icon: Plus,
                }}
              />
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => {
            const statusStyle = getStatusStyles(task.status);
            const StatusIcon = statusStyle.icon;
            const isDone = task.status === Status.DONE;
            const canTrack = !isDone;

            return (
              <Card
                key={task.id}
                className={cn(
                  'relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20',
                  isDone ? 'opacity-60' : 'hover:translate-y-[-2px]'
                )}
              >
                {/* Status-Farbstreifen links */}
                <div
                  className={cn(
                    'absolute left-0 top-0 bottom-0 w-1.5',
                    statusStyle.bg.replace('bg-', 'bg-').replace('100', '500')
                  )}
                />

                <CardContent className="flex items-start gap-4 py-4 pl-5">
                  <Checkbox
                    checked={isDone}
                    onCheckedChange={() => toggleTaskStatus(task)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`font-medium ${
                          isDone ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Status Badge - deutlich sichtbar */}
                      <Badge
                        variant="outline"
                        className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border font-medium flex items-center gap-1`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusStyle.label}
                      </Badge>

                      <Badge
                        variant="secondary"
                        className={`${getPriorityColor(
                          task.priority
                        )} text-white`}
                      >
                        {t(
                          `tasks.priority${task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}`
                        )}
                      </Badge>

                      {/* Tracking-Indikator */}
                      {activeTimeEntry?.taskId === task.id && (
                        <Badge className="bg-red-100 text-red-700 border-red-300 animate-pulse flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t('tasks.tracking')}
                        </Badge>
                      )}
                    </div>

                    {task.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {truncateText(task.description, 120)}
                      </p>
                    )}

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
                            new Date(task.dueDate) < new Date() && !isDone
                              ? 'text-red-500 font-medium'
                              : ''
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          {t('tasks.due')}{' '}
                          {formatShortDate(task.dueDate)}
                        </span>
                      )}
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
                                >
                                  {tagRelation.tag.name}
                                </Badge>
                              )
                          )}
                        </div>
                      )}
                      {(() => {
                        const totalSeconds = calculateTotalDuration(
                          task.timeEntries
                        );
                        if (totalSeconds > 0) {
                          return (
                            <span className="flex items-center gap-1 font-medium text-blue-600">
                              <Timer className="h-3 w-3" />
                              {formatDuration(totalSeconds)}
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {canTrack && (
                      <Button
                        variant={
                          activeTimeEntry?.taskId === task.id
                            ? 'default'
                            : 'ghost'
                        }
                        size="sm"
                        onClick={() => toggleTimeTracking(task.id)}
                        className={
                          activeTimeEntry?.taskId === task.id
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'hover:bg-green-100 hover:text-green-700'
                        }
                        title={
                          activeTimeEntry?.taskId === task.id
                            ? t('tasks.stopTracking')
                            : t('tasks.startTracking')
                        }
                      >
                        {activeTimeEntry?.taskId === task.id ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            <span className="text-xs">{t('tasks.stop')}</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            <span className="text-xs">{t('tasks.track')}</span>
                          </>
                        )}
                      </Button>
                    )}

                    {isDone && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{t('tasks.completed')}</span>
                      </div>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(task)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          {t('tasks.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('tasks.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        hasNextPage={page < totalPages}
        hasPrevPage={page > 1}
      />

      <TaskDialog
        key={`${editingTask?.id ?? 'new'}-${dialogOpen ? 'open' : 'closed'}`}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        projects={projects}
        tags={tags}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />
    </div>
  );
}
