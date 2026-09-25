import { useCallback, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Logo } from '@/components/brand/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { IconButton } from '@/components/ui/IconButton';
import { SearchBox } from '@/components/ui/SearchBox';
import { DEFAULT_PROFILE } from '@/constants/app';
import { TOPBAR_NAV } from '@/constants/navigation';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

import { FontSwitcher } from './FontSwitcher';
import { ThemeToggle } from './ThemeToggle';
import styles from './Topbar.module.css';

export interface TopbarProps {
  onOpenMenu: () => void;
}

/**
 * Secondary navigation, global search, theme and profile (product spec §8).
 * Deliberately sparse — the sidebar carries primary navigation.
 */
export function Topbar({ onOpenMenu }: TopbarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  // Bumped on every submit so the box below remounts instead of being reset via its `value`
  // prop: a remount is guaranteed to drop any debounce timer still in flight from the keystroke
  // right before Enter, where prop-syncing alone could lose the race and let that timer republish
  // the just-submitted text a moment later.
  const [searchKey, setSearchKey] = useState(0);

  const runSearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      void navigate(`${ROUTES.vocabulary}?q=${encodeURIComponent(trimmed)}`);
      // The Vocabulary page's own search box now owns this query; leaving it here too would
      // leave two boxes showing the same text and two "Clear search" buttons on screen, only one
      // of which actually clears the active filter.
      setQuery('');
      setSearchKey((key) => key + 1);
    },
    [navigate],
  );

  return (
    <header className={styles.topbar}>
      <div className={styles.start}>
        <IconButton
          icon="vocabulary"
          label="Open navigation menu"
          variant="ghost"
          className={styles.menuButton}
          onClick={onOpenMenu}
        />
        <span className={styles.mobileBrand}>
          <Logo compact size={28} />
        </span>

        <nav className={styles.nav} aria-label="Sections">
          <ul className={styles.navList}>
            {TOPBAR_NAV.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  end={item.end ?? false}
                  className={({ isActive }) => cn(styles.navLink, isActive && styles.navLinkActive)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.end}>
        <SearchBox
          key={searchKey}
          value={query}
          onValueChange={setQuery}
          onSubmit={runSearch}
          placeholder="Search anything..."
          label="Search vocabulary"
          className={styles.search}
        />
        <FontSwitcher />
        <ThemeToggle />
        <Avatar name={DEFAULT_PROFILE.name} />
      </div>
    </header>
  );
}
