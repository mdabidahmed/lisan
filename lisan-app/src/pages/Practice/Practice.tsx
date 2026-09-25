import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Icon } from '@/components/icons';
import { DashboardLayout, PageHeader } from '@/components/layout';
import { QuestionStrip, QuizStage } from '@/components/quiz';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { QUIZ_QUESTION_COUNT_OPTIONS } from '@/constants/app';
import { ROUTES, routePaths } from '@/constants/routes';
import {
  ALL_CATEGORIES,
  usePracticeModes,
  useQuizKeyboard,
  useQuizRunner,
  useTodaysGoal,
} from '@/features/practice';
import { useCategories } from '@/features/vocabulary';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useLastQuizResult } from '@/store/quizSessionStore';
import { useSettings, useSettingsActions } from '@/store/settingsStore';
import type { QuizDifficulty } from '@/types/quiz';
import { resolveAccentColor } from '@/utils/color';
import { formatPercent } from '@/utils/format';

import styles from './Practice.module.css';

const DIFFICULTY_OPTIONS: readonly { value: QuizDifficulty; label: string }[] = [
  { value: 'mixed', label: 'Mixed' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const STUDY_TIPS = [
  'Listen to the pronunciation',
  'Read the word carefully',
  'Think about the meaning',
  'Practice regularly',
  'Track your progress',
];

/** The quick quiz on this page is the recognition drill from reference screen 4. */
const QUICK_MODE = 'multiple-choice';

export function PracticePage() {
  useDocumentMeta({
    title: 'Practice',
    description:
      'Test your Arabic with multiple choice, listening, typing and image-match quizzes.',
  });

  const navigate = useNavigate();
  const { data: modes = [], isLoading } = usePracticeModes();
  const { data: categories = [] } = useCategories();
  const settings = useSettings();
  const { update } = useSettingsActions();
  const lastResult = useLastQuizResult();
  const goal = useTodaysGoal();

  const [categoryId, setCategoryId] = useState<string>(ALL_CATEGORIES);

  const runner = useQuizRunner({
    mode: QUICK_MODE,
    categoryId,
    questionCount: settings.quizQuestionCount,
    difficulty: settings.quizDifficulty,
    onComplete: () => {
      void navigate(ROUTES.quizResult);
    },
  });

  useQuizKeyboard({
    optionCount: runner.optionValues.length,
    onSelectIndex: runner.selectAtIndex,
    onAdvance: runner.advance,
    enabled: runner.question !== null,
  });

  const categoryOptions = [
    { value: ALL_CATEGORIES, label: 'All Categories' },
    ...categories.map((category) => ({ value: category.id, label: category.name })),
  ];

  const modeLink = (id: string) =>
    categoryId === ALL_CATEGORIES
      ? routePaths.practiceMode(id)
      : `${routePaths.practiceMode(id)}?category=${encodeURIComponent(categoryId)}`;

  return (
    <DashboardLayout
      header={
        <PageHeader
          title="Practice"
          subtitle="Test your knowledge and improve with interactive quizzes."
        />
      }
      aside={
        <>
          <Card padding="md">
            <CardHeader title="Quiz Settings" icon="settings" as="h2" />
            <div className={styles.settings}>
              <Select
                options={categoryOptions}
                value={categoryId}
                onValueChange={setCategoryId}
                label="Category"
                selectSize="md"
                fullWidth
              />
              <Select
                options={QUIZ_QUESTION_COUNT_OPTIONS.map((count) => ({
                  value: String(count),
                  label: String(count),
                }))}
                value={String(settings.quizQuestionCount)}
                onValueChange={(value) => {
                  update({ quizQuestionCount: Number(value) });
                }}
                label="Number of Questions"
                selectSize="md"
                fullWidth
              />
              <Select
                options={DIFFICULTY_OPTIONS}
                value={settings.quizDifficulty}
                onValueChange={(value) => {
                  update({ quizDifficulty: value });
                }}
                label="Difficulty Level"
                selectSize="md"
                fullWidth
              />
            </div>
          </Card>

          <Card padding="md">
            <CardHeader title="Today's Goal" icon="goal" as="h2" />
            <p className={styles.goalCaption}>Answer {goal.target} questions correctly</p>
            <div className={styles.goalRow}>
              <ProgressBar
                value={goal.percent}
                ariaLabel={`Today's goal: ${goal.correctToday} of ${goal.target} correct`}
                className={styles.goalBar}
              />
              <span className={styles.goalValue} aria-hidden="true">
                {formatPercent(goal.percent)}
              </span>
            </div>
          </Card>

          <Card padding="md">
            <CardHeader title="Study Tips" icon="info" as="h2" />
            <ol className={styles.tips}>
              {STUDY_TIPS.map((tip, index) => (
                <li key={tip} className={styles.tip}>
                  <span className={styles.tipIndex}>{index + 1}</span>
                  {tip}
                </li>
              ))}
            </ol>
          </Card>
        </>
      }
    >
      <div className={styles.quizRow}>
        {runner.isError ? (
          <ErrorState
            title="We could not build this quiz"
            description="Check your connection, or pick a different category."
            onRetry={runner.retry}
          />
        ) : runner.isLoading ? (
          <Skeleton height={430} radius="var(--radius-xl)" />
        ) : runner.question === null ? (
          <EmptyState
            icon="quiz"
            title="No questions for these settings"
            description="Widen the category or difficulty and the quiz will rebuild itself."
          />
        ) : (
          <QuizStage
            mode={QUICK_MODE}
            question={runner.question}
            questionNumber={runner.questionNumber}
            totalQuestions={runner.totalQuestions}
            direction={runner.direction}
            {...(runner.displayAnswer === undefined ? {} : { given: runner.displayAnswer })}
            revealed={runner.revealed}
            verdict={runner.verdict}
            onAnswer={runner.answer}
            onNext={runner.next}
            onSelectPending={runner.select}
            onConfirm={runner.advance}
            isLast={runner.isLast}
          />
        )}
      </div>

      {runner.questions.length > 0 ? (
        <Card padding="md">
          <CardHeader
            title="Recent Questions"
            icon="study-time"
            as="h2"
            action={
              <div className={styles.stripActions}>
                <Button variant="ghost" size="sm" iconLeft="replay" onClick={runner.restart}>
                  Restart
                </Button>
                {lastResult === null ? null : (
                  <Link className={styles.viewAll} to={ROUTES.quizResult}>
                    View All
                  </Link>
                )}
              </div>
            }
          />
          <QuestionStrip
            questions={runner.questions}
            answers={runner.answers}
            currentIndex={runner.currentIndex}
            onSelect={runner.goTo}
          />
        </Card>
      ) : null}

      <section className={styles.modesSection} aria-labelledby="practice-modes">
        <SectionHeader
          title="Practice Modes"
          subtitle="Pick the drill that matches what you want to work on."
          as="h2"
          id="practice-modes"
        />
        <ul className={styles.modes}>
          {isLoading
            ? [0, 1, 2, 3].map((index) => (
                <li key={index}>
                  <Skeleton height={132} radius="var(--radius-lg)" />
                </li>
              ))
            : modes.map((mode) => {
                const accent = resolveAccentColor(mode.accent);
                return (
                  <li key={mode.id}>
                    <Link to={modeLink(mode.id)} className={styles.mode}>
                      <span
                        className={styles.modeIcon}
                        style={{ color: accent.fg, backgroundColor: accent.bg }}
                        aria-hidden="true"
                      >
                        <Icon name={mode.icon} size={22} />
                      </span>
                      <span className={styles.modeTitle}>{mode.title}</span>
                      <span className={styles.modeDescription}>{mode.description}</span>
                      <span className={styles.modeCount}>
                        {settings.quizQuestionCount}{' '}
                        {settings.quizQuestionCount === 1 ? 'Question' : 'Questions'}
                      </span>
                    </Link>
                  </li>
                );
              })}
        </ul>
      </section>
    </DashboardLayout>
  );
}
