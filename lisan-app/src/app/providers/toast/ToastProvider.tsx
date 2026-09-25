import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { ToastViewport, type ToastData } from '@/components/ui/Toast';
import type { ToastVariant } from '@/types/ui';
import { createId } from '@/utils/id';

import { ToastContext, type ToastContextValue, type ToastOptions } from './toastContext';

const DEFAULT_DURATION = 4000;
const MAX_VISIBLE = 4;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timers = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (variant: ToastVariant, title: string, options: ToastOptions = {}) => {
      const id = createId('toast');
      const duration = options.duration ?? DEFAULT_DURATION;

      setToasts((current) =>
        [
          ...current,
          {
            id,
            variant,
            title,
            ...(options.description === undefined ? {} : { description: options.description }),
            duration,
          },
        ].slice(-MAX_VISIBLE),
      );

      if (duration > 0) {
        timers.current.set(
          id,
          window.setTimeout(() => {
            dismiss(id);
          }, duration),
        );
      }
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => {
        window.clearTimeout(timer);
      });
      pending.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      dismiss,
      success: (title, options) => show('success', title, options),
      error: (title, options) => show('error', title, options),
      info: (title, options) => show('info', title, options),
      warning: (title, options) => show('warning', title, options),
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
