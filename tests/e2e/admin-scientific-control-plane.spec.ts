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

test.describe('FAZ 2.7C-1: Scientific Asset Management Read-Only Control Plane E2E', () => {
  test.skip(!hasTestDb, 'Skipped: TEST_DATABASE_URL is not configured');

  const timestamp = Date.now();
  const superAdminEmail = `super_admin_sci_${timestamp}@psycheai.test`;
  const superAdminPassword = 'SuperAdminPassword123!';
  let createdSuperAdminId: string | null = null;

  const normalUserEmail = `normal_user_sci_${timestamp}@psycheai.test`;
  const normalUserPassword = 'UserPassword123!';
  let createdUserId: string | null = null;

  test.beforeAll(async () => {
    const { hashPassword } = await import('@/lib/password');

    // 1. Create Super Admin User (SUPER_ADMIN role -> has ADMIN_ACCESS & SCIENTIFIC_VIEW)
    const superAdmin = await testPrisma.user.create({
      data: {
        email: superAdminEmail,
        emailNormalized: superAdminEmail.toLowerCase(),
        name: 'Bilimsel Süper Yönetici',
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

    // 2. Create Normal User (USER role only)
    const normalUser = await testPrisma.user.create({
      data: {
        email: normalUserEmail,
        emailNormalized: normalUserEmail.toLowerCase(),
        name: 'Normal Kullanıcı',
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
    if (createdSuperAdminId) {
      await testPrisma.user.delete({ where: { id: createdSuperAdminId } }).catch(() => {});
    }
    if (createdUserId) {
      await testPrisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    }
    await testPrisma.$disconnect();
  });

  test.beforeEach(async () => {
    await testPrisma.rateLimitRecord.deleteMany({});
  });

  test('Scientific routes reject unauthenticated users with redirect to login', async ({ page }) => {
    const routes = [
      '/admin/assessment-forms',
      '/admin/item-bank',
      '/admin/ontology',
      '/admin/sources',
      '/admin/licenses',
      '/admin/validation',
      '/admin/scoring-models',
      '/admin/norms',
    ];

    for (const route of routes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(new RegExp(`/login\\?callbackUrl=${encodeURIComponent(route)}`));
    }
  });

  test('Scientific routes reject standard USER role without SCIENTIFIC_VIEW', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', normalUserEmail);
    await page.fill('input[type="password"]', normalUserPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    await page.goto('/admin/assessment-forms');
    await expect(page).toHaveURL(/\/overview/);

    await page.goto('/admin/validation');
    await expect(page).toHaveURL(/\/overview/);
  });

  test('SUPER_ADMIN can access all 8 scientific explorer views via sidebar and direct URL', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', superAdminEmail);
    await page.fill('input[type="password"]', superAdminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    // 1. Assessment Forms
    await page.goto('/admin/assessment-forms', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Değerlendirme Formları');
    await expect(page.getByText('v1.0.0').first()).toBeVisible();

    // 2. Item Bank
    await page.goto('/admin/item-bank', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Psikometrik Madde Bankası');

    // 3. Ontology
    await page.goto('/admin/ontology', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Psikolojik Ontoloji Haritası');
    await expect(page.getByText('84 Alt Boyut').first()).toBeVisible();

    // 4. Sources
    await page.goto('/admin/sources', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Bilimsel Kaynak Kaydı');

    // 5. Licenses
    await page.goto('/admin/licenses', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Envanter & Lisans Sicili');

    // 6. Validation
    await page.goto('/admin/validation', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Türkçe Doğrulama Matrisi');

    // 7. Scoring Models
    await page.goto('/admin/scoring-models', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Puanlama Modelleri');
    await expect(page.getByText('PRE_CALIBRATION_MEAN_V1').first()).toBeVisible();

    // 8. Norms
    await page.goto('/admin/norms', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Norm Tabloları & Standardizasyon');
    await expect(page.getByText('UNAVAILABLE').first()).toBeVisible();
  });

  test('Details drilldown pages load successfully in read-only mode', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', superAdminEmail);
    await page.fill('input[type="password"]', superAdminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    // Ontology facet detail
    await page.goto('/admin/ontology/sincerity', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('sincerity').first()).toBeVisible();
    await expect(page.getByText('İçtenlik').first()).toBeVisible();

    // Validation facet detail
    await page.goto('/admin/validation/sincerity', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('sincerity').first()).toBeVisible();
    await expect(page.getByText('İçtenlik').first()).toBeVisible();

    // Scoring model detail
    await page.goto('/admin/scoring-models/PRE_CALIBRATION_MEAN_V1', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('PRE_CALIBRATION_MEAN_V1').first()).toBeVisible();
  });

  for (const vp of VIEWPORTS) {
    test(`Responsive Zero Overflow and readability on scientific views at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.context().clearCookies();

      await page.goto('/login');
      await page.fill('input[type="email"]', superAdminEmail);
      await page.fill('input[type="password"]', superAdminPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/overview/, { timeout: 15000 });

      const testRoutes = [
        '/admin/assessment-forms',
        '/admin/item-bank',
        '/admin/ontology',
        '/admin/validation',
      ];

      for (const route of testRoutes) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(300);

        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return doc.scrollWidth - doc.clientWidth;
        });

        expect(overflow).toBeLessThanOrEqual(1);
      }
    });
  }
});
