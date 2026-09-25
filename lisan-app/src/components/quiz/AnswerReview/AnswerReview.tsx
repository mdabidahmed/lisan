import { Link } from 'react-router-dom';

import { Icon } from '@/components/icons';
import { AudioButton } from '@/components/ui/AudioButton';
import { Badge } from '@/components/ui/Badge';
import { routePaths } from '@/constants/routes';
import type { QuizReviewRow } from '@/features/practice';
import { ARABIC_CONTENT_ATTRS } from '@/i18n';
import { cn } from '@/utils';

import styles from './AnswerReview.module.css';

export interface AnswerReviewProps {
  rows: readonly QuizReviewRow[];
}

/**
 * The question-by-question breakdown on the result screen (product spec §20).
 *
 * Every row answers the three things a learner asks after a quiz — what the word was, what they
 * said, and what it should have been — and offers the pronunciation again, because hearing a word
 * you just got wrong is the cheapest possible correction.
 */
export function AnswerReview({ rows }: AnswerReviewProps) {
  return (
    <ol className={styles.list} aria-label="Answer review">
      {rows.map((row, index) => (
        <li key={row.questionId} className={styles.row}>
          <span className={styles.index} aria-hidden="true">
            {index + 1}
          </span>

          <div className={styles.word}>
            {row.arabic === '' ? null : (
              <span className={styles.arabic} {...ARABIC_CONTENT_ATTRS}>
                {row.arabic}
              </span>
            )}
            <span className={styles.english}>{row.english}</span>
            {row.transliteration === '' ? null : (
              <span className={styles.translit}>{row.transliteration}</span>
            )}
          </div>

          <dl className={styles.answers}>
            <div className={styles.answer}>
              <dt>Your answer</dt>
              <dd
                className={cn(
                  styles.given,
                  row.correct ? styles.givenCorrect : styles.givenIncorrect,
                  row.answersAreArabic && styles.answerArabic,
                )}
                {...(row.answersAreArabic ? ARABIC_CONTENT_ATTRS : {})}
              >
                {row.givenLabel}
              </dd>
            </div>
            {row.correct ? null : (
              <div className={styles.answer}>
                <dt>Correct answer</dt>
                <dd
                  className={cn(styles.expected, row.answersAreArabic && styles.answerArabic)}
                  {...(row.answersAreArabic ? ARABIC_CONTENT_ATTRS : {})}
                >
                  {row.correctLabel}
                </dd>
              </div>
            )}
          </dl>

          <div className={styles.actions}>
            <Badge
              variant={row.correct ? 'success' : 'error'}
              size="sm"
              icon={row.correct ? 'check' : 'close'}
            >
              {row.correct ? 'Correct' : 'Missed'}
            </Badge>
            {row.arabic === '' ? null : (
              <AudioButton
                text={row.arabic}
                size="sm"
                variant="soft"
                label={`Play ${row.english}`}
              />
            )}
            <Link className={styles.link} to={routePaths.wordDetail(row.wordId)}>
              Details
              <Icon name="chevron-right" size={14} />
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
