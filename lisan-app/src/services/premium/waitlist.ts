import { z } from 'zod';

import { analytics } from '@/services/analytics';
import { nowIso } from '@/utils';

/**
 * Registering interest in a premium tier — and the seam where that becomes a real request.
 *
 * `submitWaitlist` is the only way to register, so validation, the timestamp and the analytics event
 * have exactly one implementation. What it does *with* a signup is delegated to a `WaitlistTransport`,
 * the same shape of swap as `SpeechProvider` in `services/audio` and `HttpClient` in `services/api`:
 * one interface, a default implementation, and a setter.
 *
 * ── Wiring a real endpoint ─────────────────────────────────────────────────────────────────────
 *
 * There is no backend, so the default transport sends a signup nowhere (see `deviceOnlyTransport`).
 * When there is somewhere to send it, this is the whole change — one transport, installed once at
 * bootstrap, and no call site moves:
 *
 * ```ts
 * import { apiClient, setWaitlistTransport } from '@/services';
 *
 * setWaitlistTransport({
 *   submit: async (signup) => {
 *     await apiClient.post('/premium/waitlist', signup);
 *   },
 * });
 * ```
 *
 * Going through `apiClient` rather than `fetch` means the transport inherits the base URL, the typed
 * `ApiError` and the mock/http switch the rest of the app already has.
 *
 * Two things have to change with it, and neither is in this file:
 *
 *  1. The copy. `premium.dialog.localOnly` in `src/i18n/messages/en.ts` tells the learner in as many
 *     words that nothing leaves their browser and no email will arrive. The moment that stops being
 *     true it becomes a lie, and it is the one string in the feature that must be rewritten rather
 *     than translated.
 *  2. `connect-src` in `nginx.conf`, if the endpoint is on another host.
 *
 * The local record is deliberately not this module's business: `premiumStore` owns it and persists it
 * through the storage service, so there is one writer of `lisan:premium` whichever transport is
 * installed, and a learner's own copy of what they said survives a failed request.
 */

/** RFC 5321 caps a forward path at 254 characters; anything longer cannot be an address. */
const EMAIL_MAX_LENGTH = 254;

/**
 * Optional means optional: a blank field is valid and registers a signup without an address, because
 * a learner who wants the tier but will not hand over an email is still a signal worth counting.
 * Blank normalises to `null` so the rest of the code never has to treat `''` as a special case.
 *
 * No `message` on the refinement on purpose — the message the learner reads comes from the i18n
 * dictionary, keyed off `WaitlistResult['reason']`, so the copy stays in the one file that holds copy.
 */
export const waitlistEmailSchema = z
  .string()
  .trim()
  .max(EMAIL_MAX_LENGTH)
  .refine((value) => value === '' || z.email().safeParse(value).success)
  .transform((value): string | null => (value === '' ? null : value));

export interface WaitlistSignup {
  /** The address the learner left, or `null` when they registered without one. */
  email: string | null;
  /** ISO 8601, stamped once here so the stored record and the request carry the same instant. */
  submittedAt: string;
}

export type WaitlistFailure = 'invalid_email' | 'transport_failed';

export type WaitlistResult =
  { ok: true; signup: WaitlistSignup } | { ok: false; reason: WaitlistFailure };

export interface WaitlistTransport {
  /** Rejects to report failure. `submitWaitlist` catches, so throwing is safe but not preferred. */
  submit: (signup: WaitlistSignup) => Promise<void>;
}

/**
 * The default, and an honest one: it sends the signup nowhere, because there is nowhere to send it.
 *
 * This is not a stub standing in for missing work — it is the correct behaviour while Lisan has no
 * backend. The learner is told as much in the dialog, and their answer is still kept, because
 * `premiumStore` writes it through the storage service either way.
 */
export const deviceOnlyTransport: WaitlistTransport = {
  submit: () => Promise.resolve(),
};

let transport: WaitlistTransport = deviceOnlyTransport;

/** Installs a transport. `null` restores the device-only default; tests rely on that. */
export function setWaitlistTransport(next: WaitlistTransport | null): void {
  transport = next ?? deviceOnlyTransport;
}

export interface WaitlistInput {
  /** Raw field value, untrimmed and possibly blank — exactly what the input element holds. */
  email: string;
}

/**
 * Validates, hands the signup to the active transport, and records the event.
 *
 * Analytics fires only after the transport accepts, so the count is of signups that got somewhere,
 * and it carries whether an address was left rather than the address itself.
 */
export async function submitWaitlist(input: WaitlistInput): Promise<WaitlistResult> {
  const parsed = waitlistEmailSchema.safeParse(input.email);
  if (!parsed.success) return { ok: false, reason: 'invalid_email' };

  const signup: WaitlistSignup = { email: parsed.data, submittedAt: nowIso() };

  try {
    await transport.submit(signup);
  } catch (error) {
    // A learner who typed their address must not be told it worked, but they also must not lose it:
    // the dialog keeps the field as it was so the button can simply be pressed again.
    console.warn('[lisan] waitlist transport rejected the signup', error);
    return { ok: false, reason: 'transport_failed' };
  }

  analytics.track('premium_interest_registered', { withEmail: signup.email !== null });

  return { ok: true, signup };
}
