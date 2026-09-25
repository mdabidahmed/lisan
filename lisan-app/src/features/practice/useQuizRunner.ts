/**
 * The whole live quiz session behind one hook.
 *
 * Both quiz surfaces run through it — the focused runner at `/practice/:mode` and the inline card
 * on `/practice` — so a learner who answers a question in one place sees it reflected in the
 * other, and there is exactly one place where an answer reaches the SRS.
 *
 * `quizSessionStore` stays the single source of truth: selection and reveal are derived from the
 * stored answer rather than mirrored into component state, which is what makes stepping back to
 * an answered question show it exactly as the learner left it.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { PracticeDirection } from '@/data/practiceModes';
import { useWord } from '@/features/vocabulary';
import { qualityFromAnswer } from '@/services/srs';
import { useProgressActions } from '@/store/progressStore';
import {
  useCurrentQuestion,
  useQuizActions,
  useQuizProgress,
  useQuizSession,
  useQuizSessionStore,
} from '@/store/quizSessionStore';
import type {
  PracticeModeId,
  QuizAnswer,
  QuizConfig,
  QuizQuestion,
  QuizResult,
  ReviewQuality,
  VocabularyWord,
} from '@/types';

import { gradeAnswer, type AnswerVerdict } from './answerCheck';
import { buildQuizConfig, directionOfQuiz, type QuizConfigInput } from './quizConfig';
import { useQuiz } from './usePractice';

export interface UseQuizRunnerOptions extends QuizConfigInput {
  /** `null` disables the runner entirely — an unknown mode in the URL, for example. */
  mode: PracticeModeId | null;
  /** Keeps an in-progress session instead of replacing it, used by "retry missed words". */
  resume?: boolean | undefined;
  onComplete?: ((result: QuizResult) => void) | undefined;
}

export interface QuizRunnerState {
  config: QuizConfig | undefined;
  /** Which way round the question on screen is asked, taken from the session that built it. */
  direction: PracticeDirection;
  question: QuizQuestion | null;
  /** The word behind the current question, once it has loaded. */
  word: VocabularyWord | undefined;
  questions: readonly QuizQuestion[];
  answers: Readonly<Record<string, QuizAnswer>>;
  /** The selectable answers of the current question, in display order. Empty when it is typed. */
  optionValues: readonly string[];
  questionNumber: number;
  totalQuestions: number;
  currentIndex: number;
  progressPercent: number;
  correctCount: number;
  /** Exactly what the learner submitted for the current question, or `undefined`. */
  given: string | undefined;
  /**
   * A pick that has been made but not yet confirmed — set by `select`/`selectAtIndex`, cleared
   * once the question moves on. Lets an option-picking card show "this is chosen" without
   * grading it, so a wrong tap costs nothing until the learner commits to it.
   */
  pendingAnswer: string | undefined;
  /** `given`, falling back to `pendingAnswer` — what a card should render as the chosen option. */
  displayAnswer: string | undefined;
  revealed: boolean;
  verdict: AnswerVerdict | null;
  canGoBack: boolean;
  isLast: boolean;
  isLoading: boolean;
  isError: boolean;
  answer: (value: string) => void;
  /** Answers with the nth option — the 1–4 keyboard shortcuts. Ignores an out-of-range index. */
  answerAtIndex: (index: number) => void;
  /** Stages a pick without grading it — the option-picking cards' half of "select, then confirm". */
  select: (value: string) => void;
  /** `select`, by the nth option's index. */
  selectAtIndex: (index: number) => void;
  next: () => void;
  /**
   * Bound to Enter, and to an option-picking card's "Next Question" button. A staged, unconfirmed
   * pick is graded and revealed on the first call; a question already revealed instead moves on —
   * so the same action first shows the learner their answer, then, called again, advances.
   */
  advance: () => void;
  previous: () => void;
  /** Jumps to a question by zero-based index — the numbered pills under the card. */
  goTo: (index: number) => void;
  restart: () => void;
  retry: () => void;
}

/**
 * A lapse the learner nearly recovered grades above a blank miss, so the card comes back sooner
 * than a forgotten one but not as soon as a total failure.
 */
function qualityFor(verdict: AnswerVerdict, durationMs: number): ReviewQuality {
  if (verdict === 'correct') return qualityFromAnswer(true, durationMs);
  return verdict === 'near-miss' ? 2 : 1;
}

function nearMatchesFor(word: VocabularyWord | undefined): readonly string[] {
  return word === undefined ? [] : [word.transliteration];
}

