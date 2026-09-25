import { act, renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { useVocabularyFilters, type VocabularyFilters } from './useVocabularyFilters';

function wrapperFor(route: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(MemoryRouter, { initialEntries: [route] }, children);
  };
}

/** The hook plus the query string it is driving, so every assertion can check both directions. */
function renderFilters(route = '/vocabulary') {
  return renderHook(() => ({ filters: useVocabularyFilters(), search: useLocation().search }), {
    wrapper: wrapperFor(route),
  });
}

function paramsOf(search: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(search));
}

describe('useVocabularyFilters — reading the URL', () => {
  it('hydrates every filter from the query string', () => {
    const { result } = renderFilters(
      '/vocabulary?q=book&category=work-professions&level=B1&status=mastered&bookmarked=1&sort=recent&page=3',
    );
    const { filters } = result.current;

    expect(filters.search).toBe('book');
    expect(filters.categoryId).toBe('work-professions');
    expect(filters.level).toBe('B1');
    expect(filters.status).toBe('mastered');
    expect(filters.bookmarkedOnly).toBe(true);
    expect(filters.sort).toBe('recent');
    expect(filters.page).toBe(3);
    expect(filters.isFiltered).toBe(true);
  });

  it('feeds the hydrated values straight into the vocabulary query', () => {
    const { result } = renderFilters(
      '/vocabulary?q=book&category=work-professions&level=B1&status=mastered&bookmarked=1&sort=recent&page=2',
    );

    expect(result.current.filters.query).toMatchObject({
      q: 'book',
      categoryId: 'work-professions',
      level: 'B1',
      status: 'mastered',
      bookmarkedOnly: true,
      sort: 'recent',
      page: 2,
    });
  });

  it('falls back to safe defaults for values that are not in the union', () => {
    const { result } = renderFilters('/vocabulary?level=Z9&status=forgotten&sort=sideways&page=x');
    const { filters } = result.current;

    expect(filters.level).toBe('all');
    expect(filters.status).toBe('all');
    expect(filters.sort).toBe('curated');
    expect(filters.page).toBe(1);
    expect(filters.isFiltered).toBe(false);
  });
});

describe('useVocabularyFilters — writing the URL', () => {
  function apply(
    route: string,
    mutate: (filters: VocabularyFilters) => void,
  ): Record<string, string> {
    const { result } = renderFilters(route);
    act(() => {
      mutate(result.current.filters);
    });
    return paramsOf(result.current.search);
  }

  it('round-trips level, status, bookmarked and sort through the query string', () => {
    const { result } = renderFilters();

    act(() => {
      result.current.filters.setLevel('A2');
    });
    act(() => {
      result.current.filters.setStatus('learning');
    });
    act(() => {
      result.current.filters.setBookmarkedOnly(true);
    });
    act(() => {
      result.current.filters.setSort('most-practiced');
    });

    expect(paramsOf(result.current.search)).toEqual({
      level: 'A2',
      status: 'learning',
      bookmarked: '1',
      sort: 'most-practiced',
    });
    expect(result.current.filters.level).toBe('A2');
    expect(result.current.filters.status).toBe('learning');
    expect(result.current.filters.bookmarkedOnly).toBe(true);
    expect(result.current.filters.sort).toBe('most-practiced');
  });

  it('drops a filter from the URL when it is cleared', () => {
    expect(
      apply('/vocabulary?level=A2', (filters) => {
        filters.setLevel('all');
      }),
    ).toEqual({});

    expect(
      apply('/vocabulary?status=review', (filters) => {
        filters.setStatus('all');
      }),
    ).toEqual({});

    expect(
      apply('/vocabulary?bookmarked=1', (filters) => {
        filters.setBookmarkedOnly(false);
      }),
    ).toEqual({});
  });

  it('returns to page one whenever a filter changes, but not when paging', () => {
    expect(
      apply('/vocabulary?level=A2&page=4', (filters) => {
        filters.setStatus('mastered');
      }),
    ).toEqual({ level: 'A2', status: 'mastered' });

    expect(
      apply('/vocabulary?level=A2', (filters) => {
        filters.setPage(3);
      }),
    ).toEqual({ level: 'A2', page: '3' });
  });

  it('clears the whole query string on reset', () => {
    expect(
      apply(
        '/vocabulary?q=book&level=B1&status=review&bookmarked=1&sort=recent&page=2',
        (filters) => {
          filters.reset();
        },
      ),
    ).toEqual({});
  });
});
