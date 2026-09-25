import { describe, expect, it } from 'vitest';

import { getCategoryArt, getWordArt, hasWordArt, wordArtIds } from '@/assets';
import { categories, practiceModes, words } from '@/data';
import { fallbackCategories, fallbackPracticeModes, fallbackWords } from '@/data/fallbackContent';

/**
 * `contentSource` falls back per collection, so a partial dataset can serve fallback categories
 * alongside authored words. That only degrades safely while the two agree on the shape of an id —
 * otherwise a category filter or a bookmarked URL silently resolves to nothing.
 */
describe('fallback and authored dataset agree', () => {
  it('uses category ids drawn from the authored vocabulary', () => {
    const authored = new Set(categories.map((category) => category.id));
    const unknown = fallbackCategories
      .map((category) => category.id)
      .filter((id) => !authored.has(id));

    expect(unknown).toEqual([]);
  });

  it('points every fallback word at a category the fallback also defines', () => {
    const defined = new Set(fallbackCategories.map((category) => category.id));
    const orphaned = fallbackWords
      .filter((word) => !defined.has(word.categoryId))
      .map((word) => word.id);

    expect(orphaned).toEqual([]);
  });

  it('offers the same practice modes with the same availability', () => {
    const authoredAvailability = new Map(practiceModes.map((mode) => [mode.id, mode.available]));

    for (const mode of fallbackPracticeModes) {
      expect(authoredAvailability.get(mode.id)).toBe(mode.available);
    }
  });
});

describe('artwork lines up with the content it illustrates', () => {
  it('only claims artwork for words that exist', () => {
    const authored = new Set(words.map((word) => word.id));
    const dangling = wordArtIds.filter((id) => !authored.has(id));

    expect(dangling).toEqual([]);
  });

  it('resolves artwork for every illustrated word and nothing else', () => {
    for (const id of wordArtIds) {
      expect(hasWordArt(id)).toBe(true);
      expect(getWordArt(id)).toBeDefined();
    }

    expect(getWordArt('a-word-that-does-not-exist')).toBeUndefined();
  });

  it('illustrates every authored category', () => {
    const missing = categories
      .filter((category) => getCategoryArt(category.id) === undefined)
      .map((category) => category.id);

    expect(missing).toEqual([]);
  });

  it('leaves enough illustrated words to build a four-option image-match question', () => {
    const illustrated = words.filter((word) => hasWordArt(word.id));

    expect(illustrated.length).toBeGreaterThanOrEqual(4);
  });
});
