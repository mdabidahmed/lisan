import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { DerivedAchievement } from '@/features/progress/achievements';

import { AchievementList } from './AchievementList';

const EARNED: DerivedAchievement = {
  id: 'first-steps',
  title: 'First Steps',
  description: 'Learn your first 10 words',
  icon: 'goal',
  unlocked: true,
  state: 'earned',
  progress: { current: 10, target: 10 },
  progressLabel: '10/10',
};

const IN_PROGRESS: DerivedAchievement = {
  id: 'word-explorer',
  title: 'Word Explorer',
  description: 'Learn 100 words',
  icon: 'vocabulary',
  unlocked: false,
  state: 'in-progress',
  progress: { current: 24, target: 100 },
  progressLabel: '24/100',
};

const LOCKED: DerivedAchievement = {
  id: 'streak-keeper',
  title: 'Streak Keeper',
  description: 'Study 7 days in a row',
  icon: 'streak',
  unlocked: false,
  state: 'locked',
  progress: { current: 0, target: 7 },
  progressLabel: '0/7',
};

function rowFor(title: string): HTMLElement {
  const row = screen.getByText(title).closest('li');
  if (!row) throw new Error(`No row for "${title}"`);
  return row;
}

describe('<AchievementList />', () => {
  it('marks an earned badge with a check, not colour alone', () => {
    render(<AchievementList achievements={[EARNED]} />);

    const row = rowFor('First Steps');
    expect(within(row).getByText('Earned')).toBeInTheDocument();
    expect(within(row).queryByRole('progressbar')).not.toBeInTheDocument();
    expect(within(row).queryByText('10/10')).not.toBeInTheDocument();
  });

  it('shows how far along an outstanding badge is', () => {
    render(<AchievementList achievements={[IN_PROGRESS]} />);

    const row = rowFor('Word Explorer');
    expect(within(row).getByText('24/100')).toBeInTheDocument();

    const bar = within(row).getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '24');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-label', 'Word Explorer: 24/100');
  });

  it('still shows the target for a badge with no progress yet', () => {
    render(<AchievementList achievements={[LOCKED]} />);

    const row = rowFor('Streak Keeper');
    expect(row).toHaveAttribute('data-state', 'locked');
    expect(within(row).getByText('0/7')).toBeInTheDocument();
    expect(within(row).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('renders every state together', () => {
    render(<AchievementList achievements={[EARNED, IN_PROGRESS, LOCKED]} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getAllByRole('progressbar')).toHaveLength(2);
    expect(screen.getAllByText('Earned')).toHaveLength(1);
  });

  it('explains an empty list instead of rendering nothing', () => {
    render(<AchievementList achievements={[]} />);

    expect(screen.getByText('No badges yet')).toBeInTheDocument();
  });
});
