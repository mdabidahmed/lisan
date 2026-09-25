import { useQueries, type QueryFunctionContext, type UseQueryResult } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { VocabularyWord } from '@/types';

import { STATIC_CONTENT_STALE_TIME } from '../shared/staleTimes';
import { wordKeys } from './queryKeys';

export interface WordsByIdsResult {
  words: VocabularyWord[];
  isLoading: boolean;
}

type DetailKey = ReturnType<typeof wordKeys.detail>;

/**
 * Ids that reach an id in persisted learner state may no longer exist in the content library, so a
 * word that fails to resolve is dropped rather than failing the whole strip.
 */
function combine(results: readonly UseQueryResult<VocabularyWord>[]): WordsByIdsResult {
  return {
    words: results.flatMap((result) => (result.data ? [result.data] : [])),
    isLoading: results.some((result) => result.isLoading),
  };
}

/**
 * Resolves a list of word ids — the shape the review queue and the recently-studied strip work in
 * — into full words, in the order given.
 *
 * It reuses `wordKeys.detail`, so each entry shares a cache slot with `useWord` and opening a word
 * from either surface is already warm.
 */
export function useWordsByIds(wordIds: readonly string[]): WordsByIdsResult {
  return useQueries({
    queries: wordIds.map((wordId) => ({
      queryKey: wordKeys.detail(wordId),
      queryFn: ({ signal }: QueryFunctionContext<DetailKey>) =>
        api.words.getWord(wordId, { signal }),
      staleTime: STATIC_CONTENT_STALE_TIME,
    })),
    combine,
  });
}
