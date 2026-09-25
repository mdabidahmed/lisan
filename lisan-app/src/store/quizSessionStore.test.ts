import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS, STORAGE_NAMESPACE, STORAGE_SCHEMA_VERSION } from '@/constants';
import type { Quiz } from '@/types';

import { useProgressStore } from './progressStore';
import { useQuizSessionStore } from './quizSessionStore';

const quiz: Quiz = {
  id: 'quiz_1',
  config: {
    mode: 'multiple-choice',
    type: 'multiple-choice',
    questionCount: 3,
    difficulty: 'mixed',
  },
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      wordId: 'apple',
      question: 'تُفَّاح',
      correctAnswer: 'Apple',
      options: ['Apple', 'Water', 'Book', 'House'],
    },
    {
      id: 'q2',
      type: 'typing',
      wordId: 'book',
      question: 'Book',
      correctAnswer: 'كِتَاب',
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      wordId: 'water',
      question: 'مَاء',
      correctAnswer: 'Water',
      options: ['Apple', 'Water', 'Book', 'House'],
    },
  ],
};

/** The other way round: an Arabic prompt whose typed answer is the English meaning. */
const reverseQuiz: Quiz = {
  id: 'quiz_2',
  config: {
    mode: 'typing',
    type: 'typing',
    questionCount: 1,
    difficulty: 'mixed',
    direction: 'arabic-to-english',
  },
  questions: [
    {
      id: 'r1',
      type: 'typing',
      wordId: 'apple',
      question: 'تُفَّاح',
      correctAnswer: 'Apple',
    },
  ],
};

function actions() {
  return useQuizSessionStore.getState().actions;
}

beforeEach(() => {
  localStorage.clear();
  useQuizSessionStore.setState({ session: null, lastResult: null, questionStartedAt: null });
});

describe('quizSessionStore', () => {
  it('starts an active session at the first question', () => {
    actions().start(quiz);

    const session = useQuizSessionStore.getState().session;
    expect(session).toMatchObject({ quizId: 'quiz_1', currentIndex: 0, status: 'active' });
    expect(session?.questions).toHaveLength(3);
    expect(session?.answers).toEqual({});
  });

  it('scores multiple choice ignoring case and surrounding whitespace', () => {
    actions().start(quiz);
    actions().answer('q1', '  apple ');

    expect(useQuizSessionStore.getState().session?.answers.q1?.correct).toBe(true);
  });

  it('scores typed Arabic ignoring harakat differences', () => {
    actions().start(quiz);
    actions().answer('q2', 'كتاب');

    expect(useQuizSessionStore.getState().session?.answers.q2?.correct).toBe(true);
  });

  it('marks a wrong answer as incorrect and keeps what was typed', () => {
    actions().start(quiz);
    actions().answer('q1', 'House');

    const answer = useQuizSessionStore.getState().session?.answers.q1;
    expect(answer?.correct).toBe(false);
    expect(answer?.given).toBe('House');
  });

  it('ignores answers for unknown questions and when idle', () => {
    actions().answer('q1', 'Apple');
    expect(useQuizSessionStore.getState().session).toBeNull();

    actions().start(quiz);
    actions().answer('nope', 'Apple');
    expect(useQuizSessionStore.getState().session?.answers).toEqual({});
  });

  it('navigates forwards and backwards within bounds', () => {
    actions().start(quiz);

    actions().previous();
    expect(useQuizSessionStore.getState().session?.currentIndex).toBe(0);

    actions().next();
    actions().next();
    expect(useQuizSessionStore.getState().session?.currentIndex).toBe(2);

    actions().next();
    expect(useQuizSessionStore.getState().session?.currentIndex).toBe(2);

    actions().previous();
    expect(useQuizSessionStore.getState().session?.currentIndex).toBe(1);
  });

  it('scores typed English on the Latin path, ignoring case', () => {
    actions().start(reverseQuiz);
    actions().answer('r1', '  apple ');

    expect(useQuizSessionStore.getState().session?.answers.r1?.correct).toBe(true);
  });

  it('still refuses a typed English answer that is a different word', () => {
    actions().start(reverseQuiz);
    actions().answer('r1', 'Book');

    expect(useQuizSessionStore.getState().session?.answers.r1?.correct).toBe(false);
  });
});

