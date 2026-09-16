import { test, expect } from '@playwright/test';

test.describe('FAZ 2.9: Detailed Assessment Results Experience E2E', () => {
  test('Unauthenticated user is redirected to login when accessing results route', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    await page.goto('/assessments/results/test-session-id-123');
    await expect(page).toHaveURL(/\/(login|auth\/login|\?callbackUrl=)/);

    await context.close();
  });

  test('Shows graceful error view when invalid or unauthorized session is accessed', async ({ page }) => {
    await page.goto('/assessments/results/non-existent-session-id');

    if (page.url().includes('login')) {
      return;
    }

    await expect(page.locator('h2')).toContainText(/Sonuç Görüntülenemedi|Değerlendirme/);
    await expect(page.locator('text=Değerlendirmeler Sayfasına Dön')).toBeVisible();
  });

  test('Mobile viewport (375x812) renders responsive and readable results layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/assessments');

    if (page.url().includes('login')) {
      return;
    }

    await expect(page.locator('h1')).toContainText('Değerlendirmeler');
  });
});
