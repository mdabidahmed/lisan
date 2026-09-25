import { Icon, type IconName } from '@/components/icons';
import { ArabicText, type ArabicTextFlow } from '@/components/ui/ArabicText';
import { UrduText } from '@/components/ui/UrduText';
import { cn } from '@/utils';

import styles from './QuizOption.module.css';

export type QuizOptionState = 'default' | 'selected' | 'correct' | 'incorrect';

export interface QuizOptionProps {
  value: string;
  label: string;
  /** An Urdu gloss printed under `label`, e.g. the option's translation. */
  sublabel?: string | undefined;
  state?: QuizOptionState | undefined;
  onSelect: (value: string) => void;
  disabled?: boolean | undefined;
  /**
   * Sets the label in the Arabic face, marked `lang="ar"` and bidi-isolated.
   *
   * `true` is a single vocabulary word — the practice quiz's options — and keeps the button's own
   * base direction so the answer sits beside the shortcut key. Pass `'sentence'` when the option
   * is a whole Arabic sentence, as the grammar lesson check's options are: those end in a full
   * stop, which only lands on the correct side under a right-to-left base. See `ArabicText`.
   */
  arabic?: boolean | ArabicTextFlow | undefined;
  shortcut?: string | undefined;
  className?: string | undefined;
}

const RESULT_ICON: Partial<Record<QuizOptionState, IconName>> = {
  selected: 'check',
  correct: 'check',
  incorrect: 'close',
};

/**
 * One answer inside a caller-provided `role="radiogroup"`. Correctness is always carried by an
 * icon as well as a colour, so the feedback survives colour-vision differences and high contrast.
 */
export function QuizOption({
  value,
  label,
  sublabel,
  state = 'default',
  onSelect,
  disabled = false,
  arabic = false,
  shortcut,
  className,
}: QuizOptionProps) {
  const resultIcon = RESULT_ICON[state];
  const arabicFlow: ArabicTextFlow | undefined =
    arabic === false ? undefined : arabic === true ? 'embedded' : arabic;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={state !== 'default'}
      disabled={disabled}
      className={cn(
        styles.root,
        styles[state],
        arabicFlow === undefined ? undefined : styles.arabic,
        className,
      )}
      onClick={() => {
        onSelect(value);
      }}
    >
      {shortcut ? <kbd className={styles.shortcut}>{shortcut}</kbd> : null}
      {/*
        The label is `flex: 1 1 auto`, so it grows to fill the button rather than being sized to
        its text. A base direction on a box that wide met `[dir='rtl'] { text-align: right }` and
        threw the Arabic answer against the button's far edge, leaving a gap between it and the
        shortcut key it is meant to sit next to. `ArabicText` isolates the run inline instead, so
        it starts beside the key — and a sentence still resolves right-to-left inside that isolate.
      */}
      <span className={styles.labelStack}>
        {arabicFlow === undefined ? (
          <span className={styles.label}>{label}</span>
        ) : (
          <ArabicText flow={arabicFlow} className={styles.label}>
            {label}
          </ArabicText>
        )}
        {sublabel ? <UrduText className={styles.sublabel}>{sublabel}</UrduText> : null}
      </span>
      {resultIcon ? (
        <Icon name={resultIcon} size={18} className={styles.resultIcon} />
      ) : (
        <span className={styles.marker} aria-hidden="true" />
      )}
    </button>
  );
}
