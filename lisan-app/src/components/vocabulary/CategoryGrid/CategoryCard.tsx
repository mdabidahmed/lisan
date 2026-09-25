import { Link } from 'react-router-dom';

import { getCategoryArt } from '@/assets';
import { Icon } from '@/components/icons';
import { ArabicText } from '@/components/ui/ArabicText';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { ROUTES } from '@/constants/routes';
import type { Category } from '@/types/content';
import { resolveAccentColor } from '@/utils/color';
import { clampPercent } from '@/utils/format';

import styles from './CategoryCard.module.css';

export interface CategoryCardProps {
  category: Category;
  /** Words already learned in this category. */
  learned?: number;
  /** Compact variant used in the home "Continue Learning" strip. */
  variant?: 'grid' | 'strip';
}

export function CategoryCard({ category, learned = 0, variant = 'grid' }: CategoryCardProps) {
  const accent = resolveAccentColor(category.color);
  const percent = clampPercent((learned / Math.max(1, category.wordCount)) * 100);
  const art = getCategoryArt(category.id);
  const thumbSize = variant === 'strip' ? 48 : 52;

  return (
    <Link
      to={`${ROUTES.vocabulary}?category=${encodeURIComponent(category.id)}`}
      className={styles.card}
      data-variant={variant}
      style={{ '--accent-fg': accent.fg, '--accent-bg': accent.bg } as React.CSSProperties}
    >
      <span className={styles.thumb} data-illustrated={art !== undefined}>
        {art === undefined ? (
          <Icon name={category.icon} size={variant === 'strip' ? 24 : 26} />
        ) : (
          /* The label beside it already names the category, so the tile is decorative. */
          <ResponsiveImage
            asset={art}
            alt=""
            sizes={`${thumbSize}px`}
            className={styles.thumbImage}
          />
        )}
      </span>

      <span className={styles.copy}>
        <span className={styles.title}>{category.name}</span>
        <ArabicText className={styles.arabic}>{category.arabicName}</ArabicText>
        <span className={styles.count}>{category.wordCount} words</span>
        <span className={styles.bar}>
          <ProgressBar
            value={percent}
            size="sm"
            ariaLabel={`${category.name}: ${learned} of ${category.wordCount} words learned`}
          />
        </span>
      </span>

      <span className={styles.action} aria-hidden="true">
        <Icon name="play" size={16} />
      </span>
    </Link>
  );
}
