import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  title: string;
  subtitle?: string | undefined;
  /** Buttons or filters rendered opposite the title. */
  actions?: ReactNode;
  /** A decorative panel (quote card, illustration) pinned to the end of the row. */
  aside?: ReactNode;
  id?: string | undefined;
  className?: string | undefined;
}

/** The `<h1>` block every route opens with. */
export function PageHeader({ title, subtitle, actions, aside, id, className }: PageHeaderProps) {
  return (
    <header className={cn(styles.header, className)}>
      <div className={styles.copy}>
        <h1 id={id} className={styles.title}>
          {title}
        </h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </header>
  );
}
