import { describe, expect, it, vi } from 'vitest';

import { createTranslator, t } from './translate';

describe('t', () => {
  it('reads a nested message', () => {
    expect(t('settings.header.title')).toBe('Settings');
    expect(t('settings.language.fieldLabel')).toBe('Interface language');
  });

  it('interpolates named tokens', () => {
    expect(t('settings.learning.goalOption', { count: 20 })).toBe('20 words per day');
    expect(t('settings.learning.speedOption', { speed: 0.75 })).toBe('0.75x');
  });

  it('accepts a string value as well as a number', () => {
    expect(t('settings.learning.goalOption', { count: 'a few' })).toBe('a few words per day');
  });

  it('formats interpolated numbers for the locale, so Arabic gets Arabic digits', () => {
    const arabic = createTranslator('ar');

    expect(arabic('settings.learning.goalOption', { count: 20 })).toMatch(/[٠-٩]/);
    expect(arabic('settings.learning.goalOption', { count: 20 })).not.toMatch(/[0-9]/);
  });

  it('falls back to English for a locale whose dictionary has not landed', () => {
    expect(createTranslator('ar')('settings.language.cardTitle')).toBe('Language');
  });

  it('defaults to English when no locale is given', () => {
    expect(createTranslator()('settings.header.subtitle')).toBe(
      'Tune Lisan to the way you learn best.',
    );
  });
});

/*
 * The assertions below are checked by `tsc`, not by the assertion library: `@ts-expect-error` fails
 * the typecheck if the line it guards ever stops being an error. Each one is also executed, so the
 * runtime behaviour at those untyped edges is pinned too.
 */
describe('t, compile-time checks', () => {
  it('rejects a key that is not in the dictionary', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    // @ts-expect-error there is no `settings.language.missing` message.
    expect(t('settings.language.missing')).toBe('settings.language.missing');
    expect(warn).toHaveBeenCalledOnce();
  });

  it('rejects a group path: only string leaves are keys', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    // @ts-expect-error `settings.language` is a group, not a message.
    expect(t('settings.language')).toBe('settings.language');
    expect(warn).toHaveBeenCalledOnce();
  });

  it('rejects a values object that does not match the placeholders', () => {
    // @ts-expect-error `goalOption` interpolates `{count}`, not `{total}`.
    expect(t('settings.learning.goalOption', { total: 20 })).toBe('{count} words per day');
  });

  it('rejects a message with placeholders called without values', () => {
    // @ts-expect-error `goalOption` cannot be rendered without its `{count}`.
    expect(t('settings.learning.goalOption')).toBe('{count} words per day');
  });

  it('rejects values for a message that has no placeholders', () => {
    // @ts-expect-error `header.title` has nothing to interpolate.
    expect(t('settings.header.title', { count: 1 })).toBe('Settings');
  });
});
