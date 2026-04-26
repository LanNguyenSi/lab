import { Priority, Status } from '@/types';
import {
  getPriorityColor,
  getPriorityColorValue,
  getStatusStyle,
  sortByPriority,
  formatDuration,
  formatDurationCompact,
  truncateText,
  isOverdue,
  getContrastColor,
  validateTaskInput,
  PRESET_COLORS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from './task-utils';

describe('getPriorityColor', () => {
  it('returns correct color for URGENT priority', () => {
    expect(getPriorityColor(Priority.URGENT)).toBe('bg-red-500');
  });

  it('returns correct color for HIGH priority', () => {
    expect(getPriorityColor(Priority.HIGH)).toBe('bg-orange-500');
  });

  it('returns correct color for MEDIUM priority', () => {
    expect(getPriorityColor(Priority.MEDIUM)).toBe('bg-blue-500');
  });

  it('returns correct color for LOW priority', () => {
    expect(getPriorityColor(Priority.LOW)).toBe('bg-green-500');
  });
});

describe('getPriorityColorValue', () => {
  it('returns correct hex for URGENT priority', () => {
    expect(getPriorityColorValue(Priority.URGENT)).toBe('#ef4444');
  });

  it('returns correct hex for HIGH priority', () => {
    expect(getPriorityColorValue(Priority.HIGH)).toBe('#f97316');
  });

  it('returns correct hex for MEDIUM priority', () => {
    expect(getPriorityColorValue(Priority.MEDIUM)).toBe('#3b82f6');
  });

  it('returns correct hex for LOW priority', () => {
    expect(getPriorityColorValue(Priority.LOW)).toBe('#22c55e');
  });
});

describe('getStatusStyle', () => {
  it('returns correct styles for TODO status', () => {
    const style = getStatusStyle(Status.TODO);
    expect(style.bg).toBe('bg-gray-100');
    expect(style.text).toBe('text-gray-700');
    expect(style.label).toBe('To Do');
  });

  it('returns correct styles for IN_PROGRESS status', () => {
    const style = getStatusStyle(Status.IN_PROGRESS);
    expect(style.bg).toBe('bg-blue-100');
    expect(style.text).toBe('text-blue-700');
    expect(style.label).toBe('In Progress');
  });

  it('returns correct styles for DONE status', () => {
    const style = getStatusStyle(Status.DONE);
    expect(style.bg).toBe('bg-green-100');
    expect(style.text).toBe('text-green-700');
    expect(style.label).toBe('Done');
  });

  it('returns correct styles for CANCELLED status', () => {
    const style = getStatusStyle(Status.CANCELLED);
    expect(style.bg).toBe('bg-red-100');
    expect(style.text).toBe('text-red-700');
    expect(style.label).toBe('Cancelled');
  });
});

describe('sortByPriority', () => {
  it('sorts tasks by priority (URGENT first)', () => {
    const tasks = [
      { id: '1', priority: Priority.LOW },
      { id: '2', priority: Priority.URGENT },
      { id: '3', priority: Priority.MEDIUM },
      { id: '4', priority: Priority.HIGH },
    ];

    const sorted = sortByPriority(tasks);

    expect(sorted[0].priority).toBe(Priority.URGENT);
    expect(sorted[1].priority).toBe(Priority.HIGH);
    expect(sorted[2].priority).toBe(Priority.MEDIUM);
    expect(sorted[3].priority).toBe(Priority.LOW);
  });

  it('does not mutate original array', () => {
    const tasks = [{ id: '1', priority: Priority.LOW }];
    const original = [...tasks];

    sortByPriority(tasks);

    expect(tasks).toEqual(original);
  });
});

describe('formatDuration', () => {
  it('formats seconds only', () => {
    expect(formatDuration(45)).toBe('45s');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(125)).toBe('2m 5s');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(3665)).toBe('1h 1m');
  });

  it('formats zero seconds', () => {
    expect(formatDuration(0)).toBe('0s');
  });
});

describe('formatDurationCompact', () => {
  it('formats minutes only', () => {
    expect(formatDurationCompact(125)).toBe('2m');
  });

  it('formats hours and minutes', () => {
    expect(formatDurationCompact(3665)).toBe('1h 1m');
  });
});

describe('truncateText', () => {
  it('returns original text if shorter than maxLength', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('truncates text with ellipsis', () => {
    expect(truncateText('Hello World', 8)).toBe('Hello...');
  });

  it('handles exact length', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });
});

describe('isOverdue', () => {
  it('returns true for past date', () => {
    const pastDate = new Date(Date.now() - 86400000).toISOString();
    expect(isOverdue(pastDate)).toBe(true);
  });

  it('returns false for future date', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    expect(isOverdue(futureDate)).toBe(false);
  });

  it('returns false for today', () => {
    const today = new Date().toISOString();
    expect(isOverdue(today)).toBe(false);
  });
});

describe('getContrastColor', () => {
  it('returns black for light background', () => {
    expect(getContrastColor('#ffffff')).toBe('#000000');
  });

  it('returns white for dark background', () => {
    expect(getContrastColor('#000000')).toBe('#ffffff');
  });

  it('returns correct contrast for gray', () => {
    const result = getContrastColor('#808080');
    expect(result).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe('validateTaskInput', () => {
  it('returns valid for correct input', () => {
    const result = validateTaskInput({ title: 'Valid Task' });
    expect(result.valid).toBe(true);
  });

  it('returns invalid for empty title', () => {
    const result = validateTaskInput({ title: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Title is required');
  });

  it('returns invalid for whitespace-only title', () => {
    const result = validateTaskInput({ title: '   ' });
    expect(result.valid).toBe(false);
  });

  it('returns invalid for title exceeding 200 chars', () => {
    const result = validateTaskInput({ title: 'a'.repeat(201) });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Title must be less than 200 characters');
  });

  it('returns invalid for description exceeding 2000 chars', () => {
    const result = validateTaskInput({
      title: 'Valid',
      description: 'a'.repeat(2001),
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Description must be less than 2000 characters');
  });

  it('accepts title at exactly 200 chars', () => {
    const result = validateTaskInput({ title: 'a'.repeat(200) });
    expect(result.valid).toBe(true);
  });
});

describe('Constants', () => {
  it('PRESET_COLORS has 18 colors', () => {
    expect(PRESET_COLORS).toHaveLength(18);
  });

  it('PRESET_COLORS are valid hex codes', () => {
    PRESET_COLORS.forEach((color) => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  it('has correct default page value', () => {
    expect(DEFAULT_PAGE).toBe(1);
  });

  it('has correct default limit value', () => {
    expect(DEFAULT_LIMIT).toBe(10);
  });

  it('has correct max limit value', () => {
    expect(MAX_LIMIT).toBe(100);
  });
});
