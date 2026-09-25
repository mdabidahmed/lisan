import { cn } from '@/utils';

import styles from './Spinner.module.css';

export interface SpinnerProps {
  /** Rendered square size in px. Defaults to 18 so it drops into a control without resizing it. */
  size?: number | undefined;
  /** Supplying a label promotes the spinner from decoration to an announced status. */
  label?: string | undefined;
  className?: string | undefined;
}

const DEFAULT_SIZE = 18;

export function Spinner({ size = DEFAULT_SIZE, label, className }: SpinnerProps) {
  return (
    <span
      className={cn(styles.root, className)}
      {...(label === undefined ? { 'aria-hidden': true } : { role: 'status' })}
    >
      <svg
        className={styles.svg}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        focusable="false"
        aria-hidden="true"
      >
        <circle className={styles.track} cx="12" cy="12" r="9" />
        <circle className={styles.indicator} cx="12" cy="12" r="9" />
      </svg>
      {label === undefined ? null : <span className="u-visually-hidden">{label}</span>}
    </span>
  );
}
