import { screen, waitFor, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { apiClient, networkError } from '@/services/api';
import { useLessonProgressStore } from '@/store/lessonProgressStore';
import { renderWithProviders, userEvent } from '@/test/renderWithProviders';

import { GrammarLessonPage } from './GrammarLesson';

const LESSON_ID = 'definite-article';

beforeEach(() => {
  localStorage.clear();
  useLessonProgressStore.getState().actions.reset();
});

async function renderLesson() {
  const view = renderWithProviders(<GrammarLessonPage />, {
    route: `/grammar/${LESSON_ID}`,
    path: ROUTES.grammarLesson,
  });
  await waitFor(() => {
    expect(screen.getByRole('heading', { level: 1, name: 'The Definite Article' })).toBeVisible();
  });
  return view;
}

interface ExamplePair {
  arabic: string;
  english: string;
}

/** Reads the Arabic/English pairs straight out of the rendered examples. */
function examplePairs(): ExamplePair[] {
  return screen.getAllByRole('button', { name: /^Play the example: / }).map((button) => {
    const item = button.closest('li');
    return {
      arabic: item?.querySelector('[lang="ar"]')?.textContent ?? '',
      english: (button.getAttribute('aria-label') ?? '').replace('Play the example: ', ''),
    };
  });
}

function promptOf(group: HTMLElement): { text: string; isArabic: boolean } {
  const label = document.getElementById(group.getAttribute('aria-labelledby') ?? '');
  return {
    text: label?.textContent ?? '',
    isArabic: label?.querySelector('[lang="ar"]') !== null,
  };
}

/** Answers the comprehension check, optionally getting one question deliberately wrong. */
async function answerCheck(user: UserEvent, { missIndex = -1 } = {}): Promise<number> {
  const pairs = examplePairs();
  const groups = screen.getAllByRole('radiogroup');

  for (const [index, group] of groups.entries()) {
    const prompt = promptOf(group);
    const pair = pairs.find((candidate) =>
      prompt.isArabic
        ? prompt.text.includes(candidate.arabic)
        : prompt.text.includes(candidate.english),
    );
    if (!pair) throw new Error(`No example matches the prompt "${prompt.text}"`);

    const correct = prompt.isArabic ? pair.english : pair.arabic;
    const options = within(group).getAllByRole('radio');
    const wrong = options.find((option) => option.textContent !== correct);

    const target =
      index === missIndex && wrong ? wrong : within(group).getByRole('radio', { name: correct });
    await user.click(target);
  }

  return groups.length;
}

describe('<GrammarLessonPage /> worked examples', () => {
  it('renders every example with its Arabic, transliteration, translation and audio', async () => {
    await renderLesson();

    const pairs = examplePairs();
    expect(pairs.length).toBeGreaterThanOrEqual(3);

    for (const button of screen.getAllByRole('button', { name: /^Play the example: / })) {
      const item = button.closest('li');
      expect(item).not.toBeNull();

      const arabic = item?.querySelector('[lang="ar"]');
      if (!(arabic instanceof HTMLElement)) throw new Error('No Arabic line in the example');
      expect(arabic.textContent).not.toBe('');

      /*
        Vowelled Arabic, marked up for right-to-left rendering — but on the isolated run, not on
        this `<p>`. The `<p>` is a flex item beside the example's audio button, so a base direction
        on it would align the sentence against the button once the line wraps. The run inside is
        inline and shrink-to-fit, so it begins where the column begins and still resolves
        right-to-left, which is what puts the example's full stop at its left-hand end.
      */
      expect(arabic).not.toHaveAttribute('dir');

      const run = arabic.firstElementChild;
      if (!(run instanceof HTMLElement)) throw new Error('The Arabic run is not wrapped');
      expect(run).toHaveAttribute('dir', 'rtl');
      expect(window.getComputedStyle(run).unicodeBidi).toBe('isolate');
      expect(arabic.textContent).toMatch(/\u002E$/);

      const english = (button.getAttribute('aria-label') ?? '').replace('Play the example: ', '');
      expect(within(item as HTMLElement).getByText(english)).toBeInTheDocument();
    }

    expect(screen.getByText('hādhā kitābun.')).toBeInTheDocument();
  });

  it('links the lesson vocabulary through to the word pages', async () => {
    await renderLesson();

    expect(
      await screen.findByRole('heading', { name: 'Words from this lesson' }),
    ).toBeInTheDocument();

    const wordLinks = await waitFor(() => {
      const links = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.startsWith('/vocabulary/') === true);
      expect(links.length).toBeGreaterThan(0);
      return links;
    });

    expect(wordLinks.some((link) => link.getAttribute('href') === '/vocabulary/book')).toBe(true);
  });
});

