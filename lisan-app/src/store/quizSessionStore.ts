import { create } from 'zustand';
import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/constants';
import { createZustandStorage } from '@/services/storage';
import type { Quiz, QuizAnswer, QuizQuestion, QuizResult, QuizSession } from '@/types';
import { clampPercent, containsArabic, createId, isArabicAnswerCorrect, nowIso } from '@/utils';

export interface QuizActions {
  start: (quiz: Quiz) => void;
  answer: (questionId: string, given: string) => void;
  next: () => void;
  previous: () => void;
  /** Jumps to a question by zero-based index, clamped to the session. */
  goTo: (index: number) => void;
  /** Returns the scored result, or `null` when there is no active session. */
  complete: () => QuizResult | null;
  /** Ends the session but keeps `lastResult`, so the result page survives a reload. */
  reset: () => void;
  /** Drops the last result as well. For clearing learner data, where it must not linger. */
  clearHistory: () => void;
}

export interface QuizSessionState {
  session: QuizSession | null;
  lastResult: QuizResult | null;
  /** Epoch ms the current question was shown, used for per-answer timing. */
  questionStartedAt: number | null;
  actions: QuizActions;
}

type PersistedQuizSession = Pick<QuizSessionState, 'session' | 'lastResult'>;

/** Case- and whitespace-insensitive comparison for everything that is not typed Arabic. */
function loose(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Typed answers are graded by the script they are written in, because direction decides which
 * one a question asks for: Arabic forgives tashkeel and the interchangeable letter forms, the
 * English of an `arabic-to-english` question only case and whitespace.
 */
function isAnswerCorrect(question: QuizQuestion, given: string): boolean {
  return question.type === 'typing' && containsArabic(question.correctAnswer)
    ? isArabicAnswerCorrect(given, question.correctAnswer)
    : loose(given) === loose(question.correctAnswer);
}

/**
 * The most one question may contribute to the reported time. A question's clock runs for as long
 * as it is on screen, and nothing distinguishes a learner who is thinking from one who went to
 * lunch with the tab open, so the ceiling is what stops idling being billed as study. Two minutes
 * is far beyond any real recall here — the SRS already grades everything past eight seconds
 * identically — so it never truncates effort that was actually spent.
 */
const MAX_QUESTION_MS = 120_000;

/** Contribution of one answer, with junk read back from `localStorage` counting for nothing. */
function questionTime(durationMs: number): number {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return 0;
  return Math.min(durationMs, MAX_QUESTION_MS);
}

/** Time spent answering: the per-answer clocks, each bounded, added up. */
function answeringTime(answers: readonly QuizAnswer[]): number {
  return answers.reduce((total, entry) => total + questionTime(entry.durationMs), 0);
}

function coerce(value: unknown): PersistedQuizSession {
  if (typeof value !== 'object' || value === null) return { session: null, lastResult: null };
  const record = value as Partial<PersistedQuizSession>;
  const lastResult = record.lastResult ?? null;

  return {
    session: record.session ?? null,
    // Results written while the duration was a wall-clock difference carry that inflated figure.
    // They carry their answers too, so the honest number is recoverable rather than lost.
    lastResult:
      lastResult === null || !Array.isArray(lastResult.answers)
        ? lastResult
        : { ...lastResult, durationMs: answeringTime(lastResult.answers) },
  };
}

const persistOptions: PersistOptions<QuizSessionState, PersistedQuizSession> = {
  name: STORAGE_KEYS.quizSession,
  version: STORAGE_SCHEMA_VERSION,
  storage: createJSONStorage<PersistedQuizSession>(() => createZustandStorage()),
  partialize: ({ session, lastResult }) => ({ session, lastResult }),
  migrate: (persisted) => coerce(persisted),
  /*
   * `questionStartedAt` is deliberately not persisted: a stored timestamp would charge the whole
   * gap since the tab was closed to whichever answer came next. Restarting it on rehydration is
   * what the clock actually means — the question is back on screen now — and it keeps a resumed
   * session's first answer from recording 0ms.
   */
  merge: (persisted, current) => {
    const { session, lastResult } = coerce(persisted);
    return {
      ...current,
      session,
      lastResult,
      questionStartedAt: session?.status === 'active' ? Date.now() : null,
    };
  },
};

export const useQuizSessionStore = create<QuizSessionState>()(
  persist(
    (set, get) => ({
      session: null,
      lastResult: null,
      questionStartedAt: null,

      actions: {
        start: (quiz) => {
          set({
            session: {
              id: createId('session'),
              quizId: quiz.id,
              config: quiz.config,
              questions: quiz.questions,
              answers: {},
              currentIndex: 0,
              status: 'active',
              startedAt: nowIso(),
            },
            lastResult: null,
            questionStartedAt: Date.now(),
          });
        },

        answer: (questionId, given) => {
          const { session, questionStartedAt } = get();
          if (session?.status !== 'active') return;

          const question = session.questions.find((item) => item.id === questionId);
          if (!question) return;

          const entry: QuizAnswer = {
            questionId,
            wordId: question.wordId,
            given,
            correct: isAnswerCorrect(question, given),
            answeredAt: nowIso(),
            durationMs:
              questionStartedAt === null ? 0 : Math.max(0, Date.now() - questionStartedAt),
          };

          set({
            session: { ...session, answers: { ...session.answers, [questionId]: entry } },
          });
        },

        next: () => {
          const { session } = get();
          if (!session) return;
          const last = session.questions.length - 1;
          if (session.currentIndex >= last) return;
          set({
            session: { ...session, currentIndex: session.currentIndex + 1 },
            questionStartedAt: Date.now(),
          });
        },

        previous: () => {
          const { session } = get();
          if (!session || session.currentIndex <= 0) return;
          set({
            session: { ...session, currentIndex: session.currentIndex - 1 },
            questionStartedAt: Date.now(),
          });
        },

        goTo: (index) => {
          const { session } = get();
          if (!session || !Number.isFinite(index)) return;

          const target = Math.min(Math.max(Math.trunc(index), 0), session.questions.length - 1);
          // Nothing to do for an empty session, and re-picking the question already on screen
          // must not restart its clock: a shorter response time grades higher in the SRS.
          if (target < 0 || target === session.currentIndex) return;

          set({
            session: { ...session, currentIndex: target },
            questionStartedAt: Date.now(),
          });
        },

        complete: () => {
          const { session } = get();
          if (!session) return null;

          const answers = session.questions
            .map((question) => session.answers[question.id])
            .filter((entry): entry is QuizAnswer => entry !== undefined);

          const total = session.questions.length;
          const correct = answers.filter((entry) => entry.correct).length;
          const completedAt = nowIso();

          /*
           * Time answering, not time elapsed. `startedAt` is stamped when the session object is
           * created, which happens as soon as a quiz loads — including for the inline card on
           * `/practice` — so differencing it against `completedAt` measured how long the tab had
           * been open and reported hours for a quiz answered in seconds. The same figure feeds
           * `recordQuizCompletion`, so it inflated lifetime study minutes with it.
           *
           * Summing the per-answer clocks is the only number the session can honestly claim:
           * questions that were never answered contribute nothing, and idling before the first
           * answer or after the last one is not charged to the learner at all.
           */
          const durationMs = answeringTime(answers);

          const result: QuizResult = {
            sessionId: session.id,
            quizId: session.quizId,
            total,
            correct,
            incorrect: answers.length - correct,
            skipped: total - answers.length,
            accuracy: total > 0 ? clampPercent(Math.round((correct / total) * 100)) : 0,
            durationMs,
            completedAt,
            answers,
          };

          set({
            session: { ...session, status: 'completed', completedAt },
            lastResult: result,
            questionStartedAt: null,
          });

          return result;
        },

        reset: () => {
          set({ session: null, questionStartedAt: null });
        },

        clearHistory: () => {
          set({ session: null, lastResult: null, questionStartedAt: null });
        },
      },
    }),
    persistOptions,
  ),
);

export function useQuizSession(): QuizSession | null {
  return useQuizSessionStore((state) => state.session);
}

export function useCurrentQuestion(): QuizQuestion | null {
  return useQuizSessionStore((state) =>
    state.session ? (state.session.questions[state.session.currentIndex] ?? null) : null,
  );
}

export interface QuizProgressView {
  current: number;
  total: number;
  answered: number;
  percent: number;
}

export function useQuizProgress(): QuizProgressView {
  return useQuizSessionStore(
    useShallow((state): QuizProgressView => {
      const session = state.session;
      if (!session) return { current: 0, total: 0, answered: 0, percent: 0 };

      const total = session.questions.length;
      return {
        current: Math.min(session.currentIndex + 1, total),
        total,
        answered: Object.keys(session.answers).length,
        percent:
          total > 0 ? clampPercent(Math.round(((session.currentIndex + 1) / total) * 100)) : 0,
      };
    }),
  );
}

export function useLastQuizResult(): QuizResult | null {
  return useQuizSessionStore((state) => state.lastResult);
}

export function useQuizActions(): QuizActions {
  return useQuizSessionStore((state) => state.actions);
}
