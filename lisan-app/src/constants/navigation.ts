import type { IconName } from '@/components/icons/iconNames';

import { ROUTES } from './routes';

export interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly to: string;
  readonly icon: IconName;
  /** `end` matching prevents `/` from staying active on every child route. */
  readonly end?: boolean;
}

/** Primary sidebar navigation (product spec §7). */
export const SIDEBAR_NAV: readonly NavItem[] = [
  { id: 'home', label: 'Home', to: ROUTES.home, icon: 'home', end: true },
  { id: 'vocabulary', label: 'Vocabulary', to: ROUTES.vocabulary, icon: 'vocabulary' },
  { id: 'grammar', label: 'Grammar', to: ROUTES.grammar, icon: 'grammar' },
  { id: 'practice', label: 'Practice', to: ROUTES.practice, icon: 'practice' },
  { id: 'progress', label: 'Progress', to: ROUTES.progress, icon: 'progress' },
  { id: 'bookmarks', label: 'Bookmarks', to: ROUTES.bookmarks, icon: 'bookmark' },
  { id: 'settings', label: 'Settings', to: ROUTES.settings, icon: 'settings' },
];

/** Secondary top-header navigation (product spec §8). */
export const TOPBAR_NAV: readonly NavItem[] = [
  { id: 'home', label: 'Home', to: ROUTES.home, icon: 'home', end: true },
  { id: 'learn', label: 'Learn', to: ROUTES.vocabulary, icon: 'vocabulary' },
  { id: 'practice', label: 'Practice', to: ROUTES.practice, icon: 'practice' },
  { id: 'progress', label: 'Progress', to: ROUTES.progress, icon: 'progress' },
];

/** Bottom navigation shown below the tablet breakpoint. Capped at five destinations. */
export const MOBILE_NAV: readonly NavItem[] = [
  { id: 'home', label: 'Home', to: ROUTES.home, icon: 'home', end: true },
  { id: 'vocabulary', label: 'Words', to: ROUTES.vocabulary, icon: 'vocabulary' },
  { id: 'practice', label: 'Practice', to: ROUTES.practice, icon: 'practice' },
  { id: 'progress', label: 'Progress', to: ROUTES.progress, icon: 'progress' },
  { id: 'bookmarks', label: 'Saved', to: ROUTES.bookmarks, icon: 'bookmark' },
];
