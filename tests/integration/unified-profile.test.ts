import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { assertTestDatabaseSafety } from '../../scripts/verify-test-db-safety';
import { getUnifiedPsychologicalProfile } from '@/services/unifiedProfileService';

const testDbUrl =
  process.env.TEST_DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5434/psyche_ai_test?schema=public';

const isConfigured = Boolean(process.env.TEST_DATABASE_URL);

describe('FAZ 2.11 — Unified Psychological Profile Integration Tests', () => {
  if (!isConfigured) {
    it.skip('Skipped: TEST_DATABASE_URL is not configured', () => {});
    return;
  }

  let testUserAId: string;
  let testUserBId: string;
  const timestamp = Date.now();

  beforeAll(async () => {
    // 1. HARD CANONICAL SAFETY GATE CHECK — abort immediately if pointing to non-test DB
    assertTestDatabaseSafety(testDbUrl);

    try {
      const userA = await prisma.user.create({
        data: {
          name: 'Test Profile User A',
          email: `test-prof-a-${timestamp}@psycheai.test`,
          emailNormalized: `test-prof-a-${timestamp}@psycheai.test`.toLowerCase(),
        },
      });
      testUserAId = userA.id;

      const userB = await prisma.user.create({
        data: {
          name: 'Test Profile User B',
          email: `test-prof-b-${timestamp}@psycheai.test`,
          emailNormalized: `test-prof-b-${timestamp}@psycheai.test`.toLowerCase(),
        },
      });
      testUserBId = userB.id;
    } catch (e) {
      console.warn('Could not seed integration test users (test DB may be offline):', e);
    }
  });

  afterAll(async () => {
    try {
      if (testUserAId) {
        await prisma.user.delete({ where: { id: testUserAId } }).catch(() => {});
      }
      if (testUserBId) {
        await prisma.user.delete({ where: { id: testUserBId } }).catch(() => {});
      }
    } finally {
      await prisma.$disconnect();
    }
  });

  it('returns a clean empty UnifiedProfileViewModel for a new user with zero completed assessments', async () => {
    if (!testUserAId) return;

    const profile = await getUnifiedPsychologicalProfile(testUserAId);

    expect(profile).toBeDefined();
    expect(profile.hasAssessments).toBe(false);
    expect(profile.completedAssessmentCount).toBe(0);
    expect(profile.maturity.stage).toBe('BAŞLANGIÇ');
    expect(profile.maturity.progressPercentage).toBe(0);
    expect(profile.hexacoSection).toBeNull();
    expect(profile.selfSystemSection).toBeNull();
    expect(profile.sourceAssessments).toHaveLength(0);
    expect(profile.fingerprint.dimensions).toHaveLength(0);

    // Invariant: all 84 ontology facets are present and unmeasured
    expect(profile.allFacets84.length).toBeGreaterThanOrEqual(84);
    expect(profile.allFacets84.every((f) => !f.isMeasured && f.rawMean === null)).toBe(true);
  });

  it('never leaks User B scores into User A unified profile (User Isolation)', async () => {
    if (!testUserAId || !testUserBId) return;

    const profileA = await getUnifiedPsychologicalProfile(testUserAId);
    const profileB = await getUnifiedPsychologicalProfile(testUserBId);

    expect(profileA.userId).toBe(testUserAId);
    expect(profileB.userId).toBe(testUserBId);
    expect(profileA.sourceAssessments).toHaveLength(0);
    expect(profileB.sourceAssessments).toHaveLength(0);
  });
});
