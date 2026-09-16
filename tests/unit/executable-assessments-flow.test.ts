import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import {
  getOrCreateAssessmentSession,
  pauseAssessmentSession,
  restartAssessmentSession,
} from '@/services/assessmentService';
import { recordResponse } from '@/services/responseService';
import { finalizeAssessmentAndCreateSnapshot } from '@/services/profileService';
import { getUserAssessmentJourney } from '@/services/assessmentJourneyService';

const ALL_EXECUTABLE_MODULE_CODES = [
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
  'mod_flourishing_vitality',
  'mod_coping_resilience',
  'mod_creativity_growth',
  'mod_dark_tetrad_advanced',
];

describe('FAZ 2.16.1 Executable Assessment Lifecycle & User Journey Verification (PsycheAI Native Battery)', () => {
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
    it('correctly classifies all 16 modules as playable and ready in user journey', async () => {
      const journey = await getUserAssessmentJourney(testUserId);
      expect(journey.allAssessments.length).toBe(16);

      for (const item of journey.allAssessments) {
        expect(item.isPlayable).toBe(true);
        expect(item.status).toBe('NOT_STARTED');
        expect(item.contentAvailability).toBe('READY');
        expect(item.itemCount).toBeGreaterThan(0);
      }
    });

    it('successfully initializes sessions for all 16 native modules', async () => {
      for (const moduleCode of ALL_EXECUTABLE_MODULE_CODES) {
        const session = await getOrCreateAssessmentSession(testUserId, moduleCode);
        expect(session).toBeDefined();
        expect(session.formVersion.items.length).toBeGreaterThan(0);
      }
    });
  });

  describe('2. Full Assessment Execution Flow for Verified Native Battery Module', () => {
    it('successfully completes start -> render -> respond -> pause -> resume -> finalize for mod_core_hexaco_60', async () => {
      // Step A: Start session
      const session = await getOrCreateAssessmentSession(testUserId, 'mod_core_hexaco_60');
      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.status).toBe('IN_PROGRESS');
      expect(session.formVersion).toBeDefined();

      const items = session.formVersion.items;
      expect(items.length).toBe(124);

      // Step B: Verify first item rendering
      const firstItem = items[0];
      expect(firstItem.itemVersion.promptTr).toBeTruthy();
      expect(firstItem.itemVersion.options.length).toBe(5);

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
      const resumed = await getOrCreateAssessmentSession(testUserId, 'mod_core_hexaco_60');
      expect(resumed.id).toBe(session.id);
      expect(resumed.status).toBe('IN_PROGRESS');

      // Step F: Complete all remaining responses
      for (let i = 1; i < items.length; i++) {
        const item = items[i];
        const opt = item.itemVersion.options[2];
        await recordResponse({
          userId: testUserId,
          sessionId: session.id,
          formItemId: item.id,
          selectedOptionVersionId: opt.id,
          rawValue: opt.value,
          durationMs: 800,
          focusLostCount: 0,
        });
      }

      // Step G: Finalize Assessment and create deterministic Profile Snapshot
      const snapshot = await finalizeAssessmentAndCreateSnapshot(session.id, testUserId);
      expect(snapshot).toBeDefined();
      expect(snapshot.id).toBeDefined();
      expect(snapshot.facetScores.length).toBe(24);
      expect(snapshot.domainScores.length).toBeGreaterThan(0);

      // Verify session status transitioned to COMPLETED
      const completedSessionInDb = await prisma.assessmentSession.findUnique({
        where: { id: session.id },
      });
      expect(completedSessionInDb?.status).toBe('COMPLETED');
      expect(completedSessionInDb?.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('3. User Journey State Transition after Assessment Completion', () => {
    it('reflects completed assessment in user journey with updated progress metrics', async () => {
      const journey = await getUserAssessmentJourney(testUserId);
      expect(journey.completedAssessmentsCount).toBe(1);

      const hexacoModule = journey.allAssessments.find((a) => a.assessmentId === 'mod_core_hexaco_60');
      expect(hexacoModule).toBeDefined();
      expect(hexacoModule?.status).toBe('COMPLETED');
      expect(hexacoModule?.progressPercentage).toBe(100);
      expect(hexacoModule?.completedSessionId).toBeTruthy();
    });
  });

  describe('4. Assessment Retake and Reset Lifecycle', () => {
    it('allows retaking a completed assessment by creating a fresh in-progress session', async () => {
      // Step A: Request a retake (forceNew: true)
      const retakeSession = await getOrCreateAssessmentSession(testUserId, 'mod_core_hexaco_60', { forceNew: true });
      expect(retakeSession).toBeDefined();
      expect(retakeSession.status).toBe('IN_PROGRESS');
      expect(retakeSession.currentStep).toBe(1);
      expect(retakeSession.responses.length).toBe(0);

      // Step B: User journey shows in-progress retake while keeping completedSessionId
      const journey = await getUserAssessmentJourney(testUserId);
      const hexaco = journey.allAssessments.find((a) => a.assessmentId === 'mod_core_hexaco_60');
      expect(hexaco?.status).toBe('IN_PROGRESS');
      expect(hexaco?.activeSessionId).toBe(retakeSession.id);
      expect(hexaco?.completedSessionId).toBeTruthy();

      // Step C: Answering some questions and restarting in the middle of test
      const item = retakeSession.formVersion.items[0];
      await recordResponse({
        userId: testUserId,
        sessionId: retakeSession.id,
        formItemId: item.id,
        selectedOptionVersionId: item.itemVersion.options[1].id,
        rawValue: item.itemVersion.options[1].value,
        durationMs: 900,
        focusLostCount: 0,
      });

      const restarted = await restartAssessmentSession(retakeSession.id, testUserId);
      expect(restarted.id).not.toBe(retakeSession.id);
      expect(restarted.status).toBe('IN_PROGRESS');
      expect(restarted.currentStep).toBe(1);
      expect(restarted.responses.length).toBe(0);

      // Check that previous session was marked ABANDONED
      const oldSession = await prisma.assessmentSession.findUnique({
        where: { id: retakeSession.id },
      });
      expect(oldSession?.status).toBe('ABANDONED');
    });
  });
});
