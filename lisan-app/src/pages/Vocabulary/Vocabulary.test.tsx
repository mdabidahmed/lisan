import { render, screen, waitFor } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppProviders } from '@/app/providers';
import { useBookmarksStore } from '@/store/bookmarksStore';
import { useProgressStore } from '@/store/progressStore';
import { createTestQueryClient } from '@/test';

import { VocabularyPage } from './Vocabulary';

/** Sits outside `Routes` so the query string is still readable after the page navigates away. */
function LocationProbe() {
  const { pathname, search } = useLocation();
  return (
    <>
      <span data-testid="pathname">{pathname}</span>
      <span data-testid="search">{search}</span>
    </>
  );
}

function renderVocabulary(route = '/vocabulary'): { user: UserEvent } {
  render(
    <AppProviders queryClient={createTestQueryClient()}>
      <MemoryRouter initialEntries={[route]}>
        <LocationProbe />
        <Routes>
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/vocabulary/:wordId" element={<h1>Word detail stub</h1>} />
        </Routes>
      </MemoryRouter>
    </AppProviders>,
  );
  return { user: userEvent.setup() };
}

function search(): URLSearchParams {
  return new URLSearchParams(screen.getByTestId('search').textContent);
}

function pathname(): string {
  return screen.getByTestId('pathname').textContent;
}

/** `Showing 6 of 18 words` — the only place the page reports the size of the filtered set. */
async function countLine(): Promise<string> {
  return (await screen.findByText(/Showing \d+ of \d+ words/)).textContent;
}

/**
 * A row's accessible name is its Arabic, transliteration, meaning and category — run together,
 * since jsdom has no layout to separate the stacked spans. Anchoring on the trailing category
 * keeps the match off the row's own "Add Engineer to bookmarks" control.
 */
function rowMatcher(english: string): RegExp {
  return new RegExp(`${english}\\s*Work & Professions$`);
}

function row(english: string): HTMLElement | null {
  return screen.queryByRole('button', { name: rowMatcher(english) });
}

beforeEach(() => {
  useProgressStore.setState({ byWordId: {} });
  useBookmarksStore.setState({ ids: [] });
});

