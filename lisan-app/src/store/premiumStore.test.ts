import { beforeEach, describe, expect, it } from 'vitest';

import { STORAGE_NAMESPACE } from '@/constants';

import { usePremiumStore } from './premiumStore';

const KEY = `${STORAGE_NAMESPACE}:premium`;

function actions() {
  return usePremiumStore.getState().actions;
}

function envelope(): { version: number; data: { signup: unknown } } {
  return JSON.parse(localStorage.getItem(KEY) ?? '{}') as ReturnType<typeof envelope>;
}

beforeEach(() => {
  localStorage.clear();
  usePremiumStore.setState({ signup: null });
});

describe('premiumStore', () => {
  it('starts with nothing recorded, so a first-time visitor gets the pitch', () => {
    expect(usePremiumStore.getState().signup).toBeNull();
  });

  it('records a signup and forgets it again on request', () => {
    const signup = { email: 'learner@example.com', submittedAt: '2026-09-22T08:30:00.000Z' };

    actions().register(signup);
    expect(usePremiumStore.getState().signup).toEqual(signup);

    actions().forget();
    expect(usePremiumStore.getState().signup).toBeNull();
  });

  it('writes through the storage service, in the versioned envelope', () => {
    actions().register({ email: null, submittedAt: '2026-09-22T08:30:00.000Z' });

    const stored = envelope();
    expect(stored.version).toBe(1);
    expect(stored.data.signup).toEqual({ email: null, submittedAt: '2026-09-22T08:30:00.000Z' });
  });

  it('never persists the action bundle', () => {
    actions().register({ email: null, submittedAt: '2026-09-22T08:30:00.000Z' });
    expect(Object.keys(envelope().data)).not.toContain('actions');
  });

  it('rehydrates a signup, so a returning visitor is not pitched again', async () => {
    actions().register({ email: 'learner@example.com', submittedAt: '2026-09-22T08:30:00.000Z' });
    const persisted = localStorage.getItem(KEY) ?? '';

    usePremiumStore.setState({ signup: null });
    localStorage.setItem(KEY, persisted);
    await usePremiumStore.persist.rehydrate();

    expect(usePremiumStore.getState().signup?.email).toBe('learner@example.com');
  });

  it('recovers from a corrupt payload', async () => {
    localStorage.setItem(KEY, '{{{');
    await usePremiumStore.persist.rehydrate();
    expect(usePremiumStore.getState().signup).toBeNull();
  });

  it('drops a record with no usable timestamp rather than inventing one', async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ version: 0, data: { signup: { email: 'a@b.co' } } }),
    );

    await usePremiumStore.persist.rehydrate();

    expect(usePremiumStore.getState().signup).toBeNull();
  });

  it('keeps a migrated record whose address is missing, as a signup without one', async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ version: 0, data: { signup: { submittedAt: '2026-01-01T00:00:00.000Z' } } }),
    );

    await usePremiumStore.persist.rehydrate();

    expect(usePremiumStore.getState().signup).toEqual({
      email: null,
      submittedAt: '2026-01-01T00:00:00.000Z',
    });
  });
});
