import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test/renderWithProviders';

import { MobileNav } from './MobileNav';

describe('<MobileNav />', () => {
  it('renders five labelled destinations', () => {
    renderWithProviders(<MobileNav />);

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const links = within(nav).getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual([
      'Home',
      'Words',
      'Practice',
      'Progress',
      'Saved',
    ]);
  });

  it('marks the active destination', () => {
    renderWithProviders(<MobileNav />, { route: '/progress' });

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Progress' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
