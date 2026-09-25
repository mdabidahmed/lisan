import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { api, type ProgressOverviewInput } from '@/services/api';
import { useBookmarkCount } from '@/store/bookmarksStore';
import { useProgressSummaryData, type ProgressSummaryData } from '@/store/progressStore';
import type { ProgressOverviewData } from '@/types';
import { hashString } from '@/utils';

import { LEARNER_DATA_STALE_TIME } from '../shared/staleTimes';
import { progressKeys } from './queryKeys';

/**
 * The dashboard is derived from browser-held state, so the query key carries a fingerprint of
 * that state. Answering a question changes the fingerprint, which is what makes the dashboard
 * update without any manual invalidation.
 */
function fingerprint(data: ProgressSummaryData, bookmarkCount: number): number {
  const words = Object.values(data.byWordId)
    .map(
      (entry) => `${entry.wordId}:${entry.status}:${entry.repetitions}:${entry.nextReviewAt ?? ''}`,
    )
    .sort()
    .join(',');

  return hashString(
    [
      words,
      data.studyDays.join(','),
      data.quizzesCompleted,
      data.studyMinutes,
      data.totalCorrect,
      data.totalAnswers,
      bookmarkCount,
    ].join('|'),
  );
}

export function useProgressOverview(): UseQueryResult<ProgressOverviewData> {
  const data = useProgressSummaryData();
  const bookmarkCount = useBookmarkCount();

  const input = useMemo<ProgressOverviewInput>(
    () => ({
      progressById: data.byWordId,
      studyDays: data.studyDays,
      quizzesCompleted: data.quizzesCompleted,
      studyMinutes: data.studyMinutes,
      totalCorrect: data.totalCorrect,
      totalAnswers: data.totalAnswers,
      bookmarkCount,
    }),
    [data, bookmarkCount],
  );
  const signature = useMemo(() => fingerprint(data, bookmarkCount), [data, bookmarkCount]);

  return useQuery({
    queryKey: [...progressKeys.overview, signature],
    queryFn: ({ signal }) => api.progress.getProgressOverview(input, { signal }),
    staleTime: LEARNER_DATA_STALE_TIME,
  });
}
