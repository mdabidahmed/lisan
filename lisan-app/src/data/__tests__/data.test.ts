/**
 * Integrity tests for the authored seed content.
 *
 * These deliberately import the real `src/data` barrel rather than the shared
 * fixtures: the dataset itself is the thing under test.
 */
import { describe, expect, it } from 'vitest';

import { hasWordArt } from '@/assets';
import { ICON_NAMES } from '@/components/icons/iconNames';
import type { GrammarLesson } from '@/types';

import { categoryDefinitions } from '../categories';
import { grammarLessons as authoredLessons, lessonExamples } from '../grammar';
import { categories, words, wordsByCategory, wordsById } from '../index';
import { practiceModes as authoredModes, type PracticeModeDefinition } from '../practiceModes';

/** Fatḥa … sukūn, plus the superscript (dagger) alif used in هٰذَا. */
const HARAKAT = /[\u064B-\u0652\u0670]/;
const KEBAB_CASE = /^[a-z]+(-[a-z]+)*$/;

/**
 * Widened to the declared types so the tests exercise the contract the app sees
 * rather than the narrow literal types inferred from the authored arrays.
 */
const grammarLessons: GrammarLesson[] = authoredLessons;
const practiceModes: PracticeModeDefinition[] = authoredModes;

const categoryIds = new Set(categoryDefinitions.map((category) => category.id));
const wordIds = new Set(words.map((word) => word.id));

describe('categories', () => {
  it('contains the 20 categories (the spec’s 17, with Numbers & Time split in two, plus Vegetables and Fruit)', () => {
    expect(categoryDefinitions).toHaveLength(20);
  });

  it('has unique, kebab-case ids', () => {
    expect(categoryIds.size).toBe(categoryDefinitions.length);
    for (const category of categoryDefinitions) {
      expect(category.id).toMatch(KEBAB_CASE);
    }
  });

  it('uses only registered icon names', () => {
    expect(ICON_NAMES).toHaveLength(40);
    for (const category of categoryDefinitions) {
      expect(ICON_NAMES).toContain(category.icon);
    }
  });

  it('references category colours as design tokens', () => {
    for (const category of categoryDefinitions) {
      expect(category.color).toMatch(/^var\(--color-category-[a-z]+\)$/);
    }
  });

  it('has a vowelled Arabic name and a description for every category', () => {
    for (const category of categoryDefinitions) {
      expect(category.name.trim()).not.toBe('');
      expect(category.description.trim()).not.toBe('');
      expect(category.arabicName).toMatch(HARAKAT);
    }
  });

  it('derives wordCount from the real word lists', () => {
    expect(categories).toHaveLength(categoryDefinitions.length);
    for (const category of categories) {
      expect(category.wordCount).toBe(wordsByCategory.get(category.id)?.length ?? 0);
      // Most categories sit in the middle teens; Numbers is the deliberate outlier, carrying
      // the full 1–20-then-tens teaching set, and Time is correspondingly the smallest since
      // it lost its number words to that split.
      expect(category.wordCount).toBeGreaterThanOrEqual(10);
      expect(category.wordCount).toBeLessThanOrEqual(30);
    }
    const total = categories.reduce((sum, category) => sum + category.wordCount, 0);
    expect(total).toBe(words.length);
  });
});

describe('words', () => {
  it('ships at least 220 words', () => {
    expect(words.length).toBeGreaterThanOrEqual(220);
  });

  it('has unique, kebab-case ids', () => {
    expect(wordIds.size).toBe(words.length);
    for (const word of words) {
      expect(word.id).toMatch(KEBAB_CASE);
    }
  });

  it('has no duplicate Arabic head-words', () => {
    const headwords = words.map((word) => word.arabic);
    expect(new Set(headwords).size).toBe(headwords.length);
  });

  it('fills in every required field', () => {
    for (const word of words) {
      expect(word.english.trim()).not.toBe('');
      expect(word.arabic.trim()).not.toBe('');
      expect(word.transliteration.trim()).not.toBe('');
      expect(word.examples.length).toBeGreaterThanOrEqual(1);
      expect(word.examples.length).toBeLessThanOrEqual(2);
    }
  });

  it('resolves every categoryId to a real category', () => {
    for (const word of words) {
      expect(categoryIds.has(word.categoryId)).toBe(true);
    }
  });

  it('resolves every relatedWords id to a real word', () => {
    for (const word of words) {
      for (const relatedId of word.relatedWords ?? []) {
        expect(wordIds.has(relatedId)).toBe(true);
        expect(relatedId).not.toBe(word.id);
      }
    }
  });

  it('vowels every Arabic string, including plurals and examples', () => {
    for (const word of words) {
      expect(word.arabic).toMatch(HARAKAT);
      if (word.pluralForm) {
        expect(word.pluralForm.arabic).toMatch(HARAKAT);
        expect(word.pluralForm.transliteration.trim()).not.toBe('');
      }
      for (const synonym of word.synonyms ?? []) {
        expect(synonym).toMatch(HARAKAT);
      }
      for (const example of word.examples) {
        expect(example.arabic).toMatch(HARAKAT);
        expect(example.english.trim()).not.toBe('');
        expect(example.transliteration?.trim()).not.toBe('');
      }
    }
  });

  it('gives every word an Urdu and Hindi gloss', () => {
    for (const word of words) {
      expect(word.meaningUrdu?.trim()).not.toBe('');
      expect(word.meaningHindi?.trim()).not.toBe('');
    }
  });

  it('uses browser speech synthesis for audio and ships no image paths', () => {
    for (const word of words) {
      expect(word.audio).toEqual({ source: 'browser' });
      expect(word.image).toBeUndefined();
    }
  });

  it('labels the part of speech in the "English (Arabic)" form', () => {
    for (const word of words) {
      expect(word.partOfSpeech).toMatch(/^[A-Z][a-z]+ \(.+\)$/);
    }
  });

  it('covers the levels A1 through C1, weighted towards beginners', () => {
    const levels = new Set(words.map((word) => word.level));
    for (const level of ['A1', 'A2', 'B1', 'B2', 'C1']) {
      expect(levels).toContain(level);
    }
    const beginner = words.filter((word) => word.level === 'A1' || word.level === 'A2');
    expect(beginner.length / words.length).toBeGreaterThan(0.5);
  });

  it('indexes every word by id', () => {
    expect(wordsById.size).toBe(words.length);
    for (const word of words) {
      expect(wordsById.get(word.id)).toBe(word);
    }
  });

  it('groups words under their own category only', () => {
    for (const [categoryId, bucket] of wordsByCategory) {
      expect(categoryIds.has(categoryId)).toBe(true);
      for (const word of bucket) {
        expect(word.categoryId).toBe(categoryId);
      }
    }
  });

  it('includes the words shown in the reference designs', () => {
    for (const id of ['engineer', 'teacher', 'doctor', 'student', 'computer', 'nurse', 'apple']) {
      expect(wordsById.has(id)).toBe(true);
    }
  });
});

