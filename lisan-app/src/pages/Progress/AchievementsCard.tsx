import { useState } from 'react';

import { Icon } from '@/components/icons';
import { AchievementList } from '@/components/progress';
import { Card, CardHeader } from '@/components/ui/Card';
import { useAchievements } from '@/features/progress';
import type { ProgressSummary } from '@/types';

import styles from './Progress.module.css';

/** The design shows three badges; the rest are one click away. */
const COLLAPSED_COUNT = 3;

export interface AchievementsCardProps {
  summary: ProgressSummary;
}

export function AchievementsCard({ summary }: AchievementsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const achievements = useAchievements(summary);

  const canExpand = achievements.length > COLLAPSED_COUNT;
  const visible = expanded ? achievements : achievements.slice(0, COLLAPSED_COUNT);

  const toggle = (
    <button
      type="button"
      className={styles.viewAll}
      aria-expanded={expanded}
      aria-label={expanded ? 'Show fewer achievements' : 'View all achievements'}
      onClick={() => {
        setExpanded((current) => !current);
      }}
    >
      {expanded ? 'Show Less' : 'View All'}
      <Icon name="arrow-right" size={16} />
    </button>
  );

  return (
    <Card padding="md">
      <CardHeader title="Achievements" as="h2" {...(canExpand ? { action: toggle } : {})} />
      <div className={styles.cardBody}>
        <AchievementList achievements={visible} />
      </div>
    </Card>
  );
}
