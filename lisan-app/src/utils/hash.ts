/**
 * Small deterministic hash (FNV-1a, 32-bit). Used to derive stable visuals — thumbnail gradients,
 * shuffle seeds — from ids, so the same word always looks the same on every device and render.
 */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Deterministic integer in `[0, max)`. */
export function hashToIndex(value: string, max: number): number {
  return max <= 0 ? 0 : hashString(value) % max;
}

/** Deterministic hue in `[0, 360)`. */
export function hashToHue(value: string): number {
  return hashString(value) % 360;
}
