import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { getOrCreateAssessmentSession, pauseAssessmentSession } from '@/services/assessmentService';
import { recordResponse } from '@/services/responseService';
import { finalizeAssessmentAndCreateSnapshot } from '@/services/profileService';
import { getUserAssessmentJourney } from '@/services/assessmentJourneyService';

const EXECUTABLE_MODULE_CODES = [
  'mod_core_hexaco_60',
  'mod_self_agency',
  'mod_emotion_regulation',
  'mod_cognitive_epistemic',
  'mod_volition_impulse',
  'mod_basic_needs_sdt',
  'mod_universal_values',
  'mod_relational_attachment_empathy',
  'mod_cognitive_adaptability',
  'mod_meaning_compassion_grit',
  'mod_conflict_boundaries',
  'mod_affective_distress',
  'mod_dark_tetrad_advanced',
];

const CONTENT_PENDING_MODULE_CODES = [
  'mod_flourishing_vitality',
  'mod_coping_resilience',
  'mod_creativity_growth',
];

describe('FAZ 2.16 Executable Assessment Lifecycle & User Journey Verification', () => {
  let testUserId: string;

  beforeAll(async () => {
    // Create isolated test user
    const testUser = await prisma.user.create({
      data: {
        email: `test_journey_${Date.now()}@psyche.test`,
        name: 'Test Journey Runner',
        status: 'ACTIVE',
      },
    });
    testUserId = testUser.id;
  });

  afterAll(async () => {
    // Cleanup test data
    if (testUserId) {
      await prisma.responseTelemetry.deleteMany({ where: { session: { userId: testUserId } } });
      await prisma.responseRevision.deleteMany({ where: { responseRecord: { session: { userId: testUserId } } } });
      await prisma.responseRecord.deleteMany({ where: { session: { userId: testUserId } } });
      await prisma.profileSnapshotSession.deleteMany({ where: { profileSnapshot: { userId: testUserId } } });
      await prisma.facetScore.deleteMany({ where: { profileSnapshot: { userId: testUserId } } });
      await prisma.constructScore.deleteMany({ where: { profileSnapshot: { userId: testUserId } } });
      await prisma.domainScore.deleteMany({ where: { profileSnapshot: { userId: testUserId } } });
      await prisma.profileSnapshot.deleteMany({ where: { userId: testUserId } });
      await prisma.assessmentSession.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } });
    }
  });

  describe('1. Content Availability and Catalog State Integrity', () => {
    it('correctly classifies executable vs content-pending modules in user journey', async () => {
      const journey = await getUserAssessmentJourney(testUserId);
      expect(journey.allAssessments.length).toBe(16);

      for (const item of journey.allAssessments) {
        if (EXECUTABLE_MODULE_CODES.includes(item.moduleCode) || EXECUTABLE_MODULE_CODES.includes(item.assessmentId)) {
          expect(item.isPlayable).toBe(true);
          expect(item.status).toBe('NOT_STARTED');
          expect(item.itemCount).toBeGreaterThan(0);
        } else if (CONTENT_PENDING_MODULE_CODES.includes(item.assessmentId)) {
          expect(item.isPlayable).toBe(false);
          expect(item.status).toBe('CONTENT_PENDING');
        }
      }
    });

    it('rejects session initialization on content-pending modules gracefully without crashing', async () => {
      for (const pendingCode of CONTENT_PENDING_MODULE_CODES) {
        await expect(getOrCreateAssessmentSession(testUserId, pendingCode)).rejects.toThrow(
          /Bu değerlendirme modülünün içerik formu henüz hazırlanma aşamasındadır/
        );
      }
    });
  });

  describe('2. Full Assessment Execution Flow for Every Playable Module', () => {
    for (const moduleCode of EXECUTABLE_MODULE_CODES) {
      it(`successfully completes start -> render -> respond -> pause -> resume -> finalize for ${moduleCode}`, async () => {
        // Step A: Start session
        const session = await getOrCreateAssessmentSession(testUserId, moduleCode);
        expect(session).toBeDefined();
        expect(session.id).toBeDefined();
        expect(session.status).toBe('IN_PROGRESS');
        expect(session.formVersion).toBeDefined();

        const items = session.formVersion.items;
        expect(items.length).toBeGreaterThan(0);

        // Step B: Verify first item rendering
        const firstItem = items[0];
        expect(firstItem.itemVersion.promptTr).toBeTruthy();
        expect(firstItem.itemVersion.options.length).toBeGreaterThanOrEqual(2);

        // Step C: Record first response
        const option = firstItem.itemVersion.options[0];
        const res1 = await recordResponse({
          userId: testUserId,
          sessionId: session.id,
          formItemId: firstItem.id,
          selectedOptionVersionId: option.id,
          rawValue: option.value,
          durationMs: 1200,
          focusLostCount: 0,
        });
        expect(res1).toBeDefined();
        expect(res1.recordId).toBeDefined();

        // Step D: Pause session
        const paused = await pauseAssessmentSession(session.id, testUserId, 2);
        expect(paused.status).toBe('PAUSED');
        expect(paused.currentStep).toBe(2);

        // Step E: Resume session
        const resumed = await getOrCreateAssessmentSession(testUserId, moduleCode);
        expect(resumed.id).toBe(session.id);
        expect(resumed.status).toBe('IN_PROGRESS');
        expect(resumed.responses.length).toBe(1);

        // Step F: Answer all remaining items
        for (let i = 1; i < items.length; i++) {
          const item = items[i];
          const opt = item.itemVersion.options[0];
          await recordResponse({
            userId: testUserId,
            sessionId: session.id,
            formItemId: item.id,
            selectedOptionVersionId: opt.id,
            rawValue: opt.value,
            durationMs: 900,
            focusLostCount: 0,
          });
        }

        // Step G: Finalize session and create profile snapshot
        const snapshot = await finalizeAssessmentAndCreateSnapshot(session.id, testUserId);
        expect(snapshot).toBeDefined();
        expect(snapshot.id).toBeDefined();

        // Step H: Verify session state and scores
        const finalSession = await prisma.assessmentSession.findUnique({
          where: { id: session.id },
        });
        expect(finalSession?.status).toBe('COMPLETED');
        expect(finalSession?.completedAt).toBeDefined();

        const facetScores = await prisma.facetScore.findMany({
          where: { profileSnapshotId: snapshot.id },
        });
        expect(facetScores.length).toBeGreaterThan(0);
      });
    }
  });
});
