// The authored vocabulary dataset. Swap this single line to change the content source.
import { categories, words, grammarLessons, practiceModes } from '@/data';

import {
  fallbackCategories,
  fallbackGrammarLessons,
  fallbackPracticeModes,
  fallbackWords,
} from '@/data/fallbackContent';
import type { Category, GrammarLesson, PracticeMode, VocabularyWord } from '@/types';

/**
 * The only module in the app that reads the authored content barrel.
 *
 * Everything above this file goes through the API layer, so replacing `@/data` with a network
 * fetch, a CDN JSON bundle or an IndexedDB cache is a change to this file alone.
 *
 * The barrel is authored independently of the services layer, so each collection is validated and
 * frozen on the way in and falls back to `@/data/fallbackContent` when a slice is missing or empty.
 * That keeps the app renderable rather than crashing on a partial dataset.
 */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasStrings(record: Record<string, unknown>, keys: readonly string[]): boolean {
  return keys.every((key) => typeof record[key] === 'string');
}

function isCategory(value: unknown): value is Category {
  return (
    isRecord(value) &&
    hasStrings(value, ['id', 'name', 'arabicName', 'description', 'icon', 'color', 'level']) &&
    typeof value.wordCount === 'number'
  );
}

function isVocabularyWord(value: unknown): value is VocabularyWord {
  return (
    isRecord(value) &&
    hasStrings(value, ['id', 'english', 'arabic', 'transliteration', 'categoryId', 'level']) &&
    Array.isArray(value.examples)
  );
}

function isGrammarLesson(value: unknown): value is GrammarLesson {
  return (
    isRecord(value) &&
    hasStrings(value, ['id', 'title', 'arabicTitle', 'topic', 'level', 'summary', 'icon']) &&
    typeof value.estimatedMinutes === 'number' &&
    Array.isArray(value.sections)
  );
}

function isPracticeMode(value: unknown): value is PracticeMode {
  return (
    isRecord(value) &&
    hasStrings(value, ['id', 'title', 'description', 'icon', 'accent']) &&
    typeof value.questionCount === 'number' &&
    typeof value.available === 'boolean'
  );
}

function normalizeList<T>(
  raw: unknown,
  guard: (value: unknown) => value is T,
  fallback: readonly T[],
): readonly T[] {
  const items = Array.isArray(raw) ? (raw as unknown[]).filter(guard) : [];
  return Object.freeze(items.length > 0 ? items : [...fallback]);
}

/* Laundered through `unknown` on purpose: the guards above must stay meaningful even though the
   barrel is nominally typed, because it is authored in a separate workstream. */
const rawCategories: unknown = categories;
const rawWords: unknown = words;
const rawGrammarLessons: unknown = grammarLessons;
const rawPracticeModes: unknown = practiceModes;

function memo<T>(factory: () => T): () => T {
  let cached: { value: T } | null = null;
  return () => {
    cached ??= { value: factory() };
    return cached.value;
  };
}

const allCategories = memo(() => normalizeList(rawCategories, isCategory, fallbackCategories));
const allWords = memo(() => normalizeList(rawWords, isVocabularyWord, fallbackWords));
const allGrammarLessons = memo(() =>
  normalizeList(rawGrammarLessons, isGrammarLesson, fallbackGrammarLessons),
);
const allPracticeModes = memo(() =>
  normalizeList(rawPracticeModes, isPracticeMode, fallbackPracticeModes),
);

export function getAllCategories(): readonly Category[] {
  return allCategories();
}

export function getAllWords(): readonly VocabularyWord[] {
  return allWords();
}

export function getAllGrammarLessons(): readonly GrammarLesson[] {
  return allGrammarLessons();
}

export function getAllPracticeModes(): readonly PracticeMode[] {
  return allPracticeModes();
}

/* ── Lazily built indexes; lookups are O(1) instead of scanning the dataset ─────────────────── */

function indexById<T extends { id: string }>(items: readonly T[]): ReadonlyMap<string, T> {
  const map = new Map<string, T>();
  for (const item of items) map.set(item.id, item);
  return map;
}

const categoriesById = memo(() => indexById(allCategories()));
const wordsById = memo(() => indexById(allWords()));
const grammarLessonsById = memo(() => indexById(allGrammarLessons()));
const practiceModesById = memo(() => indexById(allPracticeModes()));

const wordsByCategoryId = memo((): ReadonlyMap<string, readonly VocabularyWord[]> => {
  const map = new Map<string, VocabularyWord[]>();
  for (const word of allWords()) {
    const bucket = map.get(word.categoryId);
    if (bucket) bucket.push(word);
    else map.set(word.categoryId, [word]);
  }
  return map;
});

export function getCategoryById(id: string): Category | undefined {
  return categoriesById().get(id);
}

export function getWordById(id: string): VocabularyWord | undefined {
  return wordsById().get(id);
}

export function getGrammarLessonById(id: string): GrammarLesson | undefined {
  return grammarLessonsById().get(id);
}

export function getPracticeModeById(id: string): PracticeMode | undefined {
  return practiceModesById().get(id);
}

export function getWordsForCategory(categoryId: string): readonly VocabularyWord[] {
  return wordsByCategoryId().get(categoryId) ?? [];
}

export const contentSource = {
  getAllCategories,
  getAllWords,
  getAllGrammarLessons,
  getAllPracticeModes,
  getCategoryById,
  getWordById,
  getGrammarLessonById,
  getPracticeModeById,
  getWordsForCategory,
};
