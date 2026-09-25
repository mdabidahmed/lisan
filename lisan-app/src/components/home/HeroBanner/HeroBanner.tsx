import { Link } from 'react-router-dom';

import { Icon } from '@/components/icons';
import { ROUTES } from '@/constants/routes';

import styles from './HeroBanner.module.css';
import { HeroImage } from './HeroImage';

export interface HeroBannerProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
}

/** The home dashboard hero (reference screen 1). */
export function HeroBanner({
  eyebrow = 'Welcome to Lisan',
  title = 'Learn Arabic Step by Step',
  description = 'Build your vocabulary, understand the language, and strengthen your connection.',
  ctaLabel = 'Start Learning',
  ctaTo = ROUTES.vocabulary,
}: HeroBannerProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroImage />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <Icon name="statistics" size={15} />
            {eyebrow}
          </p>
          {/* The hero carries the page's h1 — Home has no separate title block. */}
          <h1 id="hero-title" className={styles.title}>
            {title}
          </h1>
          <p className={styles.description}>{description}</p>
          <Link to={ctaTo} className={styles.cta}>
            {ctaLabel}
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
