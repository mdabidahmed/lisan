import { render, renderHook, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSettingsStore } from '@/store/settingsStore';

import { ARABIC_CONTENT_ATTRS } from './contentDirection';
import { I18nProvider } from './I18nProvider';
import type { Locale } from './locales';
import { useTranslation } from './useTranslation';

/** Reads everything the hook hands out, next to a word rendered as Arabic learning content. */
function Probe() {
  const { t, locale, dir } = useTranslation();

  return (
    <div>
      <p data-testid="locale">{locale}</p>
      <p data-testid="dir">{dir}</p>
      <p data-testid="message">{t('settings.language.cardTitle')}</p>
      <p data-testid="word" {...ARABIC_CONTENT_ATTRS}>
        تُفَّاح
      </p>
    </div>
  );
}

function renderProbe(locale?: Locale) {
  return render(
    <I18nProvider {...(locale === undefined ? {} : { locale })}>
      <Probe />
    </I18nProvider>,
  );
}

const root = () => document.documentElement;

beforeEach(() => {
  useSettingsStore.getState().actions.reset();
  root().lang = 'en';
  root().dir = 'ltr';
});

describe('<I18nProvider />', () => {
  it('publishes the active locale and its direction', () => {
    renderProbe();

    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    expect(screen.getByTestId('dir')).toHaveTextContent('ltr');
    expect(screen.getByTestId('message')).toHaveTextContent('Language');
  });

  it('describes the document as English, left to right', () => {
    renderProbe();

    expect(root().lang).toBe('en');
    expect(root().dir).toBe('ltr');
  });

  it('describes the document as Arabic, right to left, when Arabic is the locale', () => {
    renderProbe('ar');

    expect(root().lang).toBe('ar');
    expect(root().dir).toBe('rtl');
    expect(screen.getByTestId('dir')).toHaveTextContent('rtl');
  });

  it('keeps a persisted Arabic preference out of the interface until Arabic ships', () => {
    useSettingsStore.getState().actions.update({ language: 'ar' });

    renderProbe();

    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    expect(screen.getByTestId('message')).toHaveTextContent('Language');
    expect(root().lang).toBe('en');
    expect(root().dir).toBe('ltr');
    // The preference itself survives: it is what the learner asked for, and it takes effect the day
    // the Arabic dictionary lands.
    expect(useSettingsStore.getState().language).toBe('ar');
  });

  it('leaves Arabic content right-to-left whichever interface locale is active', () => {
    const english = renderProbe('en');
    expect(english.getByTestId('word')).toHaveAttribute('dir', 'rtl');
    expect(english.getByTestId('word')).toHaveAttribute('lang', 'ar');
    english.unmount();

    const arabic = renderProbe('ar');
    expect(arabic.getByTestId('word')).toHaveAttribute('dir', 'rtl');
    expect(arabic.getByTestId('word')).toHaveAttribute('lang', 'ar');
  });
});

describe('useTranslation', () => {
  it('refuses to guess a locale outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useTranslation())).toThrow(/inside <I18nProvider>/);
  });
});
