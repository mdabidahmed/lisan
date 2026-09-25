import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { QuizAnswer, QuizQuestion } from '@/types/quiz';

import { QuestionStrip } from './QuestionStrip';

const questions: QuizQuestion[] = ['engineer', 'apple', 'book'].map((wordId, index) => ({
  id: `q${index + 1}_${wordId}`,
  type: 'multiple-choice',
  wordId,
  question: wordId,
  correctAnswer: wordId,
  options: [wordId, 'other'],
}));

function answer(questionId: string, wordId: string, correct: boolean): QuizAnswer {
  return {
    questionId,
    wordId,
    given: correct ? wordId : 'other',
    correct,
    answeredAt: '2026-09-21T10:00:00.000Z',
    durationMs: 1200,
  };
}

const answers = {
  q1_engineer: answer('q1_engineer', 'engineer', true),
  q2_apple: answer('q2_apple', 'apple', false),
};

describe('QuestionStrip', () => {
  it('lists one pill per question', () => {
    render(<QuestionStrip questions={questions} answers={{}} currentIndex={0} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('announces each question\u2019s outcome and which one is on screen', () => {
    render(<QuestionStrip questions={questions} answers={answers} currentIndex={2} />);

    expect(screen.getByText('Question 1, correct')).toBeInTheDocument();
    expect(screen.getByText('Question 2, incorrect')).toBeInTheDocument();
    expect(screen.getByText('Question 3, not answered, current question')).toBeInTheDocument();
  });

  it('renders nothing when there is no session yet', () => {
    render(<QuestionStrip questions={[]} answers={{}} currentIndex={0} />);

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});

describe('QuestionStrip — as jump controls', () => {
  function renderStrip(currentIndex = 2) {
    const onSelect = vi.fn();
    render(
      <QuestionStrip
        questions={questions}
        answers={answers}
        currentIndex={currentIndex}
        onSelect={onSelect}
      />,
    );
    return { onSelect, user: userEvent.setup() };
  }

  it('names each pill by its position and its outcome', () => {
    renderStrip();

    expect(screen.getByRole('button', { name: 'Question 1, correct' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Question 2, incorrect' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Question 3, not answered' })).toBeInTheDocument();
  });

  it('marks the question on screen as the current step', () => {
    renderStrip();

    expect(screen.getByRole('button', { name: 'Question 3, not answered' })).toHaveAttribute(
      'aria-current',
      'step',
    );
    expect(screen.getByRole('button', { name: 'Question 1, correct' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('jumps to the question that was clicked', async () => {
    const { onSelect, user } = renderStrip();

    await user.click(screen.getByRole('button', { name: 'Question 2, incorrect' }));

    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('is reachable and operable from the keyboard', async () => {
    const { onSelect, user } = renderStrip();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Question 1, correct' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(0);

    await user.tab();
    await user.keyboard(' ');
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('keeps the pill number out of the announcement', () => {
    renderStrip();

    // The digit is decorative: "3" alone says nothing about why you would press it.
    expect(screen.queryByRole('button', { name: '3' })).not.toBeInTheDocument();
  });
});
