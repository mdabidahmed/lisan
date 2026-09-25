import type { QuizConfig } from '@/types';

export const practiceKeys = {
  all: ['practice'] as const,
  modes: ['practice', 'modes'] as const,
  quiz: (config: QuizConfig) => ['practice', 'quiz', config] as const,
  /** Words behind a finished quiz, fetched as one batch for the review breakdown. */
  reviewWords: (wordIds: readonly string[]) =>
    ['practice', 'review-words', [...wordIds].join(',')] as const,
};
