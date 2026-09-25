import { describe, expect, it, vi } from 'vitest';

import type { QuizConfig, VocabularyWord, WordProgress } from '@/types';

import { getAllWords } from './contentSource';
import { api } from './endpoints';
import { aborted, badRequest, isApiError, isNotFoundError, networkError } from './errors';
import { FetchHttpClient } from './httpClient';
import { generateQuiz } from './mock/quizGenerator';
import { queryWords, searchWords } from './mock/queryWords';

/**
 * Exercised against the real content source rather than a fixture, so the search normalisation
 * and quiz generator are proven on the dataset the app actually ships.
 */

function firstWord(): VocabularyWord {
  const word = getAllWords()[0];
  if (!word) throw new Error('the content source is empty');
  return word;
}

describe('search (spec §31)', () => {
  it('matches on English', () => {
    const word = firstWord();
    expect(searchWords(word.english).map((item) => item.id)).toContain(word.id);
  });

  it('matches on Arabic regardless of harakat', () => {
    const word = firstWord();
    const stripped = word.arabic.replace(/[\u064B-\u0652\u0640]/g, '');

    expect(searchWords(word.arabic).map((item) => item.id)).toContain(word.id);
    expect(searchWords(stripped).map((item) => item.id)).toContain(word.id);
  });

  it('matches transliteration with and without diacritics', () => {
    const word = firstWord();
    const plain = word.transliteration.normalize('NFD').replace(/[\u0300-\u036F]/g, '');

    expect(searchWords(word.transliteration).map((item) => item.id)).toContain(word.id);
    expect(searchWords(plain).map((item) => item.id)).toContain(word.id);
  });

  it('is case insensitive and returns nothing for an empty term', () => {
    const word = firstWord();
    expect(searchWords(word.english.toUpperCase()).map((item) => item.id)).toContain(word.id);
    expect(searchWords('   ')).toEqual([]);
  });

  it('returns an empty list for a term that matches nothing', () => {
    expect(searchWords('zzzzzqqqqq')).toEqual([]);
  });
});

describe('filtering, sorting and pagination (spec §32, §64)', () => {
  it('filters by category', () => {
    const word = firstWord();
    const page = queryWords({ categoryId: word.categoryId, pageSize: 500 });
    expect(page.items.length).toBeGreaterThan(0);
    expect(page.items.every((item) => item.categoryId === word.categoryId)).toBe(true);
  });

  it('filters by level', () => {
    const page = queryWords({ level: 'A1', pageSize: 500 });
    expect(page.items.every((item) => item.level === 'A1')).toBe(true);
  });

  it('combines filters', () => {
    const word = firstWord();
    const page = queryWords({ categoryId: word.categoryId, level: word.level, pageSize: 500 });
    expect(
      page.items.every((item) => item.categoryId === word.categoryId && item.level === word.level),
    ).toBe(true);
  });

  it('filters by learner status', () => {
    const word = firstWord();
    const progressById: Record<string, WordProgress> = {
      [word.id]: {
        wordId: word.id,
        status: 'mastered',
        correctAnswers: 9,
        incorrectAnswers: 0,
        repetitions: 5,
      },
    };

    const mastered = queryWords({ status: 'mastered', progressById, pageSize: 500 });
    expect(mastered.items.map((item) => item.id)).toEqual([word.id]);
  });

  it('filters to bookmarked words only', () => {
    const word = firstWord();
    const page = queryWords({ bookmarkedOnly: true, bookmarkedIds: [word.id], pageSize: 500 });
    expect(page.items.map((item) => item.id)).toEqual([word.id]);
  });

  it('sorts by the authored (curated) order by default', () => {
    const page = queryWords({ pageSize: 500 });
    const english = page.items.map((item) => item.english);
    const authored = getAllWords().map((word) => word.english);
    expect(english).toEqual(authored);
  });

  it('sorts true alphabetically when a-z is asked for explicitly', () => {
    const page = queryWords({ sort: 'a-z', pageSize: 500 });
    const english = page.items.map((item) => item.english);
    expect(english).toEqual([...english].sort((a, b) => a.localeCompare(b, 'en')));
  });

  it('sorts the Numbers category by counting order, not alphabetically, by default', () => {
    // "Eight" < "Eighteen" < "Eighty" < "Eleven" alphabetically, which is not counting order —
    // the default curated sort keeps the authored 1, 2, 3 … 100 order instead.
    const page = queryWords({ categoryId: 'numbers', pageSize: 500 });

    expect(page.items.map((item) => item.english)).toEqual([
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
      'Hundred',
      'Number',
    ]);
  });

  it('sorts by most practiced', () => {
    const words = getAllWords();
    const target = words[2] ?? firstWord();
    const progressById: Record<string, WordProgress> = {
      [target.id]: {
        wordId: target.id,
        status: 'review',
        correctAnswers: 40,
        incorrectAnswers: 2,
        repetitions: 6,
      },
    };

    const page = queryWords({ sort: 'most-practiced', progressById, pageSize: 500 });
    expect(page.items[0]?.id).toBe(target.id);
  });

  it('pages without losing or duplicating items', () => {
    const all = queryWords({ pageSize: 500 });
    const pageOne = queryWords({ page: 1, pageSize: 3 });

    expect(pageOne.items).toHaveLength(3);
    expect(pageOne.total).toBe(all.total);
    expect(pageOne.totalPages).toBe(Math.ceil(all.total / 3));
    expect(pageOne.hasMore).toBe(true);

    const pageTwo = queryWords({ page: 2, pageSize: 3 });
    expect(pageTwo.items.map((item) => item.id)).not.toEqual(pageOne.items.map((item) => item.id));
  });

  it('clamps an out-of-range page to the last one', () => {
    const page = queryWords({ page: 9999, pageSize: 3 });
    expect(page.page).toBe(page.totalPages);
    expect(page.hasMore).toBe(false);
  });
});

