import type { MetricDelta, ProgressDeltas, ProgressSnapshot, ProgressSummary } from '@/types';
import { addDays, toDateKey } from '@/utils/date';
import { formatDelta, formatDuration } from '@/utils/format';

/**
 * The "this week" figures under the four headline stat cards (reference screen 5).
 *
 * The progress store keeps lifetime counters, so a week-over-week figure needs a dated copy of
 * them to subtract: `ProgressSnapshot`. Snapshots only exist for days the learner studied, so
 * there is rarely one dated exactly seven days back and the nearest is used instead.
 *
 * Nothing here invents a number. A learner with no usable baseline gets no delta at all, which
 * the stat cards render as an absent line rather than a `+0` that would claim a flat week.
 */

/** Deltas are week-over-week, so this is the age a baseline is looked for at. */
export const DELTA_WINDOW_DAYS = 7;

/** Today's snapshot is the value being measured, not something to measure it against. */
const MIN_BASELINE_AGE_DAYS = 1;

/**
 * A baseline further back than this is not "this week" by any reading, and subtracting it would
 * pass a month of progress off as a week's. Better to show nothing.
 */
export const MAX_BASELINE_AGE_DAYS = 14;

const NO_CHANGE_LABEL = 'No change this week';

export interface WeeklyDeltasInput {
  summary: Pick<ProgressSummary, 'wordsLearned' | 'quizzesCompleted' | 'accuracy' | 'studyMinutes'>;
  /** Lifetime answers given. The accuracy delta stays hidden until both sides have some. */
  totalAnswers: number;
  snapshots: readonly ProgressSnapshot[];
}

/** `YYYY-MM-DD → age in days` for every day that could serve as a baseline. */
function baselineAges(now: Date): Map<string, number> {
  const ages = new Map<string, number>();
  for (let age = MIN_BASELINE_AGE_DAYS; age <= MAX_BASELINE_AGE_DAYS; age += 1) {
    ages.set(toDateKey(addDays(now, -age)), age);
  }
  return ages;
}

/**
 * The snapshot closest to a week old, or `null` when the history holds nothing that qualifies.
 * Ties go to the newer of the two: a shorter window can only understate the week, and
 * overstating a learner's progress back to them is the worse failure.
 */
export function findBaseline(
  snapshots: readonly ProgressSnapshot[],
  now: Date = new Date(),
): ProgressSnapshot | null {
  const ages = baselineAges(now);

  let best: ProgressSnapshot | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestAge = Number.POSITIVE_INFINITY;

  for (const snapshot of snapshots) {
    const age = ages.get(snapshot.date);
    if (age === undefined) continue;

    const distance = Math.abs(age - DELTA_WINDOW_DAYS);
    if (distance < bestDistance || (distance === bestDistance && age < bestAge)) {
      best = snapshot;
      bestDistance = distance;
      bestAge = age;
    }
  }

  return best;
}

function toDelta(value: number, magnitude: string): MetricDelta {
  if (value === 0) return { value, label: NO_CHANGE_LABEL, tone: 'neutral' };
  return {
    value,
    label: `${magnitude} this week`,
    tone: value > 0 ? 'positive' : 'negative',
  };
}

function countDelta(value: number, suffix = ''): MetricDelta {
  return toDelta(value, formatDelta(value, suffix));
}

/** `formatDuration` has no sign of its own, so the magnitude is formatted and signed by hand. */
function durationDelta(minutes: number): MetricDelta {
  return toDelta(minutes, `${minutes > 0 ? '+' : '-'}${formatDuration(Math.abs(minutes))}`);
}

/**
 * Percentage points, from the baseline's own tallies rather than a stored percentage, so that the
 * card's value minus its delta is exactly the accuracy the learner held a week ago.
 *
 * Withheld while either side has no answers: going from nothing to one correct answer is not a
 * hundred-point week.
 */
function accuracyDelta(input: WeeklyDeltasInput, baseline: ProgressSnapshot): MetricDelta | null {
  if (baseline.totalAnswers === 0 || input.totalAnswers === 0) return null;

  const before = Math.round((baseline.totalCorrect / baseline.totalAnswers) * 100);
  return countDelta(input.summary.accuracy - before, '%');
}

export function deriveWeeklyDeltas(
  input: WeeklyDeltasInput,
  now: Date = new Date(),
): ProgressDeltas {
  const baseline = findBaseline(input.snapshots, now);
  if (!baseline) return {};

  const accuracy = accuracyDelta(input, baseline);

  return {
    wordsLearned: countDelta(input.summary.wordsLearned - baseline.wordsLearned),
    quizzesCompleted: countDelta(input.summary.quizzesCompleted - baseline.quizzesCompleted),
    ...(accuracy === null ? {} : { accuracy }),
    studyMinutes: durationDelta(input.summary.studyMinutes - baseline.studyMinutes),
  };
}
