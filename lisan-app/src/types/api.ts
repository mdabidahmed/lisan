import type { CEFRLevel } from './content';
import type { WordStatus } from './progress';

/** Cursor-free page envelope. Cursor pagination can be added without changing call sites. */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * `curated` is the default: each category's words in the deliberate teaching order they were
 * authored in (a greeting flow, a counting sequence) rather than a sort. `a-z` is true alphabetical
 * for a learner who wants that instead.
 */
export type VocabularySort = 'curated' | 'a-z' | 'recent' | 'most-practiced';

export interface VocabularyQuery {
  q?: string;
  categoryId?: string;
  level?: CEFRLevel;
  status?: WordStatus;
  partOfSpeech?: string;
  bookmarkedIds?: readonly string[];
  bookmarkedOnly?: boolean;
  sort?: VocabularySort;
  page?: number;
  pageSize?: number;
}

export type ApiErrorCode =
  'not_found' | 'bad_request' | 'aborted' | 'network' | 'timeout' | 'unknown';

export interface RequestOptions {
  signal?: AbortSignal;
}
