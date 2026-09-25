import { NavLink } from 'react-router-dom';

import { Icon } from '@/components/icons';
import { MOBILE_NAV } from '@/constants/navigation';
import { cn } from '@/utils/cn';

import styles from './MobileNav.module.css';

/**
 * Bottom navigation for phones (product spec §65 — an intentional mobile layout, not a shrunken
 * desktop one). Capped at five destinations; everything else lives in the drawer.
 */
export function MobileNav() {
  return (
    <nav className={styles.bar} aria-label="Primary">
      <ul className={styles.list}>
        {MOBILE_NAV.map((item) => (
          <li key={item.id} className={styles.item}>
            <NavLink
              to={item.to}
              end={item.end ?? false}
              className={({ isActive }) => cn(styles.link, isActive && styles.active)}
            >
              <Icon name={item.icon} size={22} />
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
