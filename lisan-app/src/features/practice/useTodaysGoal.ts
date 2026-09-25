/**
 * "Today's Goal" on the Practice page (reference screen 4).
 *
 * The target is the learner's daily goal setting; the tally is the number of words whose most
 * recent review happened today and passed. `srsService` resets `repetitions` to 0 on a lapse, so
 * a positive count is exactly "the last thing I did with this word today was get it right" —
 * which is the honest reading of "answer N questions correctly" across several sessions.
 */
import { useMemo } from 'react';

import { useProgressStore } from '@/store/progressStore';
import { useSetting } from '@/store/settingsStore';
import { clampPercent, toDateKey } from '@/utils';

export interface TodaysGoalView {
  correctToday: number;
  target: number;
  /** 0–100. */
  percent: number;
}

export function useTodaysGoal(): TodaysGoalView {
  const byWordId = useProgressStore((state) => state.byWordId);
  const target = useSetting('dailyGoal');

  const correctToday = useMemo(() => {
    const today = toDateKey();
    return Object.values(byWordId).filter(
      (entry) =>
        entry.lastReviewedAt !== undefined &&
        entry.repetitions > 0 &&
        toDateKey(entry.lastReviewedAt) === today,
    ).length;
  }, [byWordId]);

  return {
    correctToday,
    target,
    percent: clampPercent((correctToday / Math.max(1, target)) * 100),
  };
}
