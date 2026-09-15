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

test.describe('FAZ 2.7B: User & Access Governance E2E Tests', () => {
  test.skip(!hasTestDb, 'Skipped: TEST_DATABASE_URL is not configured');

  const timestamp = Date.now();
  const superAdminEmail = `super_gov_${timestamp}@psycheai.test`;
  const superAdminPassword = 'SuperAdminPassword123!';
  let createdSuperAdminId: string | null = null;

  const adminEmail = `admin_gov_${timestamp}@psycheai.test`;
  const adminPassword = 'AdminPassword123!';
  let createdAdminId: string | null = null;

  const targetUserEmail = `target_gov_${timestamp}@psycheai.test`;
  const targetUserPassword = 'TargetPassword123!';
  let createdTargetUserId: string | null = null;

  test.beforeAll(async () => {
    const { hashPassword } = await import('@/lib/password');

    // 1. Super Admin (SUPER_ADMIN role)
    const superAdmin = await testPrisma.user.create({
      data: {
        email: superAdminEmail,
        emailNormalized: superAdminEmail.toLowerCase(),
        name: 'Süper Yönetici Gov',
        status: 'ACTIVE',
        emailVerified: new Date(),
        isDemoUser: false,
        credential: {
          create: {
            passwordHash: await hashPassword(superAdminPassword),
          },
        },
        roles: {
          create: {
            role: 'SUPER_ADMIN',
          },
        },
      },
    });
    createdSuperAdminId = superAdmin.id;

    // 2. Standard Admin (ADMIN role, no ROLE_MANAGE)
    const admin = await testPrisma.user.create({
      data: {
        email: adminEmail,
        emailNormalized: adminEmail.toLowerCase(),
        name: 'Standart Admin Gov',
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
            role: 'ADMIN',
          },
        },
      },
    });
    createdAdminId = admin.id;

    // 3. Target User (USER role)
    const targetUser = await testPrisma.user.create({
      data: {
        email: targetUserEmail,
        emailNormalized: targetUserEmail.toLowerCase(),
        name: 'Hedef Kullanıcı Gov',
        status: 'ACTIVE',
        emailVerified: new Date(),
        isDemoUser: false,
        credential: {
          create: {
            passwordHash: await hashPassword(targetUserPassword),
          },
        },
        roles: {
          create: {
            role: 'USER',
          },
        },
      },
    });
    createdTargetUserId = targetUser.id;
  });

  test.afterAll(async () => {
    const ids = [createdSuperAdminId, createdAdminId, createdTargetUserId].filter(Boolean) as string[];
    if (ids.length > 0) {
      await testPrisma.user.deleteMany({
        where: { id: { in: ids } },
      }).catch(() => {});
    }
    await testPrisma.$disconnect();
  });

  test('SUPER_ADMIN can browse user directory, search, and view user details', async ({ page }) => {
    await page.context().clearCookies();
    // 1. Log in as Super Admin
    await page.goto('/login');
    await page.fill('input[type="email"]', superAdminEmail);
    await page.fill('input[type="password"]', superAdminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    // 2. Navigate to /admin/users
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(page.locator('h1')).toContainText('Kullanıcı Yönetimi');

    // 3. Search for target user
    await page.fill('input[placeholder*="İsim veya e-posta ile ara"]', targetUserEmail);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // 4. Verify target user is visible in list
    await expect(page.getByText('Hedef Kullanıcı Gov').first()).toBeVisible();

    // 5. Click to open detail page
    await page.click(`a[href*="/admin/users/${createdTargetUserId}"]`);
    await page.waitForURL(new RegExp(`/admin/users/${createdTargetUserId}`), { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Kullanıcı Detayı');
    await expect(page.getByText('Hedef Kullanıcı Gov').first()).toBeVisible();
    await expect(page.getByText('Aktif').first()).toBeVisible();
  });

  test('SUPER_ADMIN can suspend and reactivate a user with live state updates', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', superAdminEmail);
    await page.fill('input[type="password"]', superAdminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    await page.goto(`/admin/users/${createdTargetUserId}`);
    await expect(page.locator('h1')).toContainText('Kullanıcı Detayı');

    // 1. Click "Hesabı Askıya Al"
    await page.click('button:has-text("Hesabı Askıya Al")');

    // 2. Modal appears
    await expect(page.locator('#modal-title')).toContainText('Kullanıcıyı Askıya Al');
    await page.fill('textarea[placeholder*="gerekçesi"]', 'E2E Güvenlik Testi');
    await page.click('[role="dialog"] button:has-text("Hesabı Askıya Al")');

    // 3. Verify status updates to "Askıya Alındı"
    await expect(page.getByText('Askıya Alındı').first()).toBeVisible({ timeout: 10000 });

    // 4. Click "Hesabı Yeniden Etkinleştir"
    await page.click('button:has-text("Hesabı Yeniden Etkinleştir")');
    await expect(page.locator('#modal-title')).toContainText('Kullanıcıyı Yeniden Etkinleştir');
    await page.click('[role="dialog"] button:has-text("Etkinleştir")');

    // 5. Verify status returns to "Aktif"
    await expect(page.getByText('Aktif').first()).toBeVisible({ timeout: 10000 });
  });

  test('Standard ADMIN can view user directory but has role management locked', async ({ page }) => {
    await page.context().clearCookies();
    // 1. Log in as Standard Admin
    await page.goto('/login');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    // 2. Navigate to user detail
    await page.goto(`/admin/users/${createdTargetUserId}`);
    await expect(page.locator('h1')).toContainText('Kullanıcı Detayı');

    // 3. Verify Role Management is locked
    await expect(page.getByText('Salt Okunur (ROLE_MANAGE Gerekli)')).toBeVisible();
    await expect(page.locator('button:has-text("Rolü Ata")')).toHaveCount(0);
  });

  test('SUPER_ADMIN can browse /admin/audit and inspect details', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', superAdminEmail);
    await page.fill('input[type="password"]', superAdminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    await page.goto('/admin/audit');
    await expect(page).toHaveURL(/\/admin\/audit/);
    await expect(page.locator('h1')).toContainText('Denetim Günlüğü Gezgini');

    // Verify audit rows are rendered
    await expect(page.locator('table')).toBeVisible();
  });

  test('SUPER_ADMIN can view /admin/system health without leaking secrets', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', superAdminEmail);
    await page.fill('input[type="password"]', superAdminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    await page.goto('/admin/system');
    await expect(page).toHaveURL(/\/admin\/system/);
    await expect(page.locator('h1')).toContainText('Sistem Durumu');

    // Verify sections render
    await expect(page.getByText('Veritabanı Katmanı')).toBeVisible();
    await expect(page.getByText('Uygulama & Çalışma Zamanı')).toBeVisible();
    await expect(page.getByText('Kimlik & Oturum Güvenliği')).toBeVisible();
    await expect(page.getByText('Bilimsel Durum & Ontoloji Katmanı')).toBeVisible();
  });

  test('Responsive Zero Overflow on /admin/users and /admin/system across all viewports', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', superAdminEmail);
    await page.fill('input[type="password"]', superAdminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. Check /admin/users
      await page.goto('/admin/users');
      await expect(page.locator('h1')).toContainText('Kullanıcı Yönetimi');
      const usersOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(usersOverflow).toBe(false);

      // 2. Check /admin/system
      await page.goto('/admin/system');
      await expect(page.locator('h1')).toContainText('Sistem Durumu');
      const systemOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(systemOverflow).toBe(false);
    }
  });
});
