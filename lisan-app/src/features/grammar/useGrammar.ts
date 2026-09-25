import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { GrammarLesson } from '@/types';

import { STATIC_CONTENT_STALE_TIME } from '../shared/staleTimes';
import { grammarKeys } from './queryKeys';

export function useGrammarLessons(): UseQueryResult<GrammarLesson[]> {
  return useQuery({
    queryKey: grammarKeys.all,
    queryFn: ({ signal }) => api.grammar.getGrammarLessons({ signal }),
    staleTime: STATIC_CONTENT_STALE_TIME,
  });
}

export function useGrammarLesson(lessonId: string | undefined): UseQueryResult<GrammarLesson> {
  return useQuery({
    queryKey: grammarKeys.detail(lessonId ?? ''),
    queryFn: ({ signal }) => api.grammar.getGrammarLesson(lessonId ?? '', { signal }),
    enabled: Boolean(lessonId),
    staleTime: STATIC_CONTENT_STALE_TIME,
  });
}
