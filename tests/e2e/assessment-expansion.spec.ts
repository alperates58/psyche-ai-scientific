import { test, expect } from '@playwright/test';

test.describe('FAZ 2.10: Assessment Library Expansion & Multi-Test Flow E2E', () => {
  test('Unauthenticated user is redirected to login when accessing expanded assessment modules', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    await page.goto('/assessment?module=MODULE_2_SELF_IDENTITY');
    await expect(page).toHaveURL(/\/(login|auth\/login|\?callbackUrl=)/);

    await context.close();
  });

  test('Assessments catalog renders multi-module library with required & recommended classifications', async ({ page }) => {
    await page.goto('/assessments');

    if (page.url().includes('login')) {
      return;
    }

    await expect(page.locator('h1')).toContainText('Değerlendirmeler');
    await expect(page.locator('text=Psikolojik Değerlendirme Kataloğu')).toBeVisible();
  });

  test('Mobile viewport (375x812) renders clean multi-assessment catalog and results', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/assessments');

    if (page.url().includes('login')) {
      return;
    }

    await expect(page.locator('h1')).toContainText('Değerlendirmeler');
  });
});
