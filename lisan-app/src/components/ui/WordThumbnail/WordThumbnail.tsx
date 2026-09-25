import { useState, type CSSProperties } from 'react';

import { getWordArt } from '@/assets';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { ARABIC_CONTENT_ATTRS } from '@/i18n';
import { accentForId, cn, firstArabicLetter, hashToHue, resolveAccentColor } from '@/utils';

import styles from './WordThumbnail.module.css';

export interface WordThumbnailProps {
  wordId: string;
  arabic: string;
  src?: string | undefined;
  alt?: string | undefined;
  size?: number | undefined;
  radius?: string | undefined;
  className?: string | undefined;
}

type ThumbnailStyle = CSSProperties & Record<`--${string}`, string>;

const DEFAULT_SIZE = 64;

/**
 * Word tiles must never look like a missing asset, because most of the corpus ships without
 * artwork. The gradient and letter are derived from the word id, so a word looks identical on
 * every device and every render while still feeling authored rather than generic.
 *
 * Illustrations are looked up by word id rather than passed in, so a caller never has to know
 * which words are covered. An explicit `src` still wins, which is the hook for per-word artwork
 * arriving from a CMS later.
 */
export function WordThumbnail({
  wordId,
  arabic,
  src,
  alt,
  size = DEFAULT_SIZE,
  radius = 'var(--radius-md)',
  className,
}: WordThumbnailProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const accent = resolveAccentColor(accentForId(wordId));
  // A per-word gradient angle keeps neighbouring rows from looking stamped out.
  const angle = 108 + (hashToHue(wordId) % 64);
  const letter = firstArabicLetter(arabic);
  const art = src === undefined || src === '' ? getWordArt(wordId) : undefined;
  const showRawSrc = src !== undefined && src !== '' && !imageFailed;
  const showArt = art !== undefined && !imageFailed;
  const showImage = showRawSrc || showArt;

  const style: ThumbnailStyle = {
    '--thumb-size': `${size}px`,
    '--thumb-radius': radius,
    '--thumb-fg': accent.fg,
    '--thumb-bg': accent.bg,
    '--thumb-angle': `${angle}deg`,
  };

  const describedProps =
    alt === undefined
      ? ({ 'aria-hidden': true } as const)
      : showImage
        ? {}
        : ({ role: 'img', 'aria-label': alt } as const);

  return (
    <span className={cn(styles.root, className)} style={style} {...describedProps}>
      {showArt ? (
        <ResponsiveImage
          asset={art}
          alt={alt ?? ''}
          sizes={`${size}px`}
          className={styles.picture}
          onError={() => {
            setImageFailed(true);
          }}
        />
      ) : showRawSrc ? (
        <img
          className={styles.image}
          src={src}
          alt={alt ?? ''}
          loading="lazy"
          decoding="async"
          width={size}
          height={size}
          onError={() => {
            setImageFailed(true);
          }}
        />
      ) : (
        <span className={styles.letter} {...ARABIC_CONTENT_ATTRS}>
          {letter}
        </span>
      )}
    </span>
  );
}
