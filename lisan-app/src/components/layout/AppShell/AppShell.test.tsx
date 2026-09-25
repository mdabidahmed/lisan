import { screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { renderWithProviders, userEvent } from '@/test/renderWithProviders';
import { useSettingsStore } from '@/store/settingsStore';

import { AppShell } from './AppShell';

afterEach(() => {
  useSettingsStore.getState().actions.reset();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-contrast');
  document.documentElement.removeAttribute('data-text-size');
});

describe('<AppShell />', () => {
  it('renders the landmarks and primary navigation', () => {
    renderWithProviders(<AppShell />);

    expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');

    const sidebar = screen.getByRole('complementary', { name: /sidebar/i });
    expect(within(sidebar).getAllByRole('link')).toHaveLength(8); // brand + 7 destinations
  });

  it('toggles between light and dark by rewriting the theme attribute only', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppShell />);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('light');
    });

    await user.click(screen.getByRole('button', { name: /switch to dark theme/i }));

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('dark');
    });
    expect(useSettingsStore.getState().theme).toBe('dark');

    await user.click(screen.getByRole('button', { name: /switch to light theme/i }));
    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('light');
    });
  });

  it('applies the accessibility settings as root data attributes', async () => {
    renderWithProviders(<AppShell />);

    useSettingsStore.getState().actions.update({ highContrast: true, textSize: 'large' });

    await waitFor(() => {
      expect(document.documentElement.dataset.contrast).toBe('high');
      expect(document.documentElement.dataset.textSize).toBe('large');
    });
  });
});
