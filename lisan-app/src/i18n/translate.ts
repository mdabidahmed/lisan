/**
 * Message lookup and interpolation.
 *
 * English is the source of truth: `TranslationKey` is derived from it, so a typed call site can
 * never ask for a key that does not exist. The runtime fallbacks below exist for the untyped edges
 * — a future locale whose dictionary is missing a key, or a key arriving from persisted data.
 */
import { formatNumber } from './format';
import type { InterpolationValue, MessageTree, Translate, TranslationKey } from './keys';
import { DEFAULT_LOCALE, type Locale } from './locales';
import { en } from './messages/en';

/** Locales that have a dictionary. Add `ar` here in the same commit as `messages/ar.ts`. */
const DICTIONARIES: Readonly<Partial<Record<Locale, MessageTree>>> = { en };

const PLACEHOLDER = /\{(\w+)\}/g;

type Values = Readonly<Record<string, InterpolationValue>>;

function lookup(tree: MessageTree, key: string): string | undefined {
  let node: string | MessageTree | undefined = tree;
  for (const segment of key.split('.')) {
    if (node === undefined || typeof node === 'string') return undefined;
    node = node[segment];
  }
  return typeof node === 'string' ? node : undefined;
}

function messageFor(locale: Locale, key: string): string {
  const dictionary = DICTIONARIES[locale];
  const translated = dictionary === undefined ? undefined : lookup(dictionary, key);
  if (translated !== undefined) return translated;

  // Untranslated keys fall back to English rather than to blank space: a partly translated locale
  // stays usable, and the gap is obvious to whoever reads the screen.
  const fallback = lookup(en, key);
  if (fallback !== undefined) return fallback;

  if (import.meta.env.DEV) {
    console.warn(`[i18n] No message for key "${key}"`);
  }
  return key;
}

/**
 * Substitutes `{name}` tokens. Numbers are formatted for the locale, so a count reaches the screen
 * as `٥` under an Arabic interface without every call site remembering to format it. An unmatched
 * token is left in place — a visible `{count}` is easier to catch in review than a silent gap.
 */
function interpolate(message: string, values: Values | undefined, locale: Locale): string {
  if (values === undefined) return message;

  return message.replace(PLACEHOLDER, (token: string, name: string) => {
    const value = values[name];
    if (value === undefined) return token;
    return typeof value === 'number' ? formatNumber(value, locale) : value;
  });
}

/**
 * Builds the `t()` bound to one locale. `useTranslation()` is the way to reach it inside React;
 * call this directly only where there is no component tree (a service, a worker, a test).
 */
export function createTranslator(locale: Locale = DEFAULT_LOCALE): Translate {
  // Declared as `Translate` so call sites get the key-to-placeholder checking; the implementation
  // itself only needs the widened values object.
  const translate: Translate = (key: TranslationKey, values?: Values): string =>
    interpolate(messageFor(locale, key), values, locale);

  return translate;
}

/** English `t()`, for module scope and tests. Components must use `useTranslation()`. */
export const t: Translate = createTranslator(DEFAULT_LOCALE);
