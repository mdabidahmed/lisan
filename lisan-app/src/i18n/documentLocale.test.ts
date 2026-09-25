import { afterEach, describe, expect, it } from 'vitest';

import { ARABIC_CONTENT_ATTRS } from './contentDirection';
import { applyDocumentLocale } from './documentLocale';

/** A word as the vocabulary pages render it: Arabic content marked at the element itself. */
function mountArabicWord(): HTMLElement {
  const word = document.createElement('p');
  word.lang = ARABIC_CONTENT_ATTRS.lang;
  word.dir = ARABIC_CONTENT_ATTRS.dir;
  word.textContent = 'تُفَّاح';
  document.body.append(word);
  return word;
}

afterEach(() => {
  document.body.replaceChildren();
  delete document.documentElement.dataset.theme;
  applyDocumentLocale(document.documentElement, 'en');
});

describe('applyDocumentLocale', () => {
  it('describes an English interface as left-to-right', () => {
    applyDocumentLocale(document.documentElement, 'en');

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('describes an Arabic interface as right-to-left', () => {
    applyDocumentLocale(document.documentElement, 'ar');

    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('leaves Arabic content right-to-left under either interface direction', () => {
    const word = mountArabicWord();

    applyDocumentLocale(document.documentElement, 'en');
    expect(word.lang).toBe('ar');
    expect(word.dir).toBe('rtl');

    applyDocumentLocale(document.documentElement, 'ar');
    expect(word.lang).toBe('ar');
    expect(word.dir).toBe('rtl');
  });

  it('touches nothing but lang and dir on the root', () => {
    document.documentElement.dataset.theme = 'dark';

    applyDocumentLocale(document.documentElement, 'ar');

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.getAttributeNames().toSorted()).toEqual([
      'data-theme',
      'dir',
      'lang',
    ]);
  });
});
