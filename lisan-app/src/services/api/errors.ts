import type { ApiErrorCode } from '@/types';

/**
 * One error type for the whole data layer (spec §67). UI code branches on `code`, never on
 * message text, so error copy can change without breaking behaviour.
 */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number | undefined;

  constructor(code: ApiErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

/**
 * True when the entity genuinely does not exist, as opposed to the request having failed.
 *
 * Any route that resolves an id out of the URL needs this distinction: a mistyped or stale id is
 * an empty state the learner can only leave by going back, while a transport failure is worth a
 * retry button. Telling one as the other either offers a button that can never succeed or claims
 * content is missing when the network merely dropped.
 */
export function isNotFoundError(value: unknown): value is ApiError {
  return isApiError(value) && value.code === 'not_found';
}

export function notFound(resource: string, id: string): ApiError {
  return new ApiError('not_found', `${resource} "${id}" could not be found.`, 404);
}

export function badRequest(message: string): ApiError {
  return new ApiError('bad_request', message, 400);
}

export function aborted(): ApiError {
  return new ApiError('aborted', 'The request was cancelled.');
}

export function networkError(message = 'The network is unavailable.'): ApiError {
  return new ApiError('network', message);
}

/** True for the cancellations React Query triggers on unmount — never worth surfacing. */
export function isAbortError(value: unknown): boolean {
  if (isApiError(value)) return value.code === 'aborted';
  return value instanceof DOMException && value.name === 'AbortError';
}
