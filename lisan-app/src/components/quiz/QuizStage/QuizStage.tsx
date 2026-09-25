import type { PracticeDirection } from '@/data/practiceModes';
import type { AnswerVerdict } from '@/features/practice/answerCheck';
import type { PracticeModeId, QuizQuestion } from '@/types';

import { FlashcardCard } from '../FlashcardCard';
import { ImageMatchCard } from '../ImageMatchCard';
import { QuizCard } from '../QuizCard';
import { TypingCard } from '../TypingCard';

export interface QuizStageProps {
  /** Picks the flashcard treatment; every other mode is decided by the question type. */
  mode: PracticeModeId;
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  /** Which way round the question was generated; defaults to recognition. */
  direction?: PracticeDirection | undefined;
  given?: string | undefined;
  revealed: boolean;
  verdict: AnswerVerdict | null;
  /** The current word's romanisation, shown on the reveal. */
  transliteration?: string | undefined;
  onAnswer: (value: string) => void;
  onNext: () => void;
  /**
   * An option-picking card's (multiple-choice, listening) version of `onAnswer`: stages a pick
   * without grading it, so `onConfirm` decides when it is actually graded and revealed.
   */
  onSelectPending: (value: string) => void;
  /**
   * An option-picking card's "Next Question" button, and Enter. First call grades and reveals
   * a staged pick; called again once revealed, it advances — see `useQuizRunner`'s `advance`.
   */
  onConfirm: () => void;
  onPrevious?: (() => void) | undefined;
  canGoBack?: boolean;
  isLast?: boolean;
}

/**
 * Chooses the card for a question. Every branch takes the same navigation props, so the runner
 * that drives it never has to know which of the four question types is on screen.
 */
export function QuizStage({
  mode,
  question,
  questionNumber,
  totalQuestions,
  direction = 'arabic-to-english',
  given,
  revealed,
  verdict,
  transliteration,
  onAnswer,
  onNext,
  onSelectPending,
  onConfirm,
  onPrevious,
  canGoBack = false,
  isLast = false,
}: QuizStageProps) {
  const shared = {
    question,
    questionNumber,
    totalQuestions,
    revealed,
    onNext,
    onPrevious,
    canGoBack,
    isLast,
  };

  if (mode === 'flashcards') {
    return (
      <FlashcardCard
        {...shared}
        {...(given === undefined ? {} : { given })}
        {...(transliteration === undefined ? {} : { transliteration })}
        onRespond={(known) => {
          onAnswer(known ? question.correctAnswer : '');
        }}
      />
    );
  }

  switch (question.type) {
    case 'typing':
      return (
        <TypingCard
          // A fresh draft per question: the input must never carry the previous answer forward.
          key={question.id}
          {...shared}
          direction={direction}
          {...(given === undefined ? {} : { given })}
          {...(transliteration === undefined ? {} : { transliteration })}
          verdict={verdict}
          onSubmit={onAnswer}
        />
      );

    case 'image-match':
      return (
        <ImageMatchCard
          {...shared}
          {...(given === undefined ? {} : { selectedAnswer: given })}
          onSelect={onAnswer}
        />
      );

    // No direction: the generator always speaks the Arabic and asks for the meaning, because
    // the prompt here is audio rather than text.
    case 'listening':
      return (
        <QuizCard
          key={question.id}
          {...shared}
          onNext={onConfirm}
          {...(given === undefined ? {} : { selectedAnswer: given })}
          concealPrompt
          onSelect={onSelectPending}
        />
      );

    case 'multiple-choice':
    default:
      return (
        <QuizCard
          key={question.id}
          {...shared}
          onNext={onConfirm}
          direction={direction}
          {...(given === undefined ? {} : { selectedAnswer: given })}
          onSelect={onSelectPending}
        />
      );
  }
}
