import { describe, expect, it } from 'vitest';

import {
  formatDate,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  formatWeekday,
  weekdayLabels,
} from './format';

const MARCH_5_2026 = '2026-03-05T10:30:00.000Z';
const UTC = { timeZone: 'UTC' } as const;

/** The same Thursday, built in local time so the weekday holds in any zone the suite runs in. */
const LOCAL_THURSDAY = new Date(2026, 2, 5, 12);

const EASTERN_ARABIC_DIGIT = /[\u0660-\u0669]/;
const WESTERN_DIGIT = /[0-9]/;

describe('formatNumber', () => {
  it('groups and separates for English', () => {
    expect(formatNumber(1234.5)).toBe('1,234.5');
    expect(formatNumber(1234.5, 'en')).toBe('1,234.5');
  });

  it('uses Eastern Arabic numerals for Arabic', () => {
    const arabic = formatNumber(1234.5, 'ar');

    expect(arabic).toMatch(EASTERN_ARABIC_DIGIT);
    expect(arabic).not.toMatch(WESTERN_DIGIT);
  });

  it('passes Intl options through', () => {
    expect(formatNumber(1234.56, 'en', { maximumFractionDigits: 0 })).toBe('1,235');
  });

  it('renders nothing for a value that is not a finite number', () => {
    expect(formatNumber(Number.NaN)).toBe('');
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('');
  });
});

describe('formatPercent', () => {
  it('takes a ratio, as Intl does', () => {
    expect(formatPercent(0.923)).toBe('92%');
    expect(formatPercent(0.923, 'en', { maximumFractionDigits: 1 })).toBe('92.3%');
  });

  it('localises the digits', () => {
    expect(formatPercent(0.92, 'ar')).toMatch(EASTERN_ARABIC_DIGIT);
  });
});

describe('formatDate', () => {
  it('reads as an English date', () => {
    expect(formatDate(MARCH_5_2026, 'en', { dateStyle: 'medium', ...UTC })).toBe('Mar 5, 2026');
  });

  it('reorders and renumbers for Arabic', () => {
    const arabic = formatDate(MARCH_5_2026, 'ar', { dateStyle: 'medium', ...UTC });

    expect(arabic).toMatch(EASTERN_ARABIC_DIGIT);
    expect(arabic).not.toBe(formatDate(MARCH_5_2026, 'en', { dateStyle: 'medium', ...UTC }));
  });

  it('accepts a Date, an ISO string or a timestamp', () => {
    const date = new Date(MARCH_5_2026);
    const options = { dateStyle: 'medium', ...UTC } as const;

    expect(formatDate(date, 'en', options)).toBe('Mar 5, 2026');
    expect(formatDate(date.getTime(), 'en', options)).toBe('Mar 5, 2026');
  });

  it('renders nothing for an unparseable date', () => {
    expect(formatDate('not a date')).toBe('');
    expect(formatDate(Number.NaN)).toBe('');
  });
});

describe('formatWeekday', () => {
  it('names the day in the locale', () => {
    expect(formatWeekday(LOCAL_THURSDAY, 'en')).toBe('Thu');
    expect(formatWeekday(LOCAL_THURSDAY, 'ar')).toBe('الخميس');
  });

  it('honours the requested width', () => {
    expect(formatWeekday(LOCAL_THURSDAY, 'en', 'long')).toBe('Thursday');
  });
});

describe('weekdayLabels', () => {
  it('starts the week on Monday, the order the streak strip reads in', () => {
    expect(weekdayLabels('en')).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  it('names the days in the locale rather than transliterating English ones', () => {
    const arabic = weekdayLabels('ar');

    expect(arabic).toHaveLength(7);
    expect(arabic[0]).toBe('الاثنين');
    expect(arabic).not.toEqual(weekdayLabels('en'));
  });

  it('honours the requested width', () => {
    expect(weekdayLabels('en', 'long')[0]).toBe('Monday');
  });

  it('returns the same frozen array for repeated calls', () => {
    expect(weekdayLabels('en')).toBe(weekdayLabels('en'));
    expect(Object.isFrozen(weekdayLabels('en'))).toBe(true);
  });
});

describe('formatRelativeTime', () => {
  const now = new Date('2026-03-05T12:00:00.000Z');
  const ago = (milliseconds: number) => new Date(now.getTime() - milliseconds);

  it('picks the largest unit the gap fits inside', () => {
    expect(formatRelativeTime(ago(45_000), 'en', now)).toBe('45 seconds ago');
    expect(formatRelativeTime(ago(40 * 60_000), 'en', now)).toBe('40 minutes ago');
    expect(formatRelativeTime(ago(5 * 3_600_000), 'en', now)).toBe('5 hours ago');
    expect(formatRelativeTime(ago(3 * 86_400_000), 'en', now)).toBe('3 days ago');
    expect(formatRelativeTime(ago(3 * 604_800_000), 'en', now)).toBe('3 weeks ago');
    expect(formatRelativeTime(ago(400 * 86_400_000), 'en', now)).toBe('last year');
  });

  it('rounds to the nearest whole unit', () => {
    // `Math.round` breaks ties towards positive infinity, so a gap of exactly 90 minutes into the
    // past rounds down to one hour rather than up to two. Locked in so a refactor has to mean it.
    expect(formatRelativeTime(ago(90 * 60_000), 'en', now)).toBe('1 hour ago');
    expect(formatRelativeTime(ago(100 * 60_000), 'en', now)).toBe('2 hours ago');
  });

  it('lets Intl choose the idiom instead of counting units', () => {
    expect(formatRelativeTime(ago(86_400_000), 'en', now)).toBe('yesterday');
    expect(formatRelativeTime(now, 'en', now)).toBe('now');
  });

  it('reads a future date as the future', () => {
    expect(formatRelativeTime(ago(-2 * 86_400_000), 'en', now)).toBe('in 2 days');
  });

  it('speaks Arabic when the locale does', () => {
    // Five, not two: Arabic has a dual, so `Intl` writes "قبل ساعتين" with no numeral at all.
    const arabic = formatRelativeTime(ago(5 * 3_600_000), 'ar', now);

    expect(arabic).toMatch(EASTERN_ARABIC_DIGIT);
    expect(arabic).not.toBe(formatRelativeTime(ago(5 * 3_600_000), 'en', now));
  });

  it('renders nothing when either end is unparseable', () => {
    expect(formatRelativeTime('not a date', 'en', now)).toBe('');
    expect(formatRelativeTime(now, 'en', 'not a date')).toBe('');
  });
});
