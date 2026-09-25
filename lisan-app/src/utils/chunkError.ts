/**
 * Recognising a dynamic import that failed because the app is out of date.
 *
 * Every route is a `React.lazy` around an `import()` of a content-hashed file, so a deploy that
 * rotates those hashes leaves an already-open tab holding URLs the server has stopped serving.
 * The first navigation to a route the tab has not visited yet rejects, React surfaces the
 * rejection as a render error, and the app looks broken when it is only stale.
 *
 * There is no error code to key off. The platform reports this as an ordinary `TypeError` whose
 * one distinguishing feature is its message, and every engine words that message differently, so
 * matching text is the only option available. It is kept deliberately narrow, because the two
 * failure directions are not symmetrical: a false negative costs one error screen, while a false
 * positive reloads the page on a genuine render bug — hiding the bug behind a reload, and turning
 * a visible defect into a reload loop if the guard in `staleAppRecovery` ever failed to hold.
 *
 * Each phrase below therefore names the module-loading machinery itself rather than the fetch that
 * carried it. That is what keeps `TypeError: Failed to fetch` — the ordinary network failure, and
 * by far the more common error in this app — from matching: it shares two words with the Chromium
 * phrasing and none of the part that makes it about a module.
 */
const DYNAMIC_IMPORT_FAILURES: readonly string[] = [
  // Chromium: Chrome, Edge, Opera, Samsung Internet, Electron.
  'failed to fetch dynamically imported module',
  // Firefox.
  'error loading dynamically imported module',
  // Safari and everything else on WebKit, including every browser on iOS.
  'importing a module script failed',
];

/**
 * True when `error` is a failed dynamic import, and so evidence that this tab is running against
 * a build the server no longer has.
 *
 * Takes `unknown` because the callers are error boundaries: `useRouteError` is untyped and a
 * render can throw a non-`Error`. Anything that is not an `Error` carrying a string message is
 * treated as an ordinary failure, which is the safe direction.
 */
export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return DYNAMIC_IMPORT_FAILURES.some((phrase) => message.includes(phrase));
}
