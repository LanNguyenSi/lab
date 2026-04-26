'use client';

import { useCallback, useEffect, useState } from 'react';
import { Tag } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  TagIcon,
  Pencil,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { useI18n } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PRESET_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#6b7280',
  '#854d0e',
];

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [nameError, setNameError] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  const { t } = useI18n();

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tags?page=${page}&limit=${limit}`);
      if (res.ok) {
        const { data, meta } = await res.json();
        setTags(data);
        setTotalPages(meta.totalPages);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void fetchTags();
  }, [fetchTags]);

  const handleSubmit = async () => {
    const trimmedName = newTagName.trim();
    if (!trimmedName) {
      setNameError(t('tags.nameRequired'));
      return;
    }

    setNameError('');

    try {
      if (editingTag) {
        const res = await fetch(`/api/tags/${editingTag.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: trimmedName,
            color: selectedColor,
          }),
        });

        if (res.ok) {
          setNewTagName('');
          setEditingTag(null);
          fetchTags();
        } else if (res.status === 409) {
          setNameError(t('tags.alreadyExists'));
        }
      } else {
        const res = await fetch('/api/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: trimmedName,
            color: selectedColor,
          }),
        });

        if (res.ok) {
          setNewTagName('');
          fetchTags();
        } else if (res.status === 409) {
          setNameError(t('tags.alreadyExists'));
        }
      }
    } catch (error) {
      console.error('Error saving tag:', error);
    }
  };

  const startEditing = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setSelectedColor(tag.color);
    setNameError('');
  };

  const cancelEditing = () => {
    setEditingTag(null);
    setNewTagName('');
    setSelectedColor(PRESET_COLORS[0]);
    setNameError('');
  };

  const deleteTag = async (tagId: string) => {
    if (!confirm(t('tags.deleteConfirm'))) return;

    try {
      const res = await fetch(`/api/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchTags();
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('tags.title')}</h1>
          <p className="text-muted-foreground">{t('tags.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('tags.title')}</h1>
        <p className="text-muted-foreground">{t('tags.description')}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {editingTag ? t('tags.editTag') : t('tags.createNewTag')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('tags.tagName')}
                value={newTagName}
                onChange={(e) => {
                  setNewTagName(e.target.value);
                  if (nameError) setNameError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className={
                  nameError ? 'border-red-500 focus-visible:ring-red-500' : ''
                }
                maxLength={50}
              />
              <div className="flex justify-between mt-1">
                {nameError && (
                  <p className="text-red-500 text-sm">{nameError}</p>
                )}
                <p className="text-xs text-muted-foreground text-right flex-1">
                  {newTagName.length}/50
                </p>
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={!newTagName.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              {editingTag ? t('tags.update') : t('tags.create')}
            </Button>
            {editingTag && (
              <Button variant="outline" onClick={cancelEditing}>
                {t('tags.cancel')}
              </Button>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">{t('tags.selectColor')}</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    selectedColor === color
                      ? 'ring-2 ring-offset-2 ring-primary scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tags.length === 0 ? (
          <Card className="border-dashed md:col-span-2 lg:col-span-3">
            <CardContent>
              <EmptyState
                icon={TagIcon}
                title={t('tags.noTags')}
                description={t('tags.createFirstTag')}
              />
            </CardContent>
          </Card>
        ) : (
          tags.map((tag) => (
            <Card
              key={tag.id}
              className="group transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]"
            >
              <CardContent className="flex items-center justify-between py-4 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: tag.color,
                      color: tag.color,
                    }}
                  >
                    {tag.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {tag.tasks?.length || 0} {t('tags.tasks')}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  <Link href={`/tasks?tagId=${tag.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      title={t('tags.viewTasks')}
                      className="hover:bg-blue-100 hover:text-blue-700"
                    >
                      <ArrowRight className="h-4 w-4 xl:mr-2" />
                      <span className="hidden xl:inline">
                        {t('tags.viewTasks')}
                      </span>
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startEditing(tag)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        {t('tags.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteTag(tag.id)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('tags.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
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
