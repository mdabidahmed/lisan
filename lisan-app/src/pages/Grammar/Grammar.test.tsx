import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useLessonProgressStore } from '@/store/lessonProgressStore';
import { renderWithProviders, userEvent } from '@/test/renderWithProviders';

import { GrammarPage } from './Grammar';

beforeEach(() => {
  localStorage.clear();
  useLessonProgressStore.getState().actions.reset();
});

async function renderGrammar() {
  const view = renderWithProviders(<GrammarPage />, { route: '/grammar' });
  await waitFor(() => {
    expect(screen.getByRole('link', { name: /The Definite Article/ })).toBeInTheDocument();
  });
  return view;
}

function lessonLinks(): HTMLElement[] {
  return screen.getAllByRole('listitem').filter((item) => item.querySelector('a') !== null);
}

describe('<GrammarPage /> filters', () => {
  it('offers a chip per topic that has lessons, with its count', async () => {
    await renderGrammar();

    const topics = screen.getByRole('group', { name: 'Topic' });
    expect(within(topics).getByRole('button', { name: /All topics/ })).toBeInTheDocument();
    expect(within(topics).getByRole('button', { name: /Sentence Structure/ })).toBeInTheDocument();
    expect(within(topics).getByRole('button', { name: /Nahw/ })).toBeInTheDocument();

    const levels = screen.getByRole('group', { name: 'Level' });
    expect(within(levels).getByRole('button', { name: /A1/ })).toBeInTheDocument();
  });

  it('narrows the list to the chosen topic', async () => {
    const user = userEvent.setup();
    await renderGrammar();

    const before = lessonLinks().length;
    expect(before).toBeGreaterThan(3);

    await user.click(screen.getByRole('button', { name: /Pronouns/ }));

    await waitFor(() => {
      expect(lessonLinks().length).toBeLessThan(before);
    });
    expect(screen.getByRole('link', { name: /Personal Pronouns/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /The Definite Article/ })).not.toBeInTheDocument();
  });

  it('combines the topic and level filters and can clear them again', async () => {
    const user = userEvent.setup();
    await renderGrammar();

    await user.click(screen.getByRole('button', { name: /Verbs/ }));
    await user.click(screen.getByRole('button', { name: /^A1/ }));

    const clear = screen.getByRole('button', { name: /clear filters/i });
    expect(clear).toBeInTheDocument();

    await user.click(clear);

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /The Definite Article/ })).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument();
  });

  it('presses a selected chip to unset it', async () => {
    const user = userEvent.setup();
    await renderGrammar();

    const pronouns = screen.getByRole('button', { name: /Pronouns/ });
    await user.click(pronouns);
    expect(pronouns).toHaveAttribute('aria-pressed', 'true');

    await user.click(pronouns);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Pronouns/ })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    });
  });

  it('says so when a combination has no lessons', async () => {
    const user = userEvent.setup();
    await renderGrammar();

    await user.click(screen.getByRole('button', { name: /Nahw/ }));
    await user.click(screen.getByRole('button', { name: /^B2/ }));

    expect(await screen.findByText('No lessons match these filters')).toBeInTheDocument();
  });
});

describe('<GrammarPage /> completion', () => {
  it('marks finished lessons in the list and counts them in the header', async () => {
    useLessonProgressStore.getState().actions.markComplete('definite-article');
    await renderGrammar();

    const card = screen.getByRole('link', { name: /The Definite Article/ });
    expect(within(card).getByText('Completed')).toBeInTheDocument();

    expect(screen.getByText(/1 of \d+ lessons complete/)).toBeInTheDocument();
  });

  it('shows no completion state for a fresh learner', async () => {
    await renderGrammar();

    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
    expect(screen.getByText(/0 of \d+ lessons complete/)).toBeInTheDocument();
  });
});
