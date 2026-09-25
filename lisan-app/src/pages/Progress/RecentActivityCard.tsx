import { useState } from 'react';

import { Icon } from '@/components/icons';
import { ActivityFeed } from '@/components/progress';
import { Card, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useActivityFeed } from '@/features/progress';
import type { Category } from '@/types';

import styles from './Progress.module.css';

/** How many rows the card shows before "View All" is offered (reference screen 5). */
const COLLAPSED_COUNT = 5;

export interface RecentActivityCardProps {
  categoriesById: Readonly<Record<string, Category>>;
}

export function RecentActivityCard({ categoriesById }: RecentActivityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { entries, isLoading } = useActivityFeed({ categoriesById });

  const canExpand = entries.length > COLLAPSED_COUNT;
  const visible = expanded ? entries : entries.slice(0, COLLAPSED_COUNT);

  const toggle = (
    <button
      type="button"
      className={styles.viewAll}
      aria-expanded={expanded}
      aria-label={expanded ? 'Show fewer activity entries' : 'View all recent activity'}
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
      <CardHeader title="Recent Activity" as="h2" {...(canExpand ? { action: toggle } : {})} />
      <div className={styles.cardBody}>
        {isLoading ? (
          <div className={styles.feedSkeleton} aria-busy="true" aria-live="polite">
            <span className="u-visually-hidden">Loading recent activity…</span>
            {[0, 1, 2, 3, 4].map((index) => (
              <Skeleton key={index} height={34} radius="var(--radius-sm)" />
            ))}
          </div>
        ) : (
          <ActivityFeed entries={visible} />
        )}
      </div>
    </Card>
  );
}
