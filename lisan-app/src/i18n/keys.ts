/**
 * How the translation key union is derived.
 *
 * `TranslationKey` is computed from the English dictionary rather than maintained by hand, so the
 * dictionary is the only place a key can be added, renamed or removed. Every `t()` call site is
 * checked against it: a missing or misspelt key is a compile error instead of a blank label in
 * production, and deleting copy immediately shows every caller that still wants it.
 */
import type { en } from './messages/en';

/** A dictionary: string leaves, nested in groups as deeply as a feature area needs. */
export interface MessageTree {
  readonly [key: string]: string | MessageTree;
}

/** The English dictionary's literal type: exact keys, exact messages. */
export type Dictionary = typeof en;

/**
 * The shape a translation has to have: the same groups and keys as English, with any string in each
 * leaf. Typing `messages/ar.ts` as this turns the Arabic pass into a data task — the typecheck names
 * every key that is missing or invented.
 */
export type LocalizedDictionary<Tree = Dictionary> = {
  readonly [Key in keyof Tree]: Tree[Key] extends string ? string : LocalizedDictionary<Tree[Key]>;
};

/**
 * Dot-separated paths to every string leaf.
 * `{ settings: { header: { title: 'Settings' } } }` → `'settings.header.title'`.
 */
export type MessagePath<Tree> = {
  [Key in Extract<keyof Tree, string>]: Tree[Key] extends string
    ? Key
    : `${Key}.${MessagePath<Tree[Key]>}`;
}[Extract<keyof Tree, string>];

/** Every key the app may ask for. */
export type TranslationKey = MessagePath<Dictionary>;

/** The literal message a path points at, used to read its placeholders back out. */
export type MessageAt<Tree, Path extends string> = Path extends `${infer Head}.${infer Rest}`
  ? Head extends keyof Tree
    ? MessageAt<Tree[Head], Rest>
    : never
  : Path extends keyof Tree
    ? Tree[Path] extends string
      ? Tree[Path]
      : never
    : never;

/** The `{name}` tokens inside a message. `'{count} words per day'` → `'count'`. */
export type PlaceholderName<Message extends string> =
  Message extends `${string}{${infer Name}}${infer Rest}` ? Name | PlaceholderName<Rest> : never;

/** Numbers are formatted for the active locale before substitution; strings pass through. */
export type InterpolationValue = string | number;

export type TranslationValues<Names extends string> = Readonly<Record<Names, InterpolationValue>>;

/**
 * Interpolation values are required for a message that has placeholders and rejected for one that
 * does not, so `t()` cannot be called with the wrong shape or silently leave a `{token}` on screen.
 */
export type TranslationArgs<Key extends TranslationKey> = [
  PlaceholderName<MessageAt<Dictionary, Key>>,
] extends [never]
  ? []
  : [values: TranslationValues<PlaceholderName<MessageAt<Dictionary, Key>>>];

/** The translate function handed out by `useTranslation()`. */
export type Translate = <Key extends TranslationKey>(
  key: Key,
  ...args: TranslationArgs<Key>
) => string;
