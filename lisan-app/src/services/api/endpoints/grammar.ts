import type { GrammarLesson, RequestOptions } from '@/types';

import { apiClient } from '../client';

export function getGrammarLessons(options?: RequestOptions): Promise<GrammarLesson[]> {
  return apiClient.get<GrammarLesson[]>('/grammar', undefined, options);
}

export function getGrammarLesson(
  lessonId: string,
  options?: RequestOptions,
): Promise<GrammarLesson> {
  return apiClient.get<GrammarLesson>(
    `/grammar/${encodeURIComponent(lessonId)}`,
    undefined,
    options,
  );
}
