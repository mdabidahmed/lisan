/**
 * Arabic text helpers.
 *
 * Search has to work across three writing systems (Arabic script, Latin transliteration with
 * diacritics, and plain English), so normalisation is centralised here rather than duplicated in
 * every filter.
 */

/** Combining marks: harakat, shadda, sukun, superscript alef, tatweel. */
const HARAKAT = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;
const ARABIC_RANGE = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

/** Strips tashkeel so `تُفَّاح` and `تفاح` match. */
export function stripHarakat(text: string): string {
  return text.replace(HARAKAT, '');
}

/** Folds the letter variants that learners type interchangeably (alef forms, ya, ta marbuta). */
export function normalizeArabic(text: string): string {
  return stripHarakat(text)
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    .replace(/\u0649/g, '\u064A')
    .replace(/\u0629/g, '\u0647')
    .replace(/\u0624/g, '\u0648')
    .replace(/\u0626/g, '\u064A')
    .trim();
}

export function containsArabic(text: string): boolean {
  return ARABIC_RANGE.test(text);
}

/**
 * Folds a Latin transliteration to its plainest form so `tuffāḥ`, `tuffah` and `TUFFAH` all match.
 * NFD decomposition separates the diacritic, then the combining range is removed; the remaining
 * characters (ʿ, ʾ, ḥ-style dots already handled by NFD) are mapped explicitly.
 */
export function normalizeTransliteration(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[\u02BF\u02BE'`ʿʾ]/g, '')
    .replace(/[-_]/g, ' ')
    .toLowerCase()
    .trim();
}

/** The single entry point used by search: works for any of the three scripts. */
export function normalizeForSearch(text: string): string {
  return containsArabic(text) ? normalizeArabic(text) : normalizeTransliteration(text);
}

/**
 * Compares a typed answer with the expected Arabic, ignoring whitespace, tashkeel and the letter
 * variants above (product spec §18: "ignore harmless differences").
 */
export function isArabicAnswerCorrect(given: string, expected: string): boolean {
  const collapse = (value: string) => normalizeArabic(value).replace(/\s+/g, ' ');
  return collapse(given) === collapse(expected);
}

/** First letter of an Arabic string, tashkeel removed — used by the thumbnail fallback tile. */
export function firstArabicLetter(text: string): string {
  const stripped = stripHarakat(text).trim();
  return stripped.charAt(0) || '';
}
