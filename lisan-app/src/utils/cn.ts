type ClassValue = string | number | false | null | undefined;

/**
 * Joins CSS-module class names, dropping falsy entries.
 * Deliberately tiny — Lisan has no utility-class framework to merge against.
 */
export function cn(...values: ClassValue[]): string {
  let out = '';
  for (const value of values) {
    if (!value && value !== 0) continue;
    out = out ? `${out} ${String(value)}` : String(value);
  }
  return out;
}
