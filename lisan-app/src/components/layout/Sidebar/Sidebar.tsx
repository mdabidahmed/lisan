import { Link } from 'react-router-dom';

import { Logo } from '@/components/brand/Logo';
import { SIDEBAR_NAV } from '@/constants/navigation';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

import { NavList } from './NavList';
import { PremiumCard } from './PremiumCard';
import styles from './Sidebar.module.css';

export interface SidebarProps {
  /** `fixed` is the persistent desktop rail; `drawer` is the off-canvas mobile panel. */
  variant?: 'fixed' | 'drawer';
  onNavigate?: (() => void) | undefined;
  className?: string | undefined;
}

export function Sidebar({ variant = 'fixed', onNavigate, className }: SidebarProps) {
  return (
    <div className={cn(styles.sidebar, variant === 'drawer' && styles.drawer, className)}>
      <div className={styles.brand}>
        <Link to={ROUTES.home} className={styles.brandLink} onClick={onNavigate}>
          <Logo />
        </Link>
      </div>

      <div className={styles.nav}>
        <NavList items={SIDEBAR_NAV} onNavigate={onNavigate} label="Main" />
      </div>

      <div className={styles.footer}>
        <PremiumCard />
      </div>
    </div>
  );
}
