import { useMemo } from 'react';

import { useWordsByIds } from '@/features/vocabulary';
import { useProgressStore } from '@/store/progressStore';
import type { VocabularyWord } from '@/types/content';

export interface RecentWordsData {
  words: VocabularyWord[];
  isLoading: boolean;
}

/**
 * The words the learner touched most recently, newest first.
 *
 * `lastReviewedAt` is an ISO 8601 timestamp, so a plain string comparison already sorts it — no
 * `Date` parsing per entry.
 */
export function useRecentWords(limit: number): RecentWordsData {
  const byWordId = useProgressStore((state) => state.byWordId);

  const recentIds = useMemo(
    () =>
      Object.values(byWordId)
        .filter((entry) => entry.lastReviewedAt !== undefined)
        .sort((a, b) => (b.lastReviewedAt ?? '').localeCompare(a.lastReviewedAt ?? ''))
        .slice(0, limit)
        .map((entry) => entry.wordId),
    [byWordId, limit],
  );

  return useWordsByIds(recentIds);
}
