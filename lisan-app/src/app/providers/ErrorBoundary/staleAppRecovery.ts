import { SESSION_STORAGE_KEYS } from '@/constants';
import { storageService } from '@/services/storage';
import { isChunkLoadError } from '@/utils';

import { hardReload } from './hardReload';

/**
 * Getting a tab out of a build that no longer exists.
 *
 * A deploy replaces every content-hashed file in `/assets`, and the old ones stop being served.
 * A tab that was already open — left overnight, or a phone resuming from the background — is
 * still running the previous entry chunk, holding the previous URLs. It keeps working until the
 * learner opens a route it has not loaded yet; that `import()` then asks for a file that is gone.
 * Nothing is broken, so there is nothing to fix at the point of failure: the page is simply out of
 * date, and the fix is to fetch the current one. Hence a reload rather than a retry, which would
 * only ask for the same dead URL again.
 *
 * The whole risk in doing this automatically is doing it repeatedly, so the flow is arranged so
 * that a reload is impossible to repeat: one marker, written before the reload can fire, and read
 * back before the next one is allowed.
 */

/**
 * How long a recorded attempt blocks another one.
 *
 * It has to outlast a reload and the navigation that follows it, so that a tab which comes back up
 * and fails the same way immediately stops rather than going round again — a minute is far more
 * than that takes, even on a slow phone. It also has to expire, which is why the marker carries a
 * timestamp rather than being a bare flag: the same tab can still be open when the *next* deploy
 * lands days later, and that failure deserves its own reload rather than being turned away by a
 * marker from the last one.
 */
export const RELOAD_GUARD_WINDOW_MS = 60_000;

/**
 * Ceiling on waiting for the service worker before reloading regardless. Long enough for
 * `update()` to settle on a normal connection, short enough that a stalled network cannot leave a
 * learner watching the updating screen. The reload happens either way.
 */
const SERVICE_WORKER_UPDATE_TIMEOUT_MS = 3_000;

interface ReloadAttempt {
  /** Epoch milliseconds. */
  at: number;
}

interface ServiceWorkerScope {
  serviceWorker?: ServiceWorkerContainer | undefined;
}

function readAttempt(): ReloadAttempt | null {
  const stored = storageService.session.read<unknown>(SESSION_STORAGE_KEYS.staleReload, {
    fallback: null,
  });
  if (typeof stored !== 'object' || stored === null) return null;

  const at = (stored as Record<string, unknown>).at;
  return typeof at === 'number' ? { at } : null;
}

/**
 * True when `error` says this tab is running a build the server has replaced, and the guard still
 * permits a reload.
 *
 * Reads state but changes none, so an error boundary can call it while deriving render state and
 * show the right screen on the first frame instead of flashing a failure it is about to recover
 * from. A marker dated in the future — a clock correction, most likely — counts as recent and
 * blocks the reload, which is the harmless direction to be wrong in.
 */
export function canRecoverFromStaleApp(error: unknown, now: number = Date.now()): boolean {
  if (!isChunkLoadError(error)) return false;

  const attempt = readAttempt();
  return attempt === null || now - attempt.at >= RELOAD_GUARD_WINDOW_MS;
}

/**
 * Records the attempt and reloads. Returns whether a reload was actually started, so a caller that
 * is refused can show the error UI instead of waiting for a reload that is not coming.
 */
export function recoverFromStaleApp(error: unknown, now: number = Date.now()): boolean {
  if (!canRecoverFromStaleApp(error, now)) return false;

  /*
    The marker goes down first, synchronously, before anything can navigate. It is the only thing
    between one reload and a loop, so a reload that could not be recorded must not happen at all:
    with no marker to find, the next failed import in the reloaded tab would reload again, and
    again, for as long as the learner stayed. `write` returns false exactly when the area is
    unusable — Safari's private mode is the real-world case — and an error screen is a far better
    outcome than a tab that will not hold still.
  */
  const recorded = storageService.session.write(SESSION_STORAGE_KEYS.staleReload, {
    at: now,
  } satisfies ReloadAttempt);
  if (!recorded) return false;

  void updateServiceWorkerThenReload();
  return true;
}

/**
 * Asks the service worker to check for a new version before reloading.
 *
 * Without this the reload can be answered by the worker that is already installed. Navigation
 * requests are served from its precache (`navigateFallback: '/index.html'`), so a worker that has
 * not yet noticed the deploy hands back the same `index.html`, pointing at the same dead chunks,
 * and the reload achieves nothing. `update()` re-fetches the worker script; because the build sets
 * `skipWaiting` and `clientsClaim`, a new one activates and takes over this tab immediately, and
 * the reload is then served the current `index.html`. When there is no worker, or no update, this
 * costs a resolved promise and nothing else.
 */
async function updateServiceWorkerThenReload(): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<void>((resolve) => {
    timer = setTimeout(resolve, SERVICE_WORKER_UPDATE_TIMEOUT_MS);
  });

  try {
    await Promise.race([updateServiceWorker(), deadline]);
  } finally {
    clearTimeout(timer);
  }

  hardReload();
}

async function updateServiceWorker(): Promise<void> {
  // Typed as optional because it is: no service worker in jsdom, none over plain HTTP, and none
  // in a private window in some browsers.
  const container = (navigator as ServiceWorkerScope).serviceWorker;
  if (!container) return;

  try {
    const registration = await container.getRegistration();
    await registration?.update();
  } catch {
    // An update that cannot be fetched — offline, or the worker script itself now 404s — is not
    // worth reporting. The reload is what the learner is waiting for and it still has to happen.
  }
}
