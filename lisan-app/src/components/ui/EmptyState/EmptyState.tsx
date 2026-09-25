import type { ReactNode } from 'react';

import type { VectorAsset } from '@/assets';
import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/utils';

import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  icon?: IconName | undefined;
  /** Takes the place of the icon tile. The title carries the meaning, so it renders decoratively. */
  illustration?: VectorAsset | undefined;
  title: string;
  description?: string | undefined;
  action?: ReactNode;
  className?: string | undefined;
}

/** Shown when a list legitimately has nothing in it — a filter with no matches, no bookmarks yet. */
export function EmptyState({
  icon = 'search',
  illustration,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(styles.root, className)}>
      {illustration === undefined ? (
        <span className={styles.tile}>
          <Icon name={icon} size={24} />
        </span>
      ) : (
        <img
          className={styles.illustration}
          src={illustration.src}
          alt=""
          width={illustration.width}
          height={illustration.height}
          loading="lazy"
          decoding="async"
        />
      )}
      <p className={styles.title}>{title}</p>
      {description === undefined ? null : <p className={styles.description}>{description}</p>}
      {action === undefined ? null : <div className={styles.action}>{action}</div>}
    </div>
  );
}
