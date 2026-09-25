import { Spinner } from '@/components/ui/Spinner';

import styles from './AppUpdating.module.css';

/**
 * What a learner sees while the app reloads itself onto a newer build.
 *
 * Deliberately not the error screen. A deploy landing under an open tab is the expected cost of
 * shipping, not a fault, and the one thing the screen must not do is describe it as one — the
 * reload is already under way by the time this renders, so "something went wrong" would be both
 * alarming and wrong. `role="status"` rather than `role="alert"` for the same reason: assistive
 * technology should hear a progress update, not a warning.
 */
export function AppUpdating() {
  return (
    <div className={styles.wrapper} role="status">
      <span className={styles.badge}>
        <Spinner size={26} />
      </span>
      <h1 className={styles.title}>Updating Lisan</h1>
      <p className={styles.body}>
        A newer version is available, so this page is reloading to pick it up. Your progress and
        bookmarks are saved on this device, so nothing has been lost.
      </p>
    </div>
  );
}
