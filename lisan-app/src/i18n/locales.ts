/**
 * The locale registry: which interface languages exist, how they are written, and which ones are
 * finished enough to hand to a learner.
 *
 * Adding a locale is three edits — an id here, its metadata below, and a dictionary in
 * `messages/` — and nothing else in the app has to change.
 */

/** Source of truth for the union, in the order a language picker should list them. */
export const LOCALE_IDS = ['en', 'ar'] as const;

export type Locale = (typeof LOCALE_IDS)[number];

export type TextDirection = 'ltr' | 'rtl';

export interface LocaleMeta {
  readonly id: Locale;
  /** Direction of the *interface*. Arabic learning content has its own, fixed direction. */
  readonly dir: TextDirection;
  /** Value for `<html lang>`. */
  readonly htmlLang: string;
  /**
   * Tag handed to `Intl`. Arabic carries the `-u-nu-arab` Unicode extension so numbers and dates
   * come out in Eastern Arabic numerals (١٢٣) — `Intl` owns the digit mapping, we never do.
   */
  readonly intlLocale: string;
  /**
   * Whether the dictionary for this locale is complete enough to ship. A locale that is not
   * available is still listed — the language card shows it as unavailable rather than hiding the
   * roadmap — but it can never become the active locale. See `resolveLocale`.
   */
  readonly uiAvailable: boolean;
}

export const LOCALES: Readonly<Record<Locale, LocaleMeta>> = {
  en: {
    id: 'en',
    dir: 'ltr',
    htmlLang: 'en',
    intlLocale: 'en',
    uiAvailable: true,
  },
  ar: {
    id: 'ar',
    dir: 'rtl',
    htmlLang: 'ar',
    intlLocale: 'ar-u-nu-arab',
    // Flip to `true` in the same commit that adds `messages/ar.ts`, and mirror the change in the
    // inline locale bootstrap in `index.html` so the first paint is not a frame of LTR.
    uiAvailable: false,
  },
};

export const DEFAULT_LOCALE: Locale = 'en';

/** The locales a learner can actually select today. */
export const AVAILABLE_LOCALES: readonly Locale[] = LOCALE_IDS.filter(
  (id) => LOCALES[id].uiAvailable,
);

/** Runtime guard for values arriving from persisted storage, a URL or a header. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALE_IDS as readonly string[]).includes(value);
}

/**
 * Narrows any stored preference to a locale the app can honour.
 *
 * A learner who picked Arabic before the interface was translated has `language: 'ar'` in storage.
 * That preference is kept — it is what they asked for, and it will take effect the day Arabic ships
 * — but it resolves to English until then, so nobody is stranded in a half-translated interface.
 */
export function resolveLocale(value: unknown): Locale {
  return isLocale(value) && LOCALES[value].uiAvailable ? value : DEFAULT_LOCALE;
}

export function directionOf(locale: Locale): TextDirection {
  return LOCALES[locale].dir;
}
