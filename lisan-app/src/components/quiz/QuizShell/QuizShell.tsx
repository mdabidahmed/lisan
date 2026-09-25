import type { ReactNode } from 'react';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { clampPercent, formatPercent } from '@/utils/format';

import styles from './QuizShell.module.css';

export interface QuizShellProps {
  questionNumber: number;
  totalQuestions: number;
  /** The instruction above the question, e.g. "Select the correct meaning:". */
  prompt: string;
  children: ReactNode;
}

/**
 * The frame every question type shares: counter, progress and instruction (reference screen 4).
 * Keeping it in one place is what stops four question layouts from drifting apart.
 */
export function QuizShell({ questionNumber, totalQuestions, prompt, children }: QuizShellProps) {
  const percent = clampPercent((questionNumber / Math.max(1, totalQuestions)) * 100);

  return (
    <Card padding="lg">
      <div className={styles.head}>
        <p className={styles.counter}>
          Question {questionNumber} of {totalQuestions}
        </p>
        <div className={styles.progressRow}>
          <ProgressBar value={percent} ariaLabel="Quiz progress" className={styles.progressBar} />
          {/* The bar already exposes its value through `aria-valuenow`. */}
          <span className={styles.progressValue} aria-hidden="true">
            {formatPercent(percent)}
          </span>
        </div>
      </div>

      <p className={styles.prompt}>{prompt}</p>

      {children}
    </Card>
  );
}
