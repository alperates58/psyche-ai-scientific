import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { assertTestDatabaseSafety } from '../../scripts/verify-test-db-safety';
import { getAssessmentResultView } from '../../src/services/assessmentResultService';
import { getOrCreateAssessmentSession } from '../../src/services/assessmentService';
import { recordResponse } from '../../src/services/responseService';
import { finalizeAssessmentAndCreateSnapshot } from '../../src/services/profileService';

describe('FAZ 2.9: Detailed Assessment Results Experience Integration Tests', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    assertTestDatabaseSafety();
    prisma = new PrismaClient({
      datasources: {
        db: {
          url:
            process.env.TEST_DATABASE_URL ||
            'postgresql://postgres:postgres@localhost:5434/psyche_ai_test?schema=public',
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('rejects access when user is not the owner of the assessment session (IDOR security)', async () => {
    const userA = await prisma.user.create({
      data: {
        email: `user_a_${Date.now()}@example.com`,
        emailNormalized: `user_a_${Date.now()}@example.com`,
        name: 'Kullanıcı A',
      },
    });

    const userB = await prisma.user.create({
      data: {
        email: `user_b_${Date.now()}@example.com`,
        emailNormalized: `user_b_${Date.now()}@example.com`,
        name: 'Kullanıcı B',
      },
    });

    const sessionA = await getOrCreateAssessmentSession(userA.id, 'MODULE_1_CORE_PERSONALITY');

    // User B tries to view User A's session result
    await expect(getAssessmentResultView(userB.id, sessionA.id)).rejects.toThrow(
      'yetkiniz bulunmamaktadır'
    );
  });

  it('rejects result viewing when assessment session is still IN_PROGRESS', async () => {
    const testUser = await prisma.user.create({
      data: {
        email: `user_inprog_${Date.now()}@example.com`,
        emailNormalized: `user_inprog_${Date.now()}@example.com`,
        name: 'Devam Eden Kullanıcı',
      },
    });

    const session = await getOrCreateAssessmentSession(testUser.id, 'MODULE_1_CORE_PERSONALITY');

    await expect(getAssessmentResultView(testUser.id, session.id)).rejects.toThrow(
      'tamamlanmamış'
    );
  });

  it('correctly builds comprehensive view-model for completed session with frozen provenance', async () => {
    const testUser = await prisma.user.create({
      data: {
        email: `user_result_full_${Date.now()}@example.com`,
        emailNormalized: `user_result_full_${Date.now()}@example.com`,
        name: 'Tamamlayan Kullanıcı',
      },
    });

    const session = await getOrCreateAssessmentSession(testUser.id, 'MODULE_1_CORE_PERSONALITY');
    const items = session.formVersion.items;
    expect(items.length).toBeGreaterThan(0);

    // Answer all items with Likert value 4 or 5
    for (const item of items) {
      const opt = item.itemVersion.options[0];
      await recordResponse({
        userId: testUser.id,
        sessionId: session.id,
        formItemId: item.id,
        selectedOptionVersionId: opt.id,
        rawValue: opt.value,
        durationMs: 2500,
        focusLostCount: 0,
      });
    }

    // Finalize session
    await finalizeAssessmentAndCreateSnapshot(session.id, testUser.id);

    // Query result view model
    const result = await getAssessmentResultView(testUser.id, session.id);

    expect(result.sessionId).toBe(session.id);
    expect(result.userId).toBe(testUser.id);
    expect(result.isCompleted).toBe(true);
    expect(result.visualType).toBe('HEXACO_RADAR');
    expect(result.formVersion.versionCode).toBe(session.formVersion.versionCode);
    expect(result.snapshot.normStatus).toBe('UNAVAILABLE');
    expect(result.snapshot.scoringModelCode).toBe('PRE_CALIBRATION_MEAN_V1');
    expect(result.compositeScore).toBeGreaterThan(0);
    expect(result.keyObservations.length).toBeGreaterThanOrEqual(1);
    expect(result.constructs.length).toBeGreaterThan(0);
    expect(result.integrity.isClean).toBe(true);
    expect(result.radarData.length).toBe(result.constructs.length);
    expect(result.unmeasuredDomains.length).toBeGreaterThan(0);
  });
});
