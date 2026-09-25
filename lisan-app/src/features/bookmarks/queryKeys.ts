import type { VocabularyQuery } from '@/types';

export const bookmarkKeys = {
  all: ['bookmarks'] as const,
  words: (query?: VocabularyQuery) => ['bookmarks', 'words', query ?? {}] as const,
};
