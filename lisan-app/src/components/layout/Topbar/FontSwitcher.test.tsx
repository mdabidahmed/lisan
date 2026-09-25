import { screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSettingsStore } from '@/store/settingsStore';
import { resetWebFonts } from '@/styles/webfonts';
import { renderWithProviders, userEvent } from '@/test/renderWithProviders';

import { FontSwitcher } from './FontSwitcher';

/**
 * Every optional face reaches the network through `document.fonts.load`, whether Lisan declares
 * the `@font-face` itself or injects a CDN stylesheet first. One spy therefore covers all four,
 * and the `link[data-lisan-font]` count covers the stylesheet half on its own.
 */
function spyOnFontDownloads() {
  const load = vi.fn(() => Promise.resolve([{} as FontFace]));
  Object.defineProperty(document, 'fonts', { value: { load }, configurable: true });
  return load;
}

function injectedStylesheets(): number {
  return document.head.querySelectorAll('link[data-lisan-font]').length;
}

function openSwitcher() {
  return screen.getByRole('button', { name: 'Change typeface' });
}

beforeEach(() => {
  resetWebFonts();
});

afterEach(() => {
  useSettingsStore.getState().actions.reset();
  resetWebFonts();
  Reflect.deleteProperty(document, 'fonts');
  for (const attribute of ['data-font-arabic', 'data-font-reading', 'data-font-translit']) {
    document.documentElement.removeAttribute(attribute);
  }
});

describe('<FontSwitcher />', () => {
  it('announces the popup it controls', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FontSwitcher />);

    const trigger = openSwitcher();
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    // Nothing to point at while it is closed.
    expect(trigger).not.toHaveAttribute('aria-controls');

    await user.click(trigger);

    const panel = screen.getByRole('dialog', { name: 'Typeface' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
  });

  it('opens on the choice already in force', async () => {
    useSettingsStore.getState().actions.update({ arabicFont: 'indopak' });
    const user = userEvent.setup();
    renderWithProviders(<FontSwitcher />);

    await user.click(openSwitcher());

    const arabic = screen.getByRole('radiogroup', { name: 'Arabic font' });
    expect(within(arabic).getByRole('radio', { checked: true })).toHaveAccessibleName(
      'IndoPak Nastaleeq',
    );
    // The popover is a picker, not a menu of suggestions: entry focus lands on the live choice.
    expect(within(arabic).getByRole('radio', { name: 'IndoPak Nastaleeq' })).toHaveFocus();
  });

  it('dismisses on Escape and gives focus back to the trigger', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FontSwitcher />);

    const trigger = openSwitcher();
    await user.click(trigger);
    expect(screen.getByRole('radio', { name: 'IndoPak Nastaleeq' })).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('keeps Tab inside the trigger and its popover', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FontSwitcher />);

    const trigger = openSwitcher();
    await user.click(trigger);

    // Roving tab stops: the live option in each group, then the transliteration switch.
    expect(screen.getByRole('radio', { name: 'IndoPak Nastaleeq' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Inter' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('switch', { name: 'Monospace transliteration' })).toHaveFocus();

    // Past the last stop it wraps onto the trigger instead of escaping into the top bar.
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('switch', { name: 'Monospace transliteration' })).toHaveFocus();
  });

  it('dismisses on a press outside the widget', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FontSwitcher />);

    await user.click(openSwitcher());
    expect(screen.getByRole('dialog', { name: 'Typeface' })).toBeInTheDocument();

    await user.click(document.body);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('walks the faces with the arrow keys, applying each one', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FontSwitcher />);

    await user.click(openSwitcher());
    const arabic = screen.getByRole('radiogroup', { name: 'Arabic font' });

    // Entry focus is on the default (IndoPak, the last option in the list), so the first
    // ArrowDown wraps straight to the start.
    await user.keyboard('{ArrowDown}');
    expect(useSettingsStore.getState().arabicFont).toBe('naskh');
    expect(within(arabic).getByRole('radio', { name: 'Noto Naskh Arabic' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(useSettingsStore.getState().arabicFont).toBe('amiri');

    await user.keyboard('{ArrowDown}');
    expect(useSettingsStore.getState().arabicFont).toBe('indopak');

    await user.keyboard('{End}');
    expect(useSettingsStore.getState().arabicFont).toBe('indopak');
  });

  it('persists a choice through the settings store and stays open', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FontSwitcher />);

    await user.click(openSwitcher());
    await user.click(screen.getByRole('radio', { name: 'Spectral' }));

    expect(useSettingsStore.getState().readingFont).toBe('spectral');
    await waitFor(() => {
      expect(document.documentElement.dataset.fontReading).toBe('spectral');
    });

    // The page behind the popover is the specimen, so it is left up to be compared against.
    expect(screen.getByRole('dialog', { name: 'Typeface' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Spectral' })).toBeChecked();
  });

  it('toggles monospace transliteration from the popover', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FontSwitcher />);

    await user.click(openSwitcher());
    await user.click(screen.getByRole('switch', { name: 'Monospace transliteration' }));

    expect(useSettingsStore.getState().monospaceTransliteration).toBe(true);
  });

  it('fetches only the face already in force when it opens', async () => {
    const load = spyOnFontDownloads();
    const user = userEvent.setup();
    renderWithProviders(<FontSwitcher />);

    await user.click(openSwitcher());

    // All five faces are on offer…
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(screen.getByRole('radio', { name: 'Amiri' })).toBeInTheDocument();
    // …but only the live specimen for the face already selected (IndoPak, the default) has been
    // asked for — not the other three optional ones. A specimen of every optional face would
    // have pulled Amiri and Spectral too, on top of it — the rest of the 300 kB this guards
    // against.
    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith(expect.stringContaining('IndoPak Nastaleeq'), 'طَالِب');
    expect(injectedStylesheets()).toBe(0);

    // The spy is not vacuous: choosing a different face is what spends more bytes. IndoPak was
    // the one pure `document.fonts.load` face with no CDN stylesheet, and it is already spent —
    // every other option, Amiri included, arrives through an injected stylesheet instead.
    await user.click(screen.getByRole('radio', { name: 'Amiri' }));
    await waitFor(() => {
      expect(injectedStylesheets()).toBe(1);
    });
  });
});
