import { describe, expect, it } from 'vitest';

import type { ProgressSnapshot } from '@/types';
import { addDays, toDateKey } from '@/utils/date';

import {
  DELTA_WINDOW_DAYS,
  MAX_BASELINE_AGE_DAYS,
  deriveWeeklyDeltas,
  findBaseline,
  type WeeklyDeltasInput,
} from './weeklyDeltas';

const NOW = new Date(2026, 8, 21, 12);

function dayKey(daysAgo: number): string {
  return toDateKey(addDays(NOW, -daysAgo));
}

function snapshot(daysAgo: number, overrides: Partial<ProgressSnapshot> = {}): ProgressSnapshot {
  return {
    date: dayKey(daysAgo),
    wordsLearned: 0,
    quizzesCompleted: 0,
    totalCorrect: 0,
    totalAnswers: 0,
    studyMinutes: 0,
    ...overrides,
  };
}

const TODAY: WeeklyDeltasInput['summary'] = {
  wordsLearned: 42,
  quizzesCompleted: 11,
  accuracy: 90,
  studyMinutes: 300,
};

function deltas(
  snapshots: readonly ProgressSnapshot[],
  overrides: Partial<WeeklyDeltasInput> = {},
) {
  return deriveWeeklyDeltas({ summary: TODAY, totalAnswers: 100, snapshots, ...overrides }, NOW);
}

describe('findBaseline', () => {
  it('takes the snapshot dated exactly a week ago', () => {
    const wanted = snapshot(DELTA_WINDOW_DAYS, { wordsLearned: 30 });

    expect(findBaseline([snapshot(1), wanted, snapshot(12)], NOW)).toBe(wanted);
  });

  it('falls back to the nearest day, because snapshots only exist for days that were studied', () => {
    const wanted = snapshot(9);

    expect(findBaseline([snapshot(3), wanted, snapshot(13)], NOW)).toBe(wanted);
  });

  it('breaks a tie towards the newer snapshot, which can only understate the week', () => {
    const newer = snapshot(5);

    expect(findBaseline([snapshot(9), newer], NOW)).toBe(newer);
  });

  it('never uses today, which is the value being measured', () => {
    expect(findBaseline([snapshot(0)], NOW)).toBeNull();
  });

  it('ignores a snapshot too old to be called this week', () => {
    expect(findBaseline([snapshot(MAX_BASELINE_AGE_DAYS)], NOW)).not.toBeNull();
    expect(findBaseline([snapshot(MAX_BASELINE_AGE_DAYS + 1)], NOW)).toBeNull();
  });

  it('ignores a snapshot dated in the future', () => {
    expect(findBaseline([{ ...snapshot(0), date: toDateKey(addDays(NOW, 4)) }], NOW)).toBeNull();
  });
});

describe('deriveWeeklyDeltas with no baseline', () => {
  it('shows nothing at all for a learner who has just arrived', () => {
    expect(deltas([])).toEqual({});
  });

  it('shows nothing for a learner whose only history is today, rather than a flat +0', () => {
    const result = deltas([snapshot(0, { wordsLearned: 42, quizzesCompleted: 11 })]);

    expect(result).toEqual({});
    expect(result.wordsLearned).toBeUndefined();
    expect(result.quizzesCompleted).toBeUndefined();
    expect(result.accuracy).toBeUndefined();
    expect(result.studyMinutes).toBeUndefined();
  });

  it('shows nothing when the only history is older than the window allows', () => {
    expect(deltas([snapshot(40, { wordsLearned: 1 })])).toEqual({});
  });
});

describe('deriveWeeklyDeltas figures', () => {
  const baseline = snapshot(DELTA_WINDOW_DAYS, {
    wordsLearned: 30,
    quizzesCompleted: 6,
    totalCorrect: 42,
    totalAnswers: 50,
    studyMinutes: 180,
  });

  it('labels each metric in its own unit, the way the design writes them', () => {
    const result = deltas([baseline]);

    expect(result.wordsLearned).toEqual({
      value: 12,
      label: '+12 this week',
      tone: 'positive',
    });
    expect(result.quizzesCompleted?.label).toBe('+5 this week');
    // 90% today against 42/50 = 84% a week ago.
    expect(result.accuracy).toEqual({ value: 6, label: '+6% this week', tone: 'positive' });
    expect(result.studyMinutes).toEqual({ value: 120, label: '+2h this week', tone: 'positive' });
  });

  it('formats a study-time delta as a duration rather than a count of minutes', () => {
    const result = deltas([snapshot(DELTA_WINDOW_DAYS, { studyMinutes: 155 })]);

    expect(result.studyMinutes?.label).toBe('+2h 25m this week');
  });

  it('reports a drop as a drop, sign and tone included', () => {
    const result = deltas([
      snapshot(DELTA_WINDOW_DAYS, {
        wordsLearned: 50,
        totalCorrect: 96,
        totalAnswers: 100,
        studyMinutes: 400,
      }),
    ]);

    expect(result.wordsLearned).toEqual({ value: -8, label: '-8 this week', tone: 'negative' });
    expect(result.accuracy).toEqual({ value: -6, label: '-6% this week', tone: 'negative' });
    expect(result.studyMinutes?.label).toBe('-1h 40m this week');
  });

  it('says so plainly when a real baseline has not moved', () => {
    const flat = deltas([
      snapshot(DELTA_WINDOW_DAYS, {
        wordsLearned: 42,
        quizzesCompleted: 11,
        totalCorrect: 90,
        totalAnswers: 100,
        studyMinutes: 300,
      }),
    ]);

    expect(flat.wordsLearned).toEqual({
      value: 0,
      label: 'No change this week',
      tone: 'neutral',
    });
    expect(flat.accuracy?.label).toBe('No change this week');
  });

  it('subtracts the baseline accuracy from its own tallies, so value minus delta is exact', () => {
    const result = deltas([snapshot(DELTA_WINDOW_DAYS, { totalCorrect: 1, totalAnswers: 3 })]);

    // 1/3 rounds to 33%, and 90 - 33 = 57 percentage points.
    expect(result.accuracy?.value).toBe(57);
  });

  it('withholds the accuracy delta while the baseline has no answers to average', () => {
    const result = deltas([snapshot(DELTA_WINDOW_DAYS, { wordsLearned: 30 })]);

    expect(result.accuracy).toBeUndefined();
    // The metrics that do have a baseline are still reported.
    expect(result.wordsLearned?.value).toBe(12);
  });

  it('withholds the accuracy delta while the learner has answered nothing', () => {
    const result = deltas([snapshot(DELTA_WINDOW_DAYS, { totalCorrect: 4, totalAnswers: 5 })], {
      summary: { ...TODAY, accuracy: 0 },
      totalAnswers: 0,
    });

    expect(result.accuracy).toBeUndefined();
  });
});
