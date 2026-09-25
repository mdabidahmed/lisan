import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { VocabularyFilters, type VocabularyFiltersProps } from './VocabularyFilters';

function setup(overrides: Partial<VocabularyFiltersProps> = {}) {
  const handlers = {
    onLevelChange: vi.fn(),
    onStatusChange: vi.fn(),
    onBookmarkedOnlyChange: vi.fn(),
    onSortChange: vi.fn(),
    onReset: vi.fn(),
  };

  const props: VocabularyFiltersProps = {
    level: 'all',
    status: 'all',
    bookmarkedOnly: false,
    sort: 'curated',
    ...handlers,
    ...overrides,
  };

  const view = render(<VocabularyFilters {...props} />);

  return {
    ...handlers,
    user: userEvent.setup(),
    /** Stands in for the URL state changing after a control fires. */
    rerender: (next: Partial<VocabularyFiltersProps>) => {
      view.rerender(<VocabularyFilters {...props} {...next} />);
    },
  };
}

function sortOptions(): [string, string][] {
  const select = screen.getByRole('combobox', { name: 'Sort by' });
  return Array.from(select.querySelectorAll('option')).map((option) => [
    option.value,
    option.textContent,
  ]);
}

describe('VocabularyFilters', () => {
  it('groups every CEFR level under one labelled group', () => {
    setup();

    expect(screen.getByRole('group', { name: 'Level' })).toBeInTheDocument();
    for (const level of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) {
      expect(screen.getByRole('button', { name: level })).toBeInTheDocument();
    }
  });

  it('offers the curated default plus the three sorts the spec calls for', () => {
    setup();

    expect(sortOptions()).toEqual([
      ['curated', 'Suggested'],
      ['a-z', 'A–Z'],
      ['recent', 'Recently Added'],
      ['most-practiced', 'Most Practiced'],
    ]);
  });

  it('selects a level, then clears it when the pressed chip is pressed again', async () => {
    const { onLevelChange, rerender, user } = setup();

    await user.click(screen.getByRole('button', { name: 'B2' }));
    expect(onLevelChange).toHaveBeenLastCalledWith('B2');

    rerender({ level: 'B2' });
    expect(screen.getByRole('button', { name: 'B2' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'B2' }));
    expect(onLevelChange).toHaveBeenLastCalledWith('all');
  });

  it('treats the status chips as one-of-many toggles', async () => {
    const { onStatusChange, user } = setup({ status: 'learning' });

    expect(screen.getByRole('button', { name: 'Learning' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Mastered' }));
    expect(onStatusChange).toHaveBeenLastCalledWith('mastered');

    await user.click(screen.getByRole('button', { name: 'Learning' }));
    expect(onStatusChange).toHaveBeenLastCalledWith('all');
  });

  it('toggles the bookmark filter on and off', async () => {
    const { onBookmarkedOnlyChange, rerender, user } = setup();

    await user.click(screen.getByRole('button', { name: 'Bookmarked' }));
    expect(onBookmarkedOnlyChange).toHaveBeenLastCalledWith(true);

    rerender({ bookmarkedOnly: true });
    await user.click(screen.getByRole('button', { name: 'Bookmarked' }));
    expect(onBookmarkedOnlyChange).toHaveBeenLastCalledWith(false);
  });

  it('only shows the reset control while something is filtered', async () => {
    const { onReset, rerender, user } = setup();

    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();

    rerender({ isFiltered: true });
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
