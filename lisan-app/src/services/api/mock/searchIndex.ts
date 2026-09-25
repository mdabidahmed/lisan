import type { VocabularyWord } from '@/types';
import {
  containsArabic,
  normalizeArabic,
  normalizeForSearch,
  normalizeTransliteration,
} from '@/utils';

import { getAllWords } from '../contentSource';

/**
 * Pre-normalised haystacks, built once. Spec §31 requires search to work across English, Arabic
 * (harakat-insensitive) and transliteration (diacritic-insensitive); normalising on every
 * keystroke instead of once per word is the thing that makes large datasets feel slow.
 */

interface SearchEntry {
  /** Harakat-folded Arabic: the word plus its plural. */
  arabic: string;
  /** Diacritic-folded English, transliteration, part of speech and tags. */
  latin: string;
}

let index: Map<string, SearchEntry> | null = null;

function buildEntry(word: VocabularyWord): SearchEntry {
  const arabicParts = [word.arabic, word.pluralForm?.arabic ?? ''];
  const latinParts = [
    word.english,
    word.transliteration,
    word.pluralForm?.transliteration ?? '',
    word.partOfSpeech ?? '',
    ...(word.tags ?? []),
    ...(word.synonyms ?? []),
  ];

  return {
    arabic: arabicParts.map(normalizeArabic).join(' '),
    latin: latinParts.map(normalizeTransliteration).join(' '),
  };
}

function getIndex(): Map<string, SearchEntry> {
  if (!index) {
    index = new Map<string, SearchEntry>();
    for (const word of getAllWords()) index.set(word.id, buildEntry(word));
  }
  return index;
}

export function matchesSearch(word: VocabularyWord, rawTerm: string): boolean {
  const term = normalizeForSearch(rawTerm);
  if (!term) return true;

  const entry = getIndex().get(word.id) ?? buildEntry(word);
  return containsArabic(rawTerm) ? entry.arabic.includes(term) : entry.latin.includes(term);
}
