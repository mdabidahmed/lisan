import { WEB_FONTS, type WebFontId } from './webfontRegistry';

/**
 * Fetches an optional web font, once per document.
 *
 * Two mechanisms, one entry point. Families served by a font CDN need their `@font-face` rules
 * before anything can be requested, so a `<link rel="stylesheet">` is injected first; families
 * Lisan declares itself (IndoPak, in `fonts.css`) skip straight to the download. Either way the
 * actual bytes are pulled with the CSS Font Loading API, which is what makes the result
 * observable: a face that cannot be fetched resolves `false` instead of silently never arriving,
 * and the caller can drop back to the default family.
 *
 * Nothing here blocks rendering. Every face is declared `font-display: swap`, and every token
 * stack in `tokens.css` ends in the self-hosted default, so text is always painted in a real face
 * and merely re-paints when a better one lands.
 */

/** Marks the `<link>` elements this module owns. Also how a repeat request finds the first one. */
const LINK_ATTRIBUTE = 'data-lisan-font';

/**
 * One promise per face, kept for the life of the document.
 *
 * This is the idempotency guarantee: toggling a preference back and forth, or two components
 * asking for Urdu at once, produces exactly one stylesheet and one download. Failures are cached
 * too — a face blocked by CSP or missing from the CDN will fail identically on every retry, and
 * re-requesting it on each render would turn one bad response into a request storm.
 */
const requests = new Map<WebFontId, Promise<boolean>>();

/** Resolves `true` once the face is usable, `false` if it could not be fetched. Never rejects. */
export function loadWebFont(id: WebFontId): Promise<boolean> {
  const existing = requests.get(id);
  if (existing) return existing;

  const request = resolveWebFont(id);
  requests.set(id, request);
  return request;
}

async function resolveWebFont(id: WebFontId): Promise<boolean> {
  const font = WEB_FONTS[id];

  if (font.stylesheet !== undefined && !(await injectStylesheet(id, font.stylesheet))) {
    return false;
  }

  /*
    `document.fonts` is typed as always present, but jsdom and pre-2016 browsers do not implement
    it. The `@font-face` rules are live either way — the Font Loading API only lets us start the
    download early and notice a failure — so its absence is not a failed load. `Partial` is the
    feature detection: without it both the compiler and the linter insist the check is redundant.
  */
  const fontSet = (document as Partial<Document>).fonts;
  if (!fontSet) return true;

  try {
    const matched = await Promise.all(
      font.weights.map((weight) => fontSet.load(`${weight} 1em "${font.family}"`, font.sample)),
    );
    return matched.some((faces) => faces.length > 0);
  } catch {
    return false;
  }
}

function injectStylesheet(id: WebFontId, href: string): Promise<boolean> {
  if (document.head.querySelector(`link[${LINK_ATTRIBUTE}="${id}"]`)) return Promise.resolve(true);

  return new Promise<boolean>((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute(LINK_ATTRIBUTE, id);

    link.addEventListener(
      'load',
      () => {
        resolve(true);
      },
      { once: true },
    );
    link.addEventListener(
      'error',
      () => {
        // Leaving a dead stylesheet in `<head>` would make the idempotency check above report a
        // face that is not there.
        link.remove();
        resolve(false);
      },
      { once: true },
    );

    document.head.append(link);
  });
}

/**
 * Forgets every request and removes the stylesheets they injected.
 *
 * Tests only. The cache is deliberately document-lifetime in the app, so there is nothing to
 * reset there; a test that shares it with the next one would leak both the promise and the
 * `<link>`.
 */
export function resetWebFonts(): void {
  requests.clear();
  for (const link of document.head.querySelectorAll(`link[${LINK_ATTRIBUTE}]`)) {
    link.remove();
  }
}
