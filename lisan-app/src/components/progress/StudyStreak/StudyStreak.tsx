import { Icon } from '@/components/icons';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import { weekdayLabels } from '@/utils/date';
import { cn } from '@/utils/cn';

import styles from './StudyStreak.module.css';

export interface StudyStreakProps {
  /** Consecutive days studied. */
  days: number;
  /** Seven booleans, Monday-first. */
  week: readonly boolean[];
  message?: string;
}

/** Study streak card (reference screen 5). The flame is an SVG icon, never an emoji. */
export function StudyStreak({
  days,
  week,
  message = "Keep going! You're doing great!",
}: StudyStreakProps) {
  const { locale } = useTranslation();

  return (
    <Card padding="md">
      <div className={styles.body}>
        <span className={styles.flame}>
          <Icon name="streak" size={30} />
        </span>
        <p className={styles.count}>
          {days} {days === 1 ? 'Day' : 'Days'}
        </p>
        <p className={styles.message}>{message}</p>

        <ul className={styles.week}>
          {weekdayLabels(locale).map((label, index) => {
            const studied = week[index] ?? false;
            return (
              <li key={label} className={styles.day}>
                <span className={cn(styles.dot, studied && styles.dotActive)}>
                  {studied ? <Icon name="check" size={14} /> : null}
                  <span className="u-visually-hidden">
                    {label}: {studied ? 'studied' : 'not studied'}
                  </span>
                </span>
                <span className={styles.dayLabel} aria-hidden="true">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
