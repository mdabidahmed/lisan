import { useNavigate } from 'react-router-dom';

import { QuizLayout } from '@/components/layout';
import { AnswerReview } from '@/components/quiz';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Skeleton } from '@/components/ui/Skeleton';
import { ROUTES, routePaths } from '@/constants/routes';
import { useQuizReview } from '@/features/practice';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useQuizActions } from '@/store/quizSessionStore';
import { createId } from '@/utils/id';
import { formatElapsed, formatPercent } from '@/utils/format';

import styles from './QuizResult.module.css';

export function QuizResultPage() {
  useDocumentMeta({
    title: 'Quiz result',
    description: 'Your score, accuracy and time for this quiz.',
  });

  const navigate = useNavigate();
  const { result, rows, missedQuestions, mode, config, isLoading } = useQuizReview();
  const { start, reset } = useQuizActions();

  if (!result) {
    return (
      <QuizLayout>
        <EmptyState
          icon="quiz"
          title="No quiz to show yet"
          description="Finish a practice quiz and your results will appear here."
          action={
            <Button onClick={() => void navigate(ROUTES.practice)} iconRight="arrow-right">
              Go to Practice
            </Button>
          }
        />
      </QuizLayout>
    );
  }

  const canRetryMissed = missedQuestions.length > 0 && mode !== null && config !== null;

  /*
   * The missed set is replayed from the questions the learner just saw rather than regenerated,
   * so "retry" really does mean the same words — and `resume` stops the runner from replacing
   * this hand-built session with a freshly generated one.
   */
  const retryMissed = () => {
    if (!canRetryMissed) return;

    start({
      id: createId('quiz-retry'),
      config: { ...config, questionCount: missedQuestions.length },
      questions: missedQuestions,
    });
    void navigate(`${routePaths.practiceMode(mode)}?resume=1`);
  };

  const startNewQuiz = () => {
    reset();
    void navigate(ROUTES.practice);
  };

  return (
    <QuizLayout title="Quiz Complete">
      <Card padding="lg">
        <div className={styles.summary}>
          <ProgressRing value={result.accuracy} size={148} tone="primary">
            <span className={styles.score}>
              {result.correct}/{result.total}
            </span>
            <span className={styles.percent}>{formatPercent(result.accuracy)}</span>
          </ProgressRing>

          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt>Correct</dt>
              <dd>{result.correct}</dd>
            </div>
            <div className={styles.stat}>
              <dt>Incorrect</dt>
              <dd>{result.incorrect}</dd>
            </div>
            <div className={styles.stat}>
              <dt>Accuracy</dt>
              <dd>{formatPercent(result.accuracy)}</dd>
            </div>
            <div className={styles.stat}>
              <dt>Time</dt>
              <dd>{formatElapsed(result.durationMs)}</dd>
            </div>
          </dl>
        </div>

        <div className={styles.actions}>
          {canRetryMissed ? (
            <Button onClick={retryMissed} iconLeft="replay">
              Retry {missedQuestions.length} Missed
            </Button>
          ) : null}
          <Button
            variant={canRetryMissed ? 'secondary' : 'primary'}
            onClick={startNewQuiz}
            iconLeft="quiz"
          >
            New Quiz
          </Button>
          <Button variant="secondary" onClick={() => void navigate(ROUTES.progress)}>
            View Progress
          </Button>
        </div>
      </Card>

      <Card padding="md">
        <CardHeader
          title="Review Answers"
          subtitle="What you said, and what the answer was."
          icon="check"
          as="h2"
        />
        {isLoading ? (
          <div className={styles.reviewLoading}>
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} height={64} radius="var(--radius-md)" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon="info"
            title="Nothing to review"
            description="This quiz finished without any recorded answers."
          />
        ) : (
          <AnswerReview rows={rows} />
        )}
      </Card>
    </QuizLayout>
  );
}
