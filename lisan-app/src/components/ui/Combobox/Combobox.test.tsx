import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders, userEvent } from '@/test/renderWithProviders';

import { Combobox, type ComboboxOption } from './Combobox';

const OPTIONS: readonly ComboboxOption[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'basics', label: 'Basics', icon: 'vocabulary', color: 'blue' },
  { value: 'food', label: 'Food & Dining', icon: 'food', color: 'var(--color-category-food)' },
  { value: 'travel', label: 'Transport & Travel', icon: 'travel' },
];

function openTrigger() {
  return screen.getByRole('button', { name: 'Filter by category' });
}

describe('<Combobox />', () => {
  it('shows the current selection on the trigger and opens a listbox', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Combobox
        options={OPTIONS}
        value="food"
        onValueChange={onValueChange}
        label="Filter by category"
      />,
    );

    const trigger = openTrigger();
    expect(trigger).toHaveTextContent('Food & Dining');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const listbox = screen.getByRole('listbox', { name: 'Filter by category' });
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(OPTIONS.length);
    // Entry focus lands on the option already selected, not the first in the list.
    expect(screen.getByRole('option', { name: 'Food & Dining' })).toHaveFocus();
  });

  it('commits a choice on click and returns focus to the trigger', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Combobox
        options={OPTIONS}
        value="all"
        onValueChange={onValueChange}
        label="Filter by category"
      />,
    );

    await user.click(openTrigger());
    await user.click(screen.getByRole('option', { name: 'Basics' }));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('basics');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(openTrigger()).toHaveFocus();
  });

  it('moves focus with the arrow keys without committing, and commits on Enter', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Combobox
        options={OPTIONS}
        value="all"
        onValueChange={onValueChange}
        label="Filter by category"
      />,
    );

    await user.click(openTrigger());
    expect(screen.getByRole('option', { name: 'All Categories' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Basics' })).toHaveFocus();
    // Browsing alone must not re-query the list — only a real commit may do that.
    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Transport & Travel' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('travel');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on Escape without committing the highlighted option', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Combobox
        options={OPTIONS}
        value="all"
        onValueChange={onValueChange}
        label="Filter by category"
      />,
    );

    await user.click(openTrigger());
    await user.keyboard('{ArrowDown}{ArrowDown}');
    await user.keyboard('{Escape}');

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(openTrigger()).toHaveFocus();
  });

  it('closes on a press outside the widget', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <div>
        <Combobox
          options={OPTIONS}
          value="all"
          onValueChange={onValueChange}
          label="Filter by category"
        />
        <button type="button">Elsewhere</button>
      </div>,
    );

    await user.click(openTrigger());
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Elsewhere' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('marks the selected option for assistive tech and shows a checkmark', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Combobox
        options={OPTIONS}
        value="food"
        onValueChange={vi.fn()}
        label="Filter by category"
      />,
    );

    await user.click(openTrigger());

    const selected = screen.getByRole('option', { name: 'Food & Dining' });
    const others = screen.getAllByRole('option').filter((option) => option !== selected);

    expect(selected).toHaveAttribute('aria-selected', 'true');
    for (const option of others) {
      expect(option).toHaveAttribute('aria-selected', 'false');
    }
  });
});