describe('<GrammarLessonPage /> comprehension check', () => {
  it('grades the check only when asked, and congratulates a clean sweep', async () => {
    const user = userEvent.setup();
    await renderLesson();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Check your understanding' }),
    ).toBeInTheDocument();

    const check = screen.getByRole('button', { name: 'Check answers' });
    expect(check).toBeDisabled();

    const total = await answerCheck(user);
    expect(screen.getByText(`${total} of ${total} answered`)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Check answers' }));

    expect(screen.getByText(`You got ${total} of ${total}`)).toBeInTheDocument();
  });

  it('points a wrong answer back at the section that explains it', async () => {
    const user = userEvent.setup();
    await renderLesson();

    const total = await answerCheck(user, { missIndex: 0 });
    await user.click(screen.getByRole('button', { name: 'Check answers' }));

    expect(screen.getByText(`You got ${total - 1} of ${total}`)).toBeInTheDocument();
    expect(screen.getByText(/Revisit/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(screen.getByRole('button', { name: 'Check answers' })).toBeDisabled();
    expect(screen.queryByText(/You got/)).not.toBeInTheDocument();
  });
});

describe('<GrammarLessonPage /> completion', () => {
  it('records completion, persists it and reflects it in the button', async () => {
    const user = userEvent.setup();
    await renderLesson();

    await user.click(screen.getByRole('button', { name: 'Mark as complete' }));

    expect(useLessonProgressStore.getState().completedById[LESSON_ID]).toBeDefined();
    expect(localStorage.getItem('lisan:grammar') ?? '').toContain(LESSON_ID);
    expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('can be un-marked', async () => {
    const user = userEvent.setup();
    useLessonProgressStore.getState().actions.markComplete(LESSON_ID);
    await renderLesson();

    await user.click(screen.getByRole('button', { name: 'Completed' }));

    expect(useLessonProgressStore.getState().completedById[LESSON_ID]).toBeUndefined();
    expect(screen.getByRole('button', { name: 'Mark as complete' })).toBeInTheDocument();
  });

  it('offers completion from the end of the check', async () => {
    const user = userEvent.setup();
    await renderLesson();

    await answerCheck(user);
    await user.click(screen.getByRole('button', { name: 'Check answers' }));
    await user.click(screen.getByRole('button', { name: 'Mark lesson complete' }));

    expect(useLessonProgressStore.getState().completedById[LESSON_ID]).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Mark lesson complete' })).not.toBeInTheDocument();
  });
});

/*
 * The lesson id comes out of the URL, so this page has the same hazard as every other route that
 * resolves an entity by id: a missing lesson and a failed request are different events. This one
 * had no error branch at all, which meant a dropped request claimed the lesson was not in the
 * library — and gave the learner no way to ask again.
 */
describe('<GrammarLessonPage /> an id that does not resolve', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('says the lesson is not in the library for an unknown id', async () => {
    renderWithProviders(<GrammarLessonPage />, {
      route: '/grammar/definitely-not-a-lesson',
      path: ROUTES.grammarLesson,
    });

    expect(await screen.findByText('Lesson not found')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('blames the connection for a dropped request, and offers a retry that works', async () => {
    const user = userEvent.setup();
    const get = vi.spyOn(apiClient, 'get').mockRejectedValue(networkError());

    renderWithProviders(<GrammarLessonPage />, {
      route: `/grammar/${LESSON_ID}`,
      path: ROUTES.grammarLesson,
    });

    expect(await screen.findByText('We could not load this lesson')).toBeInTheDocument();
    expect(screen.queryByText('Lesson not found')).not.toBeInTheDocument();

    get.mockRestore();
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'The Definite Article' }),
    ).toBeInTheDocument();
  });
});
