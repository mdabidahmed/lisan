import type { PracticeMode, Quiz, QuizConfig, RequestOptions } from '@/types';

import { apiClient } from '../client';

export function getPracticeModes(options?: RequestOptions): Promise<PracticeMode[]> {
  return apiClient.get<PracticeMode[]>('/practice/modes', undefined, options);
}

/** Deterministic for a given config, so the same quiz can be cached and replayed. */
export function getQuiz(config: QuizConfig, options?: RequestOptions): Promise<Quiz> {
  return apiClient.post<Quiz>('/practice/quiz', config, options);
}
