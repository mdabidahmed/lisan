import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { VOCABULARY_PAGE_SIZE } from '@/constants/app';
import type { VocabularyQuery, VocabularySort } from '@/types/api';
import { CEFR_LEVELS, type CEFRLevel } from '@/types/content';
import { WORD_STATUSES, type WordStatus } from '@/types/progress';

const SORTS: readonly VocabularySort[] = ['curated', 'a-z', 'recent', 'most-practiced'];

function asLevel(value: string | null): CEFRLevel | undefined {
  return value && (CEFR_LEVELS as readonly string[]).includes(value)
    ? (value as CEFRLevel)
    : undefined;
}

function asSort(value: string | null): VocabularySort {
  return value && (SORTS as readonly string[]).includes(value)
    ? (value as VocabularySort)
    : 'curated';
}

function asStatus(value: string | null): WordStatus | undefined {
  return value && (WORD_STATUSES as readonly string[]).includes(value)
    ? (value as WordStatus)
    : undefined;
}

export interface VocabularyFilters {
  query: VocabularyQuery;
  search: string;
  categoryId: string;
  level: CEFRLevel | 'all';
  status: WordStatus | 'all';
  bookmarkedOnly: boolean;
  sort: VocabularySort;
  page: number;
  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  setLevel: (value: string) => void;
  setStatus: (value: string) => void;
  setBookmarkedOnly: (value: boolean) => void;
  setSort: (value: string) => void;
  setPage: (value: number) => void;
  reset: () => void;
  isFiltered: boolean;
}

/**
 * Filter state lives in the URL so a filtered list is shareable, survives a reload, and works with
 * browser back/forward — which also keeps the page ready for server-side search later.
 */
export function useVocabularyFilters(): VocabularyFilters {
  const [params, setParams] = useSearchParams();

  const search = params.get('q') ?? '';
  const categoryId = params.get('category') ?? 'all';
  const levelParam = asLevel(params.get('level'));
  const statusParam = asStatus(params.get('status'));
  const bookmarkedOnly = params.get('bookmarked') === '1';
  const sort = asSort(params.get('sort'));
  const page = Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1);

  const update = useCallback(
    (patch: Record<string, string | null>, { resetPage = true } = {}) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(patch)) {
            if (value === null || value === '' || value === 'all') next.delete(key);
            else next.set(key, value);
          }
          if (resetPage) next.delete('page');
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const query = useMemo<VocabularyQuery>(
    () => ({
      ...(search ? { q: search } : {}),
      ...(categoryId !== 'all' ? { categoryId } : {}),
      ...(levelParam ? { level: levelParam } : {}),
      ...(statusParam ? { status: statusParam } : {}),
      ...(bookmarkedOnly ? { bookmarkedOnly: true } : {}),
      sort,
      page,
      pageSize: VOCABULARY_PAGE_SIZE,
    }),
    [search, categoryId, levelParam, statusParam, bookmarkedOnly, sort, page],
  );

  return {
    query,
    search,
    categoryId,
    level: levelParam ?? 'all',
    status: statusParam ?? 'all',
    bookmarkedOnly,
    sort,
    page,
    isFiltered:
      Boolean(search) ||
      categoryId !== 'all' ||
      Boolean(levelParam) ||
      Boolean(statusParam) ||
      bookmarkedOnly,
    setSearch: useCallback(
      (value: string) => {
        update({ q: value });
      },
      [update],
    ),
    setCategory: useCallback(
      (value: string) => {
        update({ category: value });
      },
      [update],
    ),
    setLevel: useCallback(
      (value: string) => {
        update({ level: value });
      },
      [update],
    ),
    setStatus: useCallback(
      (value: string) => {
        update({ status: value });
      },
      [update],
    ),
    setBookmarkedOnly: useCallback(
      (value: boolean) => {
        update({ bookmarked: value ? '1' : null });
      },
      [update],
    ),
    setSort: useCallback(
      (value: string) => {
        update({ sort: value });
      },
      [update],
    ),
    setPage: useCallback(
      (value: number) => {
        update({ page: String(value) }, { resetPage: false });
      },
      [update],
    ),
    reset: useCallback(() => {
      setParams(new URLSearchParams(), { replace: true });
    }, [setParams]),
  };
}
