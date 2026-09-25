import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { FONT_PREVIEW_SAMPLE } from '@/constants/app';
import { words } from '@/data';
import { useLessonProgressStore } from '@/store/lessonProgressStore';
import { renderWithProviders, userEvent } from '@/test/renderWithProviders';
import { useBookmarksStore } from '@/store/bookmarksStore';
import { useProgressStore } from '@/store/progressStore';
import { useSettingsStore } from '@/store/settingsStore';
import { resetWebFonts, WEB_FONTS } from '@/styles/webfonts';

import { SettingsPage } from './Settings';

/** The stylesheets the on-demand loader has injected, if any. */
const fontStylesheets = (): string[] =>
  [...document.head.querySelectorAll<HTMLLinkElement>('link[data-lisan-font]')].map(
    (link) => link.href,
  );

function seed(): void {
  useProgressStore.getState().actions.recordAnswer('apple', true);
  useBookmarksStore.getState().actions.add('book');
  useLessonProgressStore.getState().actions.markComplete('definite-article');
  useSettingsStore.getState().actions.update({ theme: 'dark', dailyGoal: 30 });
}

beforeEach(() => {
  localStorage.clear();
  useProgressStore.getState().actions.reset();
  useBookmarksStore.getState().actions.clear();
  useLessonProgressStore.getState().actions.reset();
  useSettingsStore.getState().actions.reset();
  resetWebFonts();
  delete document.documentElement.dataset.fontArabic;
  delete document.documentElement.dataset.fontReading;
  delete document.documentElement.dataset.fontTranslit;
});

describe('<SettingsPage /> language', () => {
  it('renders its copy through the translation layer', () => {
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    expect(screen.getByRole('heading', { level: 2, name: 'Language' })).toBeInTheDocument();
    expect(screen.getByLabelText('Interface language')).toHaveValue('en');
    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Tune Lisan to the way you learn best.')).toBeInTheDocument();
    // Interpolated, and formatted for the locale.
    expect(screen.getByRole('option', { name: '30 words per day' })).toBeInTheDocument();
  });

  it('offers Arabic but marks it unavailable rather than pretending it works', () => {
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    expect(screen.getByRole('option', { name: 'English' })).toBeEnabled();
    expect(screen.getByRole('option', { name: 'العربية' })).toBeDisabled();
    expect(screen.getByText('Arabic interface is on the way')).toBeInTheDocument();
    expect(
      screen.getByText(/already render in full Arabic script, right to left/),
    ).toBeInTheDocument();
  });

  it('cannot be switched to a language the interface does not speak', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    const select = screen.getByLabelText('Interface language');
    await user.selectOptions(select, 'ar');

    expect(select).toHaveValue('en');
    expect(useSettingsStore.getState().language).toBe('en');
  });

  it('reads English for a preference persisted before Arabic was ready', () => {
    useSettingsStore.getState().actions.update({ language: 'ar' });

    renderWithProviders(<SettingsPage />, { route: '/settings' });

    expect(screen.getByLabelText('Interface language')).toHaveValue('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
    // The preference is kept, so it will take effect the day the Arabic dictionary lands.
    expect(useSettingsStore.getState().language).toBe('ar');
  });
});

