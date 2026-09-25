import type { ReviewQuality, WordProgress, WordStatus } from '@/types';
import { addDays, isPast } from '@/utils';

/**
 * SM-2-inspired spaced repetition (product spec §27).
 *
 * Every function here is pure and takes an explicit `now`, so the ladder is deterministic and the
 * store can stay a thin wrapper. Keeping the algorithm isolated is what makes a smarter scheduler
 * a drop-in replacement later.
 */

export const INITIAL_EASE_FACTOR = 2.5;
export const MIN_EASE_FACTOR = 1.3;
export const FIRST_INTERVAL_DAYS = 1;
export const SECOND_INTERVAL_DAYS = 6;
/** Below this quality the card lapsed: repetitions reset and the interval drops to one day. */
export const PASSING_QUALITY: ReviewQuality = 3;
export const MASTERY_REPETITIONS = 3;
export const MASTERY_INTERVAL_DAYS = 21;

/** Response-time buckets used to grade an answer without asking the learner to self-rate. */
const FAST_ANSWER_MS = 3_000;
const SLOW_ANSWER_MS = 8_000;

function clampEaseFactor(value: number): number {
  return Number.isFinite(value) ? Math.max(MIN_EASE_FACTOR, value) : INITIAL_EASE_FACTOR;
}

/** Classic SM-2: `EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))`. */
function nextEaseFactor(easeFactor: number, quality: ReviewQuality): number {
  const delta = 5 - quality;
  return clampEaseFactor(easeFactor + (0.1 - delta * (0.08 + delta * 0.02)));
}

export function createInitialProgress(wordId: string): WordProgress {
  return {
    wordId,
    status: 'new',
    correctAnswers: 0,
    incorrectAnswers: 0,
    repetitions: 0,
    easeFactor: INITIAL_EASE_FACTOR,
    intervalDays: 0,
  };
}

export function resetProgress(wordId: string): WordProgress {
  return createInitialProgress(wordId);
}

type StatusInput = Pick<WordProgress, 'repetitions'> & { intervalDays?: number | undefined };

export function deriveStatus(progress: StatusInput): WordStatus {
  if (progress.repetitions <= 0) return 'new';
  if (progress.repetitions < MASTERY_REPETITIONS) return 'learning';
  return (progress.intervalDays ?? 0) >= MASTERY_INTERVAL_DAYS ? 'mastered' : 'review';
}

export function qualityFromAnswer(correct: boolean, responseMs?: number): ReviewQuality {
  if (!correct) {
    if (responseMs === undefined) return 2;
    return responseMs <= SLOW_ANSWER_MS ? 2 : 1;
  }
  if (responseMs === undefined) return 4;
  if (responseMs <= FAST_ANSWER_MS) return 5;
  if (responseMs <= SLOW_ANSWER_MS) return 4;
  return 3;
}

/**
 * Advances one card. Also keeps the correct/incorrect tallies, because the quality already
 * encodes whether the recall succeeded and the two must never drift apart.
 */
export function calculateNextReview(
  progress: WordProgress,
  quality: ReviewQuality,
  now: Date = new Date(),
): WordProgress {
  const easeFactor = nextEaseFactor(progress.easeFactor ?? INITIAL_EASE_FACTOR, quality);
  const passed = quality >= PASSING_QUALITY;

  let repetitions: number;
  let intervalDays: number;

  if (!passed) {
    repetitions = 0;
    intervalDays = FIRST_INTERVAL_DAYS;
  } else {
    repetitions = progress.repetitions + 1;
    if (repetitions === 1) {
      intervalDays = FIRST_INTERVAL_DAYS;
    } else if (repetitions === 2) {
      intervalDays = SECOND_INTERVAL_DAYS;
    } else {
      const previous = progress.intervalDays ?? SECOND_INTERVAL_DAYS;
      intervalDays = Math.max(FIRST_INTERVAL_DAYS, Math.round(previous * easeFactor));
    }
  }

  return {
    wordId: progress.wordId,
    status: deriveStatus({ repetitions, intervalDays }),
    correctAnswers: progress.correctAnswers + (passed ? 1 : 0),
    incorrectAnswers: progress.incorrectAnswers + (passed ? 0 : 1),
    repetitions,
    easeFactor,
    intervalDays,
    nextReviewAt: addDays(now, intervalDays).toISOString(),
    lastReviewedAt: now.toISOString(),
  };
}

