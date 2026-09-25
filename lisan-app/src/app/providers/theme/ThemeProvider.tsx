import { useCallback, useMemo, type ReactNode } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersDarkScheme } from '@/hooks/useMediaQuery';
import { useSettings, useSettingsActions } from '@/store/settingsStore';
import { applyDocumentFonts, ensureDocumentFonts } from '@/styles/webfonts';
import type { ResolvedTheme } from '@/types/ui';

import { ThemeContext, type ThemeContextValue } from './themeContext';

const THEME_COLORS: Record<ResolvedTheme, string> = {
  light: '#1769FF',
  dark: '#0A101D',
};

/**
 * Applies the learner's appearance preferences to the document root.
 *
 * The first paint is already correct: the inline script in `index.html` reads the same persisted
 * settings before React boots, so there is no flash of the wrong theme. This provider keeps the
 * attributes in sync afterwards.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const settings = useSettings();
  const { update } = useSettingsActions();
  const prefersDark = usePrefersDarkScheme();

  const resolved: ResolvedTheme =
    settings.theme === 'system' ? (prefersDark ? 'dark' : 'light') : settings.theme;

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolved;

    if (settings.highContrast) root.dataset.contrast = 'high';
    else delete root.dataset.contrast;

    if (settings.textSize === 'large') root.dataset.textSize = 'large';
    else delete root.dataset.textSize;

    if (settings.reducedMotion) root.dataset.motion = 'reduced';
    else delete root.dataset.motion;

    document.head
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLORS[resolved]);
  }, [resolved, settings.highContrast, settings.textSize, settings.reducedMotion]);

  /*
    Fonts are a second effect because they have a second half. The attributes go on synchronously,
    like every other appearance preference; the bytes a non-default face needs are then fetched in
    the background, and a face that never arrives gives its attribute back so the slot falls to
    the self-hosted default. Boot is covered by the same path: a persisted preference re-runs this
    on mount, which is when the download for it starts.
  */
  useIsomorphicLayoutEffect(() => {
    const preferences = {
      arabicFont: settings.arabicFont,
      readingFont: settings.readingFont,
      monospaceTransliteration: settings.monospaceTransliteration,
    };
    const root = document.documentElement;

    applyDocumentFonts(root, preferences);
    void ensureDocumentFonts(root, preferences);
  }, [settings.arabicFont, settings.readingFont, settings.monospaceTransliteration]);

  const setMode = useCallback<ThemeContextValue['setMode']>(
    (mode) => {
      update({ theme: mode });
    },
    [update],
  );

  const toggle = useCallback(() => {
    update({ theme: resolved === 'dark' ? 'light' : 'dark' });
  }, [resolved, update]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode: settings.theme, resolved, setMode, toggle }),
    [settings.theme, resolved, setMode, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
