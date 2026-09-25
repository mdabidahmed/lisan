/** Date helpers. Everything persisted uses ISO 8601 strings so storage stays JSON-safe. */
import { weekdayLabels as localeWeekdayLabels } from '@/i18n/format';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales';

export const DAY_MS = 86_400_000;

export function nowIso(): string {
  return new Date().toISOString();
}

/** `YYYY-MM-DD` in local time — the key used for streaks and daily aggregation. */
export function toDateKey(value: Date | string = new Date()): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function startOfDay(value: Date | string = new Date()): Date {
  const date = typeof value === 'string' ? new Date(value) : new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(value: Date | string, days: number): Date {
  const date = typeof value === 'string' ? new Date(value) : new Date(value);
  date.setDate(date.getDate() + days);
  return date;
}

/** Whole-day difference, ignoring clock time. */
export function daysBetween(a: Date | string, b: Date | string): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);
}

export function isPast(isoDate: string | undefined, now: Date = new Date()): boolean {
  if (!isoDate) return false;
  const time = new Date(isoDate).getTime();
  return !Number.isNaN(time) && time <= now.getTime();
}

/** Monday-first weekday labels used by the study-streak strip. `Intl` supplies the names. */
export function weekdayLabels(locale: Locale = DEFAULT_LOCALE): readonly string[] {
  return localeWeekdayLabels(locale);
}

/** 0 = Monday … 6 = Sunday. */
export function mondayFirstIndex(date: Date = new Date()): number {
  return (date.getDay() + 6) % 7;
}
