export { I18nProvider, type I18nProviderProps } from './I18nProvider';
export { useTranslation } from './useTranslation';
export { I18nContext, type I18nContextValue } from './i18nContext';

export { createTranslator, t } from './translate';
export {
  formatDate,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  formatWeekday,
  weekdayLabels,
  type DateInput,
} from './format';

export { ARABIC_CONTENT_ATTRS, type ArabicContentAttrs } from './contentDirection';
export { applyDocumentLocale } from './documentLocale';

export {
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_IDS,
  LOCALES,
  directionOf,
  isLocale,
  resolveLocale,
  type Locale,
  type LocaleMeta,
  type TextDirection,
} from './locales';

export type {
  Dictionary,
  InterpolationValue,
  LocalizedDictionary,
  MessageTree,
  Translate,
  TranslationKey,
  TranslationValues,
} from './keys';
