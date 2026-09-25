import { beforeEach, describe, expect, it } from 'vitest';

import { STORAGE_KEYS, STORAGE_NAMESPACE } from '@/constants';
import { storageService } from '@/services/storage';

import { useBookmarksStore } from './bookmarksStore';

const KEY = `${STORAGE_NAMESPACE}:${STORAGE_KEYS.bookmarks}`;

function actions() {
  return useBookmarksStore.getState().actions;
}

function ids(): readonly string[] {
  return useBookmarksStore.getState().ids;
}

beforeEach(() => {
  localStorage.clear();
  useBookmarksStore.setState({ ids: [] });
});

describe('bookmarksStore', () => {
  it('starts empty', () => {
    expect(ids()).toEqual([]);
  });

  it('adds a bookmark, most recent first', () => {
    actions().add('apple');
    actions().add('water');
    expect(ids()).toEqual(['water', 'apple']);
  });

  it('ignores a duplicate add without changing the reference', () => {
    actions().add('apple');
    const before = ids();
    actions().add('apple');
    expect(ids()).toBe(before);
  });

  it('toggles on and off', () => {
    actions().toggle('apple');
    expect(ids()).toEqual(['apple']);

    actions().toggle('apple');
    expect(ids()).toEqual([]);
  });

  it('removes a specific id and leaves the rest', () => {
    actions().add('apple');
    actions().add('water');
    actions().remove('apple');
    expect(ids()).toEqual(['water']);
  });

  it('is a no-op when removing something that is not bookmarked', () => {
    actions().add('apple');
    const before = ids();
    actions().remove('missing');
    expect(ids()).toBe(before);
  });

  it('clears everything', () => {
    actions().add('apple');
    actions().add('water');
    actions().clear();
    expect(ids()).toEqual([]);
  });

  it('exposes stable action identities so selector hooks never loop', () => {
    const first = useBookmarksStore.getState().actions;
    actions().add('apple');
    expect(useBookmarksStore.getState().actions).toBe(first);
  });
});

describe('bookmarksStore persistence', () => {
  it('writes through the storage service in the shared envelope format', () => {
    actions().add('apple');

    const raw = localStorage.getItem(KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw ?? '{}')).toEqual({ version: 1, data: { ids: ['apple'] } });
  });

  it('never persists the action bundle', () => {
    actions().add('apple');
    const envelope = JSON.parse(localStorage.getItem(KEY) ?? '{}') as { data: unknown };
    expect(Object.keys(envelope.data as object)).toEqual(['ids']);
  });

  it('rehydrates a previously stored list', async () => {
    storageService.write(STORAGE_KEYS.bookmarks, { ids: ['book', 'tree'] });

    await useBookmarksStore.persist.rehydrate();

    expect(ids()).toEqual(['book', 'tree']);
  });

  it('falls back to an empty list when the stored payload is corrupt', async () => {
    localStorage.setItem(KEY, 'not json at all');

    await useBookmarksStore.persist.rehydrate();

    expect(ids()).toEqual([]);
  });

  it('drops non-string entries when migrating an older payload', async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ version: 0, data: { ids: ['book', 42, null, 'book'] } }),
    );

    await useBookmarksStore.persist.rehydrate();

    expect(ids()).toEqual(['book']);
  });
});
