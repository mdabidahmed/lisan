import { create } from 'zustand';
import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware';

import { STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/constants';
import type { WaitlistSignup } from '@/services/premium';
import { createZustandStorage } from '@/services/storage';

/**
 * Whether the learner has asked for a premium tier, and the address they left if they left one.
 *
 * Persisted through `createZustandStorage` into `lisan:premium`, wrapped in the usual
 * `{ version, data }` envelope — so this is the "saved on this device" the dialog promises, and the
 * memory that stops a returning learner being pitched something they already said yes to.
 *
 * It is the only writer of that key, whatever `submitWaitlist` is pointed at: a learner's own copy of
 * what they said should not depend on a request succeeding.
 *
 * `WaitlistSignup` is imported as a type, which is erased — a runtime import of `@/services/premium`
 * here would drag Zod into the app shell, and this store is read while the sidebar first paints.
 */

export interface PremiumActions {
  /** Records a signup that `submitWaitlist` has already validated and stamped. */
  register: (signup: WaitlistSignup) => void;
  /** Forgets it. The learner's address is on their device, so removing it has to be their call. */
  forget: () => void;
}

export interface PremiumState {
  signup: WaitlistSignup | null;
  actions: PremiumActions;
}

export type PremiumData = Omit<PremiumState, 'actions'>;

const EMPTY: PremiumData = { signup: null };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Narrows whatever is in storage. Hand-written rather than a Zod schema for the same reason as the
 * type-only import above: this runs before first paint and Zod is deliberately off that path.
 *
 * A record missing its timestamp is dropped rather than repaired. The alternative — stamping "now" —
 * would tell a returning learner they registered today, which is worse than asking them again.
 */
function coerce(value: unknown): PremiumData {
  if (!isRecord(value) || !isRecord(value.signup)) return { ...EMPTY };

  const { email, submittedAt } = value.signup;
  if (typeof submittedAt !== 'string' || submittedAt === '') return { ...EMPTY };

  return {
    signup: { email: typeof email === 'string' && email !== '' ? email : null, submittedAt },
  };
}

const persistOptions: PersistOptions<PremiumState, PremiumData> = {
  name: STORAGE_KEYS.premium,
  version: STORAGE_SCHEMA_VERSION,
  storage: createJSONStorage<PremiumData>(() => createZustandStorage()),
  partialize: ({ actions: _actions, ...data }) => data,
  migrate: (persisted) => coerce(persisted),
};

export const usePremiumStore = create<PremiumState>()(
  persist(
    (set) => ({
      ...EMPTY,
      actions: {
        register: (signup) => {
          set({ signup: { ...signup } });
        },
        forget: () => {
          set({ ...EMPTY });
        },
      },
    }),
    persistOptions,
  ),
);

/** `null` for a first-time visitor. Drives both the card's copy and the dialog's opening view. */
export function usePremiumSignup(): WaitlistSignup | null {
  return usePremiumStore((state) => state.signup);
}

export function usePremiumActions(): PremiumActions {
  return usePremiumStore((state) => state.actions);
}
