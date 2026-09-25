import { useEffect, type ReactNode } from 'react';

import { loadWebFont } from '@/styles/webfonts';
import { cn } from '@/utils';

import styles from './UrduText.module.css';

export interface UrduTextProps {
  children: ReactNode;
  /** `span` by default, so an Urdu gloss can sit inside a row without breaking its layout. */
  as?: 'span' | 'p' | undefined;
  className?: string | undefined;
}

/**
 * An Urdu string, set the way Urdu is written.
 *
 * Three things travel together and none of them is optional: nastaliq (`--font-urdu`), `lang="ur"`
 * so the browser, screen readers and hyphenation know what language this is rather than guessing
 * Arabic from the script, and `dir="rtl"` on the element itself — the dataset's Urdu is content,
 * not chrome, so its direction cannot depend on the interface locale (`i18n/contentDirection.ts`).
 *
 * Mounting is also what pays for the face. Noto Nastaliq Urdu is 234 kB, far too much to put in
 * the boot path for a field most sessions never reach, so it is requested here, once per
 * document, and swaps in when it arrives.
 */
export function UrduText({ children, as: Tag = 'span', className }: UrduTextProps) {
  useEffect(() => {
    void loadWebFont('nastaliqUrdu');
  }, []);

  return (
    <Tag lang="ur" dir="rtl" className={cn(styles.root, className)}>
      {children}
    </Tag>
  );
}
