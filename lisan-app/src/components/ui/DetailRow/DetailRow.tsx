import type { ReactNode } from 'react';

import { Icon, type IconName } from '@/components/icons';
// Deep import: the barrel does not re-export this yet, and it is not this component's to edit.
import { ARABIC_EMBEDDED_CONTENT_ATTRS } from '@/i18n/contentDirection';
import { cn } from '@/utils';

import styles from './DetailRow.module.css';

export interface DetailRowProps {
  icon?: IconName | undefined;
  label: string;
  /**
   * Renders the value with Arabic typography, marked `lang="ar"` and bidi-isolated.
   *
   * The value stays aligned with the rest of the column: this row is a label/value pair in a
   * host-language table, so the Arabic is an embedded run rather than a right-to-left region.
   */
  arabic?: boolean | undefined;
  className?: string | undefined;
  children: ReactNode;
}

/** Label/value row from the word-detail panel (reference screen 3). */
export function DetailRow({ icon, label, arabic = false, className, children }: DetailRowProps) {
  return (
    <div className={cn(styles.root, className)}>
      <span className={styles.label}>
        {icon === undefined ? null : <Icon name={icon} size={17} className={styles.icon} />}
        {label}
      </span>
      <span
        className={cn(styles.value, arabic && styles.arabic)}
        {...(arabic ? ARABIC_EMBEDDED_CONTENT_ATTRS : {})}
      >
        {/*
          The isolate goes on an inline span, never on the cell: the cell is a grid item, so a base
          direction on it would align the value to the card's edge instead of the column's. Inline,
          the same isolation keeps the Arabic from reordering against its neighbours while the base
          direction stays inherited — see ARABIC_EMBEDDED_CONTENT_ATTRS.
        */}
        {arabic ? <span className={styles.isolate}>{children}</span> : children}
      </span>
    </div>
  );
}
