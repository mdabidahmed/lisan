import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useProgressStore } from '@/store/progressStore';
import { useQuizSessionStore } from '@/store/quizSessionStore';
import { useSettingsStore } from '@/store/settingsStore';
import { renderWithProviders, userEvent } from '@/test/renderWithProviders';
import type { QuizQuestion } from '@/types';

import { PracticePage } from './Practice';

async function currentQuestion(): Promise<QuizQuestion> {
  return waitFor(() => {
    const session = useQuizSessionStore.getState().session;
    const question = session?.questions[session.currentIndex];
    if (question === undefined) throw new Error('The session has no current question yet.');
    return question;
  });
}

beforeEach(() => {
  useQuizSessionStore.setState({ session: null, lastResult: null, questionStartedAt: null });
  useProgressStore.getState().actions.reset();
  useSettingsStore.getState().actions.reset();
  useSettingsStore.getState().actions.update({ quizQuestionCount: 5 });
});

describe('PracticePage', () => {
  it('runs a live question alongside the quiz settings rail', async () => {
    renderWithProviders(<PracticePage />, { route: '/practice' });

    expect(await screen.findByText('Question 1 of 5')).toBeInTheDocument();
    expect(screen.getByText('Select the correct meaning:')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByText('Quiz Settings')).toBeInTheDocument();
    expect(screen.getByText('Study Tips')).toBeInTheDocument();
  });

  it("shows today's goal against the learner's daily target", async () => {
    renderWithProviders(<PracticePage />, { route: '/practice' });
    await currentQuestion();

    expect(
      screen.getByRole('progressbar', { name: "Today's goal: 0 of 10 correct" }),
    ).toBeInTheDocument();
    expect(screen.getByText('Answer 10 questions correctly')).toBeInTheDocument();
  });

  it('counts a correct answer towards the goal and the recent-questions strip', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PracticePage />, { route: '/practice' });
    const question = await currentQuestion();

    await user.click(
      screen.getByRole('radio', {
        name: (name: string) => name.includes(question.correctAnswer),
      }),
    );
    await user.click(screen.getByRole('button', { name: /Next Question/ }));

    expect(
      await screen.findByRole('progressbar', { name: "Today's goal: 1 of 10 correct" }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Question 1, correct' })).toBeInTheDocument();
    expect(screen.getByText('Recent Questions')).toBeInTheDocument();
  });

  it('jumps back to an answered question from the Recent Questions strip', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PracticePage />, { route: '/practice' });
    const first = await currentQuestion();

    await user.keyboard('1');
    await user.keyboard('{Enter}'); // confirms and reveals the pick
    await waitFor(() => {
      expect(useQuizSessionStore.getState().session?.answers[first.id]).toBeDefined();
    });
    await user.keyboard('{Enter}'); // advances
    await screen.findByText('Question 2 of 5');

    await user.click(screen.getByRole('button', { name: /^Question 1, / }));

    expect(await screen.findByText('Question 1 of 5')).toBeInTheDocument();
    // The answer comes back with the question: selection is derived from the session, not state.
    expect(
      screen.getByRole('radio', {
        name: (name: string) => name.includes(first.options?.[0] ?? ''),
      }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('keeps the number shortcuts out of the way while a form control has focus', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PracticePage />, { route: '/practice' });
    const question = await currentQuestion();

    screen.getByLabelText('Number of Questions').focus();
    await user.keyboard('1');

    expect(useQuizSessionStore.getState().session?.answers[question.id]).toBeUndefined();
  });

  it('starts over on request', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PracticePage />, { route: '/practice' });
    const question = await currentQuestion();

    await user.keyboard('1');
    await user.keyboard('{Enter}'); // confirms and reveals the pick
    await waitFor(() => {
      expect(useQuizSessionStore.getState().session?.answers[question.id]).toBeDefined();
    });

    await user.click(screen.getByRole('button', { name: /Restart/ }));

    await waitFor(() => {
      expect(useQuizSessionStore.getState().session?.answers).toEqual({});
    });
  });

  it('keeps the practice mode tiles and carries the chosen category into them', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PracticePage />, { route: '/practice' });

    const listening = await screen.findByRole('link', { name: /Listening/ });
    expect(listening).toHaveAttribute('href', '/practice/listening');

    await user.selectOptions(screen.getByLabelText('Category'), 'food-dining');

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Listening/ })).toHaveAttribute(
        'href',
        '/practice/listening?category=food-dining',
      );
    });
  });

  it('rebuilds the quiz when the question count changes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PracticePage />, { route: '/practice' });
    await screen.findByText('Question 1 of 5');

    await user.selectOptions(screen.getByLabelText('Number of Questions'), '15');

    expect(await screen.findByText('Question 1 of 15')).toBeInTheDocument();
  });
});
