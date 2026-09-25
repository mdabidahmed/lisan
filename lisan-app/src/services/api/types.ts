import type { VocabularyQuery, WordProgress } from '@/types';

/**
 * Inputs that only exist because the learner's SRS state lives in the browser for the MVP.
 * A real backend would read them from the authenticated session instead, which is why they are
 * modelled as request payloads rather than baked into the frozen `VocabularyQuery`.
 */

export interface WordsQuery extends VocabularyQuery {
  /** Required for `status` filtering and `most-practiced` sorting. */
  progressById?: Record<string, WordProgress> | undefined;
}

export interface ProgressOverviewInput {
  progressById: Record<string, WordProgress>;
  /** `YYYY-MM-DD` keys, one per day the learner studied. */
  studyDays: readonly string[];
  quizzesCompleted: number;
  /** Minutes, fractional. Passed through to the summary and rounded only when rendered. */
  studyMinutes: number;
  totalCorrect: number;
  totalAnswers: number;
  bookmarkCount?: number | undefined;
}

export interface SaveProgressInput {
  progressById: Record<string, WordProgress>;
}

export interface SaveProgressResult {
  savedAt: string;
  count: number;
}

export interface DueWordsInput {
  progressById: Record<string, WordProgress>;
  limit?: number | undefined;
}
