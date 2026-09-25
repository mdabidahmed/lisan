import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { MobileNav } from '@/components/layout/MobileNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

import styles from './AppShell.module.css';
import { NavDrawer } from './NavDrawer';

/**
 * The application chrome: skip link, persistent sidebar (drawer on phones), top header, the main
 * landmark every route renders into, and the mobile bottom navigation.
 */
export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
  }, []);
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <aside className={styles.sidebar} aria-label="Sidebar">
        <Sidebar />
      </aside>

      <NavDrawer open={drawerOpen} onClose={closeDrawer} />

      <div className={styles.column}>
        <Topbar onOpenMenu={openDrawer} />
        <main id="main-content" className={styles.main} tabIndex={-1}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>

      <div className={styles.mobileNav}>
        <MobileNav />
      </div>
    </div>
  );
}
