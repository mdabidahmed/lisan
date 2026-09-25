import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { QuizQuestion } from '@/types/quiz';

import { TypingCard } from './TypingCard';

const question: QuizQuestion = {
  id: 'q1_apple',
  type: 'typing',
  wordId: 'apple',
  question: 'Apple',
  correctAnswer: 'تُفَّاح',
};

function renderCard(props: Partial<ComponentProps<typeof TypingCard>> = {}) {
  const onSubmit = vi.fn();
  render(
    <TypingCard
      question={question}
      questionNumber={2}
      totalQuestions={5}
      onSubmit={onSubmit}
      {...props}
    />,
  );
  return { onSubmit, user: userEvent.setup() };
}

describe('TypingCard', () => {
  it('asks for the Arabic of the English prompt', () => {
    renderCard();

    expect(screen.getByText('Type this word in Arabic:')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByLabelText('Your answer')).toBeInTheDocument();
  });

  it('refuses to submit an empty answer', () => {
    renderCard();

    expect(screen.getByRole('button', { name: /Check/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Next Question/ })).toBeDisabled();
  });

  it('submits what was typed', async () => {
    const { onSubmit, user } = renderCard();

    await user.type(screen.getByLabelText('Your answer'), 'تفاح');
    await user.click(screen.getByRole('button', { name: /Check/ }));

    expect(onSubmit).toHaveBeenCalledWith('تفاح');
  });

  it('submits on Enter, since the learner is already typing', async () => {
    const { onSubmit, user } = renderCard();

    await user.type(screen.getByLabelText('Your answer'), 'تفاح{Enter}');

    expect(onSubmit).toHaveBeenCalledWith('تفاح');
  });

  it('shows the correct spelling and transliteration once revealed', () => {
    renderCard({
      given: 'تفاح',
      revealed: true,
      verdict: 'correct',
      transliteration: 'tuffāḥ',
    });

    expect(screen.getByRole('status')).toHaveTextContent('Correct answer.');
    expect(screen.getByText('Correct spelling')).toBeInTheDocument();
    expect(screen.getByText('tuffāḥ')).toBeInTheDocument();
  });

  it('softens a near miss rather than calling it flatly wrong', () => {
    renderCard({ given: 'تفاج', revealed: true, verdict: 'near-miss' });

    expect(screen.getByRole('status')).toHaveTextContent('So close — the answer is تُفَّاح');
  });

  it('marks a genuinely wrong answer wrong', () => {
    renderCard({ given: 'كتاب', revealed: true, verdict: 'incorrect' });

    expect(screen.getByRole('status')).toHaveTextContent('Not quite — the answer is تُفَّاح');
  });

  it('keeps the submitted answer on screen and locks the field', () => {
    renderCard({ given: 'تفاح', revealed: true, verdict: 'correct' });

    const input = screen.getByLabelText('Your answer');
    expect(input).toHaveValue('تفاح');
    expect(input).toBeDisabled();
  });

  it('points the prompt and the field at the Arabic script', () => {
    renderCard();

    expect(screen.getByLabelText('Your answer')).toHaveAttribute('dir', 'rtl');
    expect(screen.getByText('Tashkeel is optional.')).toBeInTheDocument();
  });
});

describe('TypingCard — arabic to english', () => {
  const reverse: QuizQuestion = {
    id: 'q1_apple_reverse',
    type: 'typing',
    wordId: 'apple',
    question: 'تُفَّاح',
    correctAnswer: 'Apple',
  };

  function renderReverse(props: Partial<ComponentProps<typeof TypingCard>> = {}) {
    return renderCard({ question: reverse, direction: 'arabic-to-english', ...props });
  }

  it('shows the Arabic word and asks for the meaning', () => {
    renderReverse();

    expect(screen.getByText('Type the meaning of this word in English:')).toBeInTheDocument();

    const subject = screen.getByText('تُفَّاح').closest('p');
    expect(subject).toHaveAttribute('lang', 'ar');
    /*
      The prompt is a full-width centred `<p>`, and `.subject`'s `text-align: center` ties on
      specificity with the global `[dir='rtl'] { text-align: right }` — so whichever stylesheet
      came last decided whether the word sat centred or flush right. It is a single vocabulary
      word, not a sentence, so it carries no base direction: the selector no longer matches and
      the centring wins outright.
    */
    expect(subject).not.toHaveAttribute('dir');
  });

  it('leaves the field in the Latin script', () => {
    renderReverse();

    const input = screen.getByLabelText('Your answer');
    expect(input).not.toHaveAttribute('dir', 'rtl');
    expect(input).not.toHaveAttribute('lang', 'ar');
  });

  it('reveals the meaning rather than a spelling', () => {
    renderReverse({ given: 'Apple', revealed: true, verdict: 'correct' });

    expect(screen.getByText('Correct meaning')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Correct answer.');
  });

  it('keeps the Arabic prompt on screen next to the pronunciation', () => {
    renderReverse({ given: 'Pear', revealed: true, verdict: 'incorrect' });

    expect(screen.getByText('تُفَّاح')).toBeInTheDocument();
    // The word panel offers pronunciation up front; the reveal offers it again by that name so
    // the two "Play the word" buttons stay individually addressable.
    expect(screen.getByRole('button', { name: 'Play the word' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play the word again' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Not quite — the answer is Apple');
  });
});
