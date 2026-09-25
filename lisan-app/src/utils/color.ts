import { ACCENT_COLORS, type AccentColor } from '@/types/ui';

import { hashToIndex } from './hash';

function isAccentColor(value: string): value is AccentColor {
  return (ACCENT_COLORS as readonly string[]).includes(value);
}

/** Matches a bare custom-property reference such as `var(--color-category-food)`. */
const CSS_VAR_PATTERN = /^var\(\s*(--[a-z0-9-]+)\s*\)$/i;

/**
 * `Category['color']` (and friends) may be an accent token name, a `var(--token)` reference, or a
 * raw hex value. This resolves all three to something usable in a `style` attribute, so authored
 * content can stay token-based while still allowing one-off hexes.
 */
export function resolveAccentColor(color: string | undefined, fallback: AccentColor = 'blue') {
  const name = color && isAccentColor(color) ? color : undefined;
  if (name) {
    return {
      fg: `var(--color-accent-${name})`,
      bg: `var(--color-accent-${name}-soft)`,
    };
  }
  const token = color?.match(CSS_VAR_PATTERN)?.[1];
  if (token) {
    // The `-soft` companion is the convention, but mixing into the surface keeps a token that
    // only declares a base hue from falling all the way back to the default accent.
    return {
      fg: `var(${token})`,
      bg: `var(${token}-soft, color-mix(in srgb, var(${token}) 14%, var(--color-surface)))`,
    };
  }
  if (color?.startsWith('#')) {
    return { fg: color, bg: `color-mix(in srgb, ${color} 14%, var(--color-surface))` };
  }
  return {
    fg: `var(--color-accent-${fallback})`,
    bg: `var(--color-accent-${fallback}-soft)`,
  };
}

/** Stable accent for entities that do not declare one (e.g. a word's thumbnail tile). */
export function accentForId(id: string): AccentColor {
  return ACCENT_COLORS[hashToIndex(id, ACCENT_COLORS.length)] ?? 'blue';
}
