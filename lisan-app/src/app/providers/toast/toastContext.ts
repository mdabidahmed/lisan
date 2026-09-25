import { createContext } from 'react';

import type { ToastVariant } from '@/types/ui';

export interface ToastOptions {
  description?: string;
  /** Milliseconds before auto-dismiss. `0` keeps it until dismissed. */
  duration?: number;
}

export interface ToastContextValue {
  show: (variant: ToastVariant, title: string, options?: ToastOptions) => string;
  success: (title: string, options?: ToastOptions) => string;
  error: (title: string, options?: ToastOptions) => string;
  info: (title: string, options?: ToastOptions) => string;
  warning: (title: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