describe('VocabularyPage — level filter', () => {
  it('narrows the list and records the level in the URL', async () => {
    const { user } = renderVocabulary('/vocabulary?category=work-professions');

    expect(await countLine()).toBe('Showing 6 of 18 words');
    expect(row('Engineer')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'A1' }));

    await waitFor(() => {
      expect(search().get('level')).toBe('A1');
    });
    expect(await countLine()).toBe('Showing 4 of 4 words');
    expect(row('Teacher')).toBeInTheDocument();
    // Engineer is A2, so it must drop out of a work-professions + A1 combination.
    expect(row('Engineer')).not.toBeInTheDocument();
  });

  it('restores the pressed chip from the URL on load', async () => {
    renderVocabulary('/vocabulary?category=work-professions&level=B1');

    expect(await countLine()).toBe('Showing 6 of 7 words');
    expect(screen.getByRole('button', { name: 'B1' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'A1' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('clears the level when the pressed chip is pressed again', async () => {
    const { user } = renderVocabulary('/vocabulary?category=work-professions&level=A1');

    expect(await countLine()).toBe('Showing 4 of 4 words');

    await user.click(screen.getByRole('button', { name: 'A1' }));

    await waitFor(() => {
      expect(search().has('level')).toBe(false);
    });
    expect(await countLine()).toBe('Showing 6 of 18 words');
  });

  it('resets to page one when the level changes', async () => {
    const { user } = renderVocabulary('/vocabulary?category=work-professions&page=3');

    await screen.findByText(/Showing \d+ of 18 words/);
    await user.click(screen.getByRole('button', { name: 'A1' }));

    await waitFor(() => {
      expect(search().has('page')).toBe(false);
    });
  });
});

describe('VocabularyPage — sort control', () => {
  it('reorders the results and records the sort in the URL', async () => {
    const { user } = renderVocabulary('/vocabulary?category=work-professions');

    await countLine();
    // Alphabetically, page one of Work & Professions starts at Computer and stops before Journalist.
    expect(row('Computer')).toBeInTheDocument();
    expect(row('Journalist')).not.toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'recent');

    await waitFor(() => {
      expect(search().get('sort')).toBe('recent');
    });
    // Journalist is the last word authored in the category, so it leads the "Recently Added" page.
    expect(
      await screen.findByRole('button', { name: rowMatcher('Journalist') }),
    ).toBeInTheDocument();
  });

  it('restores the selected sort from the URL on load', async () => {
    renderVocabulary('/vocabulary?category=work-professions&sort=most-practiced');

    await countLine();
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toHaveValue('most-practiced');
  });
});

describe('VocabularyPage — status and bookmark toggles', () => {
  it('filters to words the learner has started', async () => {
    useProgressStore.setState({
      byWordId: {
        teacher: {
          wordId: 'teacher',
          status: 'learning',
          correctAnswers: 2,
          incorrectAnswers: 1,
          repetitions: 1,
          intervalDays: 1,
        },
      },
    });

    const { user } = renderVocabulary('/vocabulary?category=work-professions');
    await countLine();

    await user.click(screen.getByRole('button', { name: 'Learning' }));

    await waitFor(() => {
      expect(search().get('status')).toBe('learning');
    });
    expect(await countLine()).toBe('Showing 1 of 1 words');
    expect(row('Teacher')).toBeInTheDocument();
  });

  it('filters to bookmarked words only', async () => {
    useBookmarksStore.setState({ ids: ['doctor', 'student'] });

    const { user } = renderVocabulary('/vocabulary?category=work-professions');
    await countLine();

    await user.click(screen.getByRole('button', { name: 'Bookmarked' }));

    await waitFor(() => {
      expect(search().get('bookmarked')).toBe('1');
    });
    expect(await countLine()).toBe('Showing 2 of 2 words');
    expect(row('Doctor')).toBeInTheDocument();
    expect(row('Engineer')).not.toBeInTheDocument();
  });
});

describe('VocabularyPage — a filter combination with no matches', () => {
  it('explains the empty result and offers a reset that restores the full list', async () => {
    const { user } = renderVocabulary('/vocabulary?category=work-professions&status=mastered');

    expect(await screen.findByText('No words match these filters')).toBeInTheDocument();
    expect(screen.queryByText(/Showing \d+ of \d+ words/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear all filters' }));

    await waitFor(() => {
      expect(search().toString()).toBe('');
    });
    expect(await countLine()).toBe('Showing 6 of 352 words');
  });

  it('offers the same reset from the filter bar while any filter is active', async () => {
    const { user } = renderVocabulary('/vocabulary?level=C2&status=mastered&bookmarked=1');

    await user.click(await screen.findByRole('button', { name: 'Clear filters' }));

    await waitFor(() => {
      expect(search().toString()).toBe('');
    });
  });

  it('hides the reset control when nothing is filtered', async () => {
    renderVocabulary();

    await countLine();
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
  });
});

describe('VocabularyPage — row interaction contract', () => {
  it('opens the word detail when the row is clicked', async () => {
    const { user } = renderVocabulary('/vocabulary?category=work-professions');

    await countLine();
    await user.click(await screen.findByRole('button', { name: rowMatcher('Doctor') }));

    await waitFor(() => {
      expect(pathname()).toBe('/vocabulary/doctor');
    });
  });

  it('bookmarks from the row without leaving the list', async () => {
    const { user } = renderVocabulary('/vocabulary?category=work-professions');

    await countLine();
    await user.click(screen.getByRole('button', { name: 'Add Doctor to bookmarks' }));

    await waitFor(() => {
      expect(useBookmarksStore.getState().ids).toEqual(['doctor']);
    });
    expect(pathname()).toBe('/vocabulary');
    expect(
      screen.getByRole('button', { name: 'Remove Doctor from bookmarks' }),
    ).toBeInTheDocument();
  });
});
