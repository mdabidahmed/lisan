import type { Paginated, RequestOptions, VocabularyWord } from '@/types';

import { apiClient } from '../client';
import type { WordsQuery } from '../types';

export function getWord(wordId: string, options?: RequestOptions): Promise<VocabularyWord> {
  return apiClient.get<VocabularyWord>(`/words/${encodeURIComponent(wordId)}`, undefined, options);
}

/**
 * Listing is a POST because filtering by learner status needs the browser-held SRS state. Against
 * a real backend the session supplies it and this becomes `GET /words?status=…`.
 */
export function getWords(
  query: WordsQuery = {},
  options?: RequestOptions,
): Promise<Paginated<VocabularyWord>> {
  return apiClient.post<Paginated<VocabularyWord>>('/words/query', query, options);
}

export function searchWords(
  term: string,
  limit = 10,
  options?: RequestOptions,
): Promise<VocabularyWord[]> {
  return apiClient.get<VocabularyWord[]>('/words/search', { q: term, limit }, options);
}

export function getRelatedWords(
  wordId: string,
  options?: RequestOptions,
): Promise<VocabularyWord[]> {
  return apiClient.get<VocabularyWord[]>(
    `/words/${encodeURIComponent(wordId)}/related`,
    undefined,
    options,
  );
}
