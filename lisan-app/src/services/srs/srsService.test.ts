import { describe, expect, it } from 'vitest';

import type { WordProgress } from '@/types';
import { daysBetween } from '@/utils';

import {
  calculateNextReview,
  createInitialProgress,
  deriveStatus,
  getDueWords,
  markLearned,
  qualityFromAnswer,
  recordAnswer,
  resetProgress,
  INITIAL_EASE_FACTOR,
  MIN_EASE_FACTOR,
} from './srsService';

const NOW = new Date('2026-03-01T09:00:00.000Z');

function daysUntilReview(progress: WordProgress, from: Date = NOW): number {
  expect(progress.nextReviewAt).toBeDefined();
  return daysBetween(from, progress.nextReviewAt ?? '');
}

describe('createInitialProgress / resetProgress', () => {
  it('starts a card as new with the default ease factor', () => {
    expect(createInitialProgress('apple')).toEqual({
      wordId: 'apple',
      status: 'new',
      correctAnswers: 0,
      incorrectAnswers: 0,
      repetitions: 0,
      easeFactor: INITIAL_EASE_FACTOR,
      intervalDays: 0,
    });
  });

  it('never schedules a brand-new card', () => {
    expect(createInitialProgress('apple').nextReviewAt).toBeUndefined();
  });

  it('resetProgress wipes a mature card back to new', () => {
    const mature: WordProgress = {
      wordId: 'apple',
      status: 'mastered',
      correctAnswers: 12,
      incorrectAnswers: 1,
      repetitions: 6,
      easeFactor: 2.8,
      intervalDays: 40,
      nextReviewAt: NOW.toISOString(),
      lastReviewedAt: NOW.toISOString(),
    };
    expect(resetProgress(mature.wordId)).toEqual(createInitialProgress('apple'));
  });
});

describe('calculateNextReview', () => {
  it('walks the full interval ladder: 1 day, 6 days, then interval * ease', () => {
    let progress = createInitialProgress('kitab');

    progress = calculateNextReview(progress, 5, NOW);
    expect(progress.repetitions).toBe(1);
    expect(progress.intervalDays).toBe(1);
    expect(daysUntilReview(progress)).toBe(1);
    expect(progress.status).toBe('learning');

    progress = calculateNextReview(progress, 5, NOW);
    expect(progress.repetitions).toBe(2);
    expect(progress.intervalDays).toBe(6);
    expect(progress.status).toBe('learning');

    const easeBeforeThird = progress.easeFactor ?? INITIAL_EASE_FACTOR;
    progress = calculateNextReview(progress, 5, NOW);
    expect(progress.repetitions).toBe(3);
    expect(progress.intervalDays).toBe(Math.round(6 * (easeBeforeThird + 0.1)));
    // Three reps but only a 17-day interval: graduated, not yet mastered.
    expect(progress.status).toBe('review');

    progress = calculateNextReview(progress, 5, NOW);
    expect(progress.intervalDays).toBeGreaterThanOrEqual(21);
    expect(progress.status).toBe('mastered');
  });

  it('applies the classic ease-factor formula', () => {
    const progress = calculateNextReview(createInitialProgress('kitab'), 4, NOW);
    // q = 4 -> EF + (0.1 - 1 * (0.08 + 1 * 0.02)) = EF + 0
    expect(progress.easeFactor).toBeCloseTo(2.5, 10);

    const easier = calculateNextReview(createInitialProgress('kitab'), 5, NOW);
    expect(easier.easeFactor).toBeCloseTo(2.6, 10);

    const harder = calculateNextReview(createInitialProgress('kitab'), 3, NOW);
    expect(harder.easeFactor).toBeCloseTo(2.36, 10);
  });

  it('clamps the ease factor at the 1.3 floor', () => {
    let progress = createInitialProgress('difficult');
    for (let i = 0; i < 12; i += 1) {
      progress = calculateNextReview(progress, 0, NOW);
    }
    expect(progress.easeFactor).toBe(MIN_EASE_FACTOR);
  });

  it('resets repetitions and the interval on a failed recall', () => {
    let progress = createInitialProgress('shay');
    progress = calculateNextReview(progress, 5, NOW);
    progress = calculateNextReview(progress, 5, NOW);
    progress = calculateNextReview(progress, 5, NOW);
    expect(progress.repetitions).toBe(3);

    const lapsed = calculateNextReview(progress, 1, NOW);
    expect(lapsed.repetitions).toBe(0);
    expect(lapsed.intervalDays).toBe(1);
    expect(daysUntilReview(lapsed)).toBe(1);
    expect(lapsed.status).toBe('new');
    expect(lapsed.easeFactor).toBeLessThan(progress.easeFactor ?? INITIAL_EASE_FACTOR);
  });

  it('keeps the answer tallies in step with the quality', () => {
    const pass = calculateNextReview(createInitialProgress('bayt'), 4, NOW);
    expect(pass).toMatchObject({ correctAnswers: 1, incorrectAnswers: 0 });

    const fail = calculateNextReview(pass, 2, NOW);
    expect(fail).toMatchObject({ correctAnswers: 1, incorrectAnswers: 1 });
  });

  it('stamps lastReviewedAt with the supplied clock', () => {
    const progress = calculateNextReview(createInitialProgress('bayt'), 4, NOW);
    expect(progress.lastReviewedAt).toBe(NOW.toISOString());
  });

  it('is deterministic for the same inputs', () => {
    const a = calculateNextReview(createInitialProgress('maa'), 4, NOW);
    const b = calculateNextReview(createInitialProgress('maa'), 4, NOW);
    expect(a).toEqual(b);
  });
});

