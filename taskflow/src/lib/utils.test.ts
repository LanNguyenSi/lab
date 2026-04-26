import { cn, formatDuration, calculateTotalDuration, truncateText, formatShortDate } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('merges tailwind conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
});

describe('formatDuration', () => {
  it('returns 0m for null', () => {
    expect(formatDuration(null)).toBe('0m');
  });

  it('returns 0m for undefined', () => {
    expect(formatDuration(undefined)).toBe('0m');
  });

  it('returns 0m for zero', () => {
    expect(formatDuration(0)).toBe('0m');
  });

  it('returns 0m for negative', () => {
    expect(formatDuration(-10)).toBe('0m');
  });

  it('formats minutes only', () => {
    expect(formatDuration(120)).toBe('2m');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(3660)).toBe('1h 1m');
  });

  it('formats days, hours, minutes', () => {
    expect(formatDuration(90060)).toBe('1d 1h 1m');
  });

  it('formats hours only (no trailing minutes)', () => {
    expect(formatDuration(7200)).toBe('2h');
  });
});

describe('calculateTotalDuration', () => {
  it('returns 0 for undefined', () => {
    expect(calculateTotalDuration(undefined)).toBe(0);
  });

  it('returns 0 for empty array', () => {
    expect(calculateTotalDuration([])).toBe(0);
  });

  it('sums durations', () => {
    const entries = [{ duration: 100 }, { duration: 200 }, { duration: 300 }];
    expect(calculateTotalDuration(entries)).toBe(600);
  });

  it('handles null durations', () => {
    const entries = [{ duration: 100 }, { duration: null }, { duration: 200 }];
    expect(calculateTotalDuration(entries)).toBe(300);
  });
});

describe('truncateText', () => {
  it('returns empty string for null', () => {
    expect(truncateText(null, 10)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(truncateText(undefined, 10)).toBe('');
  });

  it('returns original text if shorter', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('truncates with ellipsis', () => {
    expect(truncateText('Hello World Foo', 10)).toBe('Hello Worl...');
  });
});

describe('formatShortDate', () => {
  it('returns empty string for null', () => {
    expect(formatShortDate(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatShortDate(undefined)).toBe('');
  });

  it('returns empty string for invalid date string', () => {
    expect(formatShortDate('not-a-date')).toBe('');
  });

  it('formats a Date object', () => {
    const date = new Date('2024-03-15T12:00:00Z');
    const result = formatShortDate(date);
    expect(result).toContain('Mar');
    expect(result).toContain('15');
  });

  it('formats a date string', () => {
    const result = formatShortDate('2024-06-01T00:00:00Z');
    expect(result).toContain('Jun');
    expect(result).toContain('1');
  });
});
