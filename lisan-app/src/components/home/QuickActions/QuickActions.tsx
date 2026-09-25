import { Link } from 'react-router-dom';

import { Icon } from '@/components/icons';

import { DEFAULT_QUICK_ACTIONS, type QuickAction } from './quickActionItems';
import styles from './QuickActions.module.css';

export interface QuickActionsProps {
  actions?: readonly QuickAction[];
}

/** The four accent tiles under the hero (reference screen 1). */
export function QuickActions({ actions = DEFAULT_QUICK_ACTIONS }: QuickActionsProps) {
  return (
    <ul className={styles.grid}>
      {actions.map((action) => (
        <li key={action.id}>
          <Link to={action.to} className={styles.tile} data-accent={action.accent}>
            <span className={styles.iconTile}>
              <Icon name={action.icon} size={24} />
            </span>
            <span className={styles.copy}>
              <span className={styles.title}>{action.title}</span>
              <span className={styles.description}>{action.description}</span>
            </span>
            <span className={styles.chevron} aria-hidden="true">
              <Icon name="chevron-right" size={16} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