describe('quiz generation (spec §28)', () => {
  const base: QuizConfig = {
    mode: 'multiple-choice',
    type: 'multiple-choice',
    questionCount: 5,
    difficulty: 'mixed',
  };

  it('is deterministic for the same config', () => {
    expect(generateQuiz(base)).toEqual(generateQuiz(base));
  });

  it('builds multiple-choice questions with the answer among the options', () => {
    const quiz = generateQuiz(base);
    expect(quiz.questions).toHaveLength(5);

    for (const question of quiz.questions) {
      expect(question.type).toBe('multiple-choice');
      expect(question.options).toBeDefined();
      expect(question.options).toContain(question.correctAnswer);
      expect(new Set(question.options).size).toBe(question.options?.length);
    }
  });

  it('builds typing questions without options and with an Arabic answer', () => {
    const quiz = generateQuiz({ ...base, type: 'typing', mode: 'typing' });

    for (const question of quiz.questions) {
      expect(question.type).toBe('typing');
      expect(question.options).toBeUndefined();
      expect(question.correctAnswer.length).toBeGreaterThan(0);
    }
  });

  it('builds listening questions that carry the Arabic prompt to speak', () => {
    const quiz = generateQuiz({ ...base, type: 'listening', mode: 'listening' });

    for (const question of quiz.questions) {
      expect(question.type).toBe('listening');
      expect(question.question.length).toBeGreaterThan(0);
      expect(question.options).toContain(question.correctAnswer);
    }
  });

  it('builds image-match questions with the answer among the image options', () => {
    const quiz = generateQuiz({ ...base, type: 'image-match', mode: 'image-match' });

    for (const question of quiz.questions) {
      expect(question.type).toBe('image-match');
      expect(question.imageOptions).toContain(question.correctAnswer);
    }
  });

  it('gives every question a unique id', () => {
    const quiz = generateQuiz({ ...base, questionCount: 8 });
    expect(new Set(quiz.questions.map((question) => question.id)).size).toBe(quiz.questions.length);
  });

  it('rejects an empty quiz', () => {
    expect(() => generateQuiz({ ...base, questionCount: 0 })).toThrow();
  });
});

describe('api client behaviour', () => {
  it('resolves content through the mock transport', async () => {
    const categories = await api.categories.getCategories();
    expect(categories.length).toBeGreaterThan(0);
  });

  it('raises a typed not_found error for a missing id', async () => {
    await expect(api.words.getWord('definitely-not-a-word')).rejects.toSatisfy(
      (error: unknown) => isApiError(error) && error.code === 'not_found' && error.status === 404,
    );
  });

  it('rejects with an aborted error when the signal fires', async () => {
    const controller = new AbortController();
    const pending = api.categories.getCategories({ signal: controller.signal });
    controller.abort();

    await expect(pending).rejects.toSatisfy(
      (error: unknown) => isApiError(error) && error.code === 'aborted',
    );
  });

  it('rejects immediately when handed an already-aborted signal', async () => {
    await expect(api.categories.getCategories({ signal: AbortSignal.abort() })).rejects.toSatisfy(
      (error: unknown) => isApiError(error) && error.code === 'aborted',
    );
  });

  it('returns related words for a word that has them', async () => {
    const word = firstWord();
    const related = await api.words.getRelatedWords(word.id);
    expect(Array.isArray(related)).toBe(true);
    expect(related.every((item) => item.id !== word.id)).toBe(true);
  });
});

/*
 * Every route that resolves an entity by an id taken from the URL has to tell "this does not
 * exist" from "the request failed", because the two want opposite surfaces: an empty state the
 * learner leaves by going back, or an error state with a retry. `code` is what carries that, so
 * no caller has to match on message text.
 */
describe('not-found is a distinct outcome from a failed request', () => {
  it('classifies a missing entity, whatever the resource', async () => {
    const missing = [
      api.words.getWord('definitely-not-a-word'),
      api.grammar.getGrammarLesson('definitely-not-a-lesson'),
      api.categories.getCategory('definitely-not-a-category'),
    ];

    for (const pending of missing) {
      await expect(pending).rejects.toSatisfy(isNotFoundError);
    }
  });

  it('does not classify a transport failure as a missing entity', () => {
    expect(isNotFoundError(networkError())).toBe(false);
    expect(isNotFoundError(aborted())).toBe(false);
    expect(isNotFoundError(badRequest('no'))).toBe(false);
    expect(isNotFoundError(new Error('Word "x" could not be found.'))).toBe(false);
  });

  it('carries the 404 through from a real HTTP response, not just the mock transport', async () => {
    const client = new FetchHttpClient('https://example.test');
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('', { status: 404 }));

    try {
      await expect(client.get('/words/nope')).rejects.toSatisfy(isNotFoundError);
    } finally {
      fetchMock.mockRestore();
    }
  });

  it('reads a dropped connection as a transport failure', async () => {
    const client = new FetchHttpClient('https://example.test');
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new TypeError('Failed to fetch'));

    try {
      await expect(client.get('/words/engineer')).rejects.toSatisfy(
        (error: unknown) => isApiError(error) && error.code === 'network',
      );
    } finally {
      fetchMock.mockRestore();
    }
  });
});
