import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const testDbUrl =
  process.env.TEST_DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5434/psyche_ai_test?schema=public';

const hasTestDb = Boolean(testDbUrl);

const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: testDbUrl,
    },
  },
});

const VIEWPORTS = [
  { name: 'Mobile-Small (320x568)', width: 320, height: 568 },
  { name: 'Mobile-Std (375x812)', width: 375, height: 812 },
  { name: 'Tablet-Portrait (768x1024)', width: 768, height: 1024 },
  { name: 'Tablet-Landscape (1024x768)', width: 1024, height: 768 },
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
];

test.describe('FAZ 2.7A: Admin Control Plane Foundation E2E', () => {
  test.skip(!hasTestDb, 'Skipped: TEST_DATABASE_URL is not configured');

  const timestamp = Date.now();
  const adminEmail = `super_admin_${timestamp}@psycheai.test`;
  const adminPassword = 'AdminPassword123!';
  let createdAdminId: string | null = null;

  const normalUserEmail = `normal_user_${timestamp}@psycheai.test`;
  const normalUserPassword = 'UserPassword123!';
  let createdUserId: string | null = null;

  test.beforeAll(async () => {
    const { hashPassword } = await import('@/lib/password');

    // 1. Create Super Admin User
    const admin = await testPrisma.user.create({
      data: {
        email: adminEmail,
        emailNormalized: adminEmail.toLowerCase(),
        name: 'Sistem Süper Yöneticisi',
        status: 'ACTIVE',
        emailVerified: new Date(),
        isDemoUser: false,
        credential: {
          create: {
            passwordHash: await hashPassword(adminPassword),
          },
        },
        roles: {
          create: {
            role: 'SUPER_ADMIN',
          },
        },
      },
    });
    createdAdminId = admin.id;

    // 2. Create Normal User (USER role only)
    const normalUser = await testPrisma.user.create({
      data: {
        email: normalUserEmail,
        emailNormalized: normalUserEmail.toLowerCase(),
        name: 'Standart Kullanıcı',
        status: 'ACTIVE',
        emailVerified: new Date(),
        isDemoUser: false,
        credential: {
          create: {
            passwordHash: await hashPassword(normalUserPassword),
          },
        },
        roles: {
          create: {
            role: 'USER',
          },
        },
      },
    });
    createdUserId = normalUser.id;
  });

  test.afterAll(async () => {
    if (createdAdminId) {
      await testPrisma.user.delete({ where: { id: createdAdminId } }).catch(() => {});
    }
    if (createdUserId) {
      await testPrisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    }
    await testPrisma.$disconnect();
  });

  test.beforeEach(async () => {
    await testPrisma.rateLimitRecord.deleteMany({});
  });

  test('Unauthenticated access to /admin redirects to login with callbackUrl', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fadmin/);
  });

  test('Standard USER role without ADMIN_ACCESS is redirected away from /admin', async ({ page }) => {
    await page.context().clearCookies();
    // Log in as normal user
    await page.goto('/login');
    await page.fill('input[type="email"]', normalUserEmail);
    await page.fill('input[type="password"]', normalUserPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    // Try navigating to /admin
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/overview/);
  });

  test('SUPER_ADMIN can login and access /admin control plane dashboard', async ({ page }) => {
    await page.context().clearCookies();
    // Log in as Super Admin
    await page.goto('/login');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    // Navigate to /admin
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin/);

    // Verify Admin Dashboard Title & Epistemic Reminders
    await expect(page.locator('h1')).toContainText('Yönetim Kontrol Paneli');
    await expect(page.getByText('FAZ 2.7A Canlı')).toBeVisible();

    // Verify Metric Cards
    await expect(page.getByText('Toplam Kullanıcı')).toBeVisible();
    await expect(page.getByText('Canlı Form Maddesi')).toBeVisible();
    await expect(page.getByText('Ontoloji Alt Boyutları')).toBeVisible();

    // Verify Future Navigation Items are disabled with badges
    await expect(page.getByText('Kullanıcı Yönetimi').first()).toBeVisible();
    await expect(page.getByText('FAZ 2.7B').first()).toBeVisible();
    await expect(page.getByText('Değerlendirme Formları').first()).toBeVisible();
    await expect(page.getByText('FAZ 2.7C').first()).toBeVisible();
    await expect(page.getByText('Yapay Zekâ Konfigürasyonu').first()).toBeVisible();
    await expect(page.getByText('FAZ 2.7D').first()).toBeVisible();
  });

  for (const vp of VIEWPORTS) {
    test(`Responsive Zero Overflow on /admin at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.context().clearCookies();

      // Log in as Super Admin
      await page.goto('/login');
      await page.fill('input[type="email"]', adminEmail);
      await page.fill('input[type="password"]', adminPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/overview/, { timeout: 15000 });

      await page.goto('/admin', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth - doc.clientWidth;
      });

      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