describe('<SettingsPage /> fonts', () => {
  it('offers the three Arabic faces and previews a real, vowelled dataset word', () => {
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    const select = screen.getByLabelText('Arabic font');
    expect(select).toHaveValue('indopak');
    expect(
      within(select)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['Noto Naskh Arabic', 'Amiri', 'IndoPak Nastaleeq']);

    // Harakat are the whole difference between these faces, so the sample has to carry them —
    // and it has to be a word the learner will actually meet.
    const specimen = screen.getByText(FONT_PREVIEW_SAMPLE.arabic).closest('p');
    expect(specimen).toHaveAttribute('lang', 'ar');
    /*
      The specimen is a line in the preview stack, not a right-to-left region: `dir="rtl"` on a
      stretched child of that column resolved `text-align: start` to the panel's right edge, so the
      two Arabic lines sat against the far side while the eyebrow above and the note below stayed
      at the start. The run is isolated inline instead, and the face — the only thing this control
      is for — is unaffected either way.
    */
    expect(specimen).not.toHaveAttribute('dir');
    expect(getComputedStyle(specimen as HTMLElement).fontFamily).toBe('var(--font-arabic)');

    /*
      The line below the specimen is the same word in a sentence, and that sentence ends in a full
      stop. A trailing neutral takes the embedding direction, so it needs a right-to-left base to
      finish on the left — declared on the isolated run, which is inline, so the line still starts
      level with the eyebrow and the note rather than against the panel's edge.
    */
    const sentence = screen.getByText(FONT_PREVIEW_SAMPLE.exampleArabic);
    expect(FONT_PREVIEW_SAMPLE.exampleArabic).toMatch(/\u002E$/);
    expect(sentence).toHaveAttribute('dir', 'rtl');
    expect(sentence.closest('p')).not.toHaveAttribute('dir');
  });

  it('previews the sample word exactly as the vocabulary library holds it', () => {
    const word = words.find((entry) => entry.id === FONT_PREVIEW_SAMPLE.wordId);

    // The sample is copied into constants so Settings does not pull in the vocabulary chunk.
    // This is the guard against that copy drifting from the dataset it claims to quote.
    expect(word).toBeDefined();
    expect(word?.arabic).toBe(FONT_PREVIEW_SAMPLE.arabic);
    expect(word?.transliteration).toBe(FONT_PREVIEW_SAMPLE.transliteration);
    expect(word?.english).toBe(FONT_PREVIEW_SAMPLE.english);
    expect(word?.examples[0]?.arabic).toBe(FONT_PREVIEW_SAMPLE.exampleArabic);
    expect(word?.examples[0]?.english).toBe(FONT_PREVIEW_SAMPLE.exampleEnglish);
  });

  it('applies an Arabic face to the document as a token override', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    await user.selectOptions(screen.getByLabelText('Arabic font'), 'indopak');

    expect(useSettingsStore.getState().arabicFont).toBe('indopak');
    // Same mechanism as theme and large text: one attribute on <html>, and every component
    // keeps reading the token it always read.
    await waitFor(() => {
      expect(document.documentElement.dataset.fontArabic).toBe('indopak');
    });
    expect(await screen.findByText('Arabic font updated')).toBeInTheDocument();
  });

  it('writes no attribute at all for the default face', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    await user.selectOptions(screen.getByLabelText('Arabic font'), 'amiri');
    await waitFor(() => {
      expect(document.documentElement.dataset.fontArabic).toBe('amiri');
    });

    await user.selectOptions(screen.getByLabelText('Arabic font'), 'naskh');

    await waitFor(() => {
      expect(document.documentElement.dataset.fontArabic).toBeUndefined();
    });
  });

  it('switches the reading face and previews English in it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    const select = screen.getByLabelText('Reading font');
    expect(
      within(select)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['Inter', 'Spectral']);
    expect(getComputedStyle(screen.getByText(FONT_PREVIEW_SAMPLE.exampleEnglish)).fontFamily).toBe(
      'var(--font-latin)',
    );

    await user.selectOptions(select, 'spectral');

    expect(useSettingsStore.getState().readingFont).toBe('spectral');
    await waitFor(() => {
      expect(document.documentElement.dataset.fontReading).toBe('spectral');
    });
  });

  it('switches transliteration to monospace and previews it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    expect(getComputedStyle(screen.getByText(FONT_PREVIEW_SAMPLE.transliteration)).fontFamily).toBe(
      'var(--font-translit)',
    );

    await user.click(screen.getByRole('switch', { name: /Monospace transliteration/ }));

    expect(useSettingsStore.getState().monospaceTransliteration).toBe(true);
    await waitFor(() => {
      expect(document.documentElement.dataset.fontTranslit).toBe('mono');
    });
  });

  it('requests a face only once it has been chosen', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    // Opening Settings must not download five families on the chance one gets picked.
    expect(fontStylesheets()).toHaveLength(0);

    await user.selectOptions(screen.getByLabelText('Reading font'), 'spectral');

    await waitFor(() => {
      expect(fontStylesheets()).toEqual([WEB_FONTS.spectral.stylesheet]);
    });
  });
});

describe('<SettingsPage /> data', () => {
  it('describes what an export contains', () => {
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    expect(screen.getByRole('heading', { level: 2, name: 'Data' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export data' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Import backup' })).toBeInTheDocument();
    expect(screen.getByText(/one\s+JSON file/)).toBeInTheDocument();
  });

  it('asks for confirmation before clearing anything', async () => {
    const user = userEvent.setup();
    seed();
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    await user.click(screen.getByRole('button', { name: /Reset data/ }));

    const dialog = await screen.findByRole('dialog', { name: 'Reset learning data?' });
    expect(dialog).toBeInTheDocument();
    expect(useProgressStore.getState().byWordId.apple).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(useProgressStore.getState().byWordId.apple).toBeDefined();
  });

  it('clears learner data on confirmation but keeps preferences', async () => {
    const user = userEvent.setup();
    seed();
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    await user.click(screen.getByRole('button', { name: /Reset data/ }));
    const dialog = await screen.findByRole('dialog');
    await user.click(await within(dialog).findByRole('button', { name: 'Reset data' }));

    expect(useProgressStore.getState().byWordId).toEqual({});
    expect(useBookmarksStore.getState().ids).toEqual([]);
    expect(useLessonProgressStore.getState().completedById).toEqual({});
    expect(useSettingsStore.getState().theme).toBe('dark');
    expect(await screen.findByText('Learning data reset')).toBeInTheDocument();
  });

  it('can restore the default preferences at the same time', async () => {
    const user = userEvent.setup();
    seed();
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    await user.click(screen.getByRole('button', { name: /Reset data/ }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByLabelText(/Also restore default preferences/));
    await user.click(within(dialog).getByRole('button', { name: 'Reset data' }));

    expect(useSettingsStore.getState().theme).toBe('system');
    expect(useSettingsStore.getState().dailyGoal).toBe(10);
  });
});

describe('<SettingsPage /> account', () => {
  it('is honest about there being no account yet', () => {
    renderWithProviders(<SettingsPage />, { route: '/settings' });

    expect(screen.getByRole('heading', { level: 2, name: 'Account' })).toBeInTheDocument();
    expect(screen.getByText('Local profile')).toBeInTheDocument();
    expect(screen.getByText('No sign-in needed')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign out|log out/i })).not.toBeInTheDocument();
  });
});
