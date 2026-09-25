import { QueryClient } from '@tanstack/react-query';

import { isApiError } from '@/services/api/errors';

const FIVE_MINUTES = 5 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;
const MAX_RETRIES = 2;

/**
 * Vocabulary content is authored and immutable, so it is cached aggressively and never refetched
 * on window focus — a learner switching tabs should not trigger a single request.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: FIVE_MINUTES,
        gcTime: ONE_HOUR,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount, error) => {
          // A missing word or a cancelled request will never succeed on retry.
          if (isApiError(error) && (error.code === 'not_found' || error.code === 'aborted')) {
            return false;
          }
          return failureCount < MAX_RETRIES;
        },
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
