import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ProgressSummary } from '@/types/progress';

import { ProgressOverview } from './ProgressOverview';

const summary: ProgressSummary = {
  wordsLearned: 42,
  wordsReviewed: 30,
  wordsMastered: 8,
  quizzesCompleted: 11,
  accuracy: 90,
  currentStreak: 3,
  longestStreak: 9,
  studyMinutes: 300,
  dueToday: 4,
};

describe('<ProgressOverview />', () => {
  it('renders the four headline metrics', () => {
    render(<ProgressOverview summary={summary} />);

    expect(screen.getByText('Words Learned')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('5h')).toBeInTheDocument();
  });

  it('renders each delta it is given, with the tone it was given', () => {
    render(
      <ProgressOverview
        summary={summary}
        deltas={{
          wordsLearned: { value: 12, label: '+12 this week', tone: 'positive' },
          accuracy: { value: -6, label: '-6% this week', tone: 'negative' },
        }}
      />,
    );

    expect(screen.getByText('+12 this week')).toBeInTheDocument();
    expect(screen.getByText('-6% this week')).toBeInTheDocument();
  });

  it('shows no line for a metric with no baseline, rather than an invented zero', () => {
    render(
      <ProgressOverview
        summary={summary}
        deltas={{ wordsLearned: { value: 12, label: '+12 this week', tone: 'positive' } }}
      />,
    );

    expect(screen.getAllByText(/this week/)).toHaveLength(1);
  });

  it('shows no deltas at all when none were derived', () => {
    render(<ProgressOverview summary={summary} deltas={{}} />);

    expect(screen.queryByText(/this week/)).not.toBeInTheDocument();
  });

  it('renders placeholders instead of stale numbers while loading', () => {
    render(<ProgressOverview summary={summary} isLoading />);

    expect(screen.queryByText('Words Learned')).not.toBeInTheDocument();
  });
});
