import { useMemo } from 'react';

import { Card, CardHeader } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { useTranslation } from '@/i18n';
import { formatDate } from '@/i18n/format';
import { cn } from '@/utils/cn';
import { addDays, mondayFirstIndex, toDateKey } from '@/utils/date';

import styles from './StudyCalendar.module.css';

export interface StudyCalendarProps {
  /** Date keys (`YYYY-MM-DD`) the learner studied on, from anywhere in their history. */
  studyDays: readonly string[];
  /** Defaults to today; a fixed value keeps the grid testable. */
  today?: Date;
}

/** 0 = not studied, 1–3 = an unbroken run of study days ending here, short to long. */
type StreakLevel = 0 | 1 | 2 | 3;

interface DayCell {
  key: string;
  day: number;
  studied: boolean;
  isToday: boolean;
  level: StreakLevel;
  runLength: number;
}

const LEVEL_THRESHOLDS: readonly [minRun: number, level: StreakLevel][] = [
  [4, 3],
  [2, 2],
  [1, 1],
];

/** How many consecutive days, ending on `key` and going backward, are in `studied`. */
function runLengthEndingAt(key: string, studied: ReadonlySet<string>): number {
  if (!studied.has(key)) return 0;

  let length = 0;
  let cursor = key;
  while (studied.has(cursor)) {
    length += 1;
    cursor = toDateKey(addDays(cursor, -1));
  }
  return length;
}

function levelFor(runLength: number): StreakLevel {
  const match = LEVEL_THRESHOLDS.find(([minRun]) => runLength >= minRun);
  return match ? match[1] : 0;
}

function buildMonth(today: Date, studied: ReadonlySet<string>): DayCell[] {
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstOffset = mondayFirstIndex(new Date(year, month, 1));
  const todayKey = toDateKey(today);

  const cells: DayCell[] = Array.from({ length: firstOffset }, (_, index) => ({
    key: `pad-${index}`,
    day: 0,
    studied: false,
    isToday: false,
    level: 0,
    runLength: 0,
  }));

  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = toDateKey(new Date(year, month, day));
    const studiedToday = studied.has(key);
    const runLength = runLengthEndingAt(key, studied);
    cells.push({
      key,
      day,
      studied: studiedToday,
      isToday: key === todayKey,
      level: levelFor(runLength),
      runLength,
    });
  }

  return cells;
}

const LEVEL_CLASS: Record<StreakLevel, string | undefined> = {
  0: undefined,
  1: styles.level1,
  2: styles.level2,
  3: styles.level3,
};

/** The full date plus a plain-language streak status, for the tooltip and the accessible name. */
function tooltipFor(cell: DayCell, locale: Parameters<typeof formatDate>[1]): string {
  const dateLabel = formatDate(cell.key, locale, { dateStyle: 'long' });
  if (!cell.studied) return `${dateLabel} — no study session`;
  const streak = cell.runLength === 1 ? '1-day streak' : `${cell.runLength}-day streak`;
  return `${dateLabel} — ${streak}`;
}

/**
 * A month grid marking every day the learner studied, shaded by how long their streak had grown
 * by that day — the fuller picture behind the single streak-length number on the flame card.
 */
export function StudyCalendar({ studyDays, today = new Date() }: StudyCalendarProps) {
  const { locale } = useTranslation();
  const studied = useMemo(() => new Set(studyDays), [studyDays]);
  const cells = useMemo(() => buildMonth(today, studied), [today, studied]);
  const weekdayInitials = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        formatDate(new Date(Date.UTC(2024, 0, 1 + index)), locale, {
          weekday: 'narrow',
          timeZone: 'UTC',
        }),
      ),
    [locale],
  );
  const monthLabel = formatDate(today, locale, { month: 'long', year: 'numeric' });

  return (
    <Card padding="md">
      <CardHeader
        title="Study Calendar"
        subtitle={`${monthLabel} · darker = longer streak`}
        as="h2"
      />
      <div className={styles.grid}>
        {weekdayInitials.map((label, index) => (
          <span key={`${label}-${index}`} className={styles.weekdayLabel} aria-hidden="true">
            {label}
          </span>
        ))}
        {cells.map((cell) =>
          cell.day === 0 ? (
            <span key={cell.key} className={styles.pad} aria-hidden="true" />
          ) : (
            <Tooltip
              key={cell.key}
              content={tooltipFor(cell, locale)}
              className={styles.dayWrapper}
            >
              <button
                type="button"
                className={cn(styles.day, LEVEL_CLASS[cell.level], cell.isToday && styles.today)}
              >
                {cell.day}
              </button>
            </Tooltip>
          ),
        )}
      </div>
      <div className={styles.legend}>
        <span>Less</span>
        <span className={cn(styles.swatch)} />
        <span className={cn(styles.swatch, styles.level1)} />
        <span className={cn(styles.swatch, styles.level2)} />
        <span className={cn(styles.swatch, styles.level3)} />
        <span>More</span>
      </div>
    </Card>
  );
}
