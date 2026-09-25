import { describe, expect, it } from 'vitest';

import type { AppLanguage } from '@/types/settings';

import {
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
  directionOf,
  isLocale,
  LOCALE_IDS,
  LOCALES,
  resolveLocale,
  type Locale,
} from './locales';

describe('the locale registry', () => {
  it('has metadata for every locale id', () => {
    for (const id of LOCALE_IDS) {
      expect(LOCALES[id].id).toBe(id);
      expect(LOCALES[id].htmlLang).not.toBe('');
    }
  });

  it('is the only definition of the languages settings can persist', () => {
    // Trivially true, and that is the point: `AppLanguage` is an alias of `Locale` rather than a
    // second union, so there is nothing left that can drift from the registry.
    const persisted: readonly AppLanguage[] = LOCALE_IDS;
    const locales: readonly Locale[] = persisted;

    expect(locales).toEqual([...LOCALE_IDS]);
  });

  it('ships English only, and says so rather than hiding Arabic', () => {
    expect(AVAILABLE_LOCALES).toEqual(['en']);
    expect(LOCALES[DEFAULT_LOCALE].uiAvailable).toBe(true);
    expect(LOCALES.ar.uiAvailable).toBe(false);
    expect(LOCALE_IDS).toContain('ar');
  });

  it('pairs each locale with its interface direction', () => {
    expect(directionOf('en')).toBe('ltr');
    expect(directionOf('ar')).toBe('rtl');
  });

  it('asks Intl for Eastern Arabic numerals instead of mapping digits by hand', () => {
    expect(LOCALES.ar.intlLocale).toBe('ar-u-nu-arab');
    expect(LOCALES.en.intlLocale).toBe('en');
  });
});

describe('isLocale', () => {
  it('accepts known ids and nothing else', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('ar')).toBe(true);
    expect(isLocale('EN')).toBe(false);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(42)).toBe(false);
  });
});

describe('resolveLocale', () => {
  it('keeps a preference the app can honour', () => {
    expect(resolveLocale('en')).toBe('en');
  });

  it('resolves a persisted Arabic preference to English until Arabic ships', () => {
    expect(resolveLocale('ar')).toBe('en');
  });

  it('falls back to English for anything unrecognised', () => {
    expect(resolveLocale(undefined)).toBe('en');
    expect(resolveLocale(null)).toBe('en');
    expect(resolveLocale('fr')).toBe('en');
    expect(resolveLocale('en-GB')).toBe('en');
    expect(resolveLocale({ language: 'en' })).toBe('en');
  });
});
