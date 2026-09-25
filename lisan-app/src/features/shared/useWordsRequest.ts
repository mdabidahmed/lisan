import { useMemo } from 'react';

import type { WordsQuery } from '@/services/api';
import { useBookmarkIds } from '@/store/bookmarksStore';
import { useProgressStore } from '@/store/progressStore';
import type { VocabularyQuery, WordProgress } from '@/types';
import { hashString } from '@/utils';

const EMPTY_PROGRESS: Record<string, WordProgress> = {};

export interface WordsRequest {
  /** What the API is actually called with, including local learner state. */
  request: WordsQuery;
  /** Fingerprint of that learner state; appended to the query key so caches invalidate. */
  signature: number;
}

/**
 * Folds browser-held learner state into a vocabulary query.
 *
 * Filtering by status and sorting by "most practiced" need the SRS record, and `bookmarkedOnly`
 * needs the bookmark list — none of which the content API knows about while there is no backend.
 * Pulling them in here keeps every page calling `useWords(query)` and nothing else.
 */
export function useWordsRequest(query: VocabularyQuery = {}): WordsRequest {
  const needsProgress = query.status !== undefined || query.sort === 'most-practiced';
  const needsBookmarks = query.bookmarkedOnly === true && query.bookmarkedIds === undefined;

  const progressById = useProgressStore((state) =>
    needsProgress ? state.byWordId : EMPTY_PROGRESS,
  );
  const bookmarkIds = useBookmarkIds();

  return useMemo(() => {
    const ids = needsBookmarks ? bookmarkIds : query.bookmarkedIds;

    const request: WordsQuery = {
      ...query,
      ...(needsProgress ? { progressById } : {}),
      ...(ids ? { bookmarkedIds: ids } : {}),
    };

    const progressPart = needsProgress
      ? Object.values(progressById)
          .map(
            (entry) =>
              `${entry.wordId}:${entry.status}:${entry.correctAnswers + entry.incorrectAnswers}`,
          )
          .sort()
          .join(',')
      : '';

    return {
      request,
      signature: hashString(`${progressPart}|${ids ? [...ids].join(',') : ''}`),
    };
  }, [query, needsProgress, needsBookmarks, progressById, bookmarkIds]);
}
