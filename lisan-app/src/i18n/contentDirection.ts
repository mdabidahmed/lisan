/**
 * Direction for Arabic *learning content* — deliberately independent of the interface locale.
 *
 * The vocabulary, examples and grammar in `src/data` are the subject being studied, not interface
 * chrome. Their direction is a property of the text itself, so it cannot follow a UI preference: an
 * English interface still has to render تُفَّاح right to left, and an Arabic interface must not drag
 * the English gloss along with it. Product spec §63: Arabic is a first-class language, never Latin
 * text with an RTL hack.
 *
 * The mechanics that keep the two apart:
 *   • `I18nProvider` writes `lang`/`dir` on `<html>` only — see `documentLocale.ts`.
 *   • Every element rendering Arabic content carries its own `lang="ar" dir="rtl"`, which wins over
 *     whatever the root says, in either interface direction.
 *
 * Spread these attributes on the element that holds the Arabic string.
 *
 * Only on elements that are a right-to-left *region* in their own right — a head word, a quote, an
 * example sentence. `dir="rtl"` sets a base direction, and on a block-level element that makes the
 * whole box a right-to-left paragraph: `text-align: start` resolves to its right edge, and runs
 * inside it are ordered from the right. Use `ARABIC_EMBEDDED_CONTENT_ATTRS` for Arabic sitting in a
 * line of host-language layout, where that base direction is the wrong one.
 */
export const ARABIC_CONTENT_ATTRS = {
  lang: 'ar',
  dir: 'rtl',
} as const;

export type ArabicContentAttrs = typeof ARABIC_CONTENT_ATTRS;

/**
 * Arabic *embedded in host-language layout* — a value in an English label/value table, a gloss in
 * an English sentence, a head word trailed by its Latin transliteration.
 *
 * Direction has two jobs and they pull apart here. The Arabic run still has to be laid out right to
 * left, but that comes free: Arabic characters are strongly right-to-left, so the bidi algorithm
 * orders their glyphs and harakat correctly under *any* base direction. What `dir` decides is the
 * base direction of the line — where the text starts, and how runs of different scripts are ordered
 * against each other. An English table row wants the base direction it already has.
 *
 * Forcing `dir="rtl"` here does visible damage to a mixed-script value. `مَطَارَات (maṭārāt)` in a
 * right-to-left base renders as `(maṭārāt) مَطَارَات`, flush to the container's right edge: the
 * Arabic goes rightmost because it comes first, and the transliteration lands to its left. In the
 * inherited left-to-right base it renders as `مَطَارَات (maṭārāt)` at the start of its column,
 * which is what the design asks for.
 *
 * So mark the language and leave direction alone. Pair this with an inline bidi isolate around the
 * run — `unicode-bidi: isolate`, or a `<bdi>` — so the Arabic cannot reorder against neighbouring
 * text. Note that a bare `<bdi>` is *not* a drop-in: it defaults to `dir="auto"`, which picks the
 * base direction from the first strong character, so an Arabic-initial value flips back to a
 * right-to-left base and the reordering above returns.
 */
export const ARABIC_EMBEDDED_CONTENT_ATTRS = {
  lang: 'ar',
} as const;

export type ArabicEmbeddedContentAttrs = typeof ARABIC_EMBEDDED_CONTENT_ATTRS;
