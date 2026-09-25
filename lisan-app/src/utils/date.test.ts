import { describe, expect, it } from 'vitest';

import {
  addDays,
  DAY_MS,
  daysBetween,
  isPast,
  mondayFirstIndex,
  startOfDay,
  toDateKey,
  weekdayLabels,
} from './date';

describe('toDateKey', () => {
  it('keys by local calendar day, not by UTC', () => {
    expect(toDateKey(new Date(2026, 2, 5, 23, 30))).toBe('2026-03-05');
  });

  it('pads single-digit months and days', () => {
    expect(toDateKey(new Date(2026, 0, 9, 12))).toBe('2026-01-09');
  });
});

describe('startOfDay and addDays', () => {
  it('strips the clock time', () => {
    expect(startOfDay(new Date(2026, 2, 5, 18, 45)).getHours()).toBe(0);
  });

  it('does not mutate its argument', () => {
    const original = new Date(2026, 2, 5, 12);

    addDays(original, 3);

    expect(original.getDate()).toBe(5);
  });

  it('crosses a month boundary', () => {
    expect(toDateKey(addDays(new Date(2026, 2, 30, 12), 3))).toBe('2026-04-02');
  });
});

describe('daysBetween', () => {
  it('counts whole days, ignoring the clock', () => {
    expect(daysBetween(new Date(2026, 2, 5, 23), new Date(2026, 2, 6, 1))).toBe(1);
    expect(daysBetween(new Date(2026, 2, 6, 1), new Date(2026, 2, 5, 23))).toBe(-1);
  });
});

describe('isPast', () => {
  const now = new Date('2026-03-05T12:00:00.000Z');

  it('is false for a review that is not due yet', () => {
    expect(isPast(new Date(now.getTime() + DAY_MS).toISOString(), now)).toBe(false);
  });

  it('is true for one that is', () => {
    expect(isPast(new Date(now.getTime() - DAY_MS).toISOString(), now)).toBe(true);
  });

  it('treats a word that has never been scheduled as not due', () => {
    expect(isPast(undefined, now)).toBe(false);
    expect(isPast('not a date', now)).toBe(false);
  });
});

describe('the Monday-first week', () => {
  it('labels the days in order', () => {
    expect(weekdayLabels()).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  it('names the days in the locale it is given', () => {
    expect(weekdayLabels('ar')).not.toEqual(weekdayLabels('en'));
  });

  it('indexes Monday at 0 and Sunday at 6', () => {
    expect(mondayFirstIndex(new Date(2026, 2, 2, 12))).toBe(0);
    expect(mondayFirstIndex(new Date(2026, 2, 8, 12))).toBe(6);
  });

  it('agrees with the labels, so the streak strip cannot be off by a day', () => {
    // A whole week, each day checked against the label the strip would put above it.
    for (let offset = 0; offset < 7; offset += 1) {
      const day = new Date(2026, 2, 2 + offset, 12);
      const labels = weekdayLabels();

      expect(labels[mondayFirstIndex(day)]).toBe(
        day.toLocaleDateString('en', { weekday: 'short' }),
      );
    }
  });
});
