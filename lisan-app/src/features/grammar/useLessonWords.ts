import { useQueries } from '@tanstack/react-query';

import { wordKeys } from '@/features/vocabulary/queryKeys';
import { api } from '@/services/api';
import type { VocabularyWord } from '@/types';

import { STATIC_CONTENT_STALE_TIME } from '../shared/staleTimes';

export interface LessonWordsResult {
  words: VocabularyWord[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * Resolves `GrammarLesson.relatedWordIds` to vocabulary entries.
 *
 * One query per id, keyed exactly like the word detail page, so opening a linked word afterwards
 * is already warm and a missing id only fails its own tile.
 */
export function useLessonWords(wordIds: readonly string[] = []): LessonWordsResult {
  return useQueries({
    queries: wordIds.map((wordId) => ({
      queryKey: wordKeys.detail(wordId),
      queryFn: ({ signal }: { signal: AbortSignal }) => api.words.getWord(wordId, { signal }),
      staleTime: STATIC_CONTENT_STALE_TIME,
    })),
    combine: (results): LessonWordsResult => ({
      words: results.flatMap((result) => (result.data === undefined ? [] : [result.data])),
      isLoading: results.some((result) => result.isLoading),
      isError: results.every((result) => result.isError) && results.length > 0,
    }),
  });
}
