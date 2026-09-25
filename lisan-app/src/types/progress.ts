import type { IconName } from '@/components/icons/iconNames';

export type WordStatus = 'new' | 'learning' | 'review' | 'mastered';

export const WORD_STATUSES: readonly WordStatus[] = ['new', 'learning', 'review', 'mastered'];

/** Per-word spaced-repetition state. Owned by `progressStore`, computed by `srsService`. */
export interface WordProgress {
  wordId: string;
  status: WordStatus;
  correctAnswers: number;
  incorrectAnswers: number;
  repetitions: number;
  /** SM-2 ease factor; clamped to >= 1.3. */
  easeFactor?: number;
  intervalDays?: number;
  /** ISO 8601 timestamp. */
  nextReviewAt?: string;
  /** ISO 8601 timestamp. */
  lastReviewedAt?: string;
}

/** Answer quality on the classic SM-2 0–5 scale. */
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface StudySession {
  id: string;
  startedAt: string;
  endedAt?: string;
  wordsStudied: number;
  quizzesCompleted: number;
}

export interface ProgressSummary {
  wordsLearned: number;
  wordsReviewed: number;
  wordsMastered: number;
  quizzesCompleted: number;
  /** 0–100. */
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
  /**
   * Minutes, fractional: the accumulated total exactly as the store holds it, so that rounding
   * happens once where it is rendered rather than once per session on the way in.
   */
  studyMinutes: number;
  dueToday: number;
}

/**
 * One day's totals, kept so week-over-week change has something to be measured against.
 *
 * The progress store holds lifetime counters and one SRS record per word, neither of which says
 * what the learner's numbers were a week ago. A snapshot is that missing baseline and nothing
 * more: every field is a counter the store already maintains, so the record stays small enough to
 * keep a couple of months of them on the device.
 */
export interface ProgressSnapshot {
  /** `YYYY-MM-DD` in local time — the same key `studyDays` uses. */
  date: string;
  wordsLearned: number;
  quizzesCompleted: number;
  totalCorrect: number;
  totalAnswers: number;
  /** Minutes, fractional, in the same unit as the live counter it is a baseline for. */
  studyMinutes: number;
}

/** Signed change in one headline metric since its baseline, ready to render. */
export interface MetricDelta {
  /** Signed, in the metric's own unit: words, quizzes, percentage points or minutes. */
  value: number;
  /** `"+12 this week"`, `"No change this week"`. */
  label: string;
  tone: 'positive' | 'negative' | 'neutral';
}

/** A metric is absent when the learner's record holds no baseline for it, never zeroed. */
export interface ProgressDeltas {
  wordsLearned?: MetricDelta;
  quizzesCompleted?: MetricDelta;
  accuracy?: MetricDelta;
  studyMinutes?: MetricDelta;
}

export interface CategoryProgress {
  categoryId: string;
  learned: number;
  total: number;
  /** 0–100, rounded. */
  percent: number;
}

/** One point on the Progress page line chart. */
export interface TimeSeriesPoint {
  /** ISO date (`YYYY-MM-DD`). */
  date: string;
  value: number;
}

export type ActivityType =
  | 'words-learned'
  | 'words-reviewed'
  | 'quiz-completed'
  | 'word-bookmarked'
  | 'lesson-completed'
  | 'streak-extended';

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  label: string;
  detail?: string;
  /** ISO 8601 timestamp. */
  at: string;
  icon: IconName;
  accent: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
  };
}

/**
 * What the Progress dashboard asks the API layer for.
 *
 * The timeline and the badges are not here: both are derived in `src/features/progress/` from
 * slices the endpoint never sees (the last quiz result, grammar lesson completions), so an
 * endpoint copy of them could only ever be a thinner second answer to the same question.
 */
export interface ProgressOverviewData {
  summary: ProgressSummary;
  wordsOverTime: TimeSeriesPoint[];
  categories: CategoryProgress[];
  /** Seven booleans, Monday-first, describing the current week's study days. */
  weekStudyDays: boolean[];
}
