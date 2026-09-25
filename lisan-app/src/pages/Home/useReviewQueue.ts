import { useMemo } from 'react';

import { useDueWords } from '@/features/progress';
import { useWordsByIds } from '@/features/vocabulary';
import type { VocabularyWord } from '@/types/content';

export interface ReviewQueueData {
  /** The first `limit` due words, oldest due first. */
  words: VocabularyWord[];
  /** Everything the schedule says is due, so the card can say how much is hidden. */
  total: number;
  isLoading: boolean;
}

/**
 * The dashboard review queue. `useDueWords` returns ids in schedule order, so the slice happens
 * here and only the visible words are resolved to full records.
 */
export function useReviewQueue(limit: number): ReviewQueueData {
  const { data: dueIds, isLoading: idsLoading } = useDueWords();
  const visibleIds = useMemo(() => (dueIds ?? []).slice(0, limit), [dueIds, limit]);
  const { words, isLoading } = useWordsByIds(visibleIds);

  return {
    words,
    total: dueIds?.length ?? 0,
    isLoading: idsLoading || isLoading,
  };
}
