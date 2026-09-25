import { Link } from 'react-router-dom';

import { Icon } from '@/components/icons';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ROUTES } from '@/constants/routes';
import { clampPercent, formatPercent } from '@/utils/format';

import styles from './DailyGoal.module.css';

export interface DailyGoalProps {
  /** Words learned today. */
  current: number;
  /** The learner's daily target. */
  target: number;
  title?: string;
  description?: string;
}

/** "Today's Goal" card (reference screen 1). The whole card links into practice. */
export function DailyGoal({
  current,
  target,
  title = "Today's Goal",
  description,
}: DailyGoalProps) {
  const safeTarget = Math.max(1, target);
  const percent = clampPercent((current / safeTarget) * 100);
  const caption = description ?? `Learn ${target} new words`;
  const remaining = Math.max(0, safeTarget - current);
  const met = current >= safeTarget;
  const status = met
    ? 'Goal met — nice work!'
    : `Keep going — ${remaining} more ${remaining === 1 ? 'word' : 'words'}`;

  return (
    <Link to={ROUTES.practice} className={styles.card}>
      <div className={styles.row}>
        <span className={styles.badge}>
          <Icon name="goal" size={22} />
        </span>
        <div className={styles.copy}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.caption}>{caption}</p>
        </div>
        <span className={styles.tally}>
          <strong>{current}</strong> / {target} words
        </span>
      </div>

      <div className={styles.bar}>
        <ProgressBar
          value={percent}
          size="lg"
          ariaLabel={`Daily goal: ${current} of ${target} words`}
        />
        <p className={styles.barLabel}>
          <span className={styles.barPercent}>{formatPercent(percent)}</span>
          <span className={styles.barStatus}>{status}</span>
        </p>
      </div>
    </Link>
  );
}
