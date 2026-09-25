import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

import { analytics } from '@/services/analytics';

import {
  setWaitlistTransport,
  submitWaitlist,
  waitlistEmailSchema,
  type WaitlistSignup,
} from './waitlist';

let track: MockInstance<typeof analytics.track>;

beforeEach(() => {
  track = vi.spyOn(analytics, 'track');
});

afterEach(() => {
  setWaitlistTransport(null);
});

describe('waitlistEmailSchema', () => {
  it('accepts an address and hands it back trimmed', () => {
    expect(waitlistEmailSchema.safeParse('  learner@example.com ')).toMatchObject({
      success: true,
      data: 'learner@example.com',
    });
  });

  it('treats a blank field as a signup without an address', () => {
    for (const blank of ['', '   ', '\n\t']) {
      expect(waitlistEmailSchema.safeParse(blank)).toMatchObject({ success: true, data: null });
    }
  });

  it('rejects anything that is not an address', () => {
    for (const bad of ['learner', 'learner@', '@example.com', 'a b@example.com', 'learner@ex']) {
      expect(waitlistEmailSchema.safeParse(bad).success).toBe(false);
    }
  });

  it('rejects an address longer than a mail server would accept', () => {
    const tooLong = `${'a'.repeat(250)}@example.com`;
    expect(waitlistEmailSchema.safeParse(tooLong).success).toBe(false);
  });
});

describe('submitWaitlist', () => {
  it('reports an invalid address without reaching the transport', async () => {
    const submit = vi.fn(() => Promise.resolve());
    setWaitlistTransport({ submit });

    const result = await submitWaitlist({ email: 'not-an-address' });

    expect(result).toEqual({ ok: false, reason: 'invalid_email' });
    expect(submit).not.toHaveBeenCalled();
    expect(track).not.toHaveBeenCalled();
  });

  it('stamps the signup once and hands that exact record to the transport', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-22T08:30:00.000Z'));
    const seen: WaitlistSignup[] = [];
    setWaitlistTransport({
      submit: (signup) => {
        seen.push(signup);
        return Promise.resolve();
      },
    });

    const result = await submitWaitlist({ email: 'learner@example.com' });

    expect(result).toEqual({
      ok: true,
      signup: { email: 'learner@example.com', submittedAt: '2026-09-22T08:30:00.000Z' },
    });
    expect(seen).toEqual([
      { email: 'learner@example.com', submittedAt: '2026-09-22T08:30:00.000Z' },
    ]);
  });

  it('records the event with whether an address was left, and never the address', async () => {
    await submitWaitlist({ email: 'learner@example.com' });

    expect(track).toHaveBeenCalledWith('premium_interest_registered', { withEmail: true });
    expect(JSON.stringify(track.mock.calls)).not.toContain('learner@example.com');
  });

  it('counts a blank registration as a signup with no address', async () => {
    const result = await submitWaitlist({ email: '' });

    expect(result).toMatchObject({ ok: true, signup: { email: null } });
    expect(track).toHaveBeenCalledWith('premium_interest_registered', { withEmail: false });
  });

  it('reports a rejected transport, and does not count it as a signup', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    setWaitlistTransport({ submit: () => Promise.reject(new Error('503')) });

    const result = await submitWaitlist({ email: 'learner@example.com' });

    expect(result).toEqual({ ok: false, reason: 'transport_failed' });
    expect(track).not.toHaveBeenCalled();
  });

  it('sends nothing anywhere by default — there is no backend to send it to', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    await expect(submitWaitlist({ email: 'learner@example.com' })).resolves.toMatchObject({
      ok: true,
    });

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
