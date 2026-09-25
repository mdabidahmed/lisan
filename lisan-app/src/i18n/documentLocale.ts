import { LOCALES, type Locale } from './locales';

/**
 * Writes the interface locale onto the document root.
 *
 * The narrow scope is the contract: `<html lang>` and `<html dir>` and nothing else. Arabic content
 * declares its own direction at the element that renders it (`contentDirection.ts`), so changing
 * the interface locale can never reorder the words being learned.
 */
export function applyDocumentLocale(root: HTMLElement, locale: Locale): void {
  const { htmlLang, dir } = LOCALES[locale];
  root.lang = htmlLang;
  root.dir = dir;
}
