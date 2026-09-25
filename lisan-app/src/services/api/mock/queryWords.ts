import { VOCABULARY_PAGE_SIZE } from '@/constants';
import type { Paginated, VocabularyWord, WordProgress } from '@/types';

import { getAllWords, getWordsForCategory } from '../contentSource';
import type { WordsQuery } from '../types';
import { matchesSearch } from './searchIndex';

/** Authored order doubles as recency: later entries were added later. */
let authoredOrder: Map<string, number> | null = null;

function orderOf(wordId: string): number {
  if (!authoredOrder) {
    authoredOrder = new Map<string, number>();
    getAllWords().forEach((word, position) => authoredOrder?.set(word.id, position));
  }
  return authoredOrder.get(wordId) ?? 0;
}

function practiceCount(progress: WordProgress | undefined): number {
  if (!progress) return 0;
  return progress.correctAnswers + progress.incorrectAnswers;
}

export function paginate<T>(
  items: readonly T[],
  page = 1,
  pageSize = VOCABULARY_PAGE_SIZE,
): Paginated<T> {
  const size = Math.max(1, Math.trunc(pageSize));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const current = Math.min(Math.max(1, Math.trunc(page)), totalPages);
  const start = (current - 1) * size;

  return {
    items: items.slice(start, start + size),
    page: current,
    pageSize: size,
    total,
    totalPages,
    hasMore: current < totalPages,
  };
}

export function filterWords(query: WordsQuery): VocabularyWord[] {
  const base = query.categoryId ? getWordsForCategory(query.categoryId) : getAllWords();
  const bookmarked = query.bookmarkedIds ? new Set(query.bookmarkedIds) : null;
  const progressById = query.progressById;

  return base.filter((word) => {
    if (query.level && word.level !== query.level) return false;
    if (query.partOfSpeech && word.partOfSpeech !== query.partOfSpeech) return false;
    if (query.bookmarkedOnly && !bookmarked?.has(word.id)) return false;

    if (query.status) {
      const status = progressById?.[word.id]?.status ?? 'new';
      if (status !== query.status) return false;
    }

    if (query.q && !matchesSearch(word, query.q)) return false;
    return true;
  });
}

export function sortWords(words: VocabularyWord[], query: WordsQuery): VocabularyWord[] {
  const progressById = query.progressById;

  switch (query.sort) {
    case 'recent':
      return words.sort((a, b) => orderOf(b.id) - orderOf(a.id));

    case 'most-practiced':
      return words.sort((a, b) => {
        const delta = practiceCount(progressById?.[b.id]) - practiceCount(progressById?.[a.id]);
        return delta !== 0 ? delta : a.english.localeCompare(b.english, 'en');
      });

    case 'a-z':
      return words.sort((a, b) => a.english.localeCompare(b.english, 'en'));

    case 'curated':
    case undefined:
    default:
      // Every category is authored in a deliberate teaching sequence — a greeting flow, a
      // counting sequence — and that sequence, not the alphabet, is what "sorted" means by
      // default. A learner who wants true alphabetical order still has that as an explicit choice.
      return words.sort((a, b) => orderOf(a.id) - orderOf(b.id));
  }
}

/** Filter, then sort, then page — the order a SQL backend would use. */
export function queryWords(query: WordsQuery = {}): Paginated<VocabularyWord> {
  const filtered = sortWords(filterWords(query), query);
  return paginate(filtered, query.page ?? 1, query.pageSize ?? VOCABULARY_PAGE_SIZE);
}

export function searchWords(term: string, limit = 10): VocabularyWord[] {
  if (!term.trim()) return [];
  return getAllWords()
    .filter((word) => matchesSearch(word, term))
    .slice(0, Math.max(1, limit));
}
