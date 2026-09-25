import { useCallback, useMemo } from 'react';

import { submitWaitlist, type WaitlistResult, type WaitlistSignup } from '@/services/premium';
import { usePremiumActions, usePremiumSignup } from '@/store/premiumStore';

export interface PremiumWaitlistApi {
  /** What the learner already told us, or `null` for a first-time visitor. */
  signup: WaitlistSignup | null;
  /** Takes the raw field value — blank is valid and registers without an address. */
  submit: (email: string) => Promise<WaitlistResult>;
  forget: () => void;
}

/**
 * The premium card's one dependency: the service that submits and the store that remembers, joined.
 *
 * The order matters. `submitWaitlist` runs first and the store is written only if it succeeds, so a
 * transport that rejects leaves the learner un-registered and free to press the button again —
 * rather than recording a signup the endpoint never received.
 *
 * This module imports Zod through the service, so only the lazily loaded `PremiumDialog` may import
 * it. `PremiumCard` renders in the app shell and reads `usePremiumSignup` from the store directly.
 */
export function usePremiumWaitlist(): PremiumWaitlistApi {
  const signup = usePremiumSignup();
  const { register, forget } = usePremiumActions();

  const submit = useCallback(
    async (email: string): Promise<WaitlistResult> => {
      const result = await submitWaitlist({ email });
      if (result.ok) register(result.signup);
      return result;
    },
    [register],
  );

  return useMemo(() => ({ signup, submit, forget }), [signup, submit, forget]);
}
