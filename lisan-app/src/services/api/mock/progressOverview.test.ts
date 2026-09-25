import { describe, expect, it } from 'vitest';

import { countLearnedWords } from '@/services/srs';
import type { WordProgress } from '@/types';
import { toDateKey } from '@/utils/date';

import type { ProgressOverviewInput } from '../types';
import { buildProgressOverview } from './progressOverview';

const NOW = new Date(2026, 8, 21, 12);

function word(wordId: string, overrides: Partial<WordProgress> = {}): WordProgress {
  return {
    wordId,
    status: 'learning',
    correctAnswers: 2,
    incorrectAnswers: 0,
    repetitions: 2,
    lastReviewedAt: new Date(2026, 8, 21, 9).toISOString(),
    ...overrides,
  };
}

const input: ProgressOverviewInput = {
  progressById: {
    apple: word('apple'),
    bread: word('bread', { status: 'mastered', repetitions: 4 }),
    // Never reviewed, so it counts towards neither the learned nor the reviewed tally.
    tree: { wordId: 'tree', status: 'new', correctAnswers: 0, incorrectAnswers: 0, repetitions: 0 },
  },
  studyDays: [toDateKey(NOW)],
  quizzesCompleted: 4,
  studyMinutes: 92,
  totalCorrect: 18,
  totalAnswers: 20,
};

describe('buildProgressOverview', () => {
  it('answers with the summary, the chart, the category bars and the week strip — nothing else', () => {
    const overview = buildProgressOverview(input, NOW);

    // `activity` and `achievements` were computed here too until this pass, from less of the
    // learner's record than `src/features/progress/` sees, and then thrown away unread.
    expect(Object.keys(overview).sort()).toEqual([
      'categories',
      'summary',
      'weekStudyDays',
      'wordsOverTime',
    ]);
  });

  it('counts words learned by the one shared definition of learned', () => {
    const { summary } = buildProgressOverview(input, NOW);

    expect(summary.wordsLearned).toBe(countLearnedWords(input.progressById));
    expect(summary.wordsLearned).toBe(2);
  });

  it('still rolls up the rest of the summary', () => {
    const { summary, wordsOverTime, weekStudyDays } = buildProgressOverview(input, NOW);

    expect(summary).toMatchObject({
      wordsReviewed: 2,
      wordsMastered: 1,
      quizzesCompleted: 4,
      accuracy: 90,
      studyMinutes: 92,
      currentStreak: 1,
    });
    expect(wordsOverTime).toHaveLength(14);
    expect(weekStudyDays).toHaveLength(7);
  });

  it('measures category progress by the same definition as the summary', () => {
    const { categories } = buildProgressOverview(input, NOW);

    const learned = categories.reduce((total, category) => total + category.learned, 0);
    expect(learned).toBe(countLearnedWords(input.progressById));
  });
});
