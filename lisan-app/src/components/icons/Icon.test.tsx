import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from './Icon';
import { ICON_COUNT, ICON_NAMES, isIconName } from './iconNames';
import { ICON_SHAPES } from './iconShapes';

describe('icon registry', () => {
  it('contains exactly the 40 icons the design system specifies', () => {
    expect(ICON_COUNT).toBe(40);
    expect(new Set(ICON_NAMES).size).toBe(40);
  });

  it('has artwork for every registered name and no orphan artwork', () => {
    expect(Object.keys(ICON_SHAPES).sort()).toEqual([...ICON_NAMES].sort());
    for (const name of ICON_NAMES) {
      expect(ICON_SHAPES[name].length).toBeGreaterThan(0);
    }
  });

  it('narrows unknown strings', () => {
    expect(isIconName('home')).toBe(true);
    expect(isIconName('rocket')).toBe(false);
  });
});

describe('<Icon />', () => {
  it('is decorative by default', () => {
    const { container } = render(<Icon name="home" />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('becomes an image with an accessible name when given a title', () => {
    render(<Icon name="trophy" title="Achievement unlocked" />);
    expect(screen.getByRole('img', { name: 'Achievement unlocked' })).toBeInTheDocument();
  });

  it('honours aria-label without rendering a title element', () => {
    const { container } = render(<Icon name="streak" aria-label="Current streak" />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Current streak');
    expect(container.querySelector('title')).toBeNull();
  });

  it('applies the design-system stroke contract', () => {
    const { container } = render(<Icon name="search" size={28} />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('width', '28');
    expect(svg).toHaveAttribute('height', '28');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('stroke-width', '1.8');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    expect(svg).toHaveAttribute('stroke-linejoin', 'round');
  });

  it('renders every icon without throwing', () => {
    for (const name of ICON_NAMES) {
      const { container, unmount } = render(<Icon name={name} />);
      expect(container.querySelector(`svg[data-icon="${name}"]`)).not.toBeNull();
      unmount();
    }
  });
});
