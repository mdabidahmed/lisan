import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DetailRow } from './DetailRow';

/** The plural form of مَطَار: an Arabic run, a space, a Latin run and a pair of parentheses. */
const MIXED_SCRIPT_VALUE = 'مَطَارَات (maṭārāt)';

function valueCellOf(label: string): HTMLElement {
  const cell = screen.getByText(label).parentElement?.lastElementChild;
  if (!(cell instanceof HTMLElement)) throw new Error(`No value cell for "${label}"`);
  return cell;
}

describe('DetailRow', () => {
  it('marks an Arabic value as Arabic without making it a right-to-left block', () => {
    render(
      <DetailRow label="Plural Form" arabic>
        {MIXED_SCRIPT_VALUE}
      </DetailRow>,
    );

    const cell = valueCellOf('Plural Form');

    expect(cell).toHaveAttribute('lang', 'ar');
    /*
      The regression this pins. `dir="rtl"` here gave the cell — a grid item spanning the value
      column — its own base direction, so `text-align: start` resolved to the card's right edge and
      the runs reordered around it: `مَطَارَات (maṭārāt)` rendered as `(maṭārāt) مَطَارَات` hard
      against the card edge, while every other row's value sat at the start of the column.
    */
    expect(cell).not.toHaveAttribute('dir');
  });

  it('keeps the Arabic value in the same flow as the rest of the column', () => {
    render(
      <>
        <DetailRow label="Part of Speech">Noun</DetailRow>
        <DetailRow label="Plural Form" arabic>
          {MIXED_SCRIPT_VALUE}
        </DetailRow>
      </>,
    );

    const latin = valueCellOf('Part of Speech');
    const arabic = valueCellOf('Plural Form');

    // Neither cell overrides direction, so both inherit the document's and align together.
    expect(arabic.closest('[dir]')).toBe(latin.closest('[dir]'));
    expect(window.getComputedStyle(arabic).direction).toBe(
      window.getComputedStyle(latin).direction,
    );
  });

  it('isolates the Arabic run on an inline element inside the cell', () => {
    render(
      <DetailRow label="Plural Form" arabic>
        {MIXED_SCRIPT_VALUE}
      </DetailRow>,
    );

    const cell = valueCellOf('Plural Form');
    const isolate = cell.firstElementChild;

    if (!(isolate instanceof HTMLElement)) throw new Error('Arabic run is not wrapped');
    expect(isolate.tagName).toBe('SPAN');
    expect(isolate).toHaveTextContent(MIXED_SCRIPT_VALUE);
    /*
      `isolate`, not `plaintext`: plaintext would infer the base direction from the content, which
      for an Arabic-initial value resolves to right-to-left and reorders the runs all over again.
      The isolate takes the inherited direction instead.
    */
    expect(window.getComputedStyle(isolate).unicodeBidi).toBe('isolate');
  });

  it('leaves a non-Arabic value unwrapped and unmarked', () => {
    render(<DetailRow label="Category">Transport &amp; Travel</DetailRow>);

    const cell = valueCellOf('Category');

    expect(cell).not.toHaveAttribute('lang');
    expect(cell).not.toHaveAttribute('dir');
    expect(cell.firstElementChild).toBeNull();
  });
});
