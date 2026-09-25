import { Icon } from '@/components/icons';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { DerivedAchievement } from '@/features/progress/achievements';
import { cn } from '@/utils/cn';

import styles from './AchievementList.module.css';

export interface AchievementListProps {
  achievements: readonly DerivedAchievement[];
}

/**
 * Badge list (reference screen 5, bottom right).
 *
 * Earned badges are marked with a check rather than colour alone, and an outstanding badge always
 * shows how far along it is — a locked row with no measurable progress still renders its bar at
 * zero so the target is visible.
 */
export function AchievementList({ achievements }: AchievementListProps) {
  if (achievements.length === 0) {
    return (
      <EmptyState
        icon="trophy"
        title="No badges yet"
        description="Badges unlock as you learn words, finish lessons and complete quizzes."
      />
    );
  }

  return (
    <ul className={styles.list}>
      {achievements.map((achievement) => {
        const earned = achievement.state === 'earned';

        return (
          <li key={achievement.id} className={styles.row} data-state={achievement.state}>
            <span
              className={cn(styles.tile, earned ? styles.tileEarned : styles.tileLocked)}
              aria-hidden="true"
            >
              <Icon name={achievement.icon} size={18} />
            </span>

            <span className={styles.copy}>
              <span className={styles.title}>{achievement.title}</span>
              <span className={styles.description}>{achievement.description}</span>
            </span>

            {earned ? (
              <span className={styles.earned}>
                <Icon name="check" size={14} />
                <span className="u-visually-hidden">Earned</span>
              </span>
            ) : (
              <span className={styles.count}>{achievement.progressLabel}</span>
            )}

            {earned ? null : (
              <span className={styles.bar}>
                <ProgressBar
                  value={achievement.progress.current}
                  max={achievement.progress.target}
                  size="sm"
                  ariaLabel={`${achievement.title}: ${achievement.progressLabel}`}
                />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
