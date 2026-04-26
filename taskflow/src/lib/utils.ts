import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format seconds into human-readable duration string
 * Examples: "2h 30m", "45m", "1d 4h 30m"
 */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '0m';

  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

  return parts.join(' ');
}

/**
 * Calculate total duration from array of time entries
 */
export function calculateTotalDuration(
  timeEntries: { duration?: number | null }[] | undefined
): number {
  if (!timeEntries || timeEntries.length === 0) return 0;

  return timeEntries.reduce((total, entry) => {
    return total + (entry.duration || 0);
  }, 0);
}

/**
 * Truncate text to max length with ellipsis
 */
export function truncateText(
  text: string | null | undefined,
  maxLength: number
): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function formatShortDate(date: Date | string | null | undefined): string {
  if (!date) return '';

  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return '';

  return shortDateFormatter.format(value);
}
