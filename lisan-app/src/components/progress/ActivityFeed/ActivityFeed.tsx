import { Icon } from '@/components/icons';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ActivityEntry } from '@/types/progress';
import { resolveAccentColor } from '@/utils/color';
import { formatRelativeTime } from '@/utils/format';

import styles from './ActivityFeed.module.css';

export interface ActivityFeedProps {
  entries: readonly ActivityEntry[];
  /** Passed in by tests so the relative timestamps are deterministic. */
  now?: Date | undefined;
  emptyDescription?: string | undefined;
}

/** Timeline of learning events (reference screen 5, bottom left). */
export function ActivityFeed({
  entries,
  now,
  emptyDescription = 'Learn a word or take a quiz and it will show up here.',
}: ActivityFeedProps) {
  if (entries.length === 0) {
    return <EmptyState icon="study-time" title="Nothing here yet" description={emptyDescription} />;
  }

  return (
    <ul className={styles.list}>
      {entries.map((entry) => {
        const accent = resolveAccentColor(entry.accent);

        return (
          <li key={entry.id} className={styles.row}>
            <span
              className={styles.icon}
              style={{ color: accent.fg, backgroundColor: accent.bg }}
              aria-hidden="true"
            >
              <Icon name={entry.icon} size={18} />
            </span>

            <span className={styles.copy}>
              <span className={styles.label}>{entry.label}</span>
              {entry.detail === undefined || entry.detail === '' ? null : (
                <span className={styles.detail}>{entry.detail}</span>
              )}
            </span>

            <time className={styles.time} dateTime={entry.at}>
              {formatRelativeTime(entry.at, now)}
            </time>
          </li>
        );
      })}
    </ul>
  );
}
