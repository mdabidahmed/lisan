import { Component, type ErrorInfo, type ReactNode } from 'react';

import { isChunkLoadError } from '@/utils';

import { AppUpdating } from './AppUpdating';
import { ErrorFallback } from './ErrorFallback';
import { hardReload } from './hardReload';
import { canRecoverFromStaleApp, recoverFromStaleApp } from './staleAppRecovery';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback. Receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Changing this value clears the error — the router passes the pathname. */
  resetKey?: string;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
  /** The error was a stale build and a reload is on its way; show that instead of a failure. */
  recovering: boolean;
}

/**
 * Catches render-phase crashes so a single broken component never blanks the app.
 * Used once at the root and once per route (with `resetKey` set to the pathname).
 *
 * It also handles the one failure that is not a crash at all: every route is a dynamic import of a
 * content-hashed file, so a tab that was open across a deploy will fail to load the first route it
 * has not visited yet. `staleAppRecovery` explains the reasoning; from here it is enough to know
 * that such an error means the page is out of date rather than broken, that the boundary reloads
 * once to fix it, and that everything else is reported exactly as before.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null, recovering: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    /*
      Classified here rather than in `componentDidCatch` so that the very first frame after the
      failure is already the updating screen. Deciding later would paint "something went wrong"
      and replace it a tick afterwards, which tells the learner their app broke when it only went
      out of date. This stays a pure function of the error: it reads the recovery marker but writes
      nothing, so React re-running it changes nothing.
    */
    return { error, recovering: canRecoverFromStaleApp(error) };
  }

  override componentDidUpdate(previous: ErrorBoundaryProps): void {
    if (this.state.error && previous.resetKey !== this.props.resetKey) {
      this.setState({ error: null, recovering: false });
    }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);

    if (isChunkLoadError(error)) {
      if (recoverFromStaleApp(error)) {
        // Not `console.error`: an out-of-date tab is an expected consequence of deploying, and
        // reporting it as a crash would bury real crashes in whatever collects these.
        console.warn(
          '[Lisan] Route chunk missing; reloading onto the current build',
          error.message,
        );
        return;
      }

      /*
        Refused, which means this tab has already spent its one reload — so the learner is about
        to see the error screen and reloading did not help. That is worth reporting loudly: it is
        no longer an ordinary deploy, but a build whose chunks are missing from both the server and
        the cache. Drop the updating screen rather than promise a reload that is not coming.
      */
      console.error('[Lisan] Route chunk still missing after reloading', error.message);
      this.setState({ recovering: false });
      return;
    }

    console.error('[Lisan] Unhandled render error', error, info.componentStack);
  }

  private readonly reset = (): void => {
    /*
      Clearing the error is the right retry for a render bug and the wrong one for a stale build:
      the module React needs is no longer on the server, so re-rendering asks for the same missing
      file and fails identically. Only fetching the document again can help. Applied here, in the
      callback every fallback is handed, so the root fallback and the per-route one both get it.
    */
    if (isChunkLoadError(this.state.error)) {
      hardReload();
      return;
    }
    this.setState({ error: null, recovering: false });
  };

  override render(): ReactNode {
    const { error, recovering } = this.state;
    if (!error) return this.props.children;
    // Ahead of `fallback`: a caller's custom error UI is still an error UI, and this is not one.
    if (recovering) return <AppUpdating />;
    if (this.props.fallback) return this.props.fallback(error, this.reset);
    return <ErrorFallback error={error} onReset={this.reset} />;
  }
}
