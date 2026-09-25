import { hero } from '@/assets';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';

import styles from './HeroImage.module.css';

/** The hero spans the content column on desktop and the viewport on narrow screens. */
const SIZES = '(max-width: 960px) 100vw, 1600px';

/**
 * Backdrop for the home hero (reference screen 1).
 *
 * Decorative: the headline beside it carries the meaning, so the photograph is hidden from
 * assistive technology rather than announcing a scene description nobody asked for. It is also
 * the LCP element — its URL is content-hashed and so cannot be preloaded from `index.html`,
 * which makes `fetchPriority` the equivalent lever.
 */
export function HeroImage() {
  return (
    <div className={styles.media} aria-hidden="true">
      <ResponsiveImage
        asset={hero}
        alt=""
        sizes={SIZES}
        loading="eager"
        fetchPriority="high"
        className={styles.picture}
      />
      <span className={styles.scrim} />
    </div>
  );
}