export interface RecordAnswerOptions {
  quality?: ReviewQuality | undefined;
  now?: Date | undefined;
  /** Used only when `progress` is undefined and a card has to be created on the spot. */
  wordId?: string | undefined;
  responseMs?: number | undefined;
}

export function recordAnswer(
  progress: WordProgress | undefined,
  correct: boolean,
  opts: RecordAnswerOptions = {},
): WordProgress {
  const base = progress ?? createInitialProgress(opts.wordId ?? '');
  const quality = opts.quality ?? qualityFromAnswer(correct, opts.responseMs);
  return calculateNextReview(base, quality, opts.now ?? new Date());
}

/**
 * Moves a card out of `new` without recording a quiz answer — the "mark as learned" affordance on
 * the word detail page. Tallies are deliberately untouched so accuracy stays honest.
 */
export function markLearned(progress: WordProgress, now: Date = new Date()): WordProgress {
  const repetitions = Math.max(1, progress.repetitions);
  const intervalDays = Math.max(FIRST_INTERVAL_DAYS, progress.intervalDays ?? 0);

  return {
    ...progress,
    repetitions,
    easeFactor: progress.easeFactor ?? INITIAL_EASE_FACTOR,
    intervalDays,
    nextReviewAt: addDays(now, intervalDays).toISOString(),
    lastReviewedAt: now.toISOString(),
    status: deriveStatus({ repetitions, intervalDays }),
  };
}

/**
 * A word counts as learned once it has left `new`. The one definition of the rule: the progress
 * summary and the dated snapshots the store keeps have to agree on it or their deltas are noise.
 */
export function isLearnedWord(progress: WordProgress): boolean {
  return progress.status !== 'new';
}

export function countLearnedWords(progressById: Readonly<Record<string, WordProgress>>): number {
  let learned = 0;
  for (const progress of Object.values(progressById)) {
    if (isLearnedWord(progress)) learned += 1;
  }
  return learned;
}

/**
 * Ids that should be studied now: anything whose `nextReviewAt` has passed, plus cards that have
 * never been reviewed. Sorted oldest-due first so reviews outrank brand-new words, with the id as
 * a tie-break to keep the order deterministic.
 */
export function getDueWords(
  progressById: Record<string, WordProgress>,
  now: Date = new Date(),
): string[] {
  const due: WordProgress[] = [];

  for (const progress of Object.values(progressById)) {
    if (progress.nextReviewAt === undefined || isPast(progress.nextReviewAt, now)) {
      due.push(progress);
    }
  }

  return due.sort(compareDue).map((progress) => progress.wordId);
}

function compareDue(a: WordProgress, b: WordProgress): number {
  // Never-reviewed cards have no due date; they queue behind genuine reviews.
  if (a.nextReviewAt === undefined && b.nextReviewAt !== undefined) return 1;
  if (a.nextReviewAt !== undefined && b.nextReviewAt === undefined) return -1;

  const aAt = a.nextReviewAt ?? '';
  const bAt = b.nextReviewAt ?? '';
  if (aAt < bAt) return -1;
  if (aAt > bAt) return 1;
  if (a.wordId < b.wordId) return -1;
  return a.wordId > b.wordId ? 1 : 0;
}

export const srsService = {
  createInitialProgress,
  calculateNextReview,
  recordAnswer,
  countLearnedWords,
  getDueWords,
  resetProgress,
  qualityFromAnswer,
  deriveStatus,
  markLearned,
};
