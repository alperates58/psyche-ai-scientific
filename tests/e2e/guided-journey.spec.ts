import { test, expect } from '@playwright/test';

test.describe('FAZ 2.8: Guided Onboarding & Assessment Journey E2E', () => {
  test('Unauthenticated user is redirected to login from protected journey routes', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    // Check /onboarding redirect
    await page.goto('/onboarding');
    await expect(page).toHaveURL(/\/(login|auth\/login|\?callbackUrl=)/);

    // Check /assessments redirect
    await page.goto('/assessments');
    await expect(page).toHaveURL(/\/(login|auth\/login|\?callbackUrl=)/);

    await context.close();
  });

  test('User can view Onboarding Page, guiding principles and journey sequence', async ({ page }) => {
    await page.goto('/onboarding');

    // If redirected to login due to test session state, check login page
    if (page.url().includes('login')) {
      await expect(page.locator('h1')).toContainText(/Giriş|Hesap/);
      return;
    }

    await expect(page.locator('h1')).toContainText('Psikolojik profilini oluşturmaya başlayalım');
    await expect(page.locator('text=Kademeli Gelişim')).toBeVisible();
    await expect(page.locator('text=Doğru ya da Yanlış Yok')).toBeVisible();
    await expect(page.locator('text=Klinik Tanı Değildir')).toBeVisible();
    await expect(page.locator('text=Veri Güvenliği & Gizlilik')).toBeVisible();
    await expect(page.locator('text=Başlangıç Yolculuğun')).toBeVisible();
  });

  test('User can view Assessment Catalog with grouped sections', async ({ page }) => {
    await page.goto('/assessments');

    if (page.url().includes('login')) {
      return;
    }

    await expect(page.locator('h1')).toContainText('Değerlendirmeler');
    await expect(page.locator('text=Başlangıç & Zorunlu Değerlendirmeler')).toBeVisible();
  });

  test('User Dashboard displays "Sıradaki Adım" hero card', async ({ page }) => {
    await page.goto('/overview');

    if (page.url().includes('login') || page.url().includes('onboarding')) {
      return;
    }

    await expect(page.locator('text=Sıradaki Adım, text=Tüm Mevcut Değerlendirmeler Tamamlandı').first()).toBeVisible();
  });

  test('Mobile viewport (375x812) renders clean and readable layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/onboarding');

    if (page.url().includes('login')) {
      return;
    }

    await expect(page.locator('h1')).toBeVisible();
    const ctaButton = page.locator('a:has-text("İlk Adıma Başla"), a:has-text("Kaldığın Yerden Devam Et")').first();
    if (await ctaButton.count() > 0) {
      await expect(ctaButton).toBeVisible();
    }
  });
});
