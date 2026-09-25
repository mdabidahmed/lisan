import type { MouseEvent } from 'react';

import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { useAudio } from '@/hooks';
import { cn } from '@/utils';

import styles from './AudioButton.module.css';

export interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg' | undefined;
  variant?: 'primary' | 'soft' | 'ghost' | undefined;
  label?: string | undefined;
  rate?: number | undefined;
  /** Overrides the default Arabic voice — e.g. `'en-US'` to read an English prompt aloud. */
  lang?: string | undefined;
  className?: string | undefined;
  onPlay?: (() => void) | undefined;
  /** Defaults to true so the button works inside clickable rows and cards. */
  stopPropagation?: boolean | undefined;
  /**
   * `center` by default. Pass `end` when the button sits flush against a container's trailing
   * edge (a word panel, a list row) so the tooltip bubble grows inward instead of overflowing.
   */
  tooltipAlign?: 'center' | 'end' | undefined;
}

const UNSUPPORTED_TITLE = 'Speech synthesis is not available in this browser';

/**
 * The single entry point for pronunciation in the product. Every other component asks for audio by
 * rendering this, which keeps `useAudio` (and therefore the speech queue) owned by one place.
 */
export function AudioButton({
  text,
  size = 'md',
  variant = 'primary',
  label,
  rate,
  lang,
  className,
  onPlay,
  stopPropagation = true,
  tooltipAlign = 'center',
}: AudioButtonProps) {
  const { speak, stop, isSpeaking, isSupported, activeText } = useAudio();
  const isPlaying = isSpeaking && activeText === text;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) event.stopPropagation();
    if (!isSupported) return;

    if (isPlaying) {
      stop();
      return;
    }
    speak(text, { rate, lang });
    onPlay?.();
  };

  const idleLabel = label ?? 'Play pronunciation';
  // While playing, the hover message always names the action a tap now performs — even when a
  // caller supplied its own idle label ("Play the word again") — so it never reads "Play…" over
  // an icon that has already turned into a pause glyph.
  const accessibleLabel = isPlaying ? 'Stop playing' : idleLabel;
  const tooltipContent = isSupported ? accessibleLabel : UNSUPPORTED_TITLE;

  return (
    <span className={cn(styles.root, className)} data-playing={isPlaying}>
      <Tooltip content={tooltipContent} align={tooltipAlign}>
        <IconButton
          icon={isPlaying ? 'pause' : 'play'}
          label={accessibleLabel}
          variant={variant}
          size={size}
          shape="circle"
          className={styles.button}
          disabled={!isSupported}
          hideNativeTitle
          onClick={handleClick}
        />
      </Tooltip>
      <span aria-live="polite" className="u-visually-hidden">
        {isPlaying ? 'Playing pronunciation' : ''}
      </span>
    </span>
  );
}
