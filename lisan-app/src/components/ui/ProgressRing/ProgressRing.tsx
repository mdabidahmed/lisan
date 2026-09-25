import type { CSSProperties, ReactNode } from 'react';

import { clampPercent, cn, formatPercent } from '@/utils';

import styles from './ProgressRing.module.css';

export interface ProgressRingProps {
  value: number;
  max?: number | undefined;
  size?: number | undefined;
  thickness?: number | undefined;
  tone?: 'primary' | 'success' | 'warning' | undefined;
  label?: string | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

type RingStyle = CSSProperties & Record<`--${string}`, string>;

/** Circular completion indicator. Pure SVG so it scales crisply and needs no chart dependency. */
export function ProgressRing({
  value,
  max = 100,
  size = 72,
  thickness = 8,
  tone = 'primary',
  label,
  className,
  children,
}: ProgressRingProps) {
  const percent = clampPercent(max === 0 ? 0 : (value / max) * 100);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent / 100);
  const center = size / 2;

  const style: RingStyle = { '--ring-size': `${size}px` };
  const accessibleLabel =
    label === undefined
      ? `${formatPercent(percent)} complete`
      : `${label}: ${formatPercent(percent)}`;

  return (
    <div className={cn(styles.root, styles[tone], className)} style={style}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-label={accessibleLabel}
      >
        <circle
          className={styles.track}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={thickness}
        />
        <circle
          className={styles.indicator}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      {children === undefined ? null : <div className={styles.center}>{children}</div>}
    </div>
  );
}
