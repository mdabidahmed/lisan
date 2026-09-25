import { Button } from '@/components/ui/Button';

import styles from './QuizShell.module.css';

export interface QuizNavProps {
  onNext?: (() => void) | undefined;
  onPrevious?: (() => void) | undefined;
  canGoBack?: boolean | undefined;
  isLast?: boolean | undefined;
  nextDisabled?: boolean | undefined;
}

/**
 * Previous / Next for a question (product spec §16). With nowhere to go back to, Next takes the
 * full width — the single, unmistakable next step on reference screen 4.
 */
export function QuizNav({
  onNext,
  onPrevious,
  canGoBack = false,
  isLast = false,
  nextDisabled = false,
}: QuizNavProps) {
  return (
    <div className={styles.nav}>
      {canGoBack ? (
        <Button variant="secondary" iconLeft="arrow-left" onClick={onPrevious}>
          Previous
        </Button>
      ) : null}
      <Button
        variant="primary"
        iconRight="arrow-right"
        fullWidth={!canGoBack}
        onClick={onNext}
        disabled={nextDisabled}
      >
        {isLast ? 'Finish Quiz' : 'Next Question'}
      </Button>
    </div>
  );
}