describe('grammar lessons', () => {
  it('ships between 10 and 14 lessons with unique ids', () => {
    expect(grammarLessons.length).toBeGreaterThanOrEqual(10);
    expect(grammarLessons.length).toBeLessThanOrEqual(14);
    expect(new Set(grammarLessons.map((lesson) => lesson.id)).size).toBe(grammarLessons.length);
  });

  it('gives every lesson a vowelled title, an icon and ordered sections', () => {
    for (const lesson of grammarLessons) {
      expect(lesson.id).toMatch(KEBAB_CASE);
      expect(lesson.title.trim()).not.toBe('');
      expect(lesson.arabicTitle).toMatch(HARAKAT);
      expect(lesson.summary.trim()).not.toBe('');
      expect(ICON_NAMES).toContain(lesson.icon);
      expect(lesson.estimatedMinutes).toBeGreaterThan(0);
      expect(lesson.sections.length).toBeGreaterThanOrEqual(2);

      const sectionIds = lesson.sections.map((section) => section.id);
      expect(new Set(sectionIds).size).toBe(sectionIds.length);
      for (const section of lesson.sections) {
        expect(section.id).toMatch(KEBAB_CASE);
        expect(section.heading.trim()).not.toBe('');
        expect(section.body.trim()).not.toBe('');
      }
    }
  });

  it('carries 2 to 4 vowelled examples per lesson', () => {
    for (const lesson of grammarLessons) {
      const examples = lessonExamples(lesson);
      expect(examples.length).toBeGreaterThanOrEqual(2);
      expect(examples.length).toBeLessThanOrEqual(4);
      for (const example of examples) {
        expect(example.arabic).toMatch(HARAKAT);
        expect(example.english.trim()).not.toBe('');
        expect(example.transliteration?.trim()).not.toBe('');
      }
    }
  });

  it('resolves every related word id', () => {
    for (const lesson of grammarLessons) {
      for (const relatedId of lesson.relatedWordIds ?? []) {
        expect(wordIds.has(relatedId)).toBe(true);
      }
    }
  });
});

describe('practice modes', () => {
  it('covers the seven modes from the spec', () => {
    expect(practiceModes).toHaveLength(7);
    expect(new Set(practiceModes.map((mode) => mode.id)).size).toBe(practiceModes.length);
  });

  it('uses registered icons and sane question counts', () => {
    for (const mode of practiceModes) {
      expect(ICON_NAMES).toContain(mode.icon);
      expect(mode.questionCount).toBeGreaterThan(0);
      expect(mode.title.trim()).not.toBe('');
      expect(mode.description.trim()).not.toBe('');
      expect(mode.accent.trim()).not.toBe('');
    }
  });

  it('maps each mode to a quiz type, and only flashcards to none', () => {
    for (const mode of practiceModes) {
      expect(['multiple-choice', 'listening', 'typing', 'image-match', 'flashcards']).toContain(
        mode.type,
      );
    }
    expect(practiceModes.find((mode) => mode.id === 'flashcards')?.type).toBe('flashcards');
  });

  it('explains why an unavailable mode is disabled', () => {
    for (const mode of practiceModes) {
      if (!mode.available) {
        expect(mode.unavailableReason?.trim()).not.toBe('');
      }
    }
  });

  it('offers Image Match now that illustrated words exist to build it from', () => {
    const imageMatch = practiceModes.find((mode) => mode.type === 'image-match');
    expect(imageMatch?.available).toBe(true);

    // The quiz generator draws image-match options from this pool alone, so falling below the
    // four options a question needs is the thing that would silently break the mode.
    const illustrated = words.filter((word) => hasWordArt(word.id));
    expect(illustrated.length).toBeGreaterThanOrEqual(4);
  });
});