describe('deriveStatus', () => {
  it('maps the repetition and interval ladder onto the four statuses', () => {
    expect(deriveStatus({ repetitions: 0, intervalDays: 0 })).toBe('new');
    expect(deriveStatus({ repetitions: 1, intervalDays: 1 })).toBe('learning');
    expect(deriveStatus({ repetitions: 2, intervalDays: 6 })).toBe('learning');
    expect(deriveStatus({ repetitions: 3, intervalDays: 15 })).toBe('review');
    expect(deriveStatus({ repetitions: 3, intervalDays: 21 })).toBe('mastered');
    expect(deriveStatus({ repetitions: 9, intervalDays: 120 })).toBe('mastered');
  });

  it('treats a missing interval as zero', () => {
    expect(deriveStatus({ repetitions: 4 })).toBe('review');
  });
});

describe('qualityFromAnswer', () => {
  it('grades correct answers by response time', () => {
    expect(qualityFromAnswer(true)).toBe(4);
    expect(qualityFromAnswer(true, 1_200)).toBe(5);
    expect(qualityFromAnswer(true, 5_000)).toBe(4);
    expect(qualityFromAnswer(true, 20_000)).toBe(3);
  });

  it('grades wrong answers below the passing threshold', () => {
    expect(qualityFromAnswer(false)).toBe(2);
    expect(qualityFromAnswer(false, 1_200)).toBe(2);
    expect(qualityFromAnswer(false, 20_000)).toBe(1);
  });
});

describe('recordAnswer', () => {
  it('creates a card on first contact', () => {
    const progress = recordAnswer(undefined, true, { now: NOW, wordId: 'tuffah' });
    expect(progress.wordId).toBe('tuffah');
    expect(progress.repetitions).toBe(1);
    expect(progress.correctAnswers).toBe(1);
    expect(progress.status).toBe('learning');
  });

  it('honours an explicit quality over the inferred one', () => {
    const inferred = recordAnswer(createInitialProgress('tuffah'), true, { now: NOW });
    const explicit = recordAnswer(createInitialProgress('tuffah'), true, { quality: 5, now: NOW });
    expect(inferred.easeFactor).toBeCloseTo(2.5, 10);
    expect(explicit.easeFactor).toBeCloseTo(2.6, 10);
  });

  it('records an incorrect answer as a lapse', () => {
    const learned = recordAnswer(createInitialProgress('tuffah'), true, { now: NOW });
    const lapsed = recordAnswer(learned, false, { now: NOW });
    expect(lapsed.repetitions).toBe(0);
    expect(lapsed.incorrectAnswers).toBe(1);
  });
});

describe('markLearned', () => {
  it('moves a new card into learning without touching the tallies', () => {
    const progress = markLearned(createInitialProgress('tuffah'), NOW);
    expect(progress.status).toBe('learning');
    expect(progress.repetitions).toBe(1);
    expect(progress.correctAnswers).toBe(0);
    expect(progress.incorrectAnswers).toBe(0);
    expect(daysUntilReview(progress)).toBe(1);
  });

  it('does not demote a card that is already ahead', () => {
    let mature = createInitialProgress('tuffah');
    for (let i = 0; i < 4; i += 1) {
      mature = calculateNextReview(mature, 5, NOW);
    }
    expect(mature.status).toBe('mastered');

    const marked = markLearned(mature, NOW);
    expect(marked.repetitions).toBe(mature.repetitions);
    expect(marked.intervalDays).toBe(mature.intervalDays);
    expect(marked.status).toBe('mastered');
  });
});

describe('getDueWords', () => {
  const overdue: WordProgress = {
    ...createInitialProgress('overdue'),
    repetitions: 2,
    intervalDays: 6,
    nextReviewAt: '2026-02-20T09:00:00.000Z',
  };
  const dueExactlyNow: WordProgress = {
    ...createInitialProgress('now'),
    repetitions: 1,
    intervalDays: 1,
    nextReviewAt: NOW.toISOString(),
  };
  const future: WordProgress = {
    ...createInitialProgress('future'),
    repetitions: 3,
    intervalDays: 21,
    nextReviewAt: '2026-04-01T09:00:00.000Z',
  };
  const neverReviewed = createInitialProgress('never');

  const byId: Record<string, WordProgress> = {
    future,
    never: neverReviewed,
    now: dueExactlyNow,
    overdue,
  };

  it('includes overdue cards, cards due exactly now, and never-reviewed cards', () => {
    expect(getDueWords(byId, NOW)).toEqual(['overdue', 'now', 'never']);
  });

  it('excludes cards scheduled in the future', () => {
    expect(getDueWords(byId, NOW)).not.toContain('future');
  });

  it('returns an empty list for an empty record', () => {
    expect(getDueWords({}, NOW)).toEqual([]);
  });

  it('is deterministic, breaking ties on word id', () => {
    const tied: Record<string, WordProgress> = {
      zebra: { ...createInitialProgress('zebra'), nextReviewAt: '2026-02-01T00:00:00.000Z' },
      alpha: { ...createInitialProgress('alpha'), nextReviewAt: '2026-02-01T00:00:00.000Z' },
    };
    expect(getDueWords(tied, NOW)).toEqual(['alpha', 'zebra']);
    expect(getDueWords(tied, NOW)).toEqual(getDueWords(tied, NOW));
  });
});
