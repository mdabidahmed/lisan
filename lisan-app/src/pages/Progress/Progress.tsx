import { useMemo } from 'react';

import { illustrations } from '@/assets';
import { LineChart } from '@/components/charts';
import { DashboardLayout } from '@/components/layout';
import { CategoryProgressList, ProgressOverview, StudyStreak } from '@/components/progress';
import { Card, CardHeader } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { ProgressSkeleton } from '@/components/skeletons';
import { useProgressOverview, useWeeklyDeltas } from '@/features/progress';
import { useCategories } from '@/features/vocabulary';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useProgressStore } from '@/store/progressStore';

import { AchievementsCard } from './AchievementsCard';
import { ChartInsights } from './ChartInsights';
import { ProgressHeader } from './ProgressHeader';
import { RecentActivityCard } from './RecentActivityCard';
import { StudyCalendar } from './StudyCalendar';
import styles from './Progress.module.css';

export function ProgressPage() {
  useDocumentMeta({
    title: 'Progress',
    description: 'Track words learned, quiz accuracy, study time and your streak.',
  });

  const { data, isLoading, isError, refetch } = useProgressOverview();
  const { data: categories = [] } = useCategories();
  const deltas = useWeeklyDeltas(data?.summary);
  const studyDays = useProgressStore((state) => state.studyDays);

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category])),
    [categories],
  );

  if (isLoading) return <ProgressSkeleton />;

  if (isError || !data) {
    return (
      <DashboardLayout
        header={
          <ProgressHeader
            subtitle="Track your learning journey and stay motivated."
            wordsLearned={0}
          />
        }
      >
        <ErrorState
          illustration={illustrations.emptyProgress}
          title="We could not load your progress"
          description="Your data is stored on this device. Try reloading the page."
          onRetry={() => void refetch()}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      header={
        <ProgressHeader
          subtitle="Track your learning journey and stay motivated."
          wordsLearned={data.summary.wordsLearned}
        />
      }
    >
      <ProgressOverview summary={data.summary} deltas={deltas} />

      <div className={styles.chartRow}>
        <div className={styles.chartColumn}>
          <Card padding="md">
            <CardHeader title="Words Learned Over Time" as="h2" />
            <LineChart
              data={data.wordsOverTime}
              ariaLabel="Words learned over the last 30 days"
              valueSuffix="words"
            />
            <ChartInsights summary={data.summary} />
          </Card>

          <StudyCalendar studyDays={studyDays} />
        </div>

        <Card padding="md">
          <CardHeader title="Category Progress" as="h2" />
          <div className={styles.categoryList}>
            <CategoryProgressList items={data.categories} categoriesById={categoriesById} />
          </div>
        </Card>
      </div>

      <div className={styles.trioRow}>
        <RecentActivityCard categoriesById={categoriesById} />

        <StudyStreak days={data.summary.currentStreak} week={data.weekStudyDays} />

        <AchievementsCard summary={data.summary} />
      </div>
    </DashboardLayout>
  );
}
