import type { BadgeVariant, WordProgress, WordStatus } from '@/types';

/**
 * One vocabulary for learner status, shared by the vocabulary filters and the word-detail panel.
 *
 * `review` is surfaced as "Learned" because that is what the SM-2 state means to a learner: the
 * word is out of the drilling phase and only comes back on its review date. Spec §32 lists the
 * filter under the same name.
 */
export const WORD_STATUS_LABEL: Record<WordStatus, string> = {
  new: 'New',
  learning: 'Learning',
  review: 'Learned',
  mastered: 'Mastered',
};

export const WORD_STATUS_VARIANT: Record<WordStatus, BadgeVariant> = {
  new: 'info',
  learning: 'warning',
  review: 'purple',
  mastered: 'success',
};

/** Answers recorded against a word, correct or not. */
export function answerCount(progress: WordProgress | undefined): number {
  if (!progress) return 0;
  return progress.correctAnswers + progress.incorrectAnswers;
}

/** Percentage of answers that were correct. Zero until the word has been answered at least once. */
export function wordAccuracy(progress: WordProgress | undefined): number {
  const total = answerCount(progress);
  if (total === 0 || !progress) return 0;
  return Math.round((progress.correctAnswers / total) * 100);
}
