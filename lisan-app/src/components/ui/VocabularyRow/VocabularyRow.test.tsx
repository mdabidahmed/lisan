/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
 * The wrapper <div onClick> exists only to observe whether a click escapes the row's action
 * buttons; making it interactive would defeat the point of the assertion.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { words } from '@/test/fixtures/sampleContent';

import { VocabularyRow } from './VocabularyRow';

const audio = vi.hoisted(() => ({ speak: vi.fn(), stop: vi.fn() }));

vi.mock('@/hooks', () => ({
  useAudio: () => ({
    speak: audio.speak,
    stop: audio.stop,
    pause: vi.fn(),
    resume: vi.fn(),
    isSpeaking: false,
    isPaused: false,
    isSupported: true,
    activeText: null,
  }),
}));

const word = words.find((entry) => entry.id === 'engineer')!;

describe('VocabularyRow', () => {
  beforeEach(() => {
    audio.speak.mockClear();
    audio.stop.mockClear();
  });

  function setup() {
    const onOpen = vi.fn();
    const onToggleBookmark = vi.fn();
    const parentSpy = vi.fn();

    render(
      <div onClick={parentSpy}>
        <VocabularyRow word={word} onOpen={onOpen} onToggleBookmark={onToggleBookmark} />
      </div>,
    );

    return { onOpen, onToggleBookmark, parentSpy, user: userEvent.setup() };
  }

  it('opens the word detail when the row is clicked', async () => {
    const { onOpen, user } = setup();

    await user.click(screen.getByRole('button', { name: /al-muhandisu/ }));

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith(word);
  });

  it('plays pronunciation without opening the word or bubbling to the row', async () => {
    const { onOpen, parentSpy, user } = setup();

    await user.click(screen.getByRole('button', { name: 'Play pronunciation' }));

    expect(audio.speak).toHaveBeenCalledTimes(1);
    expect(audio.speak.mock.calls[0]?.[0]).toBe(word.arabic);
    expect(onOpen).not.toHaveBeenCalled();
    expect(parentSpy).not.toHaveBeenCalled();
  });

  it('toggles the bookmark without opening the word or bubbling to the row', async () => {
    const { onOpen, onToggleBookmark, parentSpy, user } = setup();

    await user.click(screen.getByRole('button', { name: /^Add .* to bookmarks$/ }));

    expect(onToggleBookmark).toHaveBeenCalledTimes(1);
    expect(onToggleBookmark).toHaveBeenCalledWith(word);
    expect(onOpen).not.toHaveBeenCalled();
    expect(parentSpy).not.toHaveBeenCalled();
  });
});
