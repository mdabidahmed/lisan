import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { PracticeMode, Quiz, QuizConfig } from '@/types';

import { STATIC_CONTENT_STALE_TIME } from '../shared/staleTimes';
import { practiceKeys } from './queryKeys';

export function usePracticeModes(): UseQueryResult<PracticeMode[]> {
  return useQuery({
    queryKey: practiceKeys.modes,
    queryFn: ({ signal }) => api.practice.getPracticeModes({ signal }),
    staleTime: STATIC_CONTENT_STALE_TIME,
  });
}

/** Placeholder so the query key stays typed while the hook is disabled. */
const DISABLED_CONFIG: QuizConfig = {
  mode: 'multiple-choice',
  type: 'multiple-choice',
  questionCount: 0,
  difficulty: 'mixed',
};

/**
 * Quiz generation is seeded from the config, so caching it is safe: remounting the quiz screen
 * returns the same questions in the same order rather than silently reshuffling mid-session.
 */
export function useQuiz(config: QuizConfig | undefined): UseQueryResult<Quiz> {
  const resolved = config ?? DISABLED_CONFIG;

  return useQuery({
    queryKey: practiceKeys.quiz(resolved),
    queryFn: ({ signal }) => api.practice.getQuiz(resolved, { signal }),
    enabled: config !== undefined,
    staleTime: STATIC_CONTENT_STALE_TIME,
  });
}
