import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test';
import { useProgressStore } from '@/store/progressStore';
import type { WordProgress } from '@/types/progress';
import { DAY_MS } from '@/utils/date';

import { HomePage } from './Home';

/** A card whose review date has already passed, so the schedule considers it due. */
function dueCard(wordId: string, daysAgo: number): WordProgress {
  const at = new Date(Date.now() - daysAgo * DAY_MS).toISOString();
  return {
    wordId,
    status: 'review',
    correctAnswers: 3,
    incorrectAnswers: 1,
    repetitions: 3,
    easeFactor: 2.5,
    intervalDays: 6,
    nextReviewAt: at,
    lastReviewedAt: at,
  };
}

function seedProgress(...cards: WordProgress[]): void {
  useProgressStore.setState({
    byWordId: Object.fromEntries(cards.map((card) => [card.wordId, card])),
  });
}

function reviewQueue(): HTMLElement {
  return screen.getByRole('region', { name: 'Due for Review' });
}

/** Word links only — each section also carries a header link ("Review now", "Your progress"). */
function wordHrefs(scope: HTMLElement): string[] {
  return within(scope)
    .getAllByRole('link')
    .map((link) => link.getAttribute('href') ?? '')
    .filter((href) => href.startsWith('/vocabulary/'));
}

beforeEach(() => {
  useProgressStore.setState({ byWordId: {}, studyDays: [] });
});

describe('HomePage — review queue', () => {
  it('celebrates an empty schedule and points at the next thing to do', async () => {
    renderWithProviders(<HomePage />);

    expect(await screen.findByText('You are all caught up')).toBeInTheDocument();

    const queue = within(reviewQueue());
    expect(queue.getByText('Your spaced-repetition schedule is clear.')).toBeInTheDocument();
    expect(queue.getByRole('button', { name: 'Browse vocabulary' })).toBeInTheDocument();
    expect(queue.queryByRole('link', { name: /Review now/ })).not.toBeInTheDocument();
  });

  it('lists the words the schedule says are due, oldest first', async () => {
    seedProgress(dueCard('teacher', 3), dueCard('doctor', 9));
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(within(reviewQueue()).getByText('2 words are ready')).toBeInTheDocument();
    });

    expect(wordHrefs(reviewQueue())).toEqual(['/vocabulary/doctor', '/vocabulary/teacher']);
    expect(within(reviewQueue()).getAllByText('Learned')).toHaveLength(2);
  });

  it('caps the list and says how much is still waiting', async () => {
    seedProgress(
      dueCard('teacher', 1),
      dueCard('doctor', 2),
      dueCard('student', 3),
      dueCard('work', 4),
      dueCard('engineer', 5),
      dueCard('computer', 6),
    );
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(within(reviewQueue()).getByText('6 words are ready')).toBeInTheDocument();
    });

    expect(wordHrefs(reviewQueue())).toHaveLength(4);
    expect(within(reviewQueue()).getByText('2 more waiting in the queue')).toBeInTheDocument();
  });

  it('offers a route into practice as soon as anything is due', async () => {
    seedProgress(dueCard('teacher', 1));
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(within(reviewQueue()).getByText('1 word is ready to come back')).toBeInTheDocument();
    });
    expect(within(reviewQueue()).getByRole('link', { name: /Review now/ })).toHaveAttribute(
      'href',
      '/practice',
    );
  });
});

describe('HomePage — recently studied', () => {
  it('stays hidden until the learner has studied something', async () => {
    renderWithProviders(<HomePage />);

    await screen.findByRole('region', { name: 'Due for Review' });
    expect(screen.queryByRole('region', { name: 'Recently Studied' })).not.toBeInTheDocument();
  });

  it('shows the most recently studied words, newest first', async () => {
    seedProgress(dueCard('teacher', 4), dueCard('doctor', 1), dueCard('student', 12));
    renderWithProviders(<HomePage />);

    const recent = await screen.findByRole('region', { name: 'Recently Studied' });

    await waitFor(() => {
      expect(wordHrefs(recent)).toEqual([
        '/vocabulary/doctor',
        '/vocabulary/teacher',
        '/vocabulary/student',
      ]);
    });
  });
});
