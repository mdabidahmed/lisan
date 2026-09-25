import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetWebFonts, WEB_FONTS } from '@/styles/webfonts';

import { UrduText } from './UrduText';

beforeEach(() => {
  resetWebFonts();
});

afterEach(() => {
  resetWebFonts();
});

const stylesheets = (): HTMLLinkElement[] => [
  ...document.head.querySelectorAll<HTMLLinkElement>('link[data-lisan-font]'),
];

describe('<UrduText />', () => {
  it('declares the language and the direction of the text it holds', () => {
    render(<UrduText>طالبِ علم</UrduText>);

    const urdu = screen.getByText('طالبِ علم');
    // `lang="ur"`, not `ar`: same script, different language, and the browser picks the font,
    // the hyphenation and the voice from the language.
    expect(urdu).toHaveAttribute('lang', 'ur');
    // On the element itself, so the gloss reads right to left in an English interface too.
    expect(urdu).toHaveAttribute('dir', 'rtl');
  });

  it('renders in the nastaliq token rather than a hard-coded family', () => {
    render(<UrduText>طالبِ علم</UrduText>);

    expect(getComputedStyle(screen.getByText('طالبِ علم')).fontFamily).toBe('var(--font-urdu)');
  });

  it('fetches the Urdu face on mount, once per document', () => {
    const { unmount } = render(<UrduText>طالبِ علم</UrduText>);
    expect(stylesheets().map((link) => link.href)).toEqual([WEB_FONTS.nastaliqUrdu.stylesheet]);

    // Two glosses on one page, or a remount, must not mean two requests for a 234 kB face.
    unmount();
    render(
      <>
        <UrduText>سلام</UrduText>
        <UrduText>کتاب</UrduText>
      </>,
    );

    expect(stylesheets()).toHaveLength(1);
  });

  it('costs nothing until something Urdu is actually rendered', () => {
    render(<p>No Urdu here.</p>);

    expect(stylesheets()).toHaveLength(0);
  });

  it('can render as a paragraph for block contexts', () => {
    render(<UrduText as="p">طالبِ علم</UrduText>);

    expect(screen.getByText('طالبِ علم').tagName).toBe('P');
  });
});

describe('<UrduText /> font loading failure', () => {
  it('leaves the text on screen when the face cannot be fetched', async () => {
    Object.defineProperty(document, 'fonts', {
      value: { load: vi.fn(() => Promise.reject(new Error('NetworkError'))) },
      configurable: true,
    });

    render(<UrduText>طالبِ علم</UrduText>);
    for (const link of stylesheets()) link.dispatchEvent(new Event('error'));
    await Promise.resolve();

    // The token's stack falls through to Noto Naskh, which is wrong typography but readable —
    // and far better than an empty row.
    expect(screen.getByText('طالبِ علم')).toBeInTheDocument();
    Reflect.deleteProperty(document, 'fonts');
  });
});
