import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { getWordArt } from '@/assets';
import type { QuizQuestion } from '@/types/quiz';

import { ImageMatchCard } from './ImageMatchCard';

const question: QuizQuestion = {
  id: 'q1_apple',
  type: 'image-match',
  wordId: 'apple',
  question: 'تُفَّاح',
  correctAnswer: 'apple',
  imageOptions: ['book', 'apple', 'cat', 'tree'],
};

function renderCard(props: Partial<ComponentProps<typeof ImageMatchCard>> = {}) {
  const onSelect = vi.fn();
  render(
    <ImageMatchCard
      question={question}
      questionNumber={1}
      totalQuestions={8}
      onSelect={onSelect}
      {...props}
    />,
  );
  return { onSelect, user: userEvent.setup() };
}

describe('ImageMatchCard', () => {
  it('shows the Arabic word above four pictures', () => {
    renderCard();

    expect(screen.getByText('تُفَّاح')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
  });

  it('names every picture by its illustration, so the question is answerable without sight', () => {
    renderCard();

    const appleAlt = getWordArt('apple')?.alt ?? '';
    expect(appleAlt).not.toBe('');
    expect(screen.getByRole('radio', { name: new RegExp(appleAlt) })).toBeInTheDocument();
  });

  it('lazily loads the artwork at a single aspect ratio', () => {
    renderCard();

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4);
    for (const image of images) {
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image).toHaveAttribute('width', '320');
      expect(image).toHaveAttribute('height', '240');
    }
  });

  it('reports the picture the learner picked', async () => {
    const { onSelect, user } = renderCard();

    const appleAlt = getWordArt('apple')?.alt ?? '';
    await user.click(screen.getByRole('radio', { name: new RegExp(appleAlt) }));

    expect(onSelect).toHaveBeenCalledWith('apple');
  });

  it('marks the outcome and locks the grid on reveal', () => {
    renderCard({ selectedAnswer: 'book', revealed: true });

    expect(screen.getByRole('status')).toHaveTextContent('Not quite');
    for (const option of screen.getAllByRole('radio')) {
      expect(option).toBeDisabled();
    }
  });
});
