import type { RequestOptions } from '@/types';

import { ApiError, aborted, isAbortError, networkError } from './errors';

/**
 * The transport contract. `MockClient` and `FetchHttpClient` both satisfy it, which is what makes
 * `client.ts` a one-line swap when a real backend lands.
 */
export interface HttpClient {
  get<T>(path: string, params?: Record<string, unknown>, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
}

function toParamValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

export function buildQueryString(params: Record<string, unknown> | undefined): string {
  if (!params) return '';
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      for (const entry of value as unknown[]) search.append(key, toParamValue(entry));
    } else {
      search.append(key, toParamValue(value));
    }
  }

  const query = search.toString();
  return query ? `?${query}` : '';
}

/**
 * The real-HTTP transport, and it is wired: `client.ts` constructs this instead of `MockClient`
 * whenever `VITE_API_MODE=http`, against `VITE_API_BASE_URL`.
 *
 * What does not exist is a backend to point it at, so `mock` is the default and this path is
 * untravelled in the shipped build rather than unbuilt. The shared `HttpClient` interface above is
 * what keeps the two honest: switching modes changes no call site. The endpoints a server has to
 * implement are listed in the README.
 */
export class FetchHttpClient implements HttpClient {
  readonly #baseUrl: string;

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl.replace(/\/$/, '');
  }

  get<T>(path: string, params?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
    return this.#request<T>('GET', `${path}${buildQueryString(params)}`, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.#request<T>('POST', path, body, options);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.#request<T>('DELETE', path, undefined, options);
  }

  async #request<T>(
    method: string,
    path: string,
    body: unknown,
    options: RequestOptions | undefined,
  ): Promise<T> {
    const init: RequestInit = { method };
    if (body !== undefined) {
      init.headers = { 'content-type': 'application/json' };
      init.body = JSON.stringify(body);
    }
    if (options?.signal) init.signal = options.signal;

    let response: Response;
    try {
      response = await fetch(`${this.#baseUrl}${path}`, init);
    } catch (error) {
      if (isAbortError(error)) throw aborted();
      throw networkError(error instanceof Error ? error.message : undefined);
    }

    if (!response.ok) {
      throw new ApiError(
        response.status === 404 ? 'not_found' : 'unknown',
        `Request failed with status ${response.status}.`,
        response.status,
      );
    }

    return (await response.json()) as T;
  }
}
