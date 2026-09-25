import type { ReactNode } from 'react';

import { cn } from '@/utils';

import styles from './Tabs.module.css';

export interface TabPanelProps {
  id: string;
  active: boolean;
  className?: string | undefined;
  children: ReactNode;
}

/** Companion to `Tabs`; the id must match the `TabItem` it belongs to. */
export function TabPanel({ id, active, className, children }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!active}
      tabIndex={0}
      className={cn(styles.panel, className)}
    >
      {children}
    </div>
  );
}
