import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { VocabularyWord } from '@/types';

import { SEARCH_STALE_TIME } from '../shared/staleTimes';
import { wordKeys } from './queryKeys';

export interface SearchWordsOptions {
  limit?: number | undefined;
  enabled?: boolean | undefined;
}

/**
 * Typeahead search across English, Arabic and transliteration (spec §31). Callers pass an already
 * debounced term — `SearchBox` and `useDebouncedValue` handle that — so this only caches results.
 */
export function useSearchWords(
  term: string,
  options: SearchWordsOptions = {},
): UseQueryResult<VocabularyWord[]> {
  const trimmed = term.trim();
  const limit = options.limit ?? 10;

  return useQuery({
    queryKey: [...wordKeys.search(trimmed), limit],
    queryFn: ({ signal }) => api.words.searchWords(trimmed, limit, { signal }),
    enabled: (options.enabled ?? true) && trimmed.length > 0,
    staleTime: SEARCH_STALE_TIME,
    placeholderData: keepPreviousData,
  });
}
