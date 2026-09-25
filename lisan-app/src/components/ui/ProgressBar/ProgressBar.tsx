import { useId, type CSSProperties } from 'react';

import { clampPercent, cn, formatPercent, resolveAccentColor } from '@/utils';

import styles from './ProgressBar.module.css';

export type ProgressBarTone = 'primary' | 'success' | 'warning' | 'accent';

export interface ProgressBarProps {
  value: number;
  max?: number | undefined;
  label?: string | undefined;
  showValue?: boolean | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  tone?: ProgressBarTone | undefined;
  /** Accent token name or hex — overrides `tone`, used for per-category progress. */
  accentColor?: string | undefined;
  className?: string | undefined;
  ariaLabel?: string | undefined;
}

const SIZE_CLASS: Record<'sm' | 'md' | 'lg', string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const TONE_CLASS: Record<ProgressBarTone, string | undefined> = {
  primary: styles.primary,
  success: styles.success,
  warning: styles.warning,
  accent: styles.accent,
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  tone = 'primary',
  accentColor,
  className,
  ariaLabel,
}: ProgressBarProps) {
  const labelId = useId();
  const safeMax = max > 0 ? max : 100;
  const percent = clampPercent((value / safeMax) * 100);

  const fillStyle: CSSProperties = { inlineSize: `${percent}%` };
  if (accentColor !== undefined) {
    fillStyle.backgroundColor = resolveAccentColor(accentColor).fg;
  }

  const hasHeader = label !== undefined || showValue;
  const naming =
    label === undefined
      ? { 'aria-label': ariaLabel ?? 'Progress' }
      : { 'aria-labelledby': labelId };

  return (
    <div className={cn(styles.root, className)}>
      {hasHeader ? (
        <div className={styles.header}>
          {label === undefined ? null : (
            <span className={styles.label} id={labelId}>
              {label}
            </span>
          )}
          {showValue ? <span className={styles.value}>{formatPercent(percent)}</span> : null}
        </div>
      ) : null}

      <div
        className={cn(styles.track, SIZE_CLASS[size], TONE_CLASS[tone])}
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        {...naming}
      >
        <div className={styles.fill} style={fillStyle} />
      </div>
    </div>
  );
}
