import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/constants/routes';

import { QuickActions } from './QuickActions';
import { DEFAULT_QUICK_ACTIONS, type QuickAction } from './quickActionItems';

function renderActions(actions?: readonly QuickAction[]) {
  render(
    <MemoryRouter>
      <QuickActions {...(actions === undefined ? {} : { actions })} />
    </MemoryRouter>,
  );
}

function tile(title: string): HTMLElement {
  const link = screen.getByText(title).closest('a');
  if (!link) throw new Error(`No tile for "${title}"`);
  return link;
}

/** The column holding just the title and the description. */
function copyColumn(title: string): HTMLElement {
  const column = screen.getByText(title).parentElement;
  if (!column) throw new Error(`No copy column for "${title}"`);
  return column;
}

function chevronIn(element: HTMLElement): HTMLElement {
  const glyph = element.querySelector('[data-icon="chevron-right"]');
  const chevron = glyph?.parentElement;
  if (!chevron) throw new Error('No chevron in the given element');
  return chevron;
}

describe('<QuickActions />', () => {
  it('names each link by its title and description, not by its icons', () => {
    renderActions();

    const link = screen.getByRole('link', { name: /Vocabulary.*Everyday words with audio/ });
    expect(link).toHaveAttribute('href', ROUTES.vocabulary);
    expect(screen.getAllByRole('link')).toHaveLength(DEFAULT_QUICK_ACTIONS.length);

    // Both icons are decoration; only the copy may reach the accessibility tree.
    for (const icon of link.querySelectorAll('svg')) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('tags every link with the accent its colours are keyed to', () => {
    renderActions();

    for (const action of DEFAULT_QUICK_ACTIONS) {
      const link = screen.getByText(action.title).closest('a');
      expect(link).toHaveAttribute('data-accent', action.accent);
      expect(link).toHaveAttribute('href', action.to);
    }
  });

  /*
   * The chevron sits on the tile's own row, after the copy column and outside it. Both halves
   * matter: outside, or its height joins the text block and the card grows back by ~27px and
   * turns bottom-heavy again; last, or it stops being the trailing-edge affordance.
   */
  it('keeps the chevron on the tile row after the copy column, never inside it', () => {
    renderActions();

    const link = tile('Vocabulary');
    const column = copyColumn('Vocabulary');
    const chevron = chevronIn(link);

    expect(chevron.parentElement).toBe(link);
    expect(column).not.toContainElement(chevron);
    expect(link.lastElementChild).toBe(chevron);
    expect(column.compareDocumentPosition(chevron) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('holds that arrangement when one description is far longer than the rest', () => {
    const actions: readonly QuickAction[] = [
      { ...DEFAULT_QUICK_ACTIONS[0]!, description: 'Short' },
      {
        ...DEFAULT_QUICK_ACTIONS[1]!,
        description: 'A description long enough to wrap onto a second and even a third line',
      },
    ];
    renderActions(actions);

    for (const action of actions) {
      const link = tile(action.title);
      const column = copyColumn(action.title);
      expect(within(column).getByText(action.description)).toBeInTheDocument();
      expect(column).not.toContainElement(chevronIn(link));
      expect(link.lastElementChild).toBe(chevronIn(link));
    }
  });

  it('renders the row as a list so the cards are announced as a set', () => {
    renderActions();

    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items).toHaveLength(DEFAULT_QUICK_ACTIONS.length);
  });
});
