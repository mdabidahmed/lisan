import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * These specs are compiled by tsconfig.node.json, which has no DOM lib, so browser globals
 * cannot be referenced from an `evaluate` callback. The string form of `evaluate` keeps the
 * expression out of the TypeScript program while still returning a typed value.
 */
function measure(page: Page, expression: string): Promise<number> {
  return page.evaluate<number>(expression);
}

test.describe('Lisan application shell', () => {
  test('loads the home screen with the Lisan brand and a main landmark', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Lisan/);

    // The wordmark is in the DOM twice and the shell hides the copy that does not belong to the
    // viewport: the sidebar's below 768px, the topbar's above it. Below 480px both go, so the
    // topbar's controls keep their tap targets (Topbar.module.css) — asserting on `.first()`
    // matched whichever copy came first in source order, hidden or not.
    const wordmark = page.getByText('Lisan', { exact: true }).filter({ visible: true });
    const narrow = (page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) < 480;

    await expect(wordmark).toHaveCount(narrow ? 0 : 1);

    const main = page.getByRole('main');
    await expect(main).toBeVisible();
    await expect(main).toHaveAttribute('id', 'main-content');
  });

  test('navigates between Vocabulary and Progress from the sidebar', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The sidebar collapses into the bottom navigation on small screens.');

    await page.goto('/');

    const nav = page.getByRole('navigation');

    await nav.getByRole('link', { name: 'Vocabulary', exact: true }).first().click();
    await expect(page).toHaveURL(/\/vocabulary$/);
    await expect(page.getByRole('heading', { name: 'Vocabulary' }).first()).toBeVisible();

    await nav.getByRole('link', { name: 'Progress', exact: true }).first().click();
    await expect(page).toHaveURL(/\/progress$/);
    await expect(page.getByRole('heading', { name: 'Progress' }).first()).toBeVisible();
  });

  test('puts the skip-to-content link first in the tab order', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');

    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('href', '#main-content');
    await expect(focused).toHaveText(/skip/i);

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
  });

  test('does not scroll horizontally at a 320px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/');

    // Wait for the shell to settle so a late-mounting element cannot widen the page after
    // the measurement is taken.
    await expect(page.getByRole('main')).toBeVisible();

    const scrollWidth = await measure(page, 'document.documentElement.scrollWidth');
    const clientWidth = await measure(page, 'document.documentElement.clientWidth');

    // One pixel of slack absorbs sub-pixel layout rounding.
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
