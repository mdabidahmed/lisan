import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { FONT_PREVIEW_SAMPLE } from '@/constants/app';

import { ArabicText } from './ArabicText';

/** The plural form of مَطَار: an Arabic run, a space, a Latin run and a pair of parentheses. */
const MIXED_SCRIPT_VALUE = 'مَطَارَات (maṭārāt)';

/**
 * A real sentence out of the content library rather than a fixture written for this file, because
 * the whole bug lives in its last character. `Settings.test.tsx` pins this copy to the dataset.
 */
const SENTENCE = FONT_PREVIEW_SAMPLE.exampleArabic;

/** The element `ArabicText` renders, as opposed to the isolate it wraps its children in. */
function hostOf(value: string): HTMLElement {
  const host = screen.getByText(value).parentElement;
  if (!(host instanceof HTMLElement)) throw new Error(`No host element for "${value}"`);
  return host;
}

/**
 * The base direction the bidi algorithm resolves for a run. An isolate is the innermost boundary
 * the algorithm looks up from, so the nearest declared `dir` is the answer — and that base is what
 * decides both where a neutral at the end of the run lands and how runs of different scripts are
 * ordered against each other.
 */
function baseDirectionOf(run: HTMLElement): 'ltr' | 'rtl' {
  return run.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
}

/** The app's own base direction, which is what these runs are being set into. */
function renderInHostLayout(node: ReactNode) {
  return render(<div dir="ltr">{node}</div>);
}

describe('ArabicText', () => {
  it('marks the content as Arabic without making it a right-to-left block', () => {
    render(<ArabicText as="p">{MIXED_SCRIPT_VALUE}</ArabicText>);

    const host = hostOf(MIXED_SCRIPT_VALUE);

    expect(host.tagName).toBe('P');
    expect(host).toHaveAttribute('lang', 'ar');
    /*
      The regression this pins. Every one of these sits in a `flex-direction: column` stack, whose
      default `align-items: stretch` gives the child the container's full width and blockifies it
      even when it is a `<span>`. `dir="rtl"` on a box that wide resolves `text-align: start` to the
      card's far edge and reorders the runs around it, so `مَطَارَات (maṭārāt)` rendered as
      `(maṭārāt) مَطَارَات` hard against the edge while its transliteration and gloss stayed at the
      start of the column.
    */
    expect(host).not.toHaveAttribute('dir');
  });

  it('isolates the Arabic run on an inline element inside the host', () => {
    render(<ArabicText>{MIXED_SCRIPT_VALUE}</ArabicText>);

    const isolate = screen.getByText(MIXED_SCRIPT_VALUE);

    expect(isolate.tagName).toBe('SPAN');
    /*
      `isolate`, not `plaintext`: plaintext would infer the base direction from the content, which
      for an Arabic-initial value resolves to right-to-left and reorders the runs all over again.
      A bare `<bdi>` is out for the same reason — it defaults to `dir="auto"`. The isolate takes the
      inherited direction instead.
    */
    expect(window.getComputedStyle(isolate).unicodeBidi).toBe('isolate');
    expect(isolate).not.toHaveAttribute('dir');
  });

  it('stays in the same flow as the host-language lines it is stacked with', () => {
    render(
      <div>
        <ArabicText as="p">{MIXED_SCRIPT_VALUE}</ArabicText>
        <p>maṭārāt</p>
      </div>,
    );

    const arabic = hostOf(MIXED_SCRIPT_VALUE);
    const latin = screen.getByText('maṭārāt');

    // Neither line overrides direction, so both inherit the document's and align together.
    expect(arabic.closest('[dir]')).toBe(latin.closest('[dir]'));
    expect(window.getComputedStyle(arabic).direction).toBe(
      window.getComputedStyle(latin).direction,
    );
  });

  it('renders a span by default and keeps the caller in charge of typography', () => {
    render(<ArabicText className="head-word">تُفَّاح</ArabicText>);

    const host = hostOf('تُفَّاح');

    expect(host.tagName).toBe('SPAN');
    expect(host).toHaveClass('head-word');
  });
});

describe('ArabicText — sentence flow', () => {
  it('is a real sentence ending in a bidi-neutral full stop', () => {
    // Guards the fixture, not the component: with any other last character there is no bug to fix.
    expect(SENTENCE).toMatch(/\u002E$/);
  });

  it('finishes a sentence at its left-hand end, where Arabic finishes', () => {
    renderInHostLayout(
      <ArabicText as="p" flow="sentence">
        {SENTENCE}
      </ArabicText>,
    );

    const isolate = screen.getByText(SENTENCE);

    /*
      The reported bug, and the whole reason this flow exists. Rule N2 of the bidi algorithm gives
      a neutral with no strong character after it the *embedding* direction. Inherited `ltr` — what
      every Arabic sentence in the app resolved to — therefore put the full stop at the right-hand
      end of the sentence, the end Arabic reads *from*. A right-to-left embedding puts it left,
      which is what reference screen 3 shows.
    */
    expect(isolate).toHaveAttribute('dir', 'rtl');
    expect(baseDirectionOf(isolate)).toBe('rtl');
  });

  it('declares that direction on the isolate only, never on the stretched host', () => {
    renderInHostLayout(
      <ArabicText as="p" flow="sentence">
        {SENTENCE}
      </ArabicText>,
    );

    /*
      The far-edge regression, which a sentence must not reintroduce. The host is a line in a
      column stack and so is stretched to the card's width; `dir` on a box that wide resolves
      `text-align: start` to the far edge. The isolate is inline and shrink-to-fit, so it resolves
      right-to-left *internally* while still beginning where its column begins.
    */
    expect(hostOf(SENTENCE)).not.toHaveAttribute('dir');
    expect(window.getComputedStyle(screen.getByText(SENTENCE)).unicodeBidi).toBe('isolate');
  });

  it('keeps a mixed-script value in the order reference screen 3 prints it', () => {
    renderInHostLayout(<ArabicText as="p">{MIXED_SCRIPT_VALUE}</ArabicText>);

    const isolate = screen.getByText(MIXED_SCRIPT_VALUE);

    /*
      The other half of the distinction. This value is not a sentence, it is an Arabic run trailed
      by its transliteration, and a right-to-left base would order the two runs against each other:
      `مَطَارَات (maṭārāt)` would come out as `(maṭārāt) مَطَارَات`. Left-to-right leaves them in
      source order, Arabic first, which is the order the reference prints.
    */
    expect(isolate).not.toHaveAttribute('dir');
    expect(baseDirectionOf(isolate)).toBe('ltr');
  });

  it('defaults to the embedded flow, so the unsafe case has to be asked for', () => {
    renderInHostLayout(<ArabicText as="p">{SENTENCE}</ArabicText>);

    expect(screen.getByText(SENTENCE)).not.toHaveAttribute('dir');
  });
});
