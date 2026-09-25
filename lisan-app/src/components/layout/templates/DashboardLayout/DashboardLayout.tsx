import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './DashboardLayout.module.css';

export interface DashboardLayoutProps {
  children: ReactNode;
  /** Usually a `<PageHeader>`. Rendered full width above the columns. */
  header?: ReactNode;
  /** Optional right rail (quiz settings, study tips). Collapses under the main column on tablet. */
  aside?: ReactNode;
  className?: string | undefined;
}

/**
 * The standard content template: a full-width header, then either one wide column or a
 * main + rail split when `aside` is supplied.
 */
export function DashboardLayout({ children, header, aside, className }: DashboardLayoutProps) {
  return (
    <div className={cn('u-page', className)}>
      {header}
      {aside ? (
        <div className={styles.split}>
          <div className={styles.main}>{children}</div>
          <aside className={styles.rail} aria-label="Page options">
            {aside}
          </aside>
        </div>
      ) : (
        <div className={styles.main}>{children}</div>
      )}
    </div>
  );
}
