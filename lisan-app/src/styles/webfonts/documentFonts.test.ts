import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  applyDocumentFonts,
  ensureDocumentFonts,
  resolveArabicFont,
  resolveReadingFont,
  type FontPreferences,
} from './documentFonts';
import { resetWebFonts } from './loadWebFont';

const DEFAULTS: FontPreferences = {
  arabicFont: 'naskh',
  readingFont: 'inter',
  monospaceTransliteration: false,
};

function stubFontSet(loads: boolean): void {
  Object.defineProperty(document, 'fonts', {
    value: {
      load: vi.fn(() =>
        loads ? Promise.resolve([{} as FontFace]) : Promise.reject(new Error('NetworkError')),
      ),
    },
    configurable: true,
  });
}

function root(): HTMLElement {
  return document.documentElement;
}

/** jsdom does not fetch cross-origin stylesheets, so the test plays the failing browser. */
function failStylesheets(): void {
  for (const link of document.head.querySelectorAll('link[data-lisan-font]')) {
    link.dispatchEvent(new Event('error'));
  }
}

beforeEach(() => {
  resetWebFonts();
  delete root().dataset.fontArabic;
  delete root().dataset.fontReading;
  delete root().dataset.fontTranslit;
});

afterEach(() => {
  resetWebFonts();
  Reflect.deleteProperty(document, 'fonts');
});

describe('applyDocumentFonts', () => {
  it('writes nothing for the default faces', () => {
    applyDocumentFonts(root(), DEFAULTS);

    // The absence of an attribute is the default state, so a first-time visitor's document is
    // byte-identical to one written before the preference existed.
    expect(root().dataset.fontArabic).toBeUndefined();
    expect(root().dataset.fontReading).toBeUndefined();
    expect(root().dataset.fontTranslit).toBeUndefined();
  });

  it('writes one attribute per non-default choice', () => {
    applyDocumentFonts(root(), {
      arabicFont: 'indopak',
      readingFont: 'spectral',
      monospaceTransliteration: true,
    });

    expect(root().dataset.fontArabic).toBe('indopak');
    expect(root().dataset.fontReading).toBe('spectral');
    expect(root().dataset.fontTranslit).toBe('mono');
  });

  it('clears the attribute when a learner switches back to the default', () => {
    applyDocumentFonts(root(), { ...DEFAULTS, arabicFont: 'amiri' });
    expect(root().dataset.fontArabic).toBe('amiri');

    applyDocumentFonts(root(), DEFAULTS);
    expect(root().dataset.fontArabic).toBeUndefined();
  });

  it('ignores a persisted face this build does not have', () => {
    // `coerceSettings` only checks the primitive type, so a downgraded or hand-edited
    // `lisan:settings` can name anything. It must not put an attribute on `<html>` that no rule
    // in tokens.css matches.
    applyDocumentFonts(root(), {
      ...DEFAULTS,
      arabicFont: 'kufi' as FontPreferences['arabicFont'],
    });

    expect(root().dataset.fontArabic).toBeUndefined();
  });
});

describe('resolveArabicFont / resolveReadingFont', () => {
  it('passes through every face the app ships', () => {
    expect(resolveArabicFont('naskh')).toBe('naskh');
    expect(resolveArabicFont('amiri')).toBe('amiri');
    expect(resolveArabicFont('indopak')).toBe('indopak');
    expect(resolveReadingFont('spectral')).toBe('spectral');
  });

  it('falls back to the self-hosted default for anything else', () => {
    expect(resolveArabicFont('kufi')).toBe('naskh');
    expect(resolveArabicFont(undefined)).toBe('naskh');
    expect(resolveArabicFont(7)).toBe('naskh');
    expect(resolveReadingFont(null)).toBe('inter');
  });
});

describe('ensureDocumentFonts', () => {
  it('keeps the attribute when every requested face arrives', async () => {
    stubFontSet(true);
    const preferences: FontPreferences = {
      arabicFont: 'indopak',
      readingFont: 'inter',
      monospaceTransliteration: false,
    };

    applyDocumentFonts(root(), preferences);
    await ensureDocumentFonts(root(), preferences);

    expect(root().dataset.fontArabic).toBe('indopak');
  });

  it('falls back to the default face when the chosen one cannot be fetched', async () => {
    stubFontSet(false);
    const preferences: FontPreferences = {
      arabicFont: 'indopak',
      readingFont: 'inter',
      monospaceTransliteration: true,
    };

    applyDocumentFonts(root(), preferences);
    const settled = ensureDocumentFonts(root(), preferences);
    // IndoPak fails at the download (`document.fonts` rejects); IBM Plex Mono never gets that
    // far, because its Google stylesheet 404s. Both have to end in the same place.
    failStylesheets();
    await settled;

    // The attributes go, so the tokens fall back to Noto Naskh and Inter and the page carries on.
    // The preference itself is untouched — this is a network failure, not a change of mind.
    expect(root().dataset.fontArabic).toBeUndefined();
    expect(root().dataset.fontTranslit).toBeUndefined();
  });

  it('never touches a slot that does not need a download', async () => {
    stubFontSet(false);

    applyDocumentFonts(root(), DEFAULTS);
    await ensureDocumentFonts(root(), DEFAULTS);

    expect(root().dataset.fontArabic).toBeUndefined();
  });

  it('does not let a failed request undo a newer choice', async () => {
    stubFontSet(false);
    const stale: FontPreferences = { ...DEFAULTS, arabicFont: 'indopak' };

    applyDocumentFonts(root(), stale);
    const inFlight = ensureDocumentFonts(root(), stale);

    // The learner changes their mind before the first request gives up.
    applyDocumentFonts(root(), { ...DEFAULTS, arabicFont: 'amiri' });
    await inFlight;

    expect(root().dataset.fontArabic).toBe('amiri');
  });
});
