import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { Paginated, VocabularyQuery, VocabularyWord } from '@/types';

import { LIST_STALE_TIME, STATIC_CONTENT_STALE_TIME } from '../shared/staleTimes';
import { useWordsRequest } from '../shared/useWordsRequest';
import { wordKeys } from './queryKeys';

export function useWords(query: VocabularyQuery = {}): UseQueryResult<Paginated<VocabularyWord>> {
  const { request, signature } = useWordsRequest(query);

  return useQuery({
    queryKey: [...wordKeys.list(query), signature],
    queryFn: ({ signal }) => api.words.getWords(request, { signal }),
    staleTime: LIST_STALE_TIME,
    // Keeps the previous page on screen while the next one loads, so the list never flashes.
    placeholderData: keepPreviousData,
  });
}

export function useWord(wordId: string | undefined): UseQueryResult<VocabularyWord> {
  return useQuery({
    queryKey: wordKeys.detail(wordId ?? ''),
    queryFn: ({ signal }) => api.words.getWord(wordId ?? '', { signal }),
    enabled: Boolean(wordId),
    staleTime: STATIC_CONTENT_STALE_TIME,
  });
}

export function useRelatedWords(wordId: string | undefined): UseQueryResult<VocabularyWord[]> {
  return useQuery({
    queryKey: wordKeys.related(wordId ?? ''),
    queryFn: ({ signal }) => api.words.getRelatedWords(wordId ?? '', { signal }),
    enabled: Boolean(wordId),
    staleTime: STATIC_CONTENT_STALE_TIME,
  });
}
