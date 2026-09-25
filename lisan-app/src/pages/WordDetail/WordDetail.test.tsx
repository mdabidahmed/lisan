import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppProviders, createQueryClient } from '@/app/providers';
import { ROUTES } from '@/constants/routes';
import { apiClient, networkError } from '@/services/api';
import { useProgressStore } from '@/store/progressStore';
import { createTestQueryClient } from '@/test';
import type { WordProgress } from '@/types/progress';
import { DAY_MS } from '@/utils/date';

import { WordDetailPage } from './WordDetail';

function LocationProbe() {
  const { pathname, search } = useLocation();
  return <span data-testid="location">{`${pathname}${search}`}</span>;
}

function renderWordDetail(wordId = 'engineer'): { user: UserEvent } {
  render(
    <AppProviders queryClient={createTestQueryClient()}>
      <MemoryRouter initialEntries={[`/vocabulary/${wordId}`]}>
        <LocationProbe />
        <Routes>
          <Route path="/vocabulary" element={<h1>Vocabulary stub</h1>} />
          <Route path="/vocabulary/:wordId" element={<WordDetailPage />} />
        </Routes>
      </MemoryRouter>
    </AppProviders>,
  );
  return { user: userEvent.setup() };
}

function location(): string {
  return screen.getByTestId('location').textContent;
}

function progressPanel(): HTMLElement {
  return screen.getByRole('region', { name: 'Your Progress' });
}

async function openRelatedTab(user: UserEvent): Promise<HTMLElement> {
  await screen.findByRole('tab', { name: 'Related Words' });
  await user.click(screen.getByRole('tab', { name: 'Related Words' }));
  return screen.getByRole('tabpanel', { name: 'Related Words' });
}

beforeEach(() => {
  // The whole slice, so the snapshot history cannot bleed between tests.
  useProgressStore.getState().actions.reset();
});

describe('WordDetailPage — related words', () => {
  it('lists the words linked to this one, each pointing at its own page', async () => {
    const { user } = renderWordDetail('engineer');
    const panel = await openRelatedTab(user);

    await waitFor(() => {
      expect(within(panel).getAllByRole('listitem')).toHaveLength(4);
    });

    // The panel also carries a "View All" link out to the category, which is not a word tile.
    const hrefs = within(panel)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href') ?? '')
      .filter((href) => href.startsWith('/vocabulary/'));
    expect(hrefs).toEqual([
      '/vocabulary/project',
      '/vocabulary/office',
      '/vocabulary/work',
      '/vocabulary/manager',
    ]);
  });

  it('navigates to a related word and loads it in place', async () => {
    const { user } = renderWordDetail('engineer');
    const panel = await openRelatedTab(user);

    await within(panel).findByRole('link', { name: /Project/ });
    await user.click(within(panel).getByRole('link', { name: /Project/ }));

    await waitFor(() => {
      expect(location()).toBe('/vocabulary/project');
    });
    expect(await screen.findByRole('heading', { level: 2, name: /مَشْرُوع/ })).toBeInTheDocument();
  });

  it('links out to the rest of the category', async () => {
    const { user } = renderWordDetail('engineer');
    const panel = await openRelatedTab(user);

    expect(within(panel).getByRole('link', { name: /View All/ })).toHaveAttribute(
      'href',
      '/vocabulary?category=work-professions',
    );
  });
});

describe('WordDetailPage — Urdu meaning', () => {
  it('sets the Urdu gloss in nastaliq, tagged as Urdu and running right to left', async () => {
    renderWordDetail('engineer');

    const urdu = await screen.findByText('انجینئر');
    // An Urdu gloss set in an Arabic naskh face is simply wrong, so the face is not a
    // preference — it travels with the field.
    expect(getComputedStyle(urdu).fontFamily).toBe('var(--font-urdu)');
    expect(urdu).toHaveAttribute('lang', 'ur');
    expect(urdu).toHaveAttribute('dir', 'rtl');
  });

  it('does not spread the Urdu treatment to the row next to it', async () => {
    renderWordDetail('engineer');

    await screen.findByText('انجینئر');
    // Hindi is Devanagari and left to right. The Urdu styling is scoped to the Urdu field, not
    // applied to whatever happens to be non-Latin.
    const hindi = screen.getByText('इंजीनियर');
    expect(hindi).not.toHaveAttribute('lang', 'ur');
    expect(hindi).not.toHaveAttribute('dir', 'rtl');
  });
});

