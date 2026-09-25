import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { QuestionStrip, QuizStage } from '@/components/quiz';
import { QuizLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ROUTES } from '@/constants/routes';
import {
  isPracticeModeId,
  usePracticeModes,
  useQuizKeyboard,
  useQuizRunner,
} from '@/features/practice';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useSettings } from '@/store/settingsStore';

import styles from './PracticeMode.module.css';

const SHORTCUTS = [
  { keys: '1 – 4', action: 'Choose an answer' },
  { keys: 'Enter', action: 'Next question' },
];

export function PracticeModePage() {
  const { mode = '' } = useParams<{ mode: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: modes = [] } = usePracticeModes();
  const settings = useSettings();

  const modeId = isPracticeModeId(mode) ? mode : null;
  const practiceMode = modes.find((item) => item.id === mode);

  const runner = useQuizRunner({
    mode: modeId,
    categoryId: searchParams.get('category') ?? undefined,
    questionCount: settings.quizQuestionCount,
    difficulty: settings.quizDifficulty,
    // Set by "retry missed words", which hands the runner a session no generated quiz matches.
    resume: searchParams.get('resume') === '1',
    onComplete: () => {
      void navigate(ROUTES.quizResult);
    },
  });

  // Image match still answers the instant a tile is picked — there is no "confirm" step to stage
  // for, so its shortcut stays wired to the direct `answerAtIndex`. Every other option-picking
  // type stages the pick and waits for a confirming Next / Enter.
  const isImageMatch = runner.question?.type === 'image-match';
  const handleSelectIndex = isImageMatch ? runner.answerAtIndex : runner.selectAtIndex;

  useQuizKeyboard({
    optionCount: runner.optionValues.length,
    onSelectIndex: handleSelectIndex,
    onAdvance: runner.advance,
    enabled: runner.question !== null,
  });

  useDocumentMeta({
    title: practiceMode ? `${practiceMode.title} practice` : 'Practice',
    description: practiceMode?.description,
  });

  const exit = () => {
    void navigate(ROUTES.practice);
  };

  if (modeId === null) {
    return (
      <QuizLayout onExit={exit}>
        <EmptyState
          icon="quiz"
          title="Unknown practice mode"
          description={`"${mode}" is not a practice mode. Pick one from the Practice page.`}
          action={<Button onClick={exit}>Back to Practice</Button>}
        />
      </QuizLayout>
    );
  }

  return (
    // The counter and progress bar live on the question card itself (reference screen 4), so the
    // layout chrome stays down to the title and the way out.
    <QuizLayout
      title={practiceMode?.title ?? 'Practice'}
      onExit={exit}
      aside={
        <>
          <Card padding="md">
            <CardHeader title="About this mode" icon="info" as="h2" />
            <p className={styles.about}>
              {practiceMode?.description ?? 'Loading the practice mode…'}
            </p>
          </Card>

          <Card padding="md">
            <CardHeader title="This session" icon="statistics" as="h2" />
            <dl className={styles.stats}>
              <div className={styles.stat}>
                <dt>Answered</dt>
                <dd>
                  {Object.keys(runner.answers).length} / {runner.totalQuestions}
                </dd>
              </div>
              <div className={styles.stat}>
                <dt>Correct</dt>
                <dd>{runner.correctCount}</dd>
              </div>
            </dl>
          </Card>

          <Card padding="md">
            <CardHeader title="Shortcuts" icon="keyboard" as="h2" />
            <dl className={styles.stats}>
              {SHORTCUTS.map((shortcut) => (
                <div key={shortcut.keys} className={styles.stat}>
                  <dt>
                    <kbd className={styles.key}>{shortcut.keys}</kbd>
                  </dt>
                  <dd>{shortcut.action}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </>
      }
    >
      {runner.isError ? (
        <ErrorState
          title="We could not build this quiz"
          description="Check your connection, or try a different category or difficulty."
          onRetry={runner.retry}
        />
      ) : runner.isLoading ? (
        <Skeleton height={420} radius="var(--radius-xl)" />
      ) : runner.question === null ? (
        <EmptyState
          icon="quiz"
          title="No questions for these settings"
          description="Widen the category or difficulty in Quiz Settings and start again."
          action={<Button onClick={exit}>Back to Practice</Button>}
        />
      ) : (
        <>
          <QuizStage
            mode={modeId}
            question={runner.question}
            questionNumber={runner.questionNumber}
            totalQuestions={runner.totalQuestions}
            direction={runner.direction}
            {...(runner.displayAnswer === undefined ? {} : { given: runner.displayAnswer })}
            revealed={runner.revealed}
            verdict={runner.verdict}
            {...(runner.word === undefined ? {} : { transliteration: runner.word.transliteration })}
            onAnswer={runner.answer}
            onNext={runner.next}
            onSelectPending={runner.select}
            onConfirm={runner.advance}
            onPrevious={runner.previous}
            canGoBack={runner.canGoBack}
            isLast={runner.isLast}
          />

          <Card padding="md">
            <CardHeader title="Progress" icon="study-time" as="h2" />
            <QuestionStrip
              questions={runner.questions}
              answers={runner.answers}
              currentIndex={runner.currentIndex}
              onSelect={runner.goTo}
            />
          </Card>
        </>
      )}
    </QuizLayout>
  );
}
