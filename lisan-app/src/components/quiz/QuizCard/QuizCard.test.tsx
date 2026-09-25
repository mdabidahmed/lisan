import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { QuizQuestion } from '@/types/quiz';

import { QuizCard } from './QuizCard';

const question: QuizQuestion = {
  id: 'q1_engineer',
  type: 'multiple-choice',
  wordId: 'engineer',
  question: 'الْمُهَنْدِسُ',
  correctAnswer: 'Engineer',
  options: ['Doctor', 'Teacher', 'Engineer', 'Student'],
};

const production: QuizQuestion = {
  id: 'q1_engineer_reverse',
  type: 'multiple-choice',
  wordId: 'engineer',
  question: 'Engineer',
  correctAnswer: 'الْمُهَنْدِسُ',
  options: ['الطَّبِيبُ', 'الْمُعَلِّمُ', 'الْمُهَنْدِسُ', 'الطَّالِبُ'],
};

function renderCard(props: Partial<ComponentProps<typeof QuizCard>> = {}) {
  const onSelect = vi.fn();
  render(
    <QuizCard
      question={question}
      questionNumber={1}
      totalQuestions={10}
      onSelect={onSelect}
      {...props}
    />,
  );
  return { onSelect, user: userEvent.setup() };
}

describe('QuizCard', () => {
  it('shows the position in the quiz and the Arabic prompt', () => {
    renderCard();

    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
    expect(screen.getByText('الْمُهَنْدِسُ')).toBeInTheDocument();
    expect(screen.getByText('Select the correct meaning:')).toBeInTheDocument();
  });

  it('renders the four options with their number shortcuts', () => {
    renderCard();

    const options = screen.getAllByRole('radio');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveAccessibleName(/1\s*Doctor/);
    expect(options[2]).toHaveAccessibleName(/3\s*Engineer/);
  });

  it('reports the chosen option', async () => {
    const { onSelect, user } = renderCard();

    await user.click(screen.getByRole('radio', { name: /Engineer/ }));

    expect(onSelect).toHaveBeenCalledWith('Engineer');
  });

  it('cannot advance before an answer is given', () => {
    renderCard();

    expect(screen.getByRole('button', { name: /Next Question/ })).toBeDisabled();
  });

  it('announces a correct answer on reveal', () => {
    renderCard({ selectedAnswer: 'Engineer', revealed: true });

    expect(screen.getByRole('status')).toHaveTextContent('Correct answer.');
    expect(screen.getByRole('radio', { name: /Engineer/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: /Next Question/ })).toBeEnabled();
  });

  it('announces the right answer when the learner is wrong', () => {
    renderCard({ selectedAnswer: 'Doctor', revealed: true });

    expect(screen.getByRole('status')).toHaveTextContent('Not quite — the answer is Engineer');
  });

  it('locks the options once the answer is revealed', () => {
    renderCard({ selectedAnswer: 'Doctor', revealed: true });

    for (const option of screen.getAllByRole('radio')) {
      expect(option).toBeDisabled();
    }
  });

  it('calls the last question the end of the quiz', () => {
    renderCard({ selectedAnswer: 'Engineer', revealed: true, isLast: true });

    expect(screen.getByRole('button', { name: /Finish Quiz/ })).toBeInTheDocument();
  });

  it('offers a way back only when there is somewhere to go', async () => {
    const onPrevious = vi.fn();
    const { user } = renderCard({ canGoBack: true, onPrevious });

    await user.click(screen.getByRole('button', { name: /Previous/ }));

    expect(onPrevious).toHaveBeenCalledTimes(1);
  });
});

describe('QuizCard — listening', () => {
  const listening: QuizQuestion = { ...question, type: 'listening' };

  it('hides the script until the answer is revealed', () => {
    render(
      <QuizCard
        question={listening}
        questionNumber={3}
        totalQuestions={10}
        concealPrompt
        onSelect={vi.fn()}
      />,
    );

    expect(screen.queryByText('الْمُهَنْدِسُ')).not.toBeInTheDocument();
    expect(screen.getByText('Listen to the word, then select its meaning:')).toBeInTheDocument();
    expect(screen.getByText('Tap play as many times as you need.')).toBeInTheDocument();
  });

  it('reveals the script with the answer', () => {
    render(
      <QuizCard
        question={listening}
        questionNumber={3}
        totalQuestions={10}
        selectedAnswer="Engineer"
        revealed
        concealPrompt
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText('الْمُهَنْدِسُ')).toBeInTheDocument();
  });
});

describe('QuizCard — english to arabic', () => {
  function renderProduction(props: Partial<ComponentProps<typeof QuizCard>> = {}) {
    return renderCard({ question: production, direction: 'english-to-arabic', ...props });
  }

  it('prints the English prompt and asks for the Arabic', () => {
    renderProduction();

    const prompt = screen.getByText('Engineer');
    expect(prompt).toBeInTheDocument();
    expect(prompt).not.toHaveAttribute('lang', 'ar');
    expect(screen.getByText('Select the correct Arabic word:')).toBeInTheDocument();
  });

  it('marks every option as Arabic and keeps it beside its shortcut key', () => {
    renderProduction();

    const options = screen.getAllByRole('radio');
    expect(options).toHaveLength(4);

    for (const option of options) {
      const label = option.querySelector('[lang="ar"]');
      expect(label).not.toBeNull();
      if (!(label instanceof HTMLElement)) throw new Error('No Arabic label on the option');

      /*
        The regression this now pins. A row flex normally makes its children content-sized and
        immune to this, but `.label` is `flex: 1 1 auto; min-inline-size: 0` and so grows to fill
        the button. `dir="rtl"` on a box that wide met `[dir='rtl'] { text-align: right }` and
        threw the Arabic answer to the button's far edge, away from the key that selects it.
      */
      expect(label).not.toHaveAttribute('dir');

      // The run is isolated inline instead, so it cannot reorder against the key or the marker.
      const run = label.firstElementChild;
      if (!(run instanceof HTMLElement)) throw new Error('The Arabic run is not wrapped');
      expect(window.getComputedStyle(run).unicodeBidi).toBe('isolate');
      // A production option is one vocabulary word, not a sentence, so it takes the host base.
      expect(run).not.toHaveAttribute('dir');
    }
  });

  it('will not read the prompt aloud, which would be reading out the answer', () => {
    renderProduction();

    expect(screen.queryByRole('button', { name: /Play the word/ })).not.toBeInTheDocument();
  });

  it('reports the Arabic the learner chose', async () => {
    const { onSelect, user } = renderProduction();

    await user.click(screen.getByRole('radio', { name: /الْمُهَنْدِسُ/ }));

    expect(onSelect).toHaveBeenCalledWith('الْمُهَنْدِسُ');
  });

  it('reveals the Arabic answer in the Arabic face', () => {
    renderProduction({ selectedAnswer: 'الطَّبِيبُ', revealed: true });

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Not quite — the answer is الْمُهَنْدِسُ');
    expect(status.querySelector('[lang="ar"]')).toHaveAttribute('dir', 'rtl');
  });
});
