import { useState } from 'react';

import { ArabicText } from '@/components/ui/ArabicText';
import { AudioButton } from '@/components/ui/AudioButton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { PracticeDirection } from '@/data/practiceModes';
import type { AnswerVerdict } from '@/features/practice/answerCheck';
import { ARABIC_CONTENT_ATTRS } from '@/i18n';
import type { QuizQuestion } from '@/types/quiz';
import { cn } from '@/utils';

import { QuizFeedback, QuizNav, QuizShell } from '../QuizShell';

import styles from './TypingCard.module.css';

export interface TypingCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  /** Which way round the question is asked: decides the script of both the prompt and the field. */
  direction?: PracticeDirection | undefined;
  /** Shown on the reveal so the learner can tie the script back to the sound. */
  transliteration?: string | undefined;
  /** What was submitted, once the question has been answered. */
  given?: string | undefined;
  revealed?: boolean;
  verdict?: AnswerVerdict | null | undefined;
  onSubmit: (value: string) => void;
  onNext?: (() => void) | undefined;
  onPrevious?: (() => void) | undefined;
  canGoBack?: boolean;
  isLast?: boolean;
}

const COPY: Record<PracticeDirection, { instruction: string; hint: string; answerLabel: string }> =
  {
    'english-to-arabic': {
      instruction: 'Type this word in Arabic:',
      hint: 'Tashkeel is optional.',
      answerLabel: 'Correct spelling',
    },
    'arabic-to-english': {
      instruction: 'Type the meaning of this word in English:',
      hint: 'Capitals do not matter.',
      answerLabel: 'Correct meaning',
    },
  };

/**
 * Recall with no options to lean on (product spec §18). Enter submits, because the learner's
 * hands are already on the keyboard; an Arabic answer is scored forgivingly about tashkeel and
 * the interchangeable letter forms, so only a genuinely different word is marked wrong.
 *
 * Remount this on every question (`key={question.id}`) so the draft never leaks across questions.
 */
export function TypingCard({
  question,
  questionNumber,
  totalQuestions,
  direction = 'english-to-arabic',
  transliteration,
  given,
  revealed = false,
  verdict = null,
  onSubmit,
  onNext,
  onPrevious,
  canGoBack = false,
  isLast = false,
}: TypingCardProps) {
  const [draft, setDraft] = useState('');
  const value = revealed ? (given ?? '') : draft;
  const canSubmit = !revealed && draft.trim() !== '';
  const arabicAnswer = direction === 'english-to-arabic';
  const copy = COPY[direction];
  // Whichever way round the question runs, the pronunciation on offer is the Arabic one.
  const spoken = arabicAnswer ? question.correctAnswer : question.question;

  return (
    <QuizShell
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      prompt={copy.instruction}
    >
      {/*
        `.subject` is a full-width centred `<p>`. Its `text-align: center` and the global
        `[dir='rtl'] { text-align: right }` have identical specificity, so which one won came down
        to the order the two stylesheets happened to land in — the prompt was centred or flush
        right by luck of the build. Settling it by weight would only have picked a winner for this
        one rule; the prompt is a single vocabulary word, so under the rule the rest of the app
        follows it is an embedded run and carries no base direction at all. The selector stops
        matching, `text-align: center` wins outright, and the word still shapes right to left.
      */}
      <div className={styles.subjectPanel}>
        {arabicAnswer ? (
          <p className={styles.subject}>{question.question}</p>
        ) : (
          <ArabicText as="p" className={cn(styles.subject, styles.subjectArabic)}>
            {question.question}
          </ArabicText>
        )}
        {/* Always safe: `question.question` is the prompt itself, never the answer being tested
            for. When the prompt is English, an English voice reads it aloud too, so a learner who
            struggles to read the word can still hear it and type the Arabic. */}
        <AudioButton
          text={question.question}
          size="md"
          variant="primary"
          label="Play the word"
          lang={arabicAnswer ? 'en-US' : undefined}
          className={styles.subjectAudio}
        />
      </div>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          if (canSubmit) onSubmit(draft);
        }}
      >
        <Input
          label="Your answer"
          hint={copy.hint}
          value={value}
          onChange={(event) => {
            setDraft(event.target.value);
          }}
          disabled={revealed}
          {...(arabicAnswer ? ARABIC_CONTENT_ATTRS : {})}
          autoComplete="off"
          spellCheck={false}
          inputSize="xl"
          className={cn(styles.input, arabicAnswer && styles.inputArabic)}
          fullWidth
        />
        <div className={styles.checkWrap}>
          <span className={styles.checkSpacer} aria-hidden="true">
            &nbsp;
          </span>
          <Button type="submit" variant="secondary" iconLeft="check" disabled={!canSubmit}>
            Check
          </Button>
        </div>
      </form>

      {revealed ? (
        <div className={styles.answer}>
          <span className={styles.answerLabel}>{copy.answerLabel}</span>
          <span
            className={arabicAnswer ? styles.answerArabic : styles.answerEnglish}
            {...(arabicAnswer ? ARABIC_CONTENT_ATTRS : {})}
          >
            {question.correctAnswer}
          </span>
          {transliteration === undefined ? null : (
            <span className={styles.answerTranslit}>{transliteration}</span>
          )}
          <AudioButton text={spoken} size="sm" variant="soft" label="Play the word again" />
        </div>
      ) : null}

      <QuizFeedback
        revealed={revealed}
        verdict={verdict}
        correctAnswer={question.correctAnswer}
        arabic={arabicAnswer}
      />

      <QuizNav
        onNext={onNext}
        onPrevious={onPrevious}
        canGoBack={canGoBack}
        isLast={isLast}
        nextDisabled={!revealed}
      />
    </QuizShell>
  );
}
