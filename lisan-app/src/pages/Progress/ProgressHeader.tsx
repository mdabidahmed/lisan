import { Link } from 'react-router-dom';

import mascotSrc from '@/assets/illustrations/progress-mascot-original.png';
import { Icon } from '@/components/icons';
import { useSetting } from '@/store/settingsStore';

import styles from './ProgressHeader.module.css';

export interface ProgressHeaderProps {
  subtitle: string;
  /** Same number the "Words Learned" stat card shows, so the two never disagree. */
  wordsLearned: number;
}

/** What goal progress becomes said in the "Next Focus" chip — always forward-looking. */
function nextFocusText(wordsLearned: number, target: number): string {
  const remaining = target - wordsLearned;
  if (remaining <= 0) {
    return "You've hit today's goal — great work!";
  }
  const noun = remaining === 1 ? 'word' : 'words';
  return `Learn ${remaining} more ${noun} to reach today's goal.`;
}

/**
 * The Progress page's own hero header: a two-tone title, a subtitle, a "Next Focus" nudge that
 * links into practice, and the celebrating mascot. `PageHeader` stays the shared, plain-text
 * header every other route uses — this is deliberately a one-off so that flourish never leaks
 * onto the rest of the app.
 *
 * The mascot artwork is the designer's file exactly as supplied — no cropping or re-encoding.
 * `.mascotFrame` shows only the character himself (not the baked-in title on the image's left
 * edge, nor the transparent margin around him) as a CSS background crop — a fixed background-size
 * and background-position tuned to his bounding box in the source file — so the source bytes on
 * disk stay untouched and he fills the frame edge to edge.
 */
export function ProgressHeader({ subtitle, wordsLearned }: ProgressHeaderProps) {
  const target = useSetting('dailyGoal');

  return (
    <header className={styles.header}>
      <div className={styles.copy}>
        <h1 className={styles.title}>
          <span className={styles.titleDark}>Your</span>{' '}
          <span className={styles.titleAccent}>Progress</span>
          <svg
            className={styles.spark}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M12 2 9.6 8.4 3 11l6.6 2.6L12 20l2.4-6.4L21 11l-6.6-2.6z"
              fill="currentColor"
            />
          </svg>
        </h1>
        <p className={styles.subtitle}>{subtitle}</p>

        <Link to="/practice" className={styles.nextFocus}>
          <span className={styles.nextFocusIcon}>
            <Icon name="goal" size={20} />
          </span>
          <span className={styles.nextFocusCopy}>
            <span className={styles.nextFocusLabel}>Next Focus</span>
            <span className={styles.nextFocusText}>{nextFocusText(wordsLearned, target)}</span>
          </span>
          <Icon className={styles.nextFocusChevron} name="chevron-right" size={18} />
        </Link>
      </div>

      <span
        className={styles.mascotFrame}
        style={{ backgroundImage: `url(${mascotSrc})` }}
        role="img"
        aria-label="A cheerful learner raising a fist in celebration while holding an open Arabic book"
      />
    </header>
  );
}
