import { Link } from 'react-router-dom';

import { DailyGoal, HeroBanner, QuickActions, ReminderCard, ReviewQueue } from '@/components/home';
import { DashboardLayout } from '@/components/layout';
import { Icon } from '@/components/icons';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CategoryGrid, RecentWords } from '@/components/vocabulary';
import { ROUTES } from '@/constants/routes';
import { useCategories } from '@/features/vocabulary';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useProgressStore } from '@/store/progressStore';
import { useSetting } from '@/store/settingsStore';
import { toDateKey } from '@/utils/date';

import { useRecentWords } from './useRecentWords';
import { useReviewQueue } from './useReviewQueue';
import styles from './Home.module.css';

const CONTINUE_LEARNING_COUNT = 4;
const REVIEW_QUEUE_COUNT = 4;
const RECENT_WORDS_COUNT = 8;

/** Words reviewed today. Selecting a number keeps the subscription cheap. */
function useWordsLearnedToday(): number {
  const todayKey = toDateKey();
  return useProgressStore((state) =>
    Object.values(state.byWordId).reduce(
      (count, entry) =>
        entry.lastReviewedAt && toDateKey(entry.lastReviewedAt) === todayKey ? count + 1 : count,
      0,
    ),
  );
}

export function HomePage() {
  useDocumentMeta({
    title: 'Home',
    description:
      'Your Arabic learning dashboard: daily goal, streak, categories and what to study next.',
  });

  const { data: categories = [], isLoading } = useCategories();
  const dailyGoal = useSetting('dailyGoal');
  const learnedToday = useWordsLearnedToday();
  const review = useReviewQueue(REVIEW_QUEUE_COUNT);
  const recent = useRecentWords(RECENT_WORDS_COUNT);

  return (
    <DashboardLayout>
      <HeroBanner />

      <QuickActions />

      <div className={styles.duo}>
        <DailyGoal current={learnedToday} target={dailyGoal} />
        <ReminderCard />
      </div>

      <section aria-labelledby="continue-learning">
        <SectionHeader
          id="continue-learning"
          title="Continue Learning"
          action={
            <Link to={ROUTES.vocabulary} className={styles.viewAll}>
              View All
              <Icon name="arrow-right" size={16} />
            </Link>
          }
        />
        <CategoryGrid
          categories={categories.slice(0, CONTINUE_LEARNING_COUNT)}
          isLoading={isLoading}
          variant="strip"
          className={styles.strip}
        />
      </section>

      <ReviewQueue words={review.words} total={review.total} isLoading={review.isLoading} />

      {recent.words.length > 0 ? (
        <section aria-labelledby="recent-vocabulary">
          <SectionHeader
            id="recent-vocabulary"
            title="Recently Studied"
            subtitle="Pick up where you left off."
            action={
              <Link to={ROUTES.progress} className={styles.viewAll}>
                Your progress
                <Icon name="arrow-right" size={16} />
              </Link>
            }
          />
          <RecentWords words={recent.words} className={styles.strip} />
        </section>
      ) : null}
    </DashboardLayout>
  );
}
