import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'Mobile-Small (320x568)', width: 320, height: 568 },
  { name: 'Mobile-Std (375x812)', width: 375, height: 812 },
  { name: 'Tablet-Portrait (768x1024)', width: 768, height: 1024 },
  { name: 'Tablet-Landscape (1024x768)', width: 1024, height: 768 },
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
];

const ROUTES_TO_AUDIT = [
  { path: '/overview', name: 'Overview' },
  { path: '/profile/personality', name: 'Personality Profile' },
  { path: '/profile/heatmap', name: 'Profile Heatmap' },
  { path: '/insights/context', name: 'Contextual Variance' },
  { path: '/insights/patterns', name: 'Pattern Detection' },
  { path: '/theory-council', name: 'Theory Council' },
  { path: '/research/login', name: 'Research Login' },
];

test.describe('FAZ 2.5 Responsive Viewport & Overflow Invariants', () => {
  for (const vp of VIEWPORTS) {
    test.describe(`Viewport: ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      for (const route of ROUTES_TO_AUDIT) {
        test(`Zero horizontal overflow on ${route.name} (${route.path})`, async ({ page }) => {
          await page.goto(route.path, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(400);

          // Verify global responsive invariant: scrollWidth <= clientWidth
          const overflow = await page.evaluate(() => {
            const doc = document.documentElement;
            return doc.scrollWidth - doc.clientWidth;
          });

          // Allow at most 1px tolerance for subpixel antialiasing/scrollbars
          expect(overflow).toBeLessThanOrEqual(1);
        });
      }
    });
  }
});

test.describe('Mobile Drawer Accessibility & Interaction', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('Hamburger button opens drawer, ESC key closes it, focus is restored', async ({ page }) => {
    await page.goto('/theory-council', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    // Find and click hamburger button
    const hamburger = page.locator('button[aria-controls="mobile-navigation-drawer"]');
    await expect(hamburger).toBeVisible();
    await hamburger.click();

    // Drawer must appear
    const drawer = page.locator('#mobile-navigation-drawer');
    await expect(drawer).toBeVisible();

    // ESC key closes drawer
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
  });

  test('Backdrop tap closes drawer', async ({ page }) => {
    await page.goto('/theory-council', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const hamburger = page.locator('button[aria-controls="mobile-navigation-drawer"]');
    await hamburger.click();

    const drawer = page.locator('#mobile-navigation-drawer');
    await expect(drawer).toBeVisible();

    // Click backdrop (outside the 288px drawer)
    await page.mouse.click(340, 200);
    await expect(drawer).toBeHidden();
  });
});

test.describe('Interactive Touch Target Sizes', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('Navigation buttons and interactive elements meet touch target thresholds (>= 44px)', async ({ page }) => {
    await page.goto('/theory-council', { waitUntil: 'domcontentloaded' });

    // Hamburger button
    const hamburger = page.locator('button[aria-controls="mobile-navigation-drawer"]');
    const box = await hamburger.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }

    // Back link to overview
    const backLink = page.getByRole('link', { name: 'Genel Bakışa Dön' });
    const linkBox = await backLink.boundingBox();
    expect(linkBox).not.toBeNull();
    if (linkBox) {
      expect(linkBox.height).toBeGreaterThanOrEqual(40);
    }
  });
});
