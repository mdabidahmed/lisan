import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { normalizeAnswer } from '@/features/practice';
import { srsService } from '@/services/srs';
import { useProgressStore } from '@/store/progressStore';
import { useQuizSessionStore } from '@/store/quizSessionStore';
import { useSettingsStore } from '@/store/settingsStore';
import { renderWithProviders, userEvent } from '@/test/renderWithProviders';
import type { QuizQuestion } from '@/types';
import { containsArabic } from '@/utils';

import { PracticeModePage } from './PracticeMode';

function renderMode(mode: string) {
  return renderWithProviders(<PracticeModePage />, {
    route: `/practice/${mode}`,
    path: '/practice/:mode',
  });
}

/** The quiz is generated from the real dataset, so the test reads the question it was given. */
async function currentQuestion(): Promise<QuizQuestion> {
  return waitFor(() => {
    const session = useQuizSessionStore.getState().session;
    const question = session?.questions[session.currentIndex];
    if (question === undefined) throw new Error('The session has no current question yet.');
    return question;
  });
}

function optionNamed(value: string) {
  return screen.getByRole('radio', { name: (name: string) => name.includes(value) });
}

function setQuestionCount(count: number) {
  useSettingsStore.getState().actions.update({ quizQuestionCount: count });
}

beforeEach(() => {
  useQuizSessionStore.setState({ session: null, lastResult: null, questionStartedAt: null });
  useProgressStore.getState().actions.reset();
  useSettingsStore.getState().actions.reset();
  setQuestionCount(5);
});