describe('WordDetailPage — Arabic in host-language layout', () => {
  it('keeps the example sentence at the start of its column, not the card edge', async () => {
    const { user } = renderWordDetail('engineer');

    await screen.findByRole('tab', { name: 'Examples' });
    await user.click(screen.getByRole('tab', { name: 'Examples' }));
    const panel = screen.getByRole('tabpanel', { name: 'Examples' });

    const [example] = within(panel).getAllByRole('listitem');
    const arabic = example?.querySelector('[lang="ar"]');
    if (!(arabic instanceof HTMLElement)) throw new Error('No Arabic line in the first example');

    /*
      The reported instance. The sentence is the first of three stacked lines in a column flex
      container, so it is stretched to the card's width; `dir="rtl"` there resolved
      `text-align: start` to the right edge and left the transliteration and translation beneath it
      at the left, which is not what reference screen 3 shows.
    */
    expect(arabic).not.toHaveAttribute('dir');

    const translit = example?.querySelector('[lang="ar"] + p');
    expect(arabic.closest('[dir]')).toBe(translit?.closest('[dir]'));

    const run = arabic.firstElementChild;
    if (!(run instanceof HTMLElement)) throw new Error('The Arabic run is not wrapped');
    expect(run.tagName).toBe('SPAN');
    expect(window.getComputedStyle(run).unicodeBidi).toBe('isolate');
  });

  it('finishes the example sentence on its left, the way reference screen 3 prints it', async () => {
    const { user } = renderWordDetail('engineer');

    await screen.findByRole('tab', { name: 'Examples' });
    await user.click(screen.getByRole('tab', { name: 'Examples' }));
    const panel = screen.getByRole('tabpanel', { name: 'Examples' });

    const [example] = within(panel).getAllByRole('listitem');
    const run = example?.querySelector('[lang="ar"] > span');
    if (!(run instanceof HTMLElement)) throw new Error('No Arabic run in the first example');

    // The bug only exists because these strings end in a bidi-neutral character.
    expect(run.textContent).toMatch(/\u002E$/);
    /*
      An example is a whole sentence, so unlike the head word it is right-to-left content in its
      own right. Rule N2 gives a trailing neutral the embedding direction, so the inherited
      left-to-right base put the full stop at the sentence's right-hand end — the end it reads
      from. The base goes on the isolate, which is inline, so the sentence still starts at the
      column's edge with its transliteration and translation.
    */
    expect(run).toHaveAttribute('dir', 'rtl');
  });

  it('marks the hero head word as Arabic without giving the hero a direction', async () => {
    renderWordDetail('engineer');

    const head = await screen.findByRole('heading', { level: 2 });

    expect(head).toHaveAttribute('lang', 'ar');
    // The head word is usually the widest line in the hero, which is why this one hid for so long:
    // a stretched box only shows its alignment when something beside it is wider.
    expect(head).not.toHaveAttribute('dir');
    expect(head).toHaveTextContent('مُهَنْدِس');
  });
});

describe('WordDetailPage — learning panel', () => {
  it('describes an untouched word and offers only the promote action', async () => {
    renderWordDetail('engineer');

    const panel = within(await screen.findByRole('region', { name: 'Your Progress' }));
    expect(panel.getByText('New')).toBeInTheDocument();
    expect(panel.getByText('No answers yet')).toBeInTheDocument();
    expect(panel.getByText('Not scheduled')).toBeInTheDocument();
    expect(panel.getByRole('button', { name: 'Mark as learned' })).toBeInTheDocument();
    expect(panel.queryByRole('button', { name: 'Reset progress' })).not.toBeInTheDocument();
  });

  it('schedules the word when it is marked as learned', async () => {
    const { user } = renderWordDetail('engineer');

    await screen.findByRole('region', { name: 'Your Progress' });
    await user.click(screen.getByRole('button', { name: 'Mark as learned' }));

    await waitFor(() => {
      expect(within(progressPanel()).getByText('Learning')).toBeInTheDocument();
    });

    const stored = useProgressStore.getState().byWordId.engineer;
    expect(stored?.status).toBe('learning');
    expect(stored?.nextReviewAt).toBeDefined();

    const panel = within(progressPanel());
    expect(panel.queryByText('Not scheduled')).not.toBeInTheDocument();
    expect(panel.getByRole('button', { name: 'Reset progress' })).toBeInTheDocument();
    expect(panel.queryByRole('button', { name: 'Mark as learned' })).not.toBeInTheDocument();
  });

  it('clears the card again on reset', async () => {
    const { user } = renderWordDetail('engineer');

    await screen.findByRole('region', { name: 'Your Progress' });
    await user.click(screen.getByRole('button', { name: 'Mark as learned' }));
    await screen.findByRole('button', { name: 'Reset progress' });

    await user.click(screen.getByRole('button', { name: 'Reset progress' }));

    await waitFor(() => {
      expect(within(progressPanel()).getByText('New')).toBeInTheDocument();
    });
    const stored = useProgressStore.getState().byWordId.engineer;
    expect(stored).toMatchObject({ status: 'new', repetitions: 0, correctAnswers: 0 });
    expect(stored?.nextReviewAt).toBeUndefined();
    expect(
      within(progressPanel()).getByRole('button', { name: 'Mark as learned' }),
    ).toBeInTheDocument();
  });

  it('resets one card without touching the streak or the weekly baseline', async () => {
    const { user } = renderWordDetail('engineer');

    await screen.findByRole('region', { name: 'Your Progress' });
    await user.click(screen.getByRole('button', { name: 'Mark as learned' }));
    await screen.findByRole('button', { name: 'Reset progress' });

    const studyDays = useProgressStore.getState().studyDays;
    const snapshots = useProgressStore.getState().snapshots;
    expect(studyDays).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Reset progress' }));

    await waitFor(() => {
      expect(within(progressPanel()).getByText('New')).toBeInTheDocument();
    });

    // Clearing a card is a scheduling decision, not a day of study, and the baseline next
    // week's deltas are measured from has to keep the count the learner actually reached.
    expect(useProgressStore.getState().studyDays).toEqual(studyDays);
    expect(useProgressStore.getState().snapshots).toBe(snapshots);
    expect(snapshots.at(-1)?.wordsLearned).toBe(1);
  });

  it('reports accuracy, repetitions and an overdue review from a real card', async () => {
    const overdue = new Date(Date.now() - 2 * DAY_MS).toISOString();
    const card: WordProgress = {
      wordId: 'engineer',
      status: 'review',
      correctAnswers: 7,
      incorrectAnswers: 3,
      repetitions: 4,
      easeFactor: 2.4,
      intervalDays: 10,
      nextReviewAt: overdue,
      lastReviewedAt: overdue,
    };
    useProgressStore.setState({ byWordId: { engineer: card } });

    renderWordDetail('engineer');

    const panel = within(await screen.findByRole('region', { name: 'Your Progress' }));
    expect(panel.getByText('Learned')).toBeInTheDocument();
    expect(panel.getByText('70%')).toBeInTheDocument();
    expect(panel.getByText('10 answered')).toBeInTheDocument();
    expect(panel.getByText('4')).toBeInTheDocument();
    expect(panel.getByText('Due now')).toBeInTheDocument();
    expect(panel.getByRole('progressbar', { name: 'Accuracy on this word' })).toHaveAttribute(
      'aria-valuenow',
      '70',
    );
  });

  it('shows a mastered card as scheduled rather than due', async () => {
    const future = new Date(Date.now() + 21 * DAY_MS).toISOString();
    useProgressStore.setState({
      byWordId: {
        engineer: {
          wordId: 'engineer',
          status: 'mastered',
          correctAnswers: 12,
          incorrectAnswers: 0,
          repetitions: 6,
          easeFactor: 2.6,
          intervalDays: 21,
          nextReviewAt: future,
          lastReviewedAt: new Date().toISOString(),
        },
      },
    });

    renderWordDetail('engineer');

    const panel = within(await screen.findByRole('region', { name: 'Your Progress' }));
    expect(panel.getByText('Mastered')).toBeInTheDocument();
    expect(panel.getByText('100%')).toBeInTheDocument();
    expect(panel.queryByText('Due now')).not.toBeInTheDocument();
    expect(panel.queryByText('Not scheduled')).not.toBeInTheDocument();
  });
});

