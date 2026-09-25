import { DashboardLayout, PageHeader } from '@/components/layout';
import { Alert } from '@/components/ui/Alert';
import { ArabicText } from '@/components/ui/ArabicText';
import { Card, CardHeader } from '@/components/ui/Card';
import { useFontControls } from '@/components/ui/FontControls';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { useToast } from '@/app/providers/toast';
import { AUDIO_SPEED_OPTIONS, DAILY_GOAL_OPTIONS, FONT_PREVIEW_SAMPLE } from '@/constants/app';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { LOCALE_IDS, LOCALES, useTranslation, type Locale } from '@/i18n';
import { useSettings, useSettingsActions } from '@/store/settingsStore';
import type { ThemeMode } from '@/types/ui';

import { AccountSection } from './AccountSection';
import { DataSection } from './DataSection';
import styles from './Settings.module.css';

const THEME_OPTIONS: readonly { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export function SettingsPage() {
  // The language card and the page chrome are the worked example for `src/i18n`; the rest of this
  // page is still literal copy, migrated one card at a time (see src/i18n/README.md).
  const { t, locale } = useTranslation();

  useDocumentMeta({
    title: t('settings.meta.title'),
    description: t('settings.meta.description'),
  });

  const settings = useSettings();
  const { update } = useSettingsActions();
  const toast = useToast();

  // Shared with the top bar's quick switcher, so the faces on offer, their names and the way a
  // choice is written down are defined once (see `useFontControls`).
  const fonts = useFontControls();

  const save = (label: string) => {
    toast.success(t('settings.toast.savedTitle'), { description: label });
  };

  /** Every locale is listed, in its own language; the unfinished ones are shown as unavailable. */
  const languageOptions: readonly SelectOption<Locale>[] = LOCALE_IDS.map((id) => ({
    value: id,
    label: t(`common.languageName.${id}`),
    disabled: !LOCALES[id].uiAvailable,
  }));

  return (
    <DashboardLayout
      header={
        <PageHeader title={t('settings.header.title')} subtitle={t('settings.header.subtitle')} />
      }
    >
      <Card padding="md">
        <CardHeader title="Appearance" icon="theme" as="h2" />
        <div className={styles.fields}>
          <Select
            options={THEME_OPTIONS}
            value={settings.theme}
            onValueChange={(value) => {
              update({ theme: value });
              save('Theme updated');
            }}
            label="Theme"
            fullWidth
          />

          {/*
            Every font control carries a sample of what it does. A typeface cannot be judged from
            its name, least of all a script face: the three Arabic options differ mainly in where
            they hang the harakat, which only a vowelled word can show. The samples are real
            entries from the vocabulary library and they read the same tokens the rest of the app
            reads, so what is previewed is exactly what will be rendered.
          */}
          <div className={styles.fontField}>
            <Select
              options={fonts.arabic.options}
              value={fonts.arabic.value}
              onValueChange={(value) => {
                fonts.arabic.select(value);
                save(fonts.arabic.savedLabel);
              }}
              label={fonts.arabic.label}
              hint={fonts.arabic.hint}
              fullWidth
            />
            <div className={styles.preview}>
              <span className={styles.previewLabel}>{t('settings.fonts.previewLabel')}</span>
              {/*
                The specimens read with the box, not against it. A preview is four stacked lines —
                eyebrow, word, sentence, note — and giving only the middle two a right-to-left base
                pinned them to the far edge while the English that frames them stayed at the start,
                which reads as a broken panel rather than a deliberate setting. What the control is
                for is comparing letterforms between the faces, and that is untouched by the base
                direction: the glyphs shape and run right to left on their own.
              */}
              <ArabicText as="p" className={styles.previewArabic}>
                {FONT_PREVIEW_SAMPLE.arabic}
              </ArabicText>
              {/*
                The specimen above is a single word and stays embedded; this one is a sentence and
                ends in a full stop, so it needs the right-to-left base that puts the stop at its
                left-hand end. Both still start where the panel starts — see `ArabicText`.
              */}
              <ArabicText as="p" flow="sentence" className={styles.previewArabicLine}>
                {FONT_PREVIEW_SAMPLE.exampleArabic}
              </ArabicText>
              <p className={styles.previewNote}>
                {t('settings.fonts.previewNote', { word: FONT_PREVIEW_SAMPLE.english })}
              </p>
            </div>
          </div>

          <div className={styles.fontField}>
            <Select
              options={fonts.reading.options}
              value={fonts.reading.value}
              onValueChange={(value) => {
                fonts.reading.select(value);
                save(fonts.reading.savedLabel);
              }}
              label={fonts.reading.label}
              hint={fonts.reading.hint}
              fullWidth
            />
            <div className={styles.preview}>
              <span className={styles.previewLabel}>{t('settings.fonts.previewLabel')}</span>
              <p className={styles.previewReading}>{FONT_PREVIEW_SAMPLE.exampleEnglish}</p>
            </div>
          </div>

          <div className={styles.fontField}>
            <Switch
              checked={fonts.monospace.checked}
              onCheckedChange={fonts.monospace.toggle}
              label={fonts.monospace.label}
              description={fonts.monospace.description}
            />
            <div className={styles.preview}>
              <span className={styles.previewLabel}>{t('settings.fonts.previewLabel')}</span>
              <p className={styles.previewTranslit}>{FONT_PREVIEW_SAMPLE.transliteration}</p>
            </div>
          </div>

          <Switch
            checked={settings.textSize === 'large'}
            onCheckedChange={(checked) => {
              update({ textSize: checked ? 'large' : 'default' });
            }}
            label="Larger text"
            description="Increase the base type scale across the app."
          />
          <Switch
            checked={settings.highContrast}
            onCheckedChange={(checked) => {
              update({ highContrast: checked });
            }}
            label="High contrast"
            description="Strengthen borders and secondary text."
          />
          <Switch
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => {
              update({ reducedMotion: checked });
            }}
            label="Reduced motion"
            description="Disable transitions and animated transforms."
          />
        </div>
      </Card>

      <Card padding="md">
        <CardHeader
          title={t('settings.language.cardTitle')}
          icon="education"
          accent="purple"
          as="h2"
        />
        <div className={styles.fields}>
          <Select
            options={languageOptions}
            // The resolved locale, not the raw preference: a learner who chose Arabic before the
            // interface was translated sees English selected, which is what they are reading.
            value={locale}
            onValueChange={(value) => {
              update({ language: value });
              save(t('settings.language.savedDescription'));
            }}
            label={t('settings.language.fieldLabel')}
            fullWidth
          />
        </div>

        <Alert
          variant="info"
          title={t('settings.language.unavailableTitle')}
          className={styles.outcome}
        >
          {t('settings.language.unavailableBody')}
        </Alert>
      </Card>

      <Card padding="md">
        <CardHeader title="Learning" icon="goal" as="h2" />
        <div className={styles.fields}>
          <Select
            options={DAILY_GOAL_OPTIONS.map((goal) => ({
              value: String(goal),
              label: t('settings.learning.goalOption', { count: goal }),
            }))}
            value={String(settings.dailyGoal)}
            onValueChange={(value) => {
              update({ dailyGoal: Number(value) });
              save('Daily goal updated');
            }}
            label="Daily goal"
            fullWidth
          />
          <Select
            options={AUDIO_SPEED_OPTIONS.map((speed) => ({
              value: String(speed),
              label: t('settings.learning.speedOption', { speed }),
            }))}
            value={String(settings.audioSpeed)}
            onValueChange={(value) => {
              update({ audioSpeed: Number(value) });
            }}
            label="Audio speed"
            hint="Arabic pronunciation is clearest a little below normal speed."
            fullWidth
          />
          <Switch
            checked={settings.autoPlayAudio}
            onCheckedChange={(checked) => {
              update({ autoPlayAudio: checked });
            }}
            label="Auto-play pronunciation"
            description="Play the word automatically when a detail page opens."
          />
        </div>
      </Card>

      <DataSection />

      <AccountSection />
    </DashboardLayout>
  );
}