describe('quizSessionStore — goTo', () => {
  it('jumps straight to a question', () => {
    actions().start(quiz);

    actions().goTo(2);

    expect(useQuizSessionStore.getState().session?.currentIndex).toBe(2);
  });

  it('clamps an index outside the question range', () => {
    actions().start(quiz);

    actions().goTo(99);
    expect(useQuizSessionStore.getState().session?.currentIndex).toBe(2);

    actions().goTo(-4);
    expect(useQuizSessionStore.getState().session?.currentIndex).toBe(0);
  });

  it('ignores an index that is not a number, rather than corrupting the session', () => {
    actions().start(quiz);
    actions().next();

    actions().goTo(Number.NaN);

    expect(useQuizSessionStore.getState().session?.currentIndex).toBe(1);
  });

  it('does nothing when there is no session', () => {
    actions().goTo(1);

    expect(useQuizSessionStore.getState().session).toBeNull();
  });

  it('restarts the response clock, the way next and previous do', () => {
    vi.useFakeTimers();
    try {
      actions().start(quiz);
      vi.advanceTimersByTime(9_000);

      actions().goTo(2);
      vi.advanceTimersByTime(1_500);
      actions().answer('q3', 'Water');

      expect(useQuizSessionStore.getState().session?.answers.q3?.durationMs).toBe(1_500);
    } finally {
      vi.useRealTimers();
    }
  });

  it('leaves the clock alone when the question is already on screen', () => {
    vi.useFakeTimers();
    try {
      actions().start(quiz);
      vi.advanceTimersByTime(4_000);

      // Pressing the pill of the question you are looking at must not make you look faster:
      // response time is what `qualityFromAnswer` grades the answer on.
      actions().goTo(0);
      actions().answer('q1', 'Apple');

      expect(useQuizSessionStore.getState().session?.answers.q1?.durationMs).toBe(4_000);
    } finally {
      vi.useRealTimers();
    }
  });

  it('scores the session on complete, counting skipped questions', () => {
    actions().start(quiz);
    actions().answer('q1', 'Apple');
    actions().answer('q2', 'خطأ');

    const result = actions().complete();

    expect(result).toMatchObject({
      quizId: 'quiz_1',
      total: 3,
      correct: 1,
      incorrect: 1,
      skipped: 1,
      accuracy: 33,
    });
    expect(result?.answers).toHaveLength(2);
    expect(useQuizSessionStore.getState().session?.status).toBe('completed');
    expect(useQuizSessionStore.getState().lastResult).toEqual(result);
  });

  it('returns null from complete when there is no session', () => {
    expect(actions().complete()).toBeNull();
  });

  it('reports 100% when every answer is right', () => {
    actions().start(quiz);
    actions().answer('q1', 'Apple');
    actions().answer('q2', 'كِتَاب');
    actions().answer('q3', 'Water');

    expect(actions().complete()?.accuracy).toBe(100);
  });

  it('reset clears the session but keeps the last result for the result screen', () => {
    actions().start(quiz);
    actions().answer('q1', 'Apple');
    const result = actions().complete();

    actions().reset();

    expect(useQuizSessionStore.getState().session).toBeNull();
    expect(useQuizSessionStore.getState().lastResult).toEqual(result);
  });

  it('clearHistory takes the last result too, so cleared data cannot resurface', () => {
    actions().start(quiz);
    actions().answer('q1', 'Apple');
    actions().complete();

    actions().clearHistory();

    const state = useQuizSessionStore.getState();
    expect(state.session).toBeNull();
    expect(state.lastResult).toBeNull();
    expect(state.questionStartedAt).toBeNull();
  });

  it('clearHistory leaves the store usable and persists the emptied slice', () => {
    actions().start(quiz);
    actions().answer('q1', 'Apple');
    actions().complete();

    actions().clearHistory();
    actions().start(quiz);

    expect(useQuizSessionStore.getState().session?.quizId).toBe('quiz_1');
    expect(localStorage.getItem(`${STORAGE_NAMESPACE}:${STORAGE_KEYS.quizSession}`)).not.toBeNull();
  });
});

/*
 * The reported time is what the learner spent answering, not how long the session object has
 * existed. A session is created the moment a quiz loads — landing on `/practice` is enough — and
 * it persists, so wall-clock since `startedAt` reported hours for a quiz answered in seconds and
 * fed that figure to the study-minutes total through `recordQuizCompletion`.
 */
