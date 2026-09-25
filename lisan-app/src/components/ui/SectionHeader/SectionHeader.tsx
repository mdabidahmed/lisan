import { createElement, type ReactNode } from 'react';

import { cn } from '@/utils';

import styles from './SectionHeader.module.css';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string | undefined;
  action?: ReactNode;
  as?: 'h2' | 'h3' | undefined;
  id?: string | undefined;
  className?: string | undefined;
}

/** "Continue Learning … View All" band that opens every dashboard section. */
export function SectionHeader({
  title,
  subtitle,
  action,
  as = 'h2',
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.copy}>
        {createElement(as, { className: styles.title, ...(id === undefined ? {} : { id }) }, title)}
        {subtitle === undefined ? null : <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action === undefined ? null : <div className={styles.action}>{action}</div>}
    </div>
  );
}
