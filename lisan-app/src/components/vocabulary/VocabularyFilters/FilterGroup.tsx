import { useId, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './VocabularyFilters.module.css';

export interface FilterGroupProps {
  label: string;
  className?: string | undefined;
  children: ReactNode;
}

/**
 * A labelled row of toggle chips. The visible label doubles as the group's accessible name, so a
 * screen reader announces "Level, group" before the chips rather than six bare letters.
 */
export function FilterGroup({ label, className, children }: FilterGroupProps) {
  const labelId = useId();

  return (
    <div className={cn(styles.group, className)} role="group" aria-labelledby={labelId}>
      <span className={styles.groupLabel} id={labelId}>
        {label}
      </span>
      <div className={styles.chips}>{children}</div>
    </div>
  );
}
