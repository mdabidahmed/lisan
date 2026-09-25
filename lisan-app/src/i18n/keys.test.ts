import { describe, expect, it } from 'vitest';

import type { LocalizedDictionary, TranslationKey } from './keys';
import { en } from './messages/en';

/*
 * Type-level tests: `tsc` fails if an `@ts-expect-error` line stops being an error, so these pin the
 * contract the key union is meant to enforce. They are executed as well, to keep the values honest.
 */

describe('TranslationKey', () => {
  it('is the set of dot paths to string leaves', () => {
    const key: TranslationKey = 'settings.language.cardTitle';

    expect(en.settings.language.cardTitle).toBe('Language');
    expect(key.split('.')).toHaveLength(3);
  });

  it('excludes groups and unknown paths', () => {
    // @ts-expect-error `settings` is a group of messages, not a message.
    const group: TranslationKey = 'settings';
    // @ts-expect-error nothing in the dictionary is called this.
    const unknown: TranslationKey = 'settings.language.tagline';

    expect([group, unknown]).toHaveLength(2);
  });
});

describe('LocalizedDictionary', () => {
  it('accepts the English dictionary as a translation of itself', () => {
    const english: LocalizedDictionary = en;

    expect(english.settings.header.title).toBe('Settings');
  });

  it('rejects a translation that is missing a group', () => {
    // @ts-expect-error a translation has to carry every group English has.
    const incomplete: LocalizedDictionary = { common: en.common };

    expect(incomplete.common.languageName.ar).toBe('العربية');
  });

  it('rejects a translation that invents a key', () => {
    const invented: LocalizedDictionary = {
      ...en,
      common: {
        languageName: {
          ...en.common.languageName,
          // @ts-expect-error `common.languageName.fr` does not exist in English.
          fr: 'Français',
        },
      },
    };

    expect(invented.common.languageName.en).toBe('English');
  });
});
