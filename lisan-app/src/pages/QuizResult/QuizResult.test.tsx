import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuizSessionStore } from '@/store/quizSessionStore';
import { renderWithProviders, userEvent } from '@/test/renderWithProviders';
import type { Quiz } from '@/types';

import { QuizResultPage } from './QuizResult';

/** As authored in the dataset: the review joins each answer back to the real word. */
const ENGINEER_ARABIC = 'مُهَنْدِس';
const APPLE_ARABIC = 'تُفَّاح';

const quiz: Quiz = {
  id: 'quiz_test',
  config: {
    mode: 'multiple-choice',
    type: 'multiple-choice',
    questionCount: 2,
    difficulty: 'mixed',
  },
  questions: [
    {
      id: 'q1_engineer',
      type: 'multiple-choice',
      wordId: 'engineer',
      question: ENGINEER_ARABIC,
      correctAnswer: 'Engineer',
      options: ['Doctor', 'Teacher', 'Engineer', 'Student'],
    },
    {
      id: 'q2_apple',
      type: 'multiple-choice',
      wordId: 'apple',
      question: APPLE_ARABIC,
      correctAnswer: 'Apple',
      options: ['Apple', 'Water', 'Bread', 'Milk'],
    },
  ],
};

/** One right, one wrong — the shape every assertion below needs. */
function playQuiz() {
  const { start, answer, next, complete } = useQuizSessionStore.getState().actions;
  start(quiz);
  answer('q1_engineer', 'Engineer');
  next();
  answer('q2_apple', 'Bread');
  complete();
}

function renderResult() {
  return renderWithProviders(<QuizResultPage />, { route: '/quiz/result' });
}

const review = () => within(screen.getByRole('list', { name: 'Answer review' }));

beforeEach(() => {
  useQuizSessionStore.setState({ session: null, lastResult: null, questionStartedAt: null });
});

describe('QuizResultPage', () => {
  it('invites the learner to practise when there is no result yet', () => {
    renderResult();

    expect(screen.getByText('No quiz to show yet')).toBeInTheDocument();
  });

  it('summarises the score', () => {
    playQuiz();
    renderResult();

    expect(screen.getByText('1/2')).toBeInTheDocument();
    expect(screen.getByText('Quiz Complete')).toBeInTheDocument();
  });

  it('breaks the quiz down question by question', async () => {
    playQuiz();
    renderResult();

    expect(await screen.findByText(ENGINEER_ARABIC)).toBeInTheDocument();
    expect(review().getByText(APPLE_ARABIC)).toBeInTheDocument();
    expect(review().getByText('Correct')).toBeInTheDocument();
    expect(review().getByText('Missed')).toBeInTheDocument();
  });

  it('shows what was answered next to what the answer was', async () => {
    playQuiz();
    renderResult();

    await screen.findByText(ENGINEER_ARABIC);
    expect(review().getAllByText('Your answer')).toHaveLength(2);
    expect(review().getByText('Bread')).toBeInTheDocument();
    expect(review().getByText('Correct answer')).toBeInTheDocument();
    // Once as the word itself, once as the answer the learner should have given.
    expect(review().getAllByText('Apple')).toHaveLength(2);
  });

  it('offers pronunciation and a link to each word', async () => {
    playQuiz();
    renderResult();

    await screen.findByText(ENGINEER_ARABIC);
    expect(screen.getByRole('button', { name: 'Play Engineer' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Details/ })[0]).toHaveAttribute(
      'href',
      '/vocabulary/engineer',
    );
  });

  it('replays only the missed words', async () => {
    const user = userEvent.setup();
    playQuiz();
    renderResult();

    await user.click(await screen.findByRole('button', { name: /Retry 1 Missed/ }));

    await waitFor(() => {
      expect(useQuizSessionStore.getState().session?.questions).toHaveLength(1);
    });
    const session = useQuizSessionStore.getState().session;
    expect(session?.questions[0]?.id).toBe('q2_apple');
    expect(session?.status).toBe('active');
    expect(session?.answers).toEqual({});
  });

  it('clears the session before starting a fresh quiz', async () => {
    const user = userEvent.setup();
    playQuiz();
    renderResult();

    await user.click(screen.getByRole('button', { name: /New Quiz/ }));

    expect(useQuizSessionStore.getState().session).toBeNull();
  });

  it('hides the retry action when nothing was missed', async () => {
    const { start, answer, next, complete } = useQuizSessionStore.getState().actions;
    start(quiz);
    answer('q1_engineer', 'Engineer');
    next();
    answer('q2_apple', 'Apple');
    complete();

    renderResult();

    await screen.findByText(ENGINEER_ARABIC);
    expect(screen.queryByRole('button', { name: /Retry/ })).not.toBeInTheDocument();
  });

  it('reports the time the learner spent answering, not how long the tab was open', () => {
    vi.useFakeTimers();
    try {
      const { start, answer, next, complete } = useQuizSessionStore.getState().actions;
      start(quiz);
      // A session exists from the moment a quiz loads, and this one sat on Practice for a while
      // before the learner got to it. "Time" is a claim about the learner, not about the tab.
      vi.advanceTimersByTime(9 * 60_000);

      next();
      vi.advanceTimersByTime(5_000);
      answer('q2_apple', 'Apple');
      complete();

      renderResult();

      expect(screen.getByText('0:05')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
