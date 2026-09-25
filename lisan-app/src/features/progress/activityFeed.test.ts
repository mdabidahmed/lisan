import { describe, expect, it } from 'vitest';

import { categories, words } from '@/test/fixtures/sampleContent';
import type { WordProgress } from '@/types';

import { deriveActivityFeed, type ActivityFeedInput } from './activityFeed';

const categoriesById = Object.fromEntries(categories.map((category) => [category.id, category]));
const categoryIdByWordId = Object.fromEntries(words.map((word) => [word.id, word.categoryId]));

function reviewed(wordId: string, at: string, overrides: Partial<WordProgress> = {}): WordProgress {
  return {
    wordId,
    status: 'learning',
    correctAnswers: 1,
    incorrectAnswers: 0,
    repetitions: 1,
    lastReviewedAt: at,
    ...overrides,
  };
}

function feed(
  progress: readonly WordProgress[],
  extra: Partial<ActivityFeedInput> = {},
): ReturnType<typeof deriveActivityFeed> {
  return deriveActivityFeed({
    progressById: Object.fromEntries(progress.map((entry) => [entry.wordId, entry])),
    categoryIdByWordId,
    categoriesById,
    ...extra,
  });
}

describe('deriveActivityFeed word groups', () => {
  it('groups words learned on the same day in the same category, as the design reads them', () => {
    const entries = feed([
      reviewed('engineer', '2026-09-21T09:00:00'),
      reviewed('teacher', '2026-09-21T09:30:00'),
      reviewed('doctor', '2026-09-21T10:00:00'),
    ]);

    expect(entries).toHaveLength(1);
    expect(entries[0]?.label).toBe('Learned 3 new words in Work & Professions');
    expect(entries[0]?.type).toBe('words-learned');
    expect(entries[0]?.icon).toBe('vocabulary');
    // The tile takes the category's own accent.
    expect(entries[0]?.accent).toBe('blue');
  });

  it('timestamps a group with its most recent word', () => {
    const entries = feed([
      reviewed('engineer', '2026-09-21T09:00:00'),
      reviewed('teacher', '2026-09-21T11:45:00'),
    ]);

    expect(entries[0]?.at).toBe('2026-09-21T11:45:00');
  });

  it('keeps one word singular', () => {
    const entries = feed([reviewed('apple', '2026-09-21T09:00:00')]);
    expect(entries[0]?.label).toBe('Learned 1 new word in Food & Dining');
  });

  it('splits groups by day and by category', () => {
    const entries = feed([
      reviewed('engineer', '2026-09-21T09:00:00'),
      reviewed('apple', '2026-09-21T09:10:00'),
      reviewed('teacher', '2026-09-19T09:00:00'),
    ]);

    expect(entries.map((entry) => entry.label)).toEqual([
      'Learned 1 new word in Food & Dining',
      'Learned 1 new word in Work & Professions',
      'Learned 1 new word in Work & Professions',
    ]);
  });

  it('separates repeat reviews from newly learned words', () => {
    const entries = feed([
      reviewed('engineer', '2026-09-21T09:00:00', { repetitions: 4, status: 'mastered' }),
      reviewed('teacher', '2026-09-21T09:05:00'),
    ]);

    const labels = entries.map((entry) => entry.label);
    expect(labels).toContain('Reviewed 1 word in Work & Professions');
    expect(labels).toContain('Learned 1 new word in Work & Professions');
    expect(entries.find((entry) => entry.label.startsWith('Reviewed'))?.icon).toBe('replay');
  });

  it('types a review row as a review, rather than leaving the label to carry the difference', () => {
    const entries = feed([
      reviewed('engineer', '2026-09-21T09:00:00', { repetitions: 4, status: 'mastered' }),
      reviewed('teacher', '2026-09-21T09:05:00'),
    ]);

    expect(entries.find((entry) => entry.label.startsWith('Reviewed'))?.type).toBe(
      'words-reviewed',
    );
    expect(entries.find((entry) => entry.label.startsWith('Learned'))?.type).toBe('words-learned');
  });

  it('treats a lapsed word as a review rather than claiming it was learned', () => {
    const entries = feed([
      reviewed('engineer', '2026-09-21T09:00:00', { repetitions: 0, status: 'new' }),
    ]);

    expect(entries[0]?.label).toBe('Reviewed 1 word in Work & Professions');
    expect(entries[0]?.type).toBe('words-reviewed');
  });

  it('ignores words that have never been reviewed', () => {
    const entries = feed([
      { wordId: 'apple', status: 'new', correctAnswers: 0, incorrectAnswers: 0, repetitions: 0 },
    ]);

    expect(entries).toEqual([]);
  });

  it('falls back to a generic label when a word is not in any known category', () => {
    const entries = deriveActivityFeed({
      progressById: { ghost: reviewed('ghost', '2026-09-21T09:00:00') },
      categoryIdByWordId: {},
      categoriesById,
    });

    expect(entries[0]?.label).toBe('Learned 1 new word in Vocabulary');
    expect(entries[0]?.accent).toBe('blue');
  });
});

describe('deriveActivityFeed other event types', () => {
  it('shows the last quiz with its score, the way the design writes it', () => {
    const entries = feed([], {
      lastQuiz: { accuracy: 90, completedAt: '2026-09-21T12:00:00' },
    });

    expect(entries).toHaveLength(1);
    expect(entries[0]?.label).toBe('Completed a quiz (Score: 90%)');
    expect(entries[0]?.type).toBe('quiz-completed');
    expect(entries[0]?.icon).toBe('quiz');
  });

  it('shows finished grammar lessons', () => {
    const entries = feed([], {
      completedLessons: [
        {
          lessonId: 'definite-article',
          title: 'The Definite Article',
          completedAt: '2026-09-20T18:00:00',
        },
      ],
    });

    expect(entries[0]?.label).toBe('Completed the grammar lesson: The Definite Article');
    expect(entries[0]?.type).toBe('lesson-completed');
  });

  it('interleaves every event type newest first', () => {
    const entries = feed(
      [reviewed('engineer', '2026-09-21T09:00:00'), reviewed('apple', '2026-09-21T17:00:00')],
      {
        lastQuiz: { accuracy: 80, completedAt: '2026-09-21T13:00:00' },
        completedLessons: [
          { lessonId: 'l1', title: 'Nominal Sentences', completedAt: '2026-09-21T20:00:00' },
        ],
      },
    );

    expect(entries.map((entry) => entry.type)).toEqual([
      'lesson-completed',
      'words-learned',
      'quiz-completed',
      'words-learned',
    ]);
  });

  it('honours the limit', () => {
    const entries = feed(
      [
        reviewed('engineer', '2026-09-21T09:00:00'),
        reviewed('apple', '2026-09-20T09:00:00'),
        reviewed('book', '2026-09-19T09:00:00'),
      ],
      { limit: 2 },
    );

    expect(entries).toHaveLength(2);
    expect(entries[0]?.at).toBe('2026-09-21T09:00:00');
  });

  it('gives every entry a stable unique id', () => {
    const entries = feed([
      reviewed('engineer', '2026-09-21T09:00:00'),
      reviewed('apple', '2026-09-20T09:00:00'),
    ]);
    const again = feed([
      reviewed('engineer', '2026-09-21T09:00:00'),
      reviewed('apple', '2026-09-20T09:00:00'),
    ]);

    expect(new Set(entries.map((entry) => entry.id)).size).toBe(entries.length);
    expect(entries.map((entry) => entry.id)).toEqual(again.map((entry) => entry.id));
  });
});
