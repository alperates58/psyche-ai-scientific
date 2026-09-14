import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { getOrCreateAssessmentSession } from '@/services/assessmentService';
import { recordResponse } from '@/services/responseService';
import { calculatePreCalibrationScores } from '@/services/scoringService';
import { finalizeAssessmentAndCreateSnapshot } from '@/services/profileService';

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);
if (!hasTestDb) {
  console.warn('SKIPPED: TEST_DATABASE_URL_NOT_CONFIGURED - Database integration tests skipped because TEST_DATABASE_URL is unset');
}

describe.skipIf(!hasTestDb)('Pre-Calibration Scoring & Scientific Guardrails', () => {
  let testUser: any;
  let session: any;

  beforeAll(async () => {
    // Create dedicated test user
    testUser = await prisma.user.create({
      data: {
        name: 'Test Scoring Researcher',
        email: `scoring_test_${Date.now()}@psycheai.test`,
        isDemoUser: false
      }
    });

    session = await getOrCreateAssessmentSession(testUser.id, 'MODULE_1_CORE_PERSONALITY');
  });

  afterAll(async () => {
    // Cleanup
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
  });

  it('calculates scored values correctly with positive and reverse keying', async () => {
    const items = session.formVersion.items;
    // Find one keyed and one reverse-keyed item
    const keyedItem = items.find((it: any) => it.itemVersion.item.isKeyed && !it.itemVersion.item.isAttentionCheck);
    const reverseItem = items.find((it: any) => !it.itemVersion.item.isKeyed && !it.itemVersion.item.isAttentionCheck);

    expect(keyedItem).toBeDefined();
    expect(reverseItem).toBeDefined();

    const keyedOpt5 = keyedItem.itemVersion.options.find((o: any) => o.value === 5);
    const reverseOpt5 = reverseItem.itemVersion.options.find((o: any) => o.value === 5);

    // Record raw value 5 on both
    const respKeyed = await recordResponse({
      userId: testUser.id,
      sessionId: session.id,
      formItemId: keyedItem.id,
      selectedOptionVersionId: keyedOpt5.id,
      rawValue: 5,
      durationMs: 3000
    });

    const respReverse = await recordResponse({
      userId: testUser.id,
      sessionId: session.id,
      formItemId: reverseItem.id,
      selectedOptionVersionId: reverseOpt5.id,
      rawValue: 5,
      durationMs: 3500
    });

    // Keyed item with raw 5 must have scoredValue = 5
    expect(respKeyed.scoredValue).toBe(5);
    // Reverse-keyed item with raw 5 must have scoredValue = 6 - 5 = 1
    expect(respReverse.scoredValue).toBe(1);
  });

  it('strictly ensures pre-calibration nulls: standardError, ci95, and normVersionId are null', async () => {
    const scores = await calculatePreCalibrationScores(session.id);

    expect(scores.normStatus).toBe('UNAVAILABLE');
    expect(scores.standardError).toBeNull();
    expect(scores.ci95Lower).toBeNull();
    expect(scores.ci95Upper).toBeNull();

    for (const fs of scores.facetScores) {
      expect(fs.standardError).toBeNull();
      expect(fs.ci95Lower).toBeNull();
      expect(fs.ci95Upper).toBeNull();
      expect(fs.normVersionId).toBeNull();
    }

    for (const cs of scores.constructScores) {
      expect(cs.standardError).toBeNull();
      expect(cs.ci95Lower).toBeNull();
      expect(cs.ci95Upper).toBeNull();
      expect(cs.normVersionId).toBeNull();
    }

    for (const ds of scores.domainScores) {
      expect(ds.standardError).toBeNull();
      expect(ds.ci95Lower).toBeNull();
      expect(ds.ci95Upper).toBeNull();
      expect(ds.normVersionId).toBeNull();
    }
  });

  it('finalizes snapshot and maintains pre-calibration nulls in database record', async () => {
    const snapshot = await finalizeAssessmentAndCreateSnapshot(session.id, testUser.id);

    expect(snapshot).toBeDefined();
    expect(snapshot?.normStatus).toBe('UNAVAILABLE');
    expect(snapshot?.standardError).toBeNull();
    expect(snapshot?.ci95Lower).toBeNull();
    expect(snapshot?.ci95Upper).toBeNull();
    expect(snapshot?.provisionalComposite).toBeGreaterThan(0);
  });
});