describe('quizSessionStore — quiz duration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('reports the time spent answering, not the time the session sat open', () => {
    actions().start(quiz);
    // The learner opened Practice, then went and did something else for eight minutes.
    vi.advanceTimersByTime(8 * 60_000);

    actions().next();
    vi.advanceTimersByTime(4_000);
    actions().answer('q2', 'كِتَاب');

    actions().next();
    vi.advanceTimersByTime(6_000);
    actions().answer('q3', 'Water');

    actions().goTo(0);
    vi.advanceTimersByTime(5_000);
    actions().answer('q1', 'Apple');

    // And left the result page open for a while before reading it.
    vi.advanceTimersByTime(3 * 60_000);

    expect(actions().complete()?.durationMs).toBe(15_000);
  });

  it('charges nothing for the questions that were skipped', () => {
    actions().start(quiz);
    vi.advanceTimersByTime(3_000);
    actions().answer('q1', 'Apple');

    const result = actions().complete();

    expect(result?.skipped).toBe(2);
    expect(result?.durationMs).toBe(3_000);
  });

  it('reports no time at all for a quiz that was never answered', () => {
    actions().start(quiz);
    vi.advanceTimersByTime(40 * 60_000);

    expect(actions().complete()?.durationMs).toBe(0);
  });

  it('caps a question the learner walked away from mid-quiz', () => {
    actions().start(quiz);
    // Question one stayed on screen over lunch. Nothing tells a thinking learner from an absent
    // one, so the ceiling is what keeps the total a plausible reading of "Time".
    vi.advanceTimersByTime(90 * 60_000);
    actions().answer('q1', 'Apple');

    actions().next();
    vi.advanceTimersByTime(2_000);
    actions().answer('q2', 'كِتَاب');

    expect(actions().complete()?.durationMs).toBe(122_000);
  });

  it('keeps the raw response time on the answer, which is what the SRS grades', () => {
    actions().start(quiz);
    vi.advanceTimersByTime(45 * 60_000);
    actions().answer('q1', 'Apple');

    // Capping is a reporting decision. The answer keeps what actually happened.
    expect(useQuizSessionStore.getState().session?.answers.q1?.durationMs).toBe(45 * 60_000);
  });

  it('feeds the study-minutes total a figure worth rounding to minutes', () => {
    useProgressStore.getState().actions.reset();

    actions().start(quiz);
    vi.advanceTimersByTime(477_000);
    actions().goTo(1);
    vi.advanceTimersByTime(8_000);
    actions().answer('q2', 'كِتَاب');
    actions().goTo(2);
    vi.advanceTimersByTime(7_000);
    actions().answer('q3', 'Water');

    const result = actions().complete();
    if (!result) throw new Error('The session produced no result');
    useProgressStore.getState().actions.recordQuizCompletion(result);

    // Fifteen seconds of answering is under a minute of study, not the eight minutes the
    // wall-clock reading added to the lifetime total and to the Progress page's weekly delta.
    expect(result.durationMs).toBe(15_000);
    expect(useProgressStore.getState().studyMinutes).toBe(0);
  });
});

describe('quizSessionStore — resuming a stored session', () => {
  it('rebuilds a stored result from its own answers rather than trusting its total', async () => {
    // A result written before the duration became a sum of the per-answer clocks.
    localStorage.setItem(
      `${STORAGE_NAMESPACE}:${STORAGE_KEYS.quizSession}`,
      JSON.stringify({
        version: STORAGE_SCHEMA_VERSION,
        data: {
          session: null,
          lastResult: {
            sessionId: 'session_old',
            quizId: 'quiz_1',
            total: 2,
            correct: 2,
            incorrect: 0,
            skipped: 0,
            accuracy: 100,
            durationMs: 477_000,
            completedAt: new Date().toISOString(),
            answers: [
              {
                questionId: 'q1',
                wordId: 'apple',
                given: 'Apple',
                correct: true,
                answeredAt: new Date().toISOString(),
                durationMs: 4_000,
              },
              {
                questionId: 'q2',
                wordId: 'book',
                given: 'كِتَاب',
                correct: true,
                answeredAt: new Date().toISOString(),
                durationMs: 6_000,
              },
            ],
          },
        },
      }),
    );

    await useQuizSessionStore.persist.rehydrate();

    expect(useQuizSessionStore.getState().lastResult?.durationMs).toBe(10_000);
  });

  it('restarts the question clock on rehydration, so the first answer back is timed', async () => {
    const key = `${STORAGE_NAMESPACE}:${STORAGE_KEYS.quizSession}`;
    actions().start(quiz);
    const stored = localStorage.getItem(key);
    if (stored === null) throw new Error('The session was not persisted');

    vi.useFakeTimers();
    try {
      // Closing the tab and coming back days later. The session survives; its clock must not.
      useQuizSessionStore.setState({ session: null, questionStartedAt: null });
      localStorage.setItem(key, stored);
      vi.advanceTimersByTime(3 * 24 * 60 * 60_000);
      await useQuizSessionStore.persist.rehydrate();

      expect(useQuizSessionStore.getState().session?.status).toBe('active');
      vi.advanceTimersByTime(5_000);
      actions().answer('q1', 'Apple');

      expect(actions().complete()?.durationMs).toBe(5_000);
    } finally {
      vi.useRealTimers();
    }
  });
});
