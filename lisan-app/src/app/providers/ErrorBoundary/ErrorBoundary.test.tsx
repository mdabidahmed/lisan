import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SESSION_STORAGE_KEYS } from '@/constants';
import { storageService } from '@/services/storage';

import { ErrorBoundary } from './ErrorBoundary';
import { ErrorFallback } from './ErrorFallback';
import { hardReload } from './hardReload';
import { RELOAD_GUARD_WINDOW_MS } from './staleAppRecovery';

/**
 * Only the reload is mocked. The marker, the guard and the classification are the real ones, so
 * these tests exercise the actual recovery path rather than a description of it.
 */
vi.mock('./hardReload', () => ({ hardReload: vi.fn() }));

const CHUNK_MESSAGE =
  'Failed to fetch dynamically imported module: https://lisan.app/assets/Settings-B7xK2p9q.js';

function Boom({ error }: { error: Error }): never {
  throw error;
}

function renderBoundary(error: Error) {
  return render(
    <ErrorBoundary>
      <Boom error={error} />
    </ErrorBoundary>,
  );
}

/** Pretends this tab already reloaded `ago` milliseconds back. */
function seedReloadMarker(ago: number): void {
  storageService.session.write(SESSION_STORAGE_KEYS.staleReload, { at: Date.now() - ago });
}

beforeEach(() => {
  sessionStorage.clear();
  // React reports every caught error on the console; these tests are about what the learner sees.
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  sessionStorage.clear();
});

describe('ErrorBoundary: a route chunk that is no longer on the server', () => {
  it('says the app is updating rather than that something went wrong', async () => {
    renderBoundary(new TypeError(CHUNK_MESSAGE));

    expect(await screen.findByRole('status')).toHaveTextContent(/updating lisan/i);
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps the reassurance that nothing local was lost', async () => {
    renderBoundary(new TypeError(CHUNK_MESSAGE));

    expect(await screen.findByRole('status')).toHaveTextContent(
      /progress and bookmarks are saved on this device/i,
    );
  });

  it('reloads the page, exactly once', async () => {
    renderBoundary(new TypeError(CHUNK_MESSAGE));

    // Not synchronous: the reload waits on the service worker check first (see `staleAppRecovery`).
    await vi.waitFor(() => {
      expect(hardReload).toHaveBeenCalledTimes(1);
    });
    expect(hardReload).toHaveBeenCalledTimes(1);
  });

  it('records the attempt so the reloaded tab can tell it has already tried', () => {
    renderBoundary(new TypeError(CHUNK_MESSAGE));

    expect(
      storageService.session.read(SESSION_STORAGE_KEYS.staleReload, { fallback: null }),
    ).not.toBeNull();
  });
});

describe('ErrorBoundary: when the reload has already been tried', () => {
  it('shows the error UI instead of reloading again', () => {
    seedReloadMarker(2_000);

    renderBoundary(new TypeError(CHUNK_MESSAGE));

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
    expect(screen.queryByText(/updating lisan/i)).not.toBeInTheDocument();
    expect(hardReload).not.toHaveBeenCalled();
  });

  it('still tells the learner their progress is safe', () => {
    seedReloadMarker(2_000);

    renderBoundary(new TypeError(CHUNK_MESSAGE));

    expect(screen.getByRole('alert')).toHaveTextContent(
      /progress and bookmarks are saved on this device/i,
    );
  });

  it('offers an action that genuinely reloads, not one that re-renders and fails again', async () => {
    seedReloadMarker(2_000);
    const user = userEvent.setup();

    renderBoundary(new TypeError(CHUNK_MESSAGE));
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(hardReload).toHaveBeenCalledTimes(1);
  });

  it('lets a failure from a later deploy have its own attempt', async () => {
    seedReloadMarker(RELOAD_GUARD_WINDOW_MS + 1);

    renderBoundary(new TypeError(CHUNK_MESSAGE));

    expect(screen.getByRole('status')).toHaveTextContent(/updating lisan/i);
    await vi.waitFor(() => {
      expect(hardReload).toHaveBeenCalledTimes(1);
    });
  });
});

describe('ErrorBoundary: an ordinary render error', () => {
  const renderBug = new TypeError("Cannot read properties of undefined (reading 'translation')");

  it('renders the error UI and never reloads', () => {
    renderBoundary(renderBug);

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
    expect(hardReload).not.toHaveBeenCalled();
  });

  it('is not mistaken for a stale build even when the network is at fault', () => {
    // `TypeError: Failed to fetch` opens with the same two words as the Chromium chunk message.
    renderBoundary(new TypeError('Failed to fetch'));

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
    expect(hardReload).not.toHaveBeenCalled();
  });

  it('leaves no recovery marker behind, so a later stale build still gets its reload', () => {
    renderBoundary(renderBug);

    expect(
      storageService.session.read(SESSION_STORAGE_KEYS.staleReload, { fallback: null }),
    ).toBeNull();
  });

  it('retries by re-rendering, which is what a transient render bug needs', async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    function Flaky() {
      if (shouldThrow) throw renderBug;
      return <p>Recovered</p>;
    }

    render(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.getByText('Recovered')).toBeInTheDocument();
    expect(hardReload).not.toHaveBeenCalled();
  });

  it('reports the crash on the console for whatever collects them', () => {
    renderBoundary(renderBug);

    expect(console.error).toHaveBeenCalledWith(
      '[Lisan] Unhandled render error',
      renderBug,
      expect.anything(),
    );
  });
});

describe('ErrorBoundary: a caller with its own fallback', () => {
  it('still gets the updating screen, because a stale build is not a failure to report', () => {
    render(
      <ErrorBoundary
        fallback={(error, reset) => <ErrorFallback error={error} onReset={reset} variant="app" />}
      >
        <Boom error={new TypeError(CHUNK_MESSAGE)} />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('status')).toHaveTextContent(/updating lisan/i);
  });

  it('gets its own fallback for an ordinary error', () => {
    render(
      <ErrorBoundary
        fallback={(error, reset) => <ErrorFallback error={error} onReset={reset} variant="app" />}
      >
        <Boom error={new Error('boom')} />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
    expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument();
  });
});
