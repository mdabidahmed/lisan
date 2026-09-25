import type { VectorAsset } from '@/assets';
import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  title?: string | undefined;
  description?: string | undefined;
  /** Takes the place of the alert tile. The title carries the meaning, so it is decorative. */
  illustration?: VectorAsset | undefined;
  onRetry?: (() => void) | undefined;
  className?: string | undefined;
}

/** Recoverable failure surface. `role="alert"` so the failure is announced, not just drawn. */
export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. Check your connection and try again.',
  illustration,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div role="alert" className={cn(styles.root, className)}>
      {illustration === undefined ? (
        <span className={styles.tile}>
          <Icon name="alert" size={24} />
        </span>
      ) : (
        <img
          className={styles.illustration}
          src={illustration.src}
          alt=""
          width={illustration.width}
          height={illustration.height}
          loading="lazy"
          decoding="async"
        />
      )}
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
      {onRetry === undefined ? null : (
        <Button variant="secondary" size="sm" iconLeft="replay" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
