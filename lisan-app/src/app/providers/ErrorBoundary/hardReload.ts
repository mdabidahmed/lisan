/**
 * Reloading the document, as opposed to re-rendering it.
 *
 * One line, but worth its own module. It marks the only place in the app that throws away the
 * running JavaScript and asks the server for the entry point again, which is a thing you want to
 * be able to find. And it gives tests a seam they cannot otherwise get: jsdom defines `location`
 * itself, and `reload`, `assign` and `replace` on it, as non-writable and non-configurable
 * properties, so none of them can be spied on or stubbed. A test that reached the real call would
 * either navigate for real or log "Not implemented: navigation" and assert nothing.
 *
 * A plain reload is correct here rather than any attempt to bypass the cache: `index.html` is
 * served `no-cache, must-revalidate` (see `nginx.conf`), so the browser revalidates it and picks
 * up the new asset hashes.
 */
export function hardReload(): void {
  window.location.reload();
}