describe('PracticeModePage — multiple choice', () => {
  it('starts a session and shows the first question', async () => {
    renderMode('multiple-choice');

    expect(await screen.findByText('Question 1 of 5')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    expect(useQuizSessionStore.getState().session?.status).toBe('active');
  });

  it('picking an option only stages it, then Next Question reveals the outcome', async () => {
    const user = userEvent.setup();
    renderMode('multiple-choice');
    const question = await currentQuestion();

    await user.click(optionNamed(question.correctAnswer));

    // Staged, not graded: Next Question is unlocked but nothing is revealed yet.
    expect(screen.getByRole('button', { name: /Next Question/ })).toBeEnabled();
    expect(screen.queryByRole('status')).toBeEmptyDOMElement();

    await user.click(screen.getByRole('button', { name: /Next Question/ }));

    expect(await screen.findByRole('status')).toHaveTextContent('Correct answer.');
  });

  it('feeds the answer to the progress store and the spaced-repetition schedule once confirmed', async () => {
    const user = userEvent.setup();
    renderMode('multiple-choice');
    const question = await currentQuestion();

    await user.click(optionNamed(question.correctAnswer));
    expect(useProgressStore.getState().totalAnswers).toBe(0);

    await user.click(screen.getByRole('button', { name: /Next Question/ }));

    await waitFor(() => {
      expect(useProgressStore.getState().totalAnswers).toBe(1);
    });
    const progress = useProgressStore.getState().byWordId[question.wordId];
    expect(useProgressStore.getState().totalCorrect).toBe(1);
    expect(progress?.repetitions).toBe(1);
    expect(progress?.nextReviewAt).toBeDefined();
  });

  it('scores the answer only once, however many times Next Question is pressed', async () => {
    const user = userEvent.setup();
    renderMode('multiple-choice');
    const question = await currentQuestion();

    await user.click(optionNamed(question.correctAnswer));
    const nextButton = screen.getByRole('button', { name: /Next Question/ });
    await user.click(nextButton); // confirms and reveals the pick
    await user.click(nextButton); // advances to the next question

    expect(useProgressStore.getState().totalAnswers).toBe(1);
  });

  it('answers with the number keys, staged until Enter confirms them', async () => {
    const user = userEvent.setup();
    renderMode('multiple-choice');
    const question = await currentQuestion();

    await user.keyboard('2');
    expect(useQuizSessionStore.getState().session?.answers[question.id]).toBeUndefined();

    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(useQuizSessionStore.getState().session?.answers[question.id]?.given).toBe(
        question.options?.[1],
      );
    });
  });

  it('advances with Enter, but only after a picked answer is confirmed', async () => {
    const user = userEvent.setup();
    renderMode('multiple-choice');
    await currentQuestion();

    await user.keyboard('{Enter}');
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();

    await user.keyboard('1');
    await user.keyboard('{Enter}'); // reveals the pick, stays on the same question
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();

    await user.keyboard('{Enter}'); // advances

    expect(await screen.findByText('Question 2 of 5')).toBeInTheDocument();
  });

  it('steps back to a previous question with its answer intact', async () => {
    const user = userEvent.setup();
    renderMode('multiple-choice');
    const first = await currentQuestion();

    await user.keyboard('1');
    await user.keyboard('{Enter}'); // reveal
    await user.keyboard('{Enter}'); // advance
    await screen.findByText('Question 2 of 5');

    await user.click(screen.getByRole('button', { name: /Previous/ }));

    expect(await screen.findByText('Question 1 of 5')).toBeInTheDocument();
    expect(optionNamed(first.options?.[0] ?? '')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('status')).not.toBeEmptyDOMElement();
  });

  it('tracks each question in the progress strip once confirmed', async () => {
    const user = userEvent.setup();
    renderMode('multiple-choice');
    const question = await currentQuestion();

    await user.click(optionNamed(question.correctAnswer));
    await user.click(screen.getByRole('button', { name: /Next Question/ }));

    expect(await screen.findByRole('button', { name: 'Question 1, correct' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Question 2, not answered' })).toBeInTheDocument();
  });

  it('jumps to any question from the progress strip', async () => {
    const user = userEvent.setup();
    renderMode('multiple-choice');
    await currentQuestion();

    await user.click(screen.getByRole('button', { name: 'Question 4, not answered' }));

    expect(await screen.findByText('Question 4 of 5')).toBeInTheDocument();
    expect(useQuizSessionStore.getState().session?.currentIndex).toBe(3);
  });

  it('completes the session and records the quiz on the last question', async () => {
    setQuestionCount(2);
    const user = userEvent.setup();
    renderMode('multiple-choice');
    await currentQuestion();

    await user.keyboard('1');
    await user.keyboard('{Enter}'); // reveal
    await user.keyboard('{Enter}'); // advance
    await screen.findByText('Question 2 of 2');
    await user.keyboard('1');
    await user.keyboard('{Enter}'); // reveal
    await user.keyboard('{Enter}'); // completes the quiz

    await waitFor(() => {
      expect(useQuizSessionStore.getState().lastResult?.total).toBe(2);
    });
    expect(useQuizSessionStore.getState().session?.status).toBe('completed');
    expect(useProgressStore.getState().quizzesCompleted).toBe(1);
  });

  it('explains an unknown mode instead of starting a quiz', () => {
    renderMode('sudoku');

    expect(screen.getByText('Unknown practice mode')).toBeInTheDocument();
    expect(useQuizSessionStore.getState().session).toBeNull();
  });
});

describe('PracticeModePage — listening', () => {
  it('keeps the script hidden until the answer is revealed', async () => {
    const user = userEvent.setup();
    renderMode('listening');
    const question = await currentQuestion();

    expect(screen.queryByText(question.question)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play the word again' })).toBeInTheDocument();

    await user.click(optionNamed(question.correctAnswer));
    // Staged, not yet confirmed: the script stays hidden.
    expect(screen.queryByText(question.question)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Next Question/ }));

    expect(await screen.findByText(question.question)).toBeInTheDocument();
  });
});

describe('PracticeModePage — typing', () => {
  it('accepts the answer typed without tashkeel', async () => {
    const user = userEvent.setup();
    renderMode('typing');
    const question = await currentQuestion();

    await user.type(
      await screen.findByLabelText('Your answer'),
      normalizeAnswer(question.correctAnswer),
    );
    await user.click(screen.getByRole('button', { name: /Check/ }));

    expect(await screen.findByRole('status')).toHaveTextContent('Correct answer.');
    expect(useProgressStore.getState().totalCorrect).toBe(1);
  });

  it('treats a missing or extra definite article as a near miss, not a flat wrong', async () => {
    const user = userEvent.setup();
    renderMode('typing');
    const question = await currentQuestion();

    const expected = normalizeAnswer(question.correctAnswer);
    const nearMiss = expected.startsWith('ال') ? expected.slice(2) : `ال${expected}`;

    await user.type(await screen.findByLabelText('Your answer'), nearMiss);
    await user.click(screen.getByRole('button', { name: /Check/ }));

    expect(await screen.findByRole('status')).toHaveTextContent('So close');

    // A near miss is still wrong, but it lapses more gently than a blank one.
    const progress = useProgressStore.getState().byWordId[question.wordId];
    const gentle = srsService.recordAnswer(undefined, false, {
      quality: 2,
      wordId: question.wordId,
    });
    const harsh = srsService.recordAnswer(undefined, false, {
      quality: 1,
      wordId: question.wordId,
    });
    expect(useProgressStore.getState().totalCorrect).toBe(0);
    expect(progress?.easeFactor).toBe(gentle.easeFactor);
    expect(gentle.easeFactor).toBeGreaterThan(harsh.easeFactor ?? 0);
  });
});

describe('PracticeModePage — english to arabic', () => {
  it('asks for the Arabic with four Arabic options, as the tile promises', async () => {
    renderMode('english-to-arabic');
    const question = await currentQuestion();

    expect(await screen.findByText('Select the correct Arabic word:')).toBeInTheDocument();
    expect(screen.getByText(question.question)).toBeInTheDocument();

    const options = screen.getAllByRole('radio');
    expect(options).toHaveLength(4);
    for (const option of options) {
      const label = option.querySelector('[lang="ar"]');
      expect(label).not.toBeNull();
      /*
        Marked as Arabic, but with no base direction of its own. The label is `flex: 1 1 auto`, so
        it fills the button; `dir="rtl"` on a box that wide right-aligned the answer against the
        button's far edge instead of letting it sit beside the shortcut key. These options are
        single vocabulary words, so the run is isolated inline and takes the button's direction.
      */
      expect(label).not.toHaveAttribute('dir');
    }
  });

  it('scores the Arabic the learner picked', async () => {
    const user = userEvent.setup();
    renderMode('english-to-arabic');
    const question = await currentQuestion();

    expect(containsArabic(question.correctAnswer)).toBe(true);
    await user.click(optionNamed(question.correctAnswer));
    await user.click(screen.getByRole('button', { name: /Next Question/ }));

    expect(await screen.findByRole('status')).toHaveTextContent('Correct answer.');
    await waitFor(() => {
      expect(useProgressStore.getState().totalCorrect).toBe(1);
    });
  });
});

describe('PracticeModePage — flashcards', () => {
  it('hides the meaning until the card is turned over, then takes the self-grade', async () => {
    const user = userEvent.setup();
    renderMode('flashcards');
    const question = await currentQuestion();

    expect(await screen.findByText(question.question)).toBeInTheDocument();
    expect(screen.queryByText(question.correctAnswer)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Show Meaning/ }));
    expect(screen.getByText(question.correctAnswer)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /I Knew It/ }));

    await waitFor(() => {
      expect(useProgressStore.getState().totalCorrect).toBe(1);
    });
    expect(screen.getByRole('button', { name: /Next Question/ })).toBeEnabled();
  });
});

describe('PracticeModePage — image match', () => {
  it('offers four illustrations to choose between', async () => {
    renderMode('image-match');
    await currentQuestion();

    expect(
      await screen.findByText('Select the picture that matches this word:'),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    expect(screen.getAllByRole('img')).toHaveLength(4);
  });

  it('scores the chosen picture', async () => {
    const user = userEvent.setup();
    renderMode('image-match');
    const question = await currentQuestion();

    await user.keyboard('1');

    await waitFor(() => {
      expect(useQuizSessionStore.getState().session?.answers[question.id]?.given).toBe(
        question.imageOptions?.[0],
      );
    });
    expect(useProgressStore.getState().totalAnswers).toBe(1);
  });
});
