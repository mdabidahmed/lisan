import { createContext } from 'react';

import type { ResolvedTheme, ThemeMode } from '@/types/ui';

export interface ThemeContextValue {
  /** What the learner chose: light, dark or follow the OS. */
  mode: ThemeMode;
  /** What is actually painted right now. */
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  /** Flips between light and dark, leaving `system` behind. */
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
