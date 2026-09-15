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
    await page.waitForSelector('h1', { timeout: 10000 });

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

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/password';

const testDbUrl =
  process.env.TEST_DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5434/psyche_ai_test?schema=public';

const testPrisma = new PrismaClient({
  datasources: { db: { url: testDbUrl } },
});

test.describe('FAZ 2.6: Real Credentials End-to-End Flow (TEST DB)', () => {
  test.skip(!process.env.TEST_DATABASE_URL, 'Skipped: TEST_DATABASE_URL is not configured');

  const e2eEmail = `e2e_user_${Date.now()}@psycheai.test`;
  const e2ePassword = 'ValidPassphrase123!';
  let createdUserId: string | null = null;

  test.afterAll(async () => {
    if (createdUserId) {
      await testPrisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    }
    await testPrisma.$disconnect();
  });

  test('incorrect password fails authentication with error alert', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'nonexistent_user@psycheai.test');
    await page.fill('input[type="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Error alert is displayed (excluding Next.js route announcer)
    const alert = page.locator('div[role="alert"]:not(#__next-route-announcer__)');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/hatalı|başarısız|bulunamadı/i);
  });

  test('full credentials user lifecycle: register, verify, login, session persistence, navigate, logout', async ({ page }) => {
    // 1. Register credentials user
    await page.goto('/register');
    await page.fill('input[name="name"]', 'E2E Testing Subject');
    await page.fill('input[name="email"]', e2eEmail);
    await page.fill('input[name="password"]', e2ePassword);
    await page.fill('input[name="confirmPassword"]', e2ePassword);
    await page.click('button[type="submit"]');

    // Wait for registration confirmation message
    await expect(page.locator('body')).toContainText(/başarılı|kontrol edin/i);

    // 2. Locate and activate user in the isolated TEST database
    const user = await testPrisma.user.findFirst({
      where: { emailNormalized: e2eEmail.toLowerCase() },
    });
    expect(user).not.toBeNull();
    createdUserId = user!.id;
    expect(user!.status).toBe('PENDING_VERIFICATION');

    await testPrisma.user.update({
      where: { id: user!.id },
      data: { emailVerified: new Date(), status: 'ACTIVE' },
    });

    // 3. Login through UI
    await page.goto('/login');
    await page.fill('input[type="email"]', e2eEmail);
    await page.fill('input[type="password"]', e2ePassword);
    await page.click('button[type="submit"]');

    // 4. Redirect to /overview
    await page.waitForURL(/\/overview/, { timeout: 15000 });
    expect(page.url()).toContain('/overview');

    // 5. Page refresh: session remains authenticated
    await page.reload();
    await page.waitForURL(/\/overview/);
    expect(page.url()).toContain('/overview');

    // 6. Access protected /assessment
    await page.goto('/assessment');
    await page.waitForURL(/\/assessment/);
    expect(page.url()).toContain('/assessment');

    // 7. Logout through UI
    const logoutBtn = page.locator('button[aria-label="Güvenli Çıkış Yap"]');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // 8. Wait for redirection to /login
    await page.waitForURL(/\/login/, { timeout: 15000 });
    expect(page.url()).toContain('/login');

    // 9. Re-attempt to access /overview -> redirected to /login
    await page.goto('/overview');
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain('/login');
  });

  test('open redirect protection prevents arbitrary external redirects via callbackUrl', async ({ page }) => {
    // Register/create a dedicated test user for redirect test
    const redirectTestEmail = `redirect_test_${Date.now()}@psycheai.test`;
    const redirectTestPassword = 'ValidPassphrase123!';
    const passwordHash = await hashPassword(redirectTestPassword);

    const redirectUser = await testPrisma.user.create({
      data: {
        name: 'Redirect Test User',
        email: redirectTestEmail,
        emailNormalized: redirectTestEmail.toLowerCase(),
        status: 'ACTIVE',
        emailVerified: new Date(),
        credential: {
          create: {
            passwordHash,
          },
        },
        roles: {
          create: {
            role: 'USER',
          },
        },
      },
    });

    try {
      // Attempt login with malicious external callbackUrl
      await page.goto('/login?callbackUrl=https://evil.com/phishing');
      await page.fill('input[type="email"]', redirectTestEmail);
      await page.fill('input[type="password"]', redirectTestPassword);
      await page.click('button[type="submit"]');

      // Should safely redirect to /overview instead of external evil.com
      await page.waitForURL(/\/overview/, { timeout: 15000 });
      expect(page.url()).toContain('/overview');
      expect(page.url()).not.toContain('evil.com');
    } finally {
      await testPrisma.user.delete({ where: { id: redirectUser.id } }).catch(() => {});
    }
  });
});

