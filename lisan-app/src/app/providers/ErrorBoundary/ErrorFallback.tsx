import { Icon } from '@/components/icons';
import { APP_ENV } from '@/utils/env';

import styles from './ErrorFallback.module.css';

export interface ErrorFallbackProps {
  error: Error;
  onReset: () => void;
  /** Root-level failures offer a full reload instead of a re-render. */
  variant?: 'route' | 'app';
}

export function ErrorFallback({ error, onReset, variant = 'route' }: ErrorFallbackProps) {
  return (
    <div className={styles.wrapper} role="alert">
      <span className={styles.badge}>
        <Icon name="alert" size={26} />
      </span>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.body}>
        Lisan hit an unexpected error. Your progress and bookmarks are saved on this device, so
        nothing has been lost.
      </p>

      {APP_ENV.isDev ? <pre className={styles.details}>{error.message}</pre> : null}

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={onReset}>
          <Icon name="replay" size={18} />
          Try again
        </button>
        {variant === 'app' ? (
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              window.location.assign('/');
            }}
          >
            Back to home
          </button>
        ) : null}
      </div>
    </div>
  );
}
