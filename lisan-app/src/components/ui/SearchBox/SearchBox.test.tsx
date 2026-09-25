import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SearchBox } from './SearchBox';

// The fake-timer bridge Testing Library needs lives in `src/test/setup.ts`.

describe('SearchBox', () => {
  it('publishes a single debounced value while the learner is typing', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onValueChange = vi.fn();

    render(<SearchBox value="" onValueChange={onValueChange} />);

    await user.type(screen.getByRole('searchbox'), 'book');
    expect(onValueChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('book');
  });

  it('clears the field and emits an empty value immediately', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onValueChange = vi.fn();

    render(<SearchBox value="book" onValueChange={onValueChange} />);

    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('book');

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(input).toHaveValue('');
    expect(onValueChange).toHaveBeenCalledWith('');
  });
});
