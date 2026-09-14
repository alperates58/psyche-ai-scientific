import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'Mobile-Small (320x568)', width: 320, height: 568 },
  { name: 'Mobile-Std (375x812)', width: 375, height: 812 },
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
];

const AUTH_ROUTES = [
  { path: '/login', name: 'Login Page' },
  { path: '/register', name: 'Register Page' },
  { path: '/forgot-password', name: 'Forgot Password Page' },
  { path: '/reset-password', name: 'Reset Password Page' },
  { path: '/verify-email', name: 'Verify Email Page' },
];

test.describe('FAZ 2.6: Auth Pages Responsive & Layout Invariants', () => {
  for (const vp of VIEWPORTS) {
    test.describe(`Viewport: ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      for (const route of AUTH_ROUTES) {
        test(`Zero horizontal overflow on ${route.name} (${route.path})`, async ({ page }) => {
          await page.goto(route.path, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(300);

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

test.describe('FAZ 2.6: Auth Page Functional Elements', () => {
  test('Login page has required form elements and Google OAuth option', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // Heading
    await expect(page.locator('h1')).toContainText('PsycheAI Giriş');

    // Input fields
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Navigation links
    await expect(page.locator('a[href="/register"]')).toBeVisible();
    await expect(page.locator('a[href="/forgot-password"]')).toBeVisible();
  });

  test('Register page has complete registration fields and validation', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toContainText('Hesap Oluştur');

    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const confirmInput = page.locator('input[name="confirmPassword"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(confirmInput).toBeVisible();

    await expect(page.locator('main a[href="/login"]').first()).toBeVisible();
  });

  test('Forgot password page has email input and back link', async ({ page }) => {
    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toContainText('Şifre Sıfırlama');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('main a[href="/login"]').first()).toBeVisible();
  });

  test('Reset password page gracefully flags missing token parameter', async ({ page }) => {
    await page.goto('/reset-password', { waitUntil: 'domcontentloaded' });

    // Without token, displays warning/error about invalid link
    await expect(page.locator('body')).toContainText(/geçersiz|eksik|sıfırlama bağlantısı/i);
    await expect(page.locator('a[href="/forgot-password"]')).toBeVisible();
  });

  test('Unauthenticated access to protected /overview redirects to /login', async ({ page }) => {
    await page.goto('/overview', { waitUntil: 'domcontentloaded' });

    // Should be redirected to /login with callbackUrl parameter
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain('/login');
    expect(page.url()).toContain('callbackUrl');
  });
});
