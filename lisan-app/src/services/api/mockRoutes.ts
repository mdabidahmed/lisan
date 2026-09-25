import type { QuizConfig, VocabularyWord, WordProgress } from '@/types';
import { nowIso } from '@/utils';
import { getDueWords } from '@/services/srs';

import {
  getAllCategories,
  getAllGrammarLessons,
  getAllPracticeModes,
  getCategoryById,
  getGrammarLessonById,
  getWordById,
  getWordsForCategory,
} from './contentSource';
import { badRequest, notFound } from './errors';
import { buildProgressOverview } from './mock/progressOverview';
import { generateQuiz } from './mock/quizGenerator';
import { queryWords, searchWords } from './mock/queryWords';
import type { MockRoute } from './mockClient';
import type { ProgressOverviewInput, SaveProgressResult, WordsQuery } from './types';

const RELATED_WORD_LIMIT = 4;

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

/** Lets a `??` chain end in a throw without an intermediate statement. */
function raise(error: Error): never {
  throw error;
}

function requiredParam(pathParams: Record<string, string>, name: string): string {
  const value = pathParams[name];
  if (value === undefined || value === '')
    throw badRequest(`Missing "${name}" in the request path.`);
  return value;
}

function toProgressRecord(value: unknown): Record<string, WordProgress> {
  return asRecord(value) as Record<string, WordProgress>;
}

function relatedWords(word: VocabularyWord): VocabularyWord[] {
  const explicit = (word.relatedWords ?? [])
    .map(getWordById)
    .filter((item): item is VocabularyWord => item !== undefined);

  if (explicit.length > 0) return explicit.slice(0, RELATED_WORD_LIMIT);

  // Falling back to the category keeps the "related" rail populated for every word.
  return getWordsForCategory(word.categoryId)
    .filter((item) => item.id !== word.id)
    .slice(0, RELATED_WORD_LIMIT);
}

/**
 * The in-memory route table. Order matters exactly as it would in a router: `/words/search` is
 * registered before `/words/:wordId` so the literal wins.
 */
export function createMockRoutes(): readonly MockRoute[] {
  return [
    {
      method: 'GET',
      pattern: '/categories',
      handler: () => getAllCategories(),
    },
    {
      method: 'GET',
      pattern: '/categories/:categoryId',
      handler: ({ pathParams }) => {
        const id = requiredParam(pathParams, 'categoryId');
        return getCategoryById(id) ?? raise(notFound('Category', id));
      },
    },
    {
      method: 'POST',
      pattern: '/categories/:categoryId/words',
      handler: ({ pathParams, body }) => {
        const categoryId = requiredParam(pathParams, 'categoryId');
        if (!getCategoryById(categoryId)) throw notFound('Category', categoryId);
        return queryWords({ ...(body as WordsQuery | undefined), categoryId });
      },
    },

    {
      method: 'GET',
      pattern: '/words/search',
      handler: ({ params }) => {
        const term = typeof params.q === 'string' ? params.q : '';
        const limit = typeof params.limit === 'number' ? params.limit : 10;
        return searchWords(term, limit);
      },
    },
    {
      method: 'GET',
      pattern: '/words/:wordId',
      handler: ({ pathParams }) => {
        const id = requiredParam(pathParams, 'wordId');
        return getWordById(id) ?? raise(notFound('Word', id));
      },
    },
    {
      method: 'GET',
      pattern: '/words/:wordId/related',
      handler: ({ pathParams }) => {
        const id = requiredParam(pathParams, 'wordId');
        const word = getWordById(id);
        if (!word) throw notFound('Word', id);
        return relatedWords(word);
      },
    },
    {
      method: 'POST',
      pattern: '/words/query',
      handler: ({ body }) => queryWords((body as WordsQuery | undefined) ?? {}),
    },

    {
      method: 'GET',
      pattern: '/grammar',
      handler: () => getAllGrammarLessons(),
    },
    {
      method: 'GET',
      pattern: '/grammar/:lessonId',
      handler: ({ pathParams }) => {
        const id = requiredParam(pathParams, 'lessonId');
        return getGrammarLessonById(id) ?? raise(notFound('Grammar lesson', id));
      },
    },

    {
      method: 'GET',
      pattern: '/practice/modes',
      handler: () => getAllPracticeModes(),
    },
    {
      method: 'POST',
      pattern: '/practice/quiz',
      handler: ({ body }) => {
        const config = body as QuizConfig | undefined;
        if (!config) throw badRequest('A quiz configuration is required.');
        return generateQuiz(config);
      },
    },

    {
      method: 'POST',
      pattern: '/progress/overview',
      handler: ({ body }) => buildProgressOverview(body as ProgressOverviewInput),
    },
    {
      method: 'POST',
      pattern: '/progress/due',
      handler: ({ body }) => {
        const record = asRecord(body);
        const ids = getDueWords(toProgressRecord(record.progressById));
        const limit = record.limit;
        return typeof limit === 'number' ? ids.slice(0, Math.max(0, limit)) : ids;
      },
    },
    {
      method: 'POST',
      pattern: '/progress',
      handler: ({ body }): SaveProgressResult => {
        const record = asRecord(body);
        const progressById = toProgressRecord(record.progressById);
        // A real backend would upsert here; the browser already owns the durable copy.
        return { savedAt: nowIso(), count: Object.keys(progressById).length };
      },
    },
  ];
}