/*
 * An id comes straight out of the URL, so a word that does not exist is an ordinary outcome:
 * a mistyped address, a stale bookmark, a link to a word that was renamed. That is not the same
 * event as the request failing, and the two need opposite surfaces — the first is an empty state,
 * the second a retry. The 404 branch used to be unreachable because `isError` was tested first,
 * so an unknown id blamed the learner's connection and offered a button that could never succeed.
 */
describe('WordDetailPage — a word that does not exist', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('says the word is not in the library, with nothing to retry', async () => {
    renderWordDetail('definitely-not-a-word');

    expect(await screen.findByText('Word not found')).toBeInTheDocument();
    expect(screen.getByText(/It may have been renamed or removed/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
    expect(screen.queryByText('We could not load this word')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('requests the missing word once, because a 404 cannot come good on a retry', async () => {
    const get = vi.spyOn(apiClient, 'get');

    // The application's own query client, not the test one: the retry policy is the thing under
    // test. Retrying would also keep the page spinning for seconds before it settled.
    render(
      <AppProviders queryClient={createQueryClient()}>
        <MemoryRouter initialEntries={['/vocabulary/definitely-not-a-word']}>
          <Routes>
            <Route path={ROUTES.wordDetail} element={<WordDetailPage />} />
          </Routes>
        </MemoryRouter>
      </AppProviders>,
    );

    expect(await screen.findByText('Word not found')).toBeInTheDocument();
    const attempts = get.mock.calls.filter(
      ([path]) => path === '/words/definitely-not-a-word',
    ).length;
    expect(attempts).toBe(1);
  });
});

describe('WordDetailPage — a request that failed', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('blames the connection and offers a retry that works', async () => {
    const get = vi.spyOn(apiClient, 'get').mockRejectedValue(networkError());
    const { user } = renderWordDetail('engineer');

    expect(await screen.findByText('We could not load this word')).toBeInTheDocument();
    expect(screen.getByText('Check your connection and try again.')).toBeInTheDocument();
    expect(screen.queryByText('Word not found')).not.toBeInTheDocument();

    get.mockRestore();
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('heading', { level: 2, name: /مُهَنْدِس/ })).toBeInTheDocument();
  });

  it('announces the failure, which a missing word is not', async () => {
    vi.spyOn(apiClient, 'get').mockRejectedValue(networkError());
    renderWordDetail('engineer');

    // `role="alert"` belongs to a failure worth interrupting the learner for. An id that is not
    // in the library is an ordinary destination, so it is drawn rather than announced.
    expect(await screen.findByRole('alert')).toHaveTextContent('We could not load this word');
  });
});
