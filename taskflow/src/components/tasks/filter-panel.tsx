'use client';

import { Status, Priority, Tag } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    status: Status[];
    priority: Priority[];
    tags: string[];
  };
  availableTags: Tag[];
  onFilterChange: (filters: {
    status: Status[];
    priority: Priority[];
    tags: string[];
  }) => void;
}

const STATUS_OPTIONS = [
  { value: Status.TODO, label: 'To Do', color: 'bg-gray-500' },
  { value: Status.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-500' },
  { value: Status.DONE, label: 'Done', color: 'bg-green-500' },
  { value: Status.CANCELLED, label: 'Cancelled', color: 'bg-red-500' },
];

const PRIORITY_OPTIONS = [
  { value: Priority.LOW, label: 'Low', color: 'bg-green-500' },
  { value: Priority.MEDIUM, label: 'Medium', color: 'bg-blue-500' },
  { value: Priority.HIGH, label: 'High', color: 'bg-orange-500' },
  { value: Priority.URGENT, label: 'Urgent', color: 'bg-red-500' },
];

export function FilterPanel({
  filters,
  availableTags,
  onFilterChange,
}: FilterPanelProps) {
  const toggleStatus = (status: Status) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFilterChange({ ...filters, status: newStatus });
  };

  const togglePriority = (priority: Priority) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    onFilterChange({ ...filters, priority: newPriority });
  };

  const toggleTag = (tagId: string) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter((t) => t !== tagId)
      : [...filters.tags, tagId];
    onFilterChange({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    onFilterChange({ status: [], priority: [], tags: [] });
  };

  const hasFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.tags.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Status</Label>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <Badge
              key={option.value}
              variant={
                filters.status.includes(option.value) ? 'default' : 'outline'
              }
              className="cursor-pointer"
              onClick={() => toggleStatus(option.value)}
            >
              <span className={`mr-1 h-2 w-2 rounded-full ${option.color}`} />
              {option.label}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Priority</Label>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_OPTIONS.map((option) => (
            <Badge
              key={option.value}
              variant={
                filters.priority.includes(option.value) ? 'default' : 'outline'
              }
              className="cursor-pointer"
              onClick={() => togglePriority(option.value)}
            >
              <span className={`mr-1 h-2 w-2 rounded-full ${option.color}`} />
              {option.label}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Tags</Label>
        {availableTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag.id}
                variant={filters.tags.includes(tag.id) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleTag(tag.id)}
                style={
                  filters.tags.includes(tag.id)
                    ? { backgroundColor: tag.color }
                    : { borderColor: tag.color, color: tag.color }
                }
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No tags available</p>
        )}
      </div>
    </div>
  );
}
