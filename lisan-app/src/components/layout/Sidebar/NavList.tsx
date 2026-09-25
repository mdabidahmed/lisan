import { NavLink } from 'react-router-dom';

import { Icon } from '@/components/icons';
import type { NavItem } from '@/constants/navigation';
import { cn } from '@/utils/cn';

import styles from './NavList.module.css';

export interface NavListProps {
  items: readonly NavItem[];
  /** Fired after a destination is chosen — lets the mobile drawer close itself. */
  onNavigate?: (() => void) | undefined;
  label: string;
}

export function NavList({ items, onNavigate, label }: NavListProps) {
  return (
    <nav aria-label={label}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.to}
              end={item.end ?? false}
              onClick={onNavigate}
              className={({ isActive }) => cn(styles.link, isActive && styles.active)}
            >
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} size={20} className={styles.icon} />
                  <span className={styles.label}>{item.label}</span>
                  {isActive ? <span className={styles.marker} aria-hidden="true" /> : null}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
