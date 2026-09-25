import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Start Learning</Button>);

    expect(screen.getByRole('button', { name: 'Start Learning' })).toBeInTheDocument();
  });

  it('fires onClick when pressed', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Start Learning</Button>);

    await user.click(screen.getByRole('button', { name: 'Start Learning' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Start Learning
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Start Learning' });
    expect(button).toBeDisabled();
    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('marks itself busy and blocks clicks while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Start Learning
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Start Learning' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders iconLeft as an svg carrying the icon name', () => {
    const { container } = render(<Button iconLeft="play">Listen</Button>);

    const icon = container.querySelector('svg[data-icon="play"]');
    expect(icon).not.toBeNull();
  });
});
