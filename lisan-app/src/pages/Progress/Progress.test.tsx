import { screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders, userEvent } from '@/test/renderWithProviders';
import { useLessonProgressStore } from '@/store/lessonProgressStore';
import { useProgressStore } from '@/store/progressStore';
import { useQuizSessionStore } from '@/store/quizSessionStore';
import type { ProgressSnapshot, WordProgress } from '@/types';
import { addDays, toDateKey } from '@/utils/date';

import { ProgressPage } from './Progress';

/**
 * Mid-afternoon, so the seeded reviews below land on the same local day whatever timezone the
 * suite runs in: the activity feed groups by local date, and hours either side of midnight would
 * otherwise split a group in two. Only `Date` is faked, so timers and `userEvent` stay real.
 */
const NOW = new Date(2026, 8, 21, 15);

function learned(wordId: string, hoursAgo: number, repetitions = 1): WordProgress {
  return {
    wordId,
    status: 'learning',
    correctAnswers: repetitions,
    incorrectAnswers: 0,
    repetitions,
    lastReviewedAt: new Date(NOW.getTime() - hoursAgo * 3_600_000).toISOString(),
  };
}

function snapshot(daysAgo: number, overrides: Partial<ProgressSnapshot> = {}): ProgressSnapshot {
  return {
    date: toDateKey(addDays(NOW, -daysAgo)),
    wordsLearned: 0,
    quizzesCompleted: 0,
    totalCorrect: 0,
    totalAnswers: 0,
    studyMinutes: 0,
    ...overrides,
  };
}

function seedProgress(snapshots: readonly ProgressSnapshot[] = []): void {
  const byWordId = Object.fromEntries(
    [
      learned('egg', 2),
      learned('bread', 2),
      learned('water', 3),
      // A different category, so the feed has to keep the two groups apart.
      learned('book', 4),
    ].map((entry) => [entry.wordId, entry]),
  );

  useProgressStore.setState({
    byWordId,
    studyDays: [toDateKey(NOW)],
    quizzesCompleted: 12,
    studyMinutes: 90,
    totalCorrect: 18,
    totalAnswers: 20,
    snapshots: [...snapshots],
  });
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
  localStorage.clear();
  useProgressStore.getState().actions.reset();
  useLessonProgressStore.getState().actions.reset();
  useQuizSessionStore.getState().actions.clearHistory();
});

afterEach(() => {
  vi.useRealTimers();
});

async function renderProgress() {
  const view = renderWithProviders(<ProgressPage />, { route: '/progress' });
  await waitFor(() => {
    expect(screen.getByRole('heading', { level: 1, name: 'Your Progress' })).toBeInTheDocument();
  });
  return view;
}

describe('<ProgressPage /> weekly deltas', () => {
  it('derives each headline delta from the snapshot nearest a week ago', async () => {
    seedProgress([
      snapshot(14, { wordsLearned: 1, quizzesCompleted: 1 }),
      snapshot(7, {
        wordsLearned: 1,
        quizzesCompleted: 7,
        totalCorrect: 8,
        totalAnswers: 10,
        studyMinutes: 30,
      }),
      snapshot(0, { wordsLearned: 4, quizzesCompleted: 12 }),
    ]);

    await renderProgress();

    // Four words learned now against one a week ago, and twelve quizzes against seven.
    expect(screen.getByText('+3 this week')).toBeInTheDocument();
    expect(screen.getByText('+5 this week')).toBeInTheDocument();
    // 18/20 = 90% today, 8/10 = 80% then.
    expect(screen.getByText('+10% this week')).toBeInTheDocument();
    // 90 minutes against 30.
    expect(screen.getByText('+1h this week')).toBeInTheDocument();
  });

  it('shows no delta at all for a learner with no history, rather than a row of +0', async () => {
    seedProgress();

    await renderProgress();

    expect(screen.getByText('Words Learned')).toBeInTheDocument();
    expect(screen.queryByText(/this week/)).not.toBeInTheDocument();
  });

  it('shows no delta when today is the only day on record', async () => {
    seedProgress([snapshot(0, { wordsLearned: 4, quizzesCompleted: 12 })]);

    await renderProgress();

    expect(screen.queryByText(/this week/)).not.toBeInTheDocument();
  });

  it('reports a decline as a decline', async () => {
    seedProgress([
      snapshot(7, {
        wordsLearned: 4,
        quizzesCompleted: 20,
        totalCorrect: 10,
        totalAnswers: 10,
        studyMinutes: 200,
      }),
    ]);

    await renderProgress();

    expect(screen.getByText('-8 this week')).toBeInTheDocument();
    expect(screen.getByText('-10% this week')).toBeInTheDocument();
    expect(screen.getByText('-1h 50m this week')).toBeInTheDocument();
    // Words learned has not moved, and a real flat week says so.
    expect(screen.getByText('No change this week')).toBeInTheDocument();
  });
});

