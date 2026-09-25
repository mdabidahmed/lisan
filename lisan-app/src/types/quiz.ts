import type { PracticeDirection } from '@/data/practiceModes';

import type { CEFRLevel, PracticeModeId } from './content';

export type QuizType = 'multiple-choice' | 'listening' | 'typing' | 'image-match';

export type QuizDifficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  wordId: string;
  question: string;
  options?: string[];
  /** Urdu gloss for each entry in `options`, aligned by index. */
  optionsUrdu?: string[];
  correctAnswer: string;
  imageOptions?: string[];
}

export interface QuizAnswer {
  questionId: string;
  wordId: string;
  /** Exactly what the learner submitted, before normalisation. */
  given: string;
  correct: boolean;
  /** ISO 8601 timestamp. */
  answeredAt: string;
  durationMs: number;
}

/**
 * The face a question shows when its config does not say. Typed answers have always been
 * production practice — an English prompt and an Arabic answer — and everything else recognition,
 * so a config written before `direction` existed keeps generating exactly what it used to.
 */
export const DEFAULT_QUIZ_DIRECTION: Record<QuizType, PracticeDirection> = {
  'multiple-choice': 'arabic-to-english',
  listening: 'arabic-to-english',
  typing: 'english-to-arabic',
  'image-match': 'arabic-to-english',
};

export interface QuizConfig {
  mode: PracticeModeId;
  type: QuizType;
  categoryId?: string;
  level?: CEFRLevel;
  questionCount: number;
  difficulty: QuizDifficulty;
  /**
   * Which way round the question is asked. Omitted falls back to `DEFAULT_QUIZ_DIRECTION`;
   * `buildQuizConfig` always sets it, so only hand-written configs rely on that.
   */
  direction?: PracticeDirection;
}

export interface Quiz {
  id: string;
  config: QuizConfig;
  questions: QuizQuestion[];
}

export type QuizStatus = 'idle' | 'active' | 'completed';

export interface QuizSession {
  id: string;
  quizId: string;
  config: QuizConfig;
  questions: QuizQuestion[];
  /** Keyed by `QuizQuestion['id']`. */
  answers: Record<string, QuizAnswer>;
  currentIndex: number;
  status: QuizStatus;
  startedAt: string;
  completedAt?: string;
}

export interface QuizResult {
  sessionId: string;
  quizId: string;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  /** 0–100, rounded. */
  accuracy: number;
  durationMs: number;
  completedAt: string;
  answers: QuizAnswer[];
}
