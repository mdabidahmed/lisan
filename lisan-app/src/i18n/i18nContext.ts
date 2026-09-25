import { createContext } from 'react';

import type { Translate } from './keys';
import type { Locale, TextDirection } from './locales';

export interface I18nContextValue {
  /** Looks up a message by key and fills in its `{placeholders}`. */
  t: Translate;
  /** The locale in effect. A persisted preference for an unavailable locale never reaches here. */
  locale: Locale;
  /** Direction of the interface. Arabic content keeps its own; see `contentDirection.ts`. */
  dir: TextDirection;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