describe('<ProgressPage /> recent activity', () => {
  it('groups the words it derived from the progress store, by day and category', async () => {
    seedProgress();
    await renderProgress();

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Recent Activity' }),
    ).toBeInTheDocument();

    expect(await screen.findByText('Learned 3 new words in Food & Dining')).toBeInTheDocument();
    expect(screen.getByText('Learned 1 new word in School & Education')).toBeInTheDocument();
    expect(screen.getAllByText(/hours ago/).length).toBeGreaterThan(0);
  });

  it('shows the last quiz with its score', async () => {
    seedProgress();
    useQuizSessionStore.setState({
      lastResult: {
        sessionId: 's1',
        quizId: 'q1',
        total: 10,
        correct: 9,
        incorrect: 1,
        skipped: 0,
        accuracy: 90,
        durationMs: 60_000,
        completedAt: new Date(Date.now() - 3_600_000).toISOString(),
        answers: [],
      },
    });

    await renderProgress();

    expect(await screen.findByText('Completed a quiz (Score: 90%)')).toBeInTheDocument();
  });

  it('explains itself when there is nothing to show', async () => {
    await renderProgress();

    expect(await screen.findByText('Nothing here yet')).toBeInTheDocument();
  });
});

describe('<ProgressPage /> achievements', () => {
  it('renders the three badges from the design with their state', async () => {
    seedProgress();
    await renderProgress();

    const heading = await screen.findByRole('heading', { level: 2, name: 'Achievements' });
    expect(heading).toBeInTheDocument();

    expect(screen.getByText('First Steps')).toBeInTheDocument();
    expect(screen.getByText('Learn your first 10 words')).toBeInTheDocument();

    // 12 quizzes clears the Quiz Master threshold of 10.
    expect(screen.getByText('Quiz Master')).toBeInTheDocument();
    expect(screen.getAllByText('Earned')).toHaveLength(1);

    // Four words learned out of the hundred Word Explorer asks for.
    expect(screen.getByText('Word Explorer')).toBeInTheDocument();
    expect(screen.getByText('4/100')).toBeInTheDocument();
  });

  it('reveals the rest of the badges on demand', async () => {
    const user = userEvent.setup();
    seedProgress();
    await renderProgress();

    const toggle = await screen.findByRole('button', { name: /view all achievements/i });
    expect(screen.queryByText('Streak Keeper')).not.toBeInTheDocument();

    await user.click(toggle);

    expect(screen.getByText('Streak Keeper')).toBeInTheDocument();
    expect(screen.getByText('Dedicated Learner')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show fewer achievements/i })).toBeInTheDocument();
  });

  it('counts finished grammar lessons towards the grammar badge', async () => {
    seedProgress();
    useLessonProgressStore.getState().actions.markComplete('definite-article');
    const user = userEvent.setup();
    await renderProgress();

    await user.click(await screen.findByRole('button', { name: /view all achievements/i }));

    const scholar = screen.getByText('Grammar Scholar').closest('li');
    expect(scholar).not.toBeNull();
    expect(within(scholar as HTMLElement).getByText('1/5')).toBeInTheDocument();
  });
});
