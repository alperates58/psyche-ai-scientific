import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const testDbUrl =
  process.env.TEST_DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5434/psyche_ai_test?schema=public';

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);

const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: testDbUrl,
    },
  },
});

test.describe('FAZ 2.6.1: Authenticated Zero-Assessment User Invariants E2E', () => {
  test.skip(!hasTestDb, 'Skipped: TEST_DATABASE_URL is not configured');

  const timestamp = Date.now();
  const testEmail = `zero_user_${timestamp}@psycheai.test`;
  const testPassword = 'ZeroPassword123!';
  let createdUserId: string | null = null;

  test.beforeAll(async () => {
    // Create an activated user with ZERO assessments
    const user = await testPrisma.user.create({
      data: {
        email: testEmail,
        emailNormalized: testEmail.toLowerCase(),
        name: 'Sıfır Değerlendirme Kullanıcısı',
        status: 'ACTIVE',
        emailVerified: new Date(),
        isDemoUser: false,
        credential: {
          create: {
            passwordHash: await import('@/lib/password').then(m => m.hashPassword(testPassword)),
          },
        },
        roles: {
          create: {
            role: 'USER',
          },
        },
      },
    });
    createdUserId = user.id;
  });

  test.afterAll(async () => {
    if (createdUserId) {
      await testPrisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    }
    await testPrisma.$disconnect();
  });

  test('login with fresh user and verify zero-data scientific invariants across all routes', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    // 2. Overview Page Verification
    await page.waitForURL(/\/overview/, { timeout: 15000 });
    const overviewBody = await page.locator('body').innerText();

    // Zero coverage invariants
    expect(overviewBody).toContain('%0 Keşfedildi');
    expect(overviewBody).toMatch(/0\s*\/\s*84\s*Alt Boyut/);

    // Measurement quality invariants: No SEM, No "Yüksek", shows "Henüz Veri Yok"
    expect(overviewBody).toContain('Henüz Veri Yok');
    expect(overviewBody).not.toContain('SEM ±2.8');
    expect(overviewBody).not.toContain('±2.8');
    expect(overviewBody).not.toContain('Yüksek (SEM');

    // Radar invariants: No fabricated scores or closed polygon
    expect(overviewBody).toContain('Henüz kişilik ölçümü bulunmuyor');
    expect(page.locator('.recharts-radar')).toHaveCount(0);

    // Psychological patterns invariants: clean empty state
    expect(overviewBody).toContain('Henüz yeterli veri yok');
    expect(overviewBody).toContain('Değerlendirmeye Başla');

    // Sidebar coverage verification
    const sidebar = page.locator('aside[aria-label="Sol Gezinme Menüsü"]');
    await expect(sidebar).toBeVisible();
    const sidebarText = await sidebar.innerText();
    expect(sidebarText).toContain('0%');
    expect(sidebarText).toMatch(/0\s*\/\s*84\s*Alt Boyut/);

    // 3. /profile/personality Verification
    await page.goto('/profile/personality');
    await page.waitForURL(/\/profile\/personality/);
    const personalityBody = await page.locator('body').innerText();

    expect(personalityBody).toContain('HENÜZ ÖLÇÜLMEDİ');
    expect(personalityBody).toContain('Henüz Kişilik Ölçümü Bulunmuyor');
    expect(personalityBody).toContain('Değerlendirmeye Başla');
    // No fake demo scores (e.g., 76, 82, etc.)
    expect(personalityBody).not.toContain('ÖNİZLEME VERİSİ');
    expect(personalityBody).not.toContain('±2.8');

    // 4. /profile/heatmap Verification
    await page.goto('/profile/heatmap');
    await page.waitForURL(/\/profile\/heatmap/);
    const heatmapBody = await page.locator('body').innerText();

    expect(heatmapBody).toContain('HENÜZ ÖLÇÜLMEDİ');
    expect(heatmapBody).toContain('Henüz tamamlanmış bir değerlendirmeniz bulunmuyor');
    expect(heatmapBody).not.toContain('ÖNİZLEME VERİSİ');

    // 5. /insights/context Verification
    await page.goto('/insights/context');
    await page.waitForURL(/\/insights\/context/);
    const contextBody = await page.locator('body').innerText();

    expect(contextBody).toContain('Henüz bağlamsal veri bulunmuyor');
    expect(contextBody).toContain('Değerlendirmeye Başla');
    expect(contextBody).not.toContain('ÖNİZLEME VERİSİ');

    // 6. /insights/patterns Verification
    await page.goto('/insights/patterns');
    await page.waitForURL(/\/insights\/patterns/);
    const patternsBody = await page.locator('body').innerText();

    expect(patternsBody).toContain('Henüz yeterli veri yok');
    expect(patternsBody).toContain('Değerlendirmeye Başla');
    expect(patternsBody).not.toContain('ÖNİZLEME VERİSİ');

    // 7. /theory-council Verification
    await page.goto('/theory-council');
    await page.waitForURL(/\/theory-council/);
    const councilBody = await page.locator('body').innerText();

    expect(councilBody).toContain('KURAMSAL ÇERÇEVE (EĞİTİMSEL)');
    expect(councilBody).toContain('Henüz ölçülmedi (Değerlendirme bekleniyor)');
    expect(councilBody).not.toContain('Alex Mercer');
    expect(councilBody).not.toContain('ÖNİZLEME VERİSİ');
  });
});
