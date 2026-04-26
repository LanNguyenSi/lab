'use client';

import { useCallback, useEffect, useState } from 'react';
import { Project } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  FolderKanban,
  CheckCircle2,
  Pencil,
  Trash2,
  X,
  ArrowRight,
  Timer,
  MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import {
  formatDuration,
  calculateTotalDuration,
  truncateText,
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [nameError, setNameError] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  const { t } = useI18n();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects?page=${page}&limit=${limit}`);
      if (res.ok) {
        const { data, meta } = await res.json();
        setProjects(data);
        setTotalPages(meta.totalPages);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const createProject = async () => {
    const trimmedName = newProjectName.trim();
    if (!trimmedName) {
      setNameError(t('projects.nameRequired'));
      return;
    }

    setNameError('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          color: '#3b82f6',
        }),
      });

      if (res.ok) {
        setNewProjectName('');
        fetchProjects();
      } else {
        const errorData = await res.json();
        setNameError(errorData.error || t('projects.createError'));
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setNameError(t('projects.createError'));
    }
  };

  const updateProject = async () => {
    if (!editingProject) return;

    const trimmedName = newProjectName.trim();
    if (!trimmedName) {
      setNameError(t('projects.nameRequired'));
      return;
    }

    setNameError('');

    try {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      if (res.ok) {
        setEditingProject(null);
        setNewProjectName('');
        fetchProjects();
      } else {
        const errorData = await res.json();
        setNameError(errorData.error || t('projects.updateError'));
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setNameError(t('projects.updateError'));
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm(t('projects.deleteConfirm'))) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchProjects();
      } else {
        const errorData = await res.json();
        alert(
          t('projects.deleteError') +
            ': ' +
            (errorData.error || 'Unknown error')
        );
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(t('projects.deleteError'));
    }
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setNewProjectName(project.name);
    setNameError('');
  };

  const cancelEditing = () => {
    setEditingProject(null);
    setNewProjectName('');
    setNameError('');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('projects.title')}</h1>
          <p className="text-muted-foreground">{t('projects.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('projects.title')}</h1>
          <p className="text-muted-foreground">{t('projects.description')}</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder={
                  editingProject
                    ? t('projects.editProjectName')
                    : t('projects.newProjectName')
                }
                value={newProjectName}
                onChange={(e) => {
                  setNewProjectName(e.target.value);
                  if (nameError) setNameError('');
                }}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (editingProject ? updateProject() : createProject())
                }
                className={
                  nameError ? 'border-red-500 focus-visible:ring-red-500' : ''
                }
                maxLength={100}
              />
              <div className="flex justify-between mt-1">
                {nameError && (
                  <p className="text-red-500 text-sm">{nameError}</p>
                )}
                <p className="text-xs text-muted-foreground text-right flex-1">
                  {newProjectName.length}/100
                </p>
              </div>
            </div>
            <Button
              onClick={editingProject ? updateProject : createProject}
              disabled={!newProjectName.trim()}
            >
              <Plus className="mr-2 h-4 w-4" />
              {editingProject ? t('projects.update') : t('projects.create')}
            </Button>
            {editingProject && (
              <Button variant="outline" onClick={cancelEditing}>
                <X className="mr-2 h-4 w-4" />
                {t('projects.cancel')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <Card className="border-dashed md:col-span-2 lg:col-span-3">
            <CardContent>
              <EmptyState
                icon={FolderKanban}
                title={t('projects.noProjects')}
                description={t('projects.createFirstProject')}
              />
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => {
            const completedTasks =
              project.tasks?.filter((t) => t.status === 'DONE').length || 0;
            const totalTasks = project.tasks?.length || 0;

            // Calculate total tracked time for all tasks in this project
            const totalProjectSeconds =
              project.tasks?.reduce((total, task) => {
                return total + calculateTotalDuration(task.timeEntries);
              }, 0) || 0;

            return (
              <Card
                key={project.id}
                className="group transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px] hover:border-primary/20"
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <CardTitle>{project.name}</CardTitle>
                  </div>
                  {project.description && (
                    <CardDescription>
                      {truncateText(project.description, 100)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>
                          {completedTasks} / {totalTasks} {t('projects.tasks')}
                        </span>
                      </div>
                      {totalProjectSeconds > 0 && (
                        <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                          <Timer className="h-4 w-4" />
                          <span>{formatDuration(totalProjectSeconds)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap justify-end">
                      {totalTasks > 0 && (
                        <span className="text-sm font-medium mr-2">
                          {Math.round((completedTasks / totalTasks) * 100)}%
                        </span>
                      )}
                      <Link href={`/tasks?projectId=${project.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          title={t('projects.viewTasks')}
                          className="hover:bg-blue-100 hover:text-blue-700"
                        >
                          <ArrowRight className="h-4 w-4 xl:mr-2" />
                          <span className="hidden xl:inline">
                            {t('projects.viewTasks')}
                          </span>
                        </Button>
                      </Link>
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
                          <DropdownMenuItem
                            onClick={() => startEditing(project)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            {t('projects.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteProject(project.id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('projects.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
    </div>
  );
}
