import { cn } from '@/utils';

import styles from './Divider.module.css';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical' | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

export function Divider({ orientation = 'horizontal', label, className }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn(styles.vertical, className)}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (label === undefined) {
    return (
      <div
        className={cn(styles.horizontal, className)}
        role="separator"
        aria-orientation="horizontal"
      />
    );
  }

  return (
    <div className={cn(styles.labelled, className)} role="separator" aria-orientation="horizontal">
      <span className={styles.rule} />
      <span className={styles.label}>{label}</span>
      <span className={styles.rule} />
    </div>
  );
}
