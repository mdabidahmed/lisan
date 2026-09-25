import { useMemo, type ReactNode } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useSetting } from '@/store/settingsStore';

import { applyDocumentLocale } from './documentLocale';
import { I18nContext, type I18nContextValue } from './i18nContext';
import { LOCALES, resolveLocale, type Locale } from './locales';
import { createTranslator } from './translate';

export interface I18nProviderProps {
  children: ReactNode;
  /**
   * Forces a locale, bypassing both the persisted preference and the availability gate. Exists for
   * tests and for previewing a locale whose dictionary is still being written; app code leaves it
   * unset so that `resolveLocale` stays the only path a learner's preference can take.
   */
  locale?: Locale | undefined;
}

/**
 * Publishes the interface locale to React and to the document root.
 *
 * The persisted preference goes through `resolveLocale`, so a learner who selected Arabic before the
 * interface was translated reads English rather than a half-translated screen — without losing the
 * preference itself.
 *
 * `index.html` ships `lang="en" dir="ltr"` on `<html>`, which is what English resolves to, so the
 * first paint already matches and this provider only keeps it in step afterwards.
 */
export function I18nProvider({ children, locale: forced }: I18nProviderProps) {
  const persisted = useSetting('language');
  const locale = forced ?? resolveLocale(persisted);

  useIsomorphicLayoutEffect(() => {
    applyDocumentLocale(document.documentElement, locale);
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({ t: createTranslator(locale), locale, dir: LOCALES[locale].dir }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
