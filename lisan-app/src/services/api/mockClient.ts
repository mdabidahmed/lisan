import type { RequestOptions } from '@/types';
import { APP_ENV } from '@/utils';

import { ApiError, aborted, notFound } from './errors';
import type { HttpClient } from './httpClient';

/**
 * An in-memory backend that behaves like a real one: asynchronous, artificially latent, abortable
 * and path-routed. Components therefore exercise the same loading, error and cancellation paths
 * they will hit against a live API (spec §66).
 */

export type HttpMethod = 'GET' | 'POST' | 'DELETE';

export interface MockRequest {
  method: HttpMethod;
  path: string;
  params: Record<string, unknown>;
  /** Values captured from `:name` segments in the route pattern. */
  pathParams: Record<string, string>;
  body: unknown;
}

export type MockHandler = (request: MockRequest) => unknown;

export interface MockRoute {
  method: HttpMethod;
  /** Express-style pattern, e.g. `/categories/:categoryId/words`. */
  pattern: string;
  handler: MockHandler;
}

export interface MockClientOptions {
  latencyMs?: number | undefined;
}

function defaultLatency(): number {
  return APP_ENV.isTest ? 0 : APP_ENV.mockLatencyMs;
}

function segments(path: string): string[] {
  return path.split('/').filter((part) => part.length > 0);
}

function matchRoute(
  route: MockRoute,
  method: HttpMethod,
  path: string,
): Record<string, string> | null {
  if (route.method !== method) return null;

  const patternParts = segments(route.pattern);
  const pathParts = segments(path);
  if (patternParts.length !== pathParts.length) return null;

  const pathParams: Record<string, string> = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const expected = patternParts[index];
    const actual = pathParts[index];
    if (expected === undefined || actual === undefined) return null;

    if (expected.startsWith(':')) {
      pathParams[expected.slice(1)] = decodeURIComponent(actual);
      continue;
    }
    if (expected !== actual) return null;
  }
  return pathParams;
}

function delay(ms: number, signal: AbortSignal | undefined): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(aborted());
      return;
    }

    const onAbort = () => {
      clearTimeout(timer);
      reject(aborted());
    };

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export class MockClient implements HttpClient {
  readonly #routes: readonly MockRoute[];
  readonly #latencyMs: number;

  constructor(routes: readonly MockRoute[], options: MockClientOptions = {}) {
    this.#routes = routes;
    this.#latencyMs = options.latencyMs ?? defaultLatency();
  }

  get<T>(path: string, params?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
    return this.#dispatch<T>('GET', path, params ?? {}, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.#dispatch<T>('POST', path, {}, body, options);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.#dispatch<T>('DELETE', path, {}, undefined, options);
  }

  async #dispatch<T>(
    method: HttpMethod,
    path: string,
    params: Record<string, unknown>,
    body: unknown,
    options: RequestOptions | undefined,
  ): Promise<T> {
    const signal = options?.signal;
    if (signal?.aborted) throw aborted();

    await delay(this.#latencyMs, signal);
    if (signal?.aborted) throw aborted();

    for (const route of this.#routes) {
      const pathParams = matchRoute(route, method, path);
      if (!pathParams) continue;

      try {
        return route.handler({ method, path, params, pathParams, body }) as T;
      } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(
          'unknown',
          error instanceof Error ? error.message : 'The request could not be completed.',
          500,
        );
      }
    }

    throw notFound('Endpoint', `${method} ${path}`);
  }
}
