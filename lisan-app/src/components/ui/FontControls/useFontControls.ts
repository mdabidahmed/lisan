import { useMemo } from 'react';

import type { SelectOption } from '@/components/ui/Select';
import { ARABIC_FONT_OPTIONS, READING_FONT_OPTIONS } from '@/constants/app';
import { useTranslation } from '@/i18n';
import { useSetting, useSettingsActions } from '@/store/settingsStore';
import type { ArabicFont, ReadingFont } from '@/types/settings';

/**
 * The one definition of what typeface choices exist, what they are called, and how choosing one is
 * written down.
 *
 * Two surfaces offer these choices — the Appearance card in Settings and the top bar's quick
 * switcher — and they present them very differently: one is a form with a live specimen of each
 * face, the other a compact list that names faces without setting them. What they must never
 * disagree on is the material underneath: the set of faces, their labels, the current selection,
 * and the settings field each one writes. That is everything this hook returns, so a face added to
 * `ARABIC_FONT_OPTIONS` or a label reworded in the dictionary reaches both at once.
 *
 * It reads one primitive per preference rather than the whole settings object: the top bar is
 * mounted on every route, and it has no reason to re-render when a quiz setting changes.
 */

export interface FontFamilyControl<Value extends string> {
  readonly label: string;
  readonly hint: string;
  readonly value: Value;
  readonly options: readonly SelectOption<Value>[];
  /** Confirmation copy, for surfaces that acknowledge a change rather than just showing it. */
  readonly savedLabel: string;
  readonly select: (value: Value) => void;
}

export interface MonospaceTransliterationControl {
  readonly label: string;
  readonly description: string;
  readonly checked: boolean;
  readonly toggle: (checked: boolean) => void;
}

export interface FontControls {
  readonly arabic: FontFamilyControl<ArabicFont>;
  readonly reading: FontFamilyControl<ReadingFont>;
  readonly monospace: MonospaceTransliterationControl;
}

export function useFontControls(): FontControls {
  const { t } = useTranslation();
  const arabicFont = useSetting('arabicFont');
  const readingFont = useSetting('readingFont');
  const monospaceTransliteration = useSetting('monospaceTransliteration');
  const { update } = useSettingsActions();

  return useMemo(
    () => ({
      arabic: {
        label: t('settings.fonts.arabicLabel'),
        hint: t('settings.fonts.arabicHint'),
        value: arabicFont,
        options: ARABIC_FONT_OPTIONS.map((font) => ({
          value: font,
          label: t(`settings.fonts.arabicOption.${font}`),
        })),
        savedLabel: t('settings.fonts.arabicSaved'),
        select: (value: ArabicFont) => {
          update({ arabicFont: value });
        },
      },
      reading: {
        label: t('settings.fonts.readingLabel'),
        hint: t('settings.fonts.readingHint'),
        value: readingFont,
        options: READING_FONT_OPTIONS.map((font) => ({
          value: font,
          label: t(`settings.fonts.readingOption.${font}`),
        })),
        savedLabel: t('settings.fonts.readingSaved'),
        select: (value: ReadingFont) => {
          update({ readingFont: value });
        },
      },
      monospace: {
        label: t('settings.fonts.monoLabel'),
        description: t('settings.fonts.monoDescription'),
        checked: monospaceTransliteration,
        toggle: (checked: boolean) => {
          update({ monospaceTransliteration: checked });
        },
      },
    }),
    [t, arabicFont, readingFont, monospaceTransliteration, update],
  );
}
