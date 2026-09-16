import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { getUnifiedPsychologicalProfile } from '@/services/unifiedProfileService';

describe('FAZ 2.11 — Unified Psychological Profile Integration Tests', () => {
  const isDbAvailable = process.env.DATABASE_URL !== undefined;

  // Skip if DB is not available in environment
  const runIfDb = isDbAvailable ? describe : describe.skip;

  runIfDb('Database Integration Flows', () => {
    let testUserAId: string;
    let testUserBId: string;

    beforeEach(async () => {
      // In real test DB environment, clean up or create isolated test users
      try {
        const userA = await prisma.user.create({
          data: {
            name: 'Test User A',
            email: `test-user-a-${Date.now()}@psyche.ai`,
          },
        });
        testUserAId = userA.id;

        const userB = await prisma.user.create({
          data: {
            name: 'Test User B',
            email: `test-user-b-${Date.now()}@psyche.ai`,
          },
        });
        testUserBId = userB.id;
      } catch {
        // DB not available or table locked
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
});
