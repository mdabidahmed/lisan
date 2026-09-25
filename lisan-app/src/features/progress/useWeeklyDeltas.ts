import { useMemo } from 'react';

import { useProgressStore } from '@/store/progressStore';
import type { ProgressDeltas, ProgressSummary } from '@/types';

import { deriveWeeklyDeltas } from './weeklyDeltas';

/**
 * Week-over-week change for the four headline stat cards.
 *
 * `summary` is optional so the Progress page can call this alongside its other hooks while the
 * overview query is still in flight. No summary means no deltas, which is also what a learner
 * with no snapshot history gets.
 */
export function useWeeklyDeltas(summary: ProgressSummary | undefined): ProgressDeltas {
  const snapshots = useProgressStore((state) => state.snapshots);
  const totalAnswers = useProgressStore((state) => state.totalAnswers);

  return useMemo(() => {
    if (!summary) return {};

    return deriveWeeklyDeltas({
      summary: {
        wordsLearned: summary.wordsLearned,
        quizzesCompleted: summary.quizzesCompleted,
        accuracy: summary.accuracy,
        studyMinutes: summary.studyMinutes,
      },
      totalAnswers,
      snapshots,
    });
  }, [summary, totalAnswers, snapshots]);
}
