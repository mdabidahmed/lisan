import { StatCard, type StatCardProps } from '@/components/ui/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { MetricDelta, ProgressDeltas, ProgressSummary } from '@/types/progress';
import { formatDuration, formatNumber, formatPercent } from '@/utils/format';

import styles from './ProgressOverview.module.css';

export interface ProgressOverviewProps {
  summary: ProgressSummary;
  /** Week-over-week change per metric. A metric with no baseline is absent, and shows no line. */
  deltas?: ProgressDeltas | undefined;
  isLoading?: boolean;
}

type DeltaProps = Pick<StatCardProps, 'delta' | 'deltaTone'>;

function deltaProps(delta: MetricDelta | undefined): DeltaProps {
  return delta ? { delta: delta.label, deltaTone: delta.tone } : {};
}

/** The four headline metrics at the top of the Progress dashboard (reference screen 5). */
export function ProgressOverview({ summary, deltas, isLoading = false }: ProgressOverviewProps) {
  if (isLoading) {
    return (
      <div className={styles.grid} aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} height={104} radius="var(--radius-lg)" />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      <StatCard
        icon="vocabulary"
        label="Words Learned"
        value={formatNumber(summary.wordsLearned)}
        accent="green"
        {...deltaProps(deltas?.wordsLearned)}
      />
      <StatCard
        icon="quiz"
        label="Quizzes Completed"
        value={formatNumber(summary.quizzesCompleted)}
        accent="purple"
        {...deltaProps(deltas?.quizzesCompleted)}
      />
      <StatCard
        icon="goal"
        label="Accuracy"
        value={formatPercent(summary.accuracy)}
        accent="orange"
        {...deltaProps(deltas?.accuracy)}
      />
      <StatCard
        icon="study-time"
        label="Study Time"
        value={formatDuration(summary.studyMinutes)}
        accent="blue"
        {...deltaProps(deltas?.studyMinutes)}
      />
    </div>
  );
}
