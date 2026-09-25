import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { words } from '@/test/fixtures/sampleContent';

import { RelatedWords, type RelatedWordsProps } from './RelatedWords';

function renderRelated(props: Partial<RelatedWordsProps> = {}) {
  return render(
    <MemoryRouter>
      <RelatedWords words={[]} {...props} />
    </MemoryRouter>,
  );
}

describe('RelatedWords', () => {
  it('renders one linked tile per word, showing Arabic with the right direction', () => {
    const sample = words.slice(0, 3);
    renderRelated({ words: sample });

    expect(screen.getAllByRole('listitem')).toHaveLength(3);

    const [first] = sample;
    const link = screen.getByRole('link', { name: new RegExp(first?.english ?? '') });
    expect(link).toHaveAttribute('href', `/vocabulary/${first?.id ?? ''}`);

    const run = screen.getByText(first?.arabic ?? '');
    const arabic = run.closest('[lang]');
    expect(arabic).toHaveAttribute('lang', 'ar');
    /*
      The head word is the first line of a `flex-direction: column` copy block, which stretches its
      children to the tile's full width — an inline `<span>` included, since stretching blockifies
      it. `dir="rtl"` there resolved `text-align: start` to the tile's right edge, stranding the
      Arabic from the transliteration and gloss beneath it. Isolate the run inline instead.
    */
    expect(arabic).not.toHaveAttribute('dir');
    expect(window.getComputedStyle(run).unicodeBidi).toBe('isolate');
  });

  it('announces the loading state instead of an empty grid', () => {
    renderRelated({ isLoading: true });

    expect(screen.getByText('Loading related words…')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('explains an unconnected word rather than rendering nothing', () => {
    renderRelated();

    expect(screen.getByText('No related words yet')).toBeInTheDocument();
  });

  it('keeps the rest of the page usable when the lookup fails', () => {
    const onRetry = vi.fn();
    renderRelated({ isError: true, onRetry });

    expect(screen.getByRole('alert')).toHaveTextContent('We could not load related words');
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});
