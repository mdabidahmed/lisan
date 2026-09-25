/**
 * Locale-aware number and date formatting.
 *
 * Thin wrappers over `Intl` — the platform already knows that Arabic wants Eastern Arabic numerals,
 * `٠٥‏/٠٣‏/٢٠٢٦` ordering and its own month names, so there is no digit map or date pattern to
 * maintain here. Formatter construction is the expensive part of `Intl`, so instances are cached
 * per locale and options; lists that format a value per row stay cheap.
 */
import { DEFAULT_LOCALE, LOCALES, type Locale } from './locales';

export type DateInput = Date | string | number;

const numberFormatters = new Map<string, Intl.NumberFormat>();
const dateFormatters = new Map<string, Intl.DateTimeFormat>();
const relativeFormatters = new Map<string, Intl.RelativeTimeFormat>();

function cacheKey(locale: Locale, options: object): string {
  return `${locale}|${JSON.stringify(options)}`;
}

function numberFormatter(locale: Locale, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = cacheKey(locale, options);
  const cached = numberFormatters.get(key);
  if (cached !== undefined) return cached;

  const formatter = new Intl.NumberFormat(LOCALES[locale].intlLocale, options);
  numberFormatters.set(key, formatter);
  return formatter;
}

function dateFormatter(locale: Locale, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = cacheKey(locale, options);
  const cached = dateFormatters.get(key);
  if (cached !== undefined) return cached;

  const formatter = new Intl.DateTimeFormat(LOCALES[locale].intlLocale, options);
  dateFormatters.set(key, formatter);
  return formatter;
}

function relativeFormatter(
  locale: Locale,
  options: Intl.RelativeTimeFormatOptions,
): Intl.RelativeTimeFormat {
  const key = cacheKey(locale, options);
  const cached = relativeFormatters.get(key);
  if (cached !== undefined) return cached;

  const formatter = new Intl.RelativeTimeFormat(LOCALES[locale].intlLocale, options);
  relativeFormatters.set(key, formatter);
  return formatter;
}

function toDate(value: DateInput): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** `1234.5` → `"1,234.5"` in English, `"١٬٢٣٤٫٥"` in Arabic. */
export function formatNumber(
  value: number,
  locale: Locale = DEFAULT_LOCALE,
  options: Intl.NumberFormatOptions = {},
): string {
  if (!Number.isFinite(value)) return '';
  return numberFormatter(locale, options).format(value);
}

/** Takes a ratio, as `Intl` does: `0.923` → `"92%"`. */
export function formatPercent(
  ratio: number,
  locale: Locale = DEFAULT_LOCALE,
  options: Intl.NumberFormatOptions = {},
): string {
  return formatNumber(ratio, locale, { style: 'percent', maximumFractionDigits: 0, ...options });
}

/** Returns an empty string for an unparseable date, so a bad record cannot render `"Invalid Date"`. */
export function formatDate(
  value: DateInput,
  locale: Locale = DEFAULT_LOCALE,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  const date = toDate(value);
  return date === null ? '' : dateFormatter(locale, options).format(date);
}

/** Weekday name for the study-streak strip: `"Thu"` in English, `"الخميس"` in Arabic. */
export function formatWeekday(
  value: DateInput,
  locale: Locale = DEFAULT_LOCALE,
  weekday: Intl.DateTimeFormatOptions['weekday'] = 'short',
): string {
  return formatDate(value, locale, { weekday });
}

const DAY_MS = 86_400_000;

/** 1 January 2024 was a Monday. Fixed in UTC so the labels never depend on the viewer's clock. */
const REFERENCE_MONDAY = Date.UTC(2024, 0, 1);

const weekdayLabelSets = new Map<string, readonly string[]>();

/**
 * The seven weekday names, Monday first — the order the study-streak strip reads in.
 *
 * Built from a fixed reference week rather than a hand-written array, so a new locale gets its
 * own names from `Intl` the moment it is registered. `timeZone: 'UTC'` pins the reference days:
 * without it, a viewer west of Greenwich formats each midnight-UTC date as the day before.
 */
export function weekdayLabels(
  locale: Locale = DEFAULT_LOCALE,
  weekday: Intl.DateTimeFormatOptions['weekday'] = 'short',
): readonly string[] {
  const key = cacheKey(locale, { weekday });
  const cached = weekdayLabelSets.get(key);
  if (cached !== undefined) return cached;

  const labels = Object.freeze(
    Array.from({ length: 7 }, (_, index) =>
      formatDate(new Date(REFERENCE_MONDAY + index * DAY_MS), locale, {
        weekday,
        timeZone: 'UTC',
      }),
    ),
  );
  weekdayLabelSets.set(key, labels);
  return labels;
}

/**
 * How long ago something happened, in words: `"2 hours ago"`, `"yesterday"`, `"in 3 days"`.
 *
 * Only the unit is chosen here — `Intl.RelativeTimeFormat` does every bit of the rendering,
 * including the plural rule, the tense and `numeric: 'auto'`'s idiomatic "yesterday" instead of
 * "1 day ago". Months and years use the mean Gregorian month/year so a boundary never lands on
 * `"12 months ago"`.
 */
type RelativeUnit = readonly [
  limitSeconds: number,
  unitSeconds: number,
  unit: Intl.RelativeTimeFormatUnit,
];

/** Anything older than a year. Named so the lookup below has a total, non-optional result. */
const YEARS: RelativeUnit = [Number.POSITIVE_INFINITY, 31_557_600, 'year'];

const RELATIVE_UNITS: readonly RelativeUnit[] = [
  [60, 1, 'second'],
  [3_600, 60, 'minute'],
  [86_400, 3_600, 'hour'],
  [604_800, 86_400, 'day'],
  [2_629_800, 604_800, 'week'],
  [31_557_600, 2_629_800, 'month'],
  YEARS,
];

/** Returns an empty string for an unparseable date, like the other formatters here. */
export function formatRelativeTime(
  value: DateInput,
  locale: Locale = DEFAULT_LOCALE,
  now: DateInput = new Date(),
): string {
  const date = toDate(value);
  const reference = toDate(now);
  if (date === null || reference === null) return '';

  const deltaSeconds = (date.getTime() - reference.getTime()) / 1000;
  const magnitude = Math.abs(deltaSeconds);
  const [, unitSeconds, unit] = RELATIVE_UNITS.find(([limit]) => magnitude < limit) ?? YEARS;

  return relativeFormatter(locale, { numeric: 'auto' }).format(
    Math.round(deltaSeconds / unitSeconds),
    unit,
  );
}
