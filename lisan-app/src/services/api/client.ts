import { APP_ENV } from '@/utils';

import { FetchHttpClient, type HttpClient } from './httpClient';
import { MockClient } from './mockClient';
import { createMockRoutes } from './mockRoutes';

/**
 * THE SWAP POINT.
 *
 * Every endpoint in `./endpoints` talks to `apiClient` and nothing else, so moving Lisan onto a
 * real backend is this one line plus `VITE_API_MODE=http` in the environment. Nothing above the
 * services layer changes, and the two implementations are kept honest by `HttpClient`.
 */
export const apiClient: HttpClient =
  APP_ENV.apiMode === 'http'
    ? new FetchHttpClient(APP_ENV.apiBaseUrl)
    : new MockClient(createMockRoutes());
