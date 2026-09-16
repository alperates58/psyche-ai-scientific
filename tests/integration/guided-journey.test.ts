import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { assertTestDatabaseSafety } from '../../scripts/verify-test-db-safety';
import { getUserAssessmentJourney } from '../../src/services/assessmentJourneyService';
import {
  getOrCreateAssessmentSession,
  getSessionWithDetails,
} from '../../src/services/assessmentService';
import { recordResponse } from '../../src/services/responseService';
import { finalizeAssessmentAndCreateSnapshot } from '../../src/services/profileService';

describe('FAZ 2.8: Guided Onboarding & Assessment Journey Integration Tests', () => {
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

  it('new user starts with ONBOARDING_NOT_STARTED and points to first required assessment', async () => {
    const testUser = await prisma.user.create({
      data: {
        email: `journey_test_${Date.now()}@example.com`,
        emailNormalized: `journey_test_${Date.now()}@example.com`,
        name: 'Yeni Yolculuk Kullanıcısı',
      },
    });

    const journey = await getUserAssessmentJourney(testUser.id);
    expect(journey.currentStage).toBe('ONBOARDING_NOT_STARTED');
    expect(journey.coreProfileReady).toBe(false);
    expect(journey.completedAssessmentsCount).toBe(0);
    expect(journey.nextAction).not.toBeNull();
    expect(journey.nextAction!.ctaText).toBe('Değerlendirmeye Başla');
    expect(journey.nextAction!.status).toBe('NOT_STARTED');
  });

  it('starting an assessment changes state to ONBOARDING_IN_PROGRESS and resumes idempotently', async () => {
    const testUser = await prisma.user.create({
      data: {
        email: `journey_inprog_${Date.now()}@example.com`,
        emailNormalized: `journey_inprog_${Date.now()}@example.com`,
        name: 'Devam Eden Kullanıcı',
      },
    });

    // Start session
    const session1 = await getOrCreateAssessmentSession(testUser.id, 'MODULE_1_CORE_PERSONALITY');
    expect(session1.status).toBe('IN_PROGRESS');

    // Calling again returns same session (idempotent, no duplicates)
    const session2 = await getOrCreateAssessmentSession(testUser.id, 'MODULE_1_CORE_PERSONALITY');
    expect(session2.id).toBe(session1.id);

    const journey = await getUserAssessmentJourney(testUser.id);
    expect(journey.currentStage).toBe('ONBOARDING_IN_PROGRESS');
    expect(journey.nextAction).not.toBeNull();
    expect(journey.nextAction!.status).toBe('IN_PROGRESS');
    expect(journey.nextAction!.ctaText).toBe('Kaldığın Yerden Devam Et');
  });

  it('completing required assessment transitions journey to CORE_PROFILE_READY', async () => {
    const testUser = await prisma.user.create({
      data: {
        email: `journey_complete_${Date.now()}@example.com`,
        emailNormalized: `journey_complete_${Date.now()}@example.com`,
        name: 'Tamamlayan Kullanıcı',
      },
    });

    const session = await getOrCreateAssessmentSession(testUser.id, 'MODULE_1_CORE_PERSONALITY');
    const items = session.formVersion.items;
    expect(items.length).toBeGreaterThan(0);

    // Answer all items
    for (const item of items) {
      const opt = item.itemVersion.options[0];
      await recordResponse({
        userId: testUser.id,
        sessionId: session.id,
        formItemId: item.id,
        selectedOptionVersionId: opt.id,
        rawValue: opt.value,
        durationMs: 1500,
        focusLostCount: 0,
      });
    }

    // Finalize assessment
    const snapshot = await finalizeAssessmentAndCreateSnapshot(session.id, testUser.id);
    expect(snapshot).toBeDefined();

    // Check journey state
    const journey = await getUserAssessmentJourney(testUser.id);
    expect(journey.coreProfileReady).toBe(true);
    expect(journey.completedAssessmentsCount).toBeGreaterThanOrEqual(1);
    expect(journey.milestoneMessage).toBeDefined();
  });

  it('enforces ownership: cannot access another user session', async () => {
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

    await expect(getSessionWithDetails(sessionA.id, userB.id)).rejects.toThrow(
      /Yetkisiz oturum erişimi/
    );
  });
});
