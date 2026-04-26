import { Priority, Status } from '@/types';

/**
 * Get color class for a priority level
 */
export function getPriorityColor(priority: Priority): string {
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
}

/**
 * Get color value for a priority level (hex)
 */
export function getPriorityColorValue(priority: Priority): string {
  switch (priority) {
    case Priority.URGENT:
      return '#ef4444';
    case Priority.HIGH:
      return '#f97316';
    case Priority.MEDIUM:
      return '#3b82f6';
    case Priority.LOW:
      return '#22c55e';
    default:
      return '#6b7280';
  }
}

/**
 * Status styles configuration
 */
export interface StatusStyle {
  bg: string;
  text: string;
  border: string;
  label: string;
}

/**
 * Get styles for a status
 */
export function getStatusStyle(status: Status): StatusStyle {
  switch (status) {
    case Status.TODO:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        label: 'To Do',
      };
    case Status.IN_PROGRESS:
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300',
        label: 'In Progress',
      };
    case Status.DONE:
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-300',
        label: 'Done',
      };
    case Status.CANCELLED:
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-300',
        label: 'Cancelled',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        label: status,
      };
  }
}

/**
 * Priority order for sorting (lower = higher priority)
 */
export const PRIORITY_ORDER: Record<Priority, number> = {
  [Priority.URGENT]: 0,
  [Priority.HIGH]: 1,
  [Priority.MEDIUM]: 2,
  [Priority.LOW]: 3,
};

/**
 * Sort tasks by priority (urgent first)
 */
export function sortByPriority<T extends { priority: Priority }>(
  items: T[]
): T[] {
  return [...items].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}

/**
 * Format duration in seconds to human readable string
 */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Format duration for compact display
 */
export function formatDurationCompact(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Check if a date is overdue
 */
export function isOverdue(dueDate: string | Date): boolean {
  return new Date(dueDate) < new Date();
}

/**
 * Get contrast color (black or white) based on background
 */
export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Validate task input
 */
export function validateTaskInput(input: {
  title?: string;
  description?: string;
}): { valid: boolean; error?: string } {
  if (!input.title || input.title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }
  if (input.title.length > 200) {
    return { valid: false, error: 'Title must be less than 200 characters' };
  }
  if (input.description && input.description.length > 2000) {
    return {
      valid: false,
      error: 'Description must be less than 2000 characters',
    };
  }
  return { valid: true };
}

/**
 * Preset colors for tags/projects
 */
export const PRESET_COLORS = [
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

/**
 * Default pagination values
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;
