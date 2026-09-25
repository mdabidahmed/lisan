import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders, userEvent } from '@/test/renderWithProviders';

import { NavDrawer } from './NavDrawer';

describe('<NavDrawer />', () => {
  it('is inert while closed', () => {
    const { container } = renderWithProviders(<NavDrawer open={false} onClose={vi.fn()} />);

    expect(container.querySelector('[data-open="false"]')).toHaveAttribute('inert');
    expect(screen.queryByRole('dialog', { name: /navigation/i })).not.toBeInTheDocument();
  });

  it('exposes a modal dialog with the full navigation when open', () => {
    renderWithProviders(<NavDrawer open onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog', { name: /navigation/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    for (const label of [
      'Home',
      'Vocabulary',
      'Grammar',
      'Practice',
      'Progress',
      'Bookmarks',
      'Settings',
    ]) {
      expect(within(dialog).getByRole('link', { name: label })).toBeInTheDocument();
    }
  });

  it('moves focus into the panel when it opens', async () => {
    const { rerender } = renderWithProviders(<NavDrawer open={false} onClose={vi.fn()} />);

    rerender(<NavDrawer open onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog', { name: /navigation/i });
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });

  it('closes on Escape, on the close button and on the backdrop', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<NavDrawer open onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /close navigation menu/i }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('closes after a destination is chosen', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<NavDrawer open onClose={onClose} />);

    const dialog = screen.getByRole('dialog', { name: /navigation/i });
    await user.click(within(dialog).getByRole('link', { name: 'Practice' }));

    expect(onClose).toHaveBeenCalled();
  });
});
