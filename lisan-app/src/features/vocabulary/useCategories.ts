import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { Category, Paginated, VocabularyQuery, VocabularyWord } from '@/types';

import { LIST_STALE_TIME, STATIC_CONTENT_STALE_TIME } from '../shared/staleTimes';
import { useWordsRequest } from '../shared/useWordsRequest';
import { categoryKeys } from './queryKeys';

export function useCategories(): UseQueryResult<Category[]> {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: ({ signal }) => api.categories.getCategories({ signal }),
    staleTime: STATIC_CONTENT_STALE_TIME,
  });
}

export function useCategory(categoryId: string | undefined): UseQueryResult<Category> {
  return useQuery({
    queryKey: categoryKeys.detail(categoryId ?? ''),
    queryFn: ({ signal }) => api.categories.getCategory(categoryId ?? '', { signal }),
    enabled: Boolean(categoryId),
    staleTime: STATIC_CONTENT_STALE_TIME,
  });
}

export function useCategoryWords(
  categoryId: string | undefined,
  query: VocabularyQuery = {},
): UseQueryResult<Paginated<VocabularyWord>> {
  const { request, signature } = useWordsRequest(query);

  return useQuery({
    queryKey: [...categoryKeys.words(categoryId ?? '', query), signature],
    queryFn: ({ signal }) => api.categories.getCategoryWords(categoryId ?? '', request, { signal }),
    enabled: Boolean(categoryId),
    staleTime: LIST_STALE_TIME,
    // Paging must not blank the list out (spec §64).
    placeholderData: keepPreviousData,
  });
}
