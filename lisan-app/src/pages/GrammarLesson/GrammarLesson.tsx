import { useParams } from 'react-router-dom';

import { useToast } from '@/app/providers/toast';
import { LearningLayout } from '@/components/layout';
import { ArabicText } from '@/components/ui/ArabicText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { RelatedWords } from '@/components/vocabulary';
import { ROUTES } from '@/constants/routes';
import { grammarTopicLabel, useGrammarLesson, useLessonWords } from '@/features/grammar';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { isNotFoundError } from '@/services/api';
import { useIsLessonComplete, useLessonProgressActions } from '@/store/lessonProgressStore';

import { LessonQuiz } from './LessonQuiz';
import { LessonSection } from './LessonSection';
import styles from './GrammarLesson.module.css';

export function GrammarLessonPage() {
  const { lessonId = '' } = useParams<{ lessonId: string }>();
  const { data: lesson, isLoading, isError, error, refetch } = useGrammarLesson(lessonId);

  const completed = useIsLessonComplete(lessonId);
  const { markComplete, markIncomplete } = useLessonProgressActions();
  const toast = useToast();

  const relatedWordIds = lesson?.relatedWordIds ?? [];
  const related = useLessonWords(relatedWordIds);

  useDocumentMeta({
    title: lesson?.title ?? 'Grammar lesson',
    description: lesson?.summary,
    type: 'article',
  });

  const complete = () => {
    markComplete(lessonId);
    toast.success('Lesson complete', { description: lesson?.title ?? '' });
  };

  const toggleCompletion = () => {
    if (completed) {
      markIncomplete(lessonId);
      toast.info('Lesson marked as not complete');
      return;
    }
    complete();
  };

  if (isLoading) {
    return (
      <LearningLayout backTo={ROUTES.grammar} backLabel="Back to grammar">
        <Skeleton height={44} width="48%" />
        <Skeleton height={280} radius="var(--radius-lg)" />
      </LearningLayout>
    );
  }

  // Only a 404 means the lesson is missing. A dropped request is recoverable, and saying "not
  // found" for it both misinforms the learner and takes away the retry that would fix it.
  if (isError && !isNotFoundError(error)) {
    return (
      <LearningLayout backTo={ROUTES.grammar} backLabel="Back to grammar">
        <ErrorState
          title="We could not load this lesson"
          description="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      </LearningLayout>
    );
  }

  if (!lesson) {
    return (
      <LearningLayout backTo={ROUTES.grammar} backLabel="Back to grammar">
        <EmptyState
          icon="grammar"
          title="Lesson not found"
          description="This grammar lesson is not in the library yet."
        />
      </LearningLayout>
    );
  }

  return (
    <LearningLayout
      backTo={ROUTES.grammar}
      backLabel="Back to grammar"
      actions={
        <Button
          variant={completed ? 'secondary' : 'primary'}
          size="sm"
          {...(completed ? { iconLeft: 'check' as const } : {})}
          aria-pressed={completed}
          onClick={toggleCompletion}
        >
          {completed ? 'Completed' : 'Mark as complete'}
        </Button>
      }
    >
      <header className={styles.header}>
        <h1 className={styles.title}>{lesson.title}</h1>
        <ArabicText as="p" className={styles.arabic}>
          {lesson.arabicTitle}
        </ArabicText>
        <p className={styles.summary}>{lesson.summary}</p>
        <div className={styles.meta}>
          <Badge variant="primary" size="sm">
            {lesson.level}
          </Badge>
          <Badge variant="purple" size="sm">
            {grammarTopicLabel(lesson.topic)}
          </Badge>
          <span className={styles.minutes}>{lesson.estimatedMinutes} min read</span>
        </div>
      </header>

      {lesson.sections.map((section) => (
        <LessonSection key={section.id} section={section} />
      ))}

      {relatedWordIds.length === 0 ? null : (
        <Card as="section" padding="md">
          <CardHeader
            title="Words from this lesson"
            subtitle="Open a word for its audio, meaning and examples."
            icon="vocabulary"
            accent="green"
            as="h2"
          />
          <div className={styles.related}>
            <RelatedWords
              words={related.words}
              isLoading={related.isLoading}
              isError={related.isError}
              skeletonCount={relatedWordIds.length}
            />
          </div>
        </Card>
      )}

      <LessonQuiz lesson={lesson} completed={completed} onMarkComplete={complete} />
    </LearningLayout>
  );
}
