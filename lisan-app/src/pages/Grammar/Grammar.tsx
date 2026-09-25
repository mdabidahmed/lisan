import { useMemo } from 'react';

import { DashboardLayout, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { useGrammarLessons } from '@/features/grammar';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useCompletedLessons } from '@/store/lessonProgressStore';

import { GrammarFilters } from './GrammarFilters';
import { LessonCard } from './LessonCard';
import { useGrammarFilters } from './useGrammarFilters';
import styles from './Grammar.module.css';

export function GrammarPage() {
  useDocumentMeta({
    title: 'Grammar',
    description:
      'Arabic grammar lessons: nahw, sarf, pronouns, verbs, cases and sentence structure.',
  });

  const { data: lessons = [], isLoading } = useGrammarLessons();
  const filters = useGrammarFilters();
  const completedById = useCompletedLessons();

  const visible = useMemo(
    () =>
      lessons.filter(
        (lesson) =>
          (filters.topic === 'all' || lesson.topic === filters.topic) &&
          (filters.level === 'all' || lesson.level === filters.level),
      ),
    [lessons, filters.topic, filters.level],
  );

  const completedCount = useMemo(
    () => lessons.filter((lesson) => completedById[lesson.id] !== undefined).length,
    [lessons, completedById],
  );

  return (
    <DashboardLayout
      header={
        <PageHeader
          title="Grammar"
          subtitle="Understand how Arabic works, one clear lesson at a time."
          {...(lessons.length === 0
            ? {}
            : {
                aside: (
                  <div className={styles.progressAside}>
                    <ProgressBar
                      value={completedCount}
                      max={lessons.length}
                      label={`${completedCount} of ${lessons.length} lessons complete`}
                      showValue
                      tone="success"
                    />
                  </div>
                ),
              })}
        />
      }
    >
      {isLoading ? (
        <div className={styles.grid} aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Skeleton key={index} height={140} radius="var(--radius-lg)" />
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <EmptyState
          icon="grammar"
          title="No lessons yet"
          description="Grammar lessons will appear here as the content library grows."
        />
      ) : (
        <>
          <GrammarFilters
            lessons={lessons}
            topic={filters.topic}
            level={filters.level}
            onTopicChange={filters.setTopic}
            onLevelChange={filters.setLevel}
            isFiltered={filters.isFiltered}
            onReset={filters.reset}
          />

          {visible.length === 0 ? (
            <EmptyState
              icon="grammar"
              title="No lessons match these filters"
              description="Try another topic or level."
              action={
                <Button variant="secondary" size="sm" onClick={filters.reset}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ul className={styles.grid}>
              {visible.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  completed={completedById[lesson.id] !== undefined}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
