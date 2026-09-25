import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { api } from '@/services/api';
import { useProgressStore } from '@/store/progressStore';
import { hashString } from '@/utils';

import { LEARNER_DATA_STALE_TIME } from '../shared/staleTimes';
import { progressKeys } from './queryKeys';

export interface DueWordsOptions {
  limit?: number | undefined;
}

/** Word ids the spaced-repetition schedule says are due now. */
export function useDueWords(options: DueWordsOptions = {}): UseQueryResult<string[]> {
  const progressById = useProgressStore((state) => state.byWordId);
  const limit = options.limit;

  const signature = useMemo(
    () =>
      hashString(
        Object.values(progressById)
          .map((entry) => `${entry.wordId}:${entry.nextReviewAt ?? ''}`)
          .sort()
          .join(','),
      ),
    [progressById],
  );

  return useQuery({
    queryKey: [...progressKeys.due, signature, limit ?? 0],
    queryFn: ({ signal }) =>
      api.progress.getDueWords(
        { progressById, ...(limit === undefined ? {} : { limit }) },
        { signal },
      ),
    staleTime: LEARNER_DATA_STALE_TIME,
  });
}
