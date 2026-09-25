import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { createQueryClient } from './queryClient';

export interface QueryProviderProps {
  children: ReactNode;
  /** Tests inject a client with retries disabled. */
  client?: QueryClient;
}

export function QueryProvider({ children, client }: QueryProviderProps) {
  const [fallbackClient] = useState(createQueryClient);
  return <QueryClientProvider client={client ?? fallbackClient}>{children}</QueryClientProvider>;
}
