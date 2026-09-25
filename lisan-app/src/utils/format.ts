/**
 * Display formatting. All user-visible numbers and durations go through these helpers.
 *
 * Anything `Intl` can do is delegated to `@/i18n/format`, which owns the formatter cache and the
 * locale-to-`Intl`-tag mapping; this module is the app-facing vocabulary on top of it (percentages
 * expressed 0–100, compact durations, signed deltas). Every helper takes a `Locale` and defaults
 * to `DEFAULT_LOCALE`, so a call site becomes locale-aware by passing `locale` from
 * `useTranslation()` and needs no other change.
 */
import {
  formatDate,
  formatNumber as formatLocaleNumber,
  formatPercent as formatLocalePercent,
  formatRelativeTime as formatLocaleRelativeTime,
  type DateInput,
} from '@/i18n/format';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales';

export function formatNumber(value: number, locale: Locale = DEFAULT_LOCALE): string {
  return formatLocaleNumber(value, locale);
}

/** `92 → "92%"`, or `0.923 → "92%"` with `fromRatio`. `Intl` takes ratios; most callers have both. */
export function formatPercent(
  value: number,
  { fromRatio = false, locale = DEFAULT_LOCALE }: { fromRatio?: boolean; locale?: Locale } = {},
): string {
  return formatLocalePercent(fromRatio ? value : value / 100, locale);
}

export function clampPercent(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/** `750 → "12h 30m"`. Falls back to minutes only when under an hour, and to `"<1m"` under that. */
export function formatDuration(totalMinutes: number): string {
  // Study time is accumulated to the millisecond, so a learner can hold a real total that rounds
  // to nothing. "0m" beside a study streak reads as a broken counter rather than a short session.
  if (totalMinutes > 0 && totalMinutes < 0.5) return '<1m';

  const safe = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

/** `93000 → "1:33"` — used for quiz timing. */
export function formatElapsed(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** `"2 hours ago"`. Accepts an ISO string or a Date. */
export function formatRelativeTime(
  value: string | Date,
  now: Date = new Date(),
  locale: Locale = DEFAULT_LOCALE,
): string {
  return formatLocaleRelativeTime(value, locale, now);
}

/** `"Aug 29"` — chart axis labels. */
export function formatShortDate(value: DateInput, locale: Locale = DEFAULT_LOCALE): string {
  return formatDate(value, locale, { month: 'short', day: 'numeric' });
}

/** `"+12 this week"` style deltas. */
export function formatDelta(value: number, suffix = '', locale: Locale = DEFAULT_LOCALE): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatNumber(value, locale)}${suffix}`;
}
