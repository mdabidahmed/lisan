// Imported as a file rather than through the `@/assets` registry on purpose: the logo renders on
// every route, and the registry is one module, so going through it would pull the URL maps and
// placeholders for all ~200 assets into the app shell's critical path. Same file either way —
// `brand.logoMark` in the registry is the catalogue entry for this artwork.
import logoMarkSrc from '@/assets/brand/logo-mark.svg';
import { APP_NAME, APP_TAGLINE } from '@/constants/app';
import { cn } from '@/utils/cn';

import styles from './Logo.module.css';

export interface LogoMarkProps {
  size?: number;
  className?: string | undefined;
}

/**
 * The Lisan brand mark — a mosque dome and arch on the primary tile.
 *
 * Sourced from `src/assets/brand/logo-mark.svg` so the sidebar, the favicon and the PWA icon can
 * never drift apart. The file is small enough that Vite inlines it, so this costs no request.
 *
 * The artwork is a rounded square with the glyph drawn inside a centred inscribed circle, which
 * is what lets the circular sidebar treatment be a `border-radius` away rather than a second file.
 * Its palette is baked in rather than tokenised: custom properties do not cascade into an SVG
 * loaded through `<img>`, and the brand tile stays blue in both themes regardless.
 */
export function LogoMark({ size = 34, className }: LogoMarkProps) {
  return (
    <img
      className={cn(styles.mark, className)}
      src={logoMarkSrc}
      alt=""
      width={size}
      height={size}
      decoding="async"
    />
  );
}

export interface LogoProps {
  /** Hide the tagline in tight spaces (mobile topbar). */
  compact?: boolean;
  size?: number;
  className?: string | undefined;
}

export function Logo({ compact = false, size = 34, className }: LogoProps) {
  return (
    <span className={cn(styles.lockup, className)}>
      <LogoMark size={size} />
      <span className={styles.text}>
        <span className={styles.name}>{APP_NAME}</span>
        {compact ? null : <span className={styles.tagline}>{APP_TAGLINE}</span>}
      </span>
    </span>
  );
}
