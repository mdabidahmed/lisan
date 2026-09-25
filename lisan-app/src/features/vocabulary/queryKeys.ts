import type { VocabularyQuery } from '@/types';

/**
 * Query keys are tuples so that `queryClient.invalidateQueries({ queryKey: wordKeys.all })`
 * invalidates every word query at once. TanStack hashes object members with sorted keys, so
 * passing the query object straight through is stable.
 */

export const categoryKeys = {
  all: ['categories'] as const,
  detail: (categoryId: string) => ['categories', 'detail', categoryId] as const,
  words: (categoryId: string, query?: VocabularyQuery) =>
    ['categories', 'words', categoryId, query ?? {}] as const,
};

export const wordKeys = {
  all: ['words'] as const,
  list: (query?: VocabularyQuery) => ['words', 'list', query ?? {}] as const,
  detail: (wordId: string) => ['words', 'detail', wordId] as const,
  search: (term: string) => ['words', 'search', term] as const,
  related: (wordId: string) => ['words', 'related', wordId] as const,
};
