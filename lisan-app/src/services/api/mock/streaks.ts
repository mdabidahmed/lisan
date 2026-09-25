import { addDays, daysBetween, mondayFirstIndex, toDateKey, unique } from '@/utils';

/** `YYYY-MM-DD` parsed in local time. `new Date(key)` would parse as UTC and shift the day. */
export function dateFromKey(key: string): Date | null {
  const [year, month, day] = key.split('-').map(Number);
  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return null;
  }
  return new Date(year, month - 1, day);
}

export interface Streaks {
  current: number;
  longest: number;
}

/** A streak survives one day of slack: studying yesterday still counts as "current". */
export function computeStreaks(studyDays: readonly string[], now: Date = new Date()): Streaks {
  const days = unique([...studyDays])
    .map(dateFromKey)
    .filter((date): date is Date => date !== null)
    .sort((a, b) => a.getTime() - b.getTime());

  let longest = 0;
  let run = 0;
  let previous: Date | null = null;

  for (const date of days) {
    run = previous !== null && daysBetween(previous, date) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }

  if (previous === null) return { current: 0, longest: 0 };

  const gap = daysBetween(previous, now);
  return { current: gap === 0 || gap === 1 ? run : 0, longest };
}

/** Seven booleans, Monday-first, for the week containing `now`. */
export function weekStudyDays(studyDays: readonly string[], now: Date = new Date()): boolean[] {
  const studied = new Set(studyDays);
  const monday = addDays(now, -mondayFirstIndex(now));
  return Array.from({ length: 7 }, (_, offset) => studied.has(toDateKey(addDays(monday, offset))));
}
