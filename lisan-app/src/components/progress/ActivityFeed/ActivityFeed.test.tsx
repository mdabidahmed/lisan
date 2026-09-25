import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ActivityEntry } from '@/types/progress';

import { ActivityFeed } from './ActivityFeed';

const NOW = new Date('2026-09-21T12:00:00.000Z');

const ENTRIES: ActivityEntry[] = [
  {
    id: 'a1',
    type: 'words-learned',
    label: 'Learned 5 new words in Professions',
    at: '2026-09-21T10:00:00.000Z',
    icon: 'vocabulary',
    accent: 'blue',
  },
  {
    id: 'a2',
    type: 'quiz-completed',
    label: 'Completed a quiz (Score: 90%)',
    detail: '9 of 10 correct',
    at: '2026-09-21T07:00:00.000Z',
    icon: 'quiz',
    accent: 'purple',
  },
];

describe('<ActivityFeed />', () => {
  it('renders each entry with a relative timestamp the design asks for', () => {
    render(<ActivityFeed entries={ENTRIES} now={NOW} />);

    expect(screen.getByText('Learned 5 new words in Professions')).toBeInTheDocument();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    expect(screen.getByText('5 hours ago')).toBeInTheDocument();
  });

  it('keeps the machine-readable timestamp on the time element', () => {
    render(<ActivityFeed entries={ENTRIES} now={NOW} />);

    expect(screen.getByText('2 hours ago')).toHaveAttribute('datetime', '2026-09-21T10:00:00.000Z');
  });

  it('shows the optional detail line when an entry has one', () => {
    render(<ActivityFeed entries={ENTRIES} now={NOW} />);

    expect(screen.getByText('9 of 10 correct')).toBeInTheDocument();
  });

  it('explains an empty feed', () => {
    render(<ActivityFeed entries={[]} />);

    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    expect(screen.getByText(/Learn a word or take a quiz/)).toBeInTheDocument();
  });
});
