'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task, Project, Tag, Status, Priority, CreateTaskInput } from '@/types';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  projects: Project[];
  tags: Tag[];
  onSubmit: (data: CreateTaskInput) => void;
}

type TaskFormState = {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  projectId: string;
  selectedTags: string[];
  dueDate: string;
};

function getInitialFormState(task?: Task | null): TaskFormState {
  if (!task) {
    return {
      title: '',
      description: '',
      status: Status.TODO,
      priority: Priority.MEDIUM,
      projectId: 'none',
      selectedTags: [],
      dueDate: '',
    };
  }

  return {
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    projectId: task.projectId || 'none',
    selectedTags: task.tags?.map((tag) => tag.tagId) || [],
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split('T')[0]
      : '',
  };
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  projects,
  tags,
  onSubmit,
}: TaskDialogProps) {
  const initialState = getInitialFormState(task);
  const [title, setTitle] = useState(initialState.title);
  const [description, setDescription] = useState(initialState.description);
  const [status, setStatus] = useState<Status>(initialState.status);
  const [priority, setPriority] = useState<Priority>(initialState.priority);
  const [projectId, setProjectId] = useState<string>(initialState.projectId);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialState.selectedTags
  );
  const [dueDate, setDueDate] = useState<string>(initialState.dueDate);
  const { t } = useI18n();

  const isEditing = !!task;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      projectId: projectId === 'none' ? undefined : projectId,
      tagIds: selectedTags.length > 0 ? selectedTags : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    onOpenChange(false);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? t('taskDialog.editTask')
                : t('taskDialog.createTask')}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t('taskDialog.titleRequired')}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('taskDialog.titlePlaceholder')}
                required
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {title.length}/200
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">{t('taskDialog.description')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('taskDialog.descriptionPlaceholder')}
                rows={3}
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length}/2000
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">{t('taskDialog.status')}</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as Status)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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

              <div className="grid gap-2">
                <Label htmlFor="priority">{t('taskDialog.priority')}</Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as Priority)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="project">{t('taskDialog.project')}</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('taskDialog.selectProject')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t('taskDialog.noProject')}
                    </SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">{t('taskDialog.dueDate')}</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>{t('taskDialog.tags')}</Label>
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Button
                      key={tag.id}
                      type="button"
                      variant={
                        selectedTags.includes(tag.id) ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => toggleTag(tag.id)}
                      style={
                        selectedTags.includes(tag.id)
                          ? { backgroundColor: tag.color }
                          : { borderColor: tag.color, color: tag.color }
                      }
                    >
                      {tag.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {t('taskDialog.noTagsYet')}{' '}
                  <Link
                    href="/tags"
                    className="text-primary hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    {t('taskDialog.createTagsFirst')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('taskDialog.cancel')}
            </Button>
            <Button type="submit">
              {isEditing
                ? t('taskDialog.saveChanges')
                : t('taskDialog.createTask')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