export function useQuizRunner({
  mode,
  categoryId,
  questionCount,
  difficulty,
  resume = false,
  onComplete,
}: UseQuizRunnerOptions): QuizRunnerState {
  const config = useMemo(
    () =>
      mode === null ? undefined : buildQuizConfig(mode, { categoryId, questionCount, difficulty }),
    [mode, categoryId, questionCount, difficulty],
  );

  const { data: quiz, isPending, isError, refetch } = useQuiz(config);

  const session = useQuizSession();
  const question = useCurrentQuestion();
  const progress = useQuizProgress();
  const quizActions = useQuizActions();
  const { recordAnswer, recordQuizCompletion } = useProgressActions();
  const { data: word } = useWord(question?.wordId);

  const { start } = quizActions;

  // Held in a ref so `next` — and therefore the document-level keyboard listener bound to it —
  // stays stable even when the caller passes an inline completion handler.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  /*
   * The session is read imperatively rather than through a dependency so that answering a
   * question cannot re-trigger the bootstrap. The guards below are what make the session
   * survivable: a quiz whose id already matches is left alone, and `resume` protects a
   * client-built session (the retry-missed set) that no generated quiz corresponds to.
   */
  useEffect(() => {
    if (quiz === undefined) return;

    const current = useQuizSessionStore.getState().session;
    if (current?.status === 'active') {
      if (resume || current.quizId === quiz.id) return;
    }

    start(quiz);
  }, [quiz, resume, start]);

  const given = question === null ? undefined : session?.answers[question.id]?.given;
  const nearMatches = useMemo(() => nearMatchesFor(word), [word]);

  // A pick the learner has made but not yet confirmed. It lives here rather than in the session
  // because grading it is what the session is for — this is the moment before that is true yet.
  // Reset in the render body (React's documented pattern for state keyed to a changing prop)
  // rather than an effect, so a new question never paints with the previous one's pick.
  const [pendingAnswer, setPendingAnswer] = useState<string | undefined>(undefined);
  const pendingQuestionIdRef = useRef(question?.id);
  if (pendingQuestionIdRef.current !== question?.id) {
    pendingQuestionIdRef.current = question?.id;
    setPendingAnswer(undefined);
  }
  const displayAnswer = given ?? pendingAnswer;

  const verdict = useMemo<AnswerVerdict | null>(() => {
    if (question === null || given === undefined) return null;
    return gradeAnswer(given, question.correctAnswer, {
      type: question.type,
      nearMatches,
    });
  }, [question, given, nearMatches]);

  const answer = useCallback(
    (value: string) => {
      if (question === null) return;
      // Re-answering a revealed question would score it twice in the SRS.
      if (useQuizSessionStore.getState().session?.answers[question.id] !== undefined) return;

      quizActions.answer(question.id, value);

      const entry = useQuizSessionStore.getState().session?.answers[question.id];
      if (entry === undefined) return;

      const graded = gradeAnswer(value, question.correctAnswer, {
        type: question.type,
        nearMatches,
      });
      recordAnswer(entry.wordId, entry.correct, qualityFor(graded, entry.durationMs));
    },
    [question, nearMatches, quizActions, recordAnswer],
  );

  const optionValues = useMemo<readonly string[]>(() => {
    if (question === null) return [];
    return (question.type === 'image-match' ? question.imageOptions : question.options) ?? [];
  }, [question]);

  const answerAtIndex = useCallback(
    (index: number) => {
      const value = optionValues[index];
      if (value !== undefined) answer(value);
    },
    [optionValues, answer],
  );

  const select = useCallback(
    (value: string) => {
      if (question === null) return;
      // A revealed question is graded and done; picking again cannot change that.
      if (useQuizSessionStore.getState().session?.answers[question.id] !== undefined) return;
      setPendingAnswer(value);
    },
    [question],
  );

  const selectAtIndex = useCallback(
    (index: number) => {
      const value = optionValues[index];
      if (value !== undefined) select(value);
    },
    [optionValues, select],
  );

  const next = useCallback(() => {
    const current = useQuizSessionStore.getState().session;
    if (current === null) return;

    if (current.currentIndex < current.questions.length - 1) {
      quizActions.next();
      return;
    }

    const result = quizActions.complete();
    if (result === null) return;
    recordQuizCompletion(result);
    onCompleteRef.current?.(result);
  }, [quizActions, recordQuizCompletion]);

  const advance = useCallback(() => {
    const current = useQuizSessionStore.getState().session;
    const shown = current?.questions[current.currentIndex];
    if (shown === undefined) return;

    // Already graded: this call just moves on.
    if (current?.answers[shown.id] !== undefined) {
      next();
      return;
    }

    // Nothing graded yet: a staged pick is confirmed and revealed, but the learner stays on the
    // question to see it — advancing is a separate, subsequent call, exactly like a second press
    // of the same "Next Question" button once it reads as answered.
    if (pendingAnswer !== undefined) answer(pendingAnswer);
  }, [next, pendingAnswer, answer]);

  const previous = useCallback(() => {
    quizActions.previous();
  }, [quizActions]);

  const goTo = useCallback(
    (index: number) => {
      quizActions.goTo(index);
    },
    [quizActions],
  );

  const restart = useCallback(() => {
    if (quiz !== undefined) start(quiz);
  }, [quiz, start]);

  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const questions = session?.questions ?? [];
  const answers = session?.answers ?? {};
  const correctCount = Object.values(answers).filter((entry) => entry.correct).length;
  const currentIndex = session?.currentIndex ?? 0;

  // The question on screen belongs to the session, so its config — not the one just built from
  // the URL — is the one that says which way round it is. The two differ for the render between
  // a mode change and the quiz that replaces the session.
  const running = session?.config ?? config;

  return {
    config,
    direction: running === undefined ? 'arabic-to-english' : directionOfQuiz(running),
    question,
    word,
    questions,
    answers,
    optionValues,
    questionNumber: progress.current,
    totalQuestions: progress.total,
    currentIndex,
    progressPercent: progress.percent,
    correctCount,
    given,
    pendingAnswer,
    displayAnswer,
    revealed: given !== undefined,
    verdict,
    canGoBack: currentIndex > 0,
    isLast: progress.total > 0 && currentIndex === progress.total - 1,
    // A settings change refetches while a session is still on screen. Keeping that session
    // visible means the card never blanks out, and never turns into an error page mid-quiz.
    isLoading: isPending && question === null,
    isError: isError && question === null,
    answer,
    answerAtIndex,
    select,
    selectAtIndex,
    next,
    advance,
    previous,
    goTo,
    restart,
    retry,
  };
}
