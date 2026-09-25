import type { Category, Paginated, RequestOptions, VocabularyWord } from '@/types';

import { apiClient } from '../client';
import type { WordsQuery } from '../types';

export function getCategories(options?: RequestOptions): Promise<Category[]> {
  return apiClient.get<Category[]>('/categories', undefined, options);
}

export function getCategory(categoryId: string, options?: RequestOptions): Promise<Category> {
  return apiClient.get<Category>(
    `/categories/${encodeURIComponent(categoryId)}`,
    undefined,
    options,
  );
}

export function getCategoryWords(
  categoryId: string,
  query: WordsQuery = {},
  options?: RequestOptions,
): Promise<Paginated<VocabularyWord>> {
  return apiClient.post<Paginated<VocabularyWord>>(
    `/categories/${encodeURIComponent(categoryId)}/words`,
    query,
    options,
  );
}
