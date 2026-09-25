import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

import styles from './PageSkeletons.module.css';

/**
 * Route-level Suspense fallbacks.
 *
 * Each one mirrors the real layout of the page it stands in for, so the shell never jumps when the
 * chunk lands (product spec §69 — no blank white screens, no bare spinners).
 */

function HeaderSkeleton() {
  return (
    <div className={styles.header}>
      <Skeleton width="42%" height={34} radius="var(--radius-sm)" />
      <Skeleton width="60%" height={16} radius="var(--radius-xs)" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      <HeaderSkeleton />
      <Skeleton height={230} radius="var(--radius-xl)" />
      <div className={styles.quadGrid}>
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} height={110} radius="var(--radius-lg)" />
        ))}
      </div>
      <div className={styles.duoGrid}>
        <Skeleton height={120} radius="var(--radius-lg)" />
        <Skeleton height={120} radius="var(--radius-lg)" />
      </div>
    </div>
  );
}

export function VocabularyListSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      <HeaderSkeleton />
      <Skeleton height={48} radius="var(--radius-md)" />
      <div className={styles.chips}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Skeleton key={index} width={86} height={34} radius="var(--radius-pill)" />
        ))}
      </div>
      <div className={styles.rows}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Card key={index} padding="sm">
            <div className={styles.row}>
              <Skeleton width={64} height={64} radius="var(--radius-md)" />
              <div className={styles.rowCopy}>
                <Skeleton width="36%" height={24} />
                <Skeleton width="24%" height={13} />
                <Skeleton width="30%" height={13} />
              </div>
              <Skeleton width={40} height={40} circle />
              <Skeleton width={40} height={40} circle />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function WordDetailSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      <Skeleton width={150} height={20} />
      <Card padding="lg">
        <div className={styles.hero}>
          <Skeleton width={230} height={190} radius="var(--radius-lg)" />
          <div className={styles.heroCopy}>
            <Skeleton width="48%" height={46} />
            <Skeleton width="30%" height={18} />
            <Skeleton width="22%" height={18} />
            <Skeleton width={64} height={64} circle />
          </div>
        </div>
      </Card>
      <Skeleton height={46} radius="var(--radius-md)" />
      <div className={styles.duoGrid}>
        <Skeleton height={260} radius="var(--radius-lg)" />
        <Skeleton height={260} radius="var(--radius-lg)" />
      </div>
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      <HeaderSkeleton />
      <div className={styles.quizGrid}>
        <Skeleton height={380} radius="var(--radius-xl)" />
        <div className={styles.rail}>
          <Skeleton height={180} radius="var(--radius-lg)" />
          <Skeleton height={140} radius="var(--radius-lg)" />
        </div>
      </div>
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      <HeaderSkeleton />
      <div className={styles.quadGrid}>
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} height={104} radius="var(--radius-lg)" />
        ))}
      </div>
      <div className={styles.chartGrid}>
        <Skeleton height={320} radius="var(--radius-lg)" />
        <Skeleton height={320} radius="var(--radius-lg)" />
      </div>
    </div>
  );
}

/** Generic fallback for the simpler routes (grammar, bookmarks, settings). */
export function SimplePageSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      <HeaderSkeleton />
      <Skeleton height={64} radius="var(--radius-lg)" />
      <Skeleton height={220} radius="var(--radius-lg)" />
      <Skeleton height={180} radius="var(--radius-lg)" />
    </div>
  );
}
