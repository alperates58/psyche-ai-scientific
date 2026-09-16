import { test, expect } from '@playwright/test';

test.describe('FAZ 2.7C-2: Scientific Admin E2E Authoring & Form Management', () => {
  test('Admin can navigate to Assessment Forms and view registered forms', async ({ page }) => {
    await page.goto('/admin/assessment-forms');
    await expect(page).toHaveTitle(/Değerlendirme Formları/);
    await expect(page.locator('h1')).toContainText('Değerlendirme Formları');
    await expect(page.locator('text=Kayıtlı Değerlendirme Formları')).toBeVisible();
  });

  test('Admin can open New Form Draft page and toggle between Blank and Clone modes', async ({ page }) => {
    await page.goto('/admin/assessment-forms/new');
    await expect(page.locator('h1')).toContainText('Yeni Taslak Değerlendirme Formu');

    // Toggle tabs
    await page.click('button:has-text("Mevcut Formu Klonla")');
    await expect(page.locator('text=Klonlanacak Kaynak Form')).toBeVisible();

    await page.click('button:has-text("Boş Taslak Form Oluştur")');
    await expect(page.locator('text=Hedef Değerlendirme Modülü')).toBeVisible();
  });

  test('Admin can access Item Bank and open New Item Authoring form', async ({ page }) => {
    await page.goto('/admin/item-bank');
    await expect(page.locator('h1')).toContainText('Psikometrik Madde Bankası');

    await page.click('a:has-text("Yeni Madde Ekle")');
    await page.waitForURL('**/admin/item-bank/new');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.locator('text=Psikolojik Boyut Eşleşmesi')).toBeVisible();
    await expect(page.locator('text=Puanlama Yönü')).toBeVisible();
  });

  test('Regular unauthenticated user cannot access scientific authoring routes', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    // Navigate to admin forms
    await page.goto('/admin/assessment-forms');
    // Expect redirection to login or unauthorized page
    await expect(page).toHaveURL(/\/(auth\/login|login|\?error=)/);

    await context.close();
  });
});
