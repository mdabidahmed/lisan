import { APP_QUOTE } from '@/constants/app';
import { ARABIC_CONTENT_ATTRS } from '@/i18n';
import { cn } from '@/utils/cn';

import styles from './QuoteCard.module.css';

export interface QuoteCardProps {
  arabic?: string;
  english?: string;
  /** `glass` sits on the hero image; `plain` sits on a page background. */
  variant?: 'glass' | 'plain' | 'tinted';
  className?: string | undefined;
}

/** Motivational Arabic quote surface (reference screens 1, 4 and 5). */
export function QuoteCard({
  arabic = APP_QUOTE.arabic,
  english = APP_QUOTE.english,
  variant = 'plain',
  className,
}: QuoteCardProps) {
  return (
    <figure className={cn(styles.card, styles[variant], className)}>
      <blockquote className={styles.arabic} {...ARABIC_CONTENT_ATTRS}>
        {arabic}
      </blockquote>
      <figcaption className={styles.english}>&ldquo;{english}&rdquo;</figcaption>
    </figure>
  );
}
