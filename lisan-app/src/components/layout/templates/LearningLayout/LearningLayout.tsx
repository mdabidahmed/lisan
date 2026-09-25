import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@/components/icons';
import { cn } from '@/utils/cn';

import styles from './LearningLayout.module.css';

export interface LearningLayoutProps {
  children: ReactNode;
  /** Where the back link goes. Defaults to the vocabulary list. */
  backTo?: string;
  backLabel?: string;
  /** Rendered opposite the back link (bookmark toggle, share). */
  actions?: ReactNode;
  className?: string | undefined;
}

/** Template for detail reading views: word detail and grammar lessons. */
export function LearningLayout({
  children,
  backTo = '/vocabulary',
  backLabel = 'Back to words',
  actions,
  className,
}: LearningLayoutProps) {
  return (
    <div className={cn('u-page', className)}>
      <div className={styles.bar}>
        <Link to={backTo} className={styles.back}>
          <Icon name="arrow-left" size={18} />
          {backLabel}
        </Link>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
