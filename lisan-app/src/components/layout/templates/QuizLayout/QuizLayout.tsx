import type { ReactNode } from 'react';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/utils/cn';
import { clampPercent } from '@/utils/format';

import styles from './QuizLayout.module.css';

export interface QuizProgress {
  current: number;
  total: number;
}

export interface QuizLayoutProps {
  children: ReactNode;
  title?: string;
  progress?: QuizProgress | undefined;
  onExit?: (() => void) | undefined;
  /** Settings / tips rail, as on reference screen 4. */
  aside?: ReactNode;
  className?: string | undefined;
}

/**
 * Focused template for an active quiz: one question at a time, prominent progress, minimal chrome
 * (product spec §50).
 */
export function QuizLayout({
  children,
  title,
  progress,
  onExit,
  aside,
  className,
}: QuizLayoutProps) {
  const percent = progress
    ? clampPercent((progress.current / Math.max(1, progress.total)) * 100)
    : 0;

  return (
    <div className={cn('u-page', className)}>
      {progress || title || onExit ? (
        <div className={styles.bar}>
          <div className={styles.meta}>
            {title ? <p className={styles.title}>{title}</p> : null}
            {progress ? (
              <p className={styles.counter}>
                Question {progress.current} of {progress.total}
              </p>
            ) : null}
          </div>
          {progress ? (
            <div className={styles.progress}>
              <ProgressBar value={percent} ariaLabel="Quiz progress" showValue />
            </div>
          ) : null}
          {onExit ? (
            <IconButton icon="close" label="Exit quiz" variant="ghost" onClick={onExit} />
          ) : null}
        </div>
      ) : null}

      <div className={aside ? styles.split : styles.single}>
        <div className={styles.stage}>{children}</div>
        {aside ? (
          <aside className={styles.rail} aria-label="Quiz options">
            {aside}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
