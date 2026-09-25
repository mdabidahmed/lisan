import { describe, expect, it } from 'vitest';

import {
  clampPercent,
  formatDelta,
  formatDuration,
  formatElapsed,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  formatShortDate,
} from './format';

const EASTERN_ARABIC_DIGIT = /[\u0660-\u0669]/;

describe('formatNumber', () => {
  it('groups for the default locale', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('renders the locale it is given rather than a hard-coded en-US', () => {
    expect(formatNumber(1234, 'ar')).toMatch(EASTERN_ARABIC_DIGIT);
  });
});

describe('formatPercent', () => {
  it('takes a percentage, which is what the app carries around', () => {
    expect(formatPercent(92)).toBe('92%');
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(100)).toBe('100%');
  });

  it('takes a ratio when asked', () => {
    expect(formatPercent(0.923, { fromRatio: true })).toBe('92%');
  });

  it('rounds to whole percentage points', () => {
    expect(formatPercent(66.4)).toBe('66%');
    expect(formatPercent(66.6)).toBe('67%');
  });

  it('accepts a locale', () => {
    expect(formatPercent(92, { locale: 'ar' })).toMatch(EASTERN_ARABIC_DIGIT);
  });
});

describe('clampPercent', () => {
  it('keeps a bar inside its track', () => {
    expect(clampPercent(-10)).toBe(0);
    expect(clampPercent(140)).toBe(100);
    expect(clampPercent(42)).toBe(42);
    expect(clampPercent(Number.NaN)).toBe(0);
  });
});

describe('formatDuration', () => {
  it('drops the part that is zero', () => {
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(120)).toBe('2h');
    expect(formatDuration(750)).toBe('12h 30m');
  });

  it('never reads as negative time', () => {
    expect(formatDuration(-5)).toBe('0m');
  });
});

describe('formatElapsed', () => {
  it('reads as a clock', () => {
    expect(formatElapsed(93_000)).toBe('1:33');
    expect(formatElapsed(9_000)).toBe('0:09');
    expect(formatElapsed(-1)).toBe('0:00');
  });
});

describe('formatShortDate', () => {
  it('is short enough for a chart axis', () => {
    expect(formatShortDate(new Date(2026, 7, 29, 12))).toBe('Aug 29');
  });

  it('renders nothing for an unparseable date', () => {
    expect(formatShortDate('not a date')).toBe('');
  });
});

describe('formatRelativeTime', () => {
  it('delegates to Intl, including its idioms', () => {
    const now = new Date('2026-03-05T12:00:00.000Z');

    expect(formatRelativeTime(new Date(now.getTime() - 2 * 3_600_000), now)).toBe('2 hours ago');
    expect(formatRelativeTime(new Date(now.getTime() - 86_400_000), now)).toBe('yesterday');
  });

  it('accepts an ISO string', () => {
    const now = new Date('2026-03-05T12:00:00.000Z');

    expect(formatRelativeTime('2026-03-05T09:00:00.000Z', now)).toBe('3 hours ago');
  });
});

describe('formatDelta', () => {
  it('signs a gain but not a loss', () => {
    expect(formatDelta(12, ' this week')).toBe('+12 this week');
    expect(formatDelta(-3)).toBe('-3');
    expect(formatDelta(0)).toBe('0');
  });
});
