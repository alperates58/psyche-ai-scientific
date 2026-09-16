import { describe, it, expect } from 'vitest';
import { runNativeBatteryRuntimeAudit } from '../../scripts/audit-native-battery-runtime';
import { getUserAssessmentJourney } from '../../src/services/assessmentJourneyService';
import { getOrCreateAssessmentSession, pauseAssessmentSession, getSessionWithDetails } from '../../src/services/assessmentService';
import { calculatePreCalibrationScores } from '../../src/services/scoringService';
import { prisma } from '../../src/lib/prisma';
import fs from 'fs';
import path from 'path';

describe('FAZ 2.16.1 — PsycheAI Native Research Battery Live Runtime Suite', () => {
  it('should pass complete runtime integration audit for all 16 modules', async () => {
    const audit = await runNativeBatteryRuntimeAudit();
    expect(audit.success).toBe(true);
    expect(audit.errors).toHaveLength(0);
    expect(audit.results).toHaveLength(16);

    // Verify all 16 modules passed individually
    for (const res of audit.results) {
      expect(res.status).toBe('PASS');
      expect(res.dbFormItems).toBeGreaterThan(0);
      expect(res.dbFormItems).toBe(res.expectedQuestions);
      expect(res.optionsCount).toBe(5);
      expect(res.canCreateSession).toBe(true);
      expect(res.canAnswer).toBe(true);
      expect(res.pauseResumeOk).toBe(true);
      expect(res.deterministicScoresCreated).toBe(true);
      expect(res.responseQualityExcluded).toBe(true);
    }
  }, 60000);

  it('should verify mod_volition_impulse has 43 executable questions and never renders Soru 1 / 0', async () => {
    const testUserId = `test_volition_${Date.now()}`;
    await prisma.user.create({
      data: { id: testUserId, email: `${testUserId}@test.local`, name: 'Volition Test' }
    });

    try {
      const session = await getOrCreateAssessmentSession(testUserId, 'mod_volition_impulse');
      expect(session).toBeDefined();
      expect(session.formVersion.items.length).toBe(43);
      expect(session.formVersion.items.length).toBeGreaterThan(0);

      // Verify first question renders properly
      const firstItem = session.formVersion.items[0];
      expect(firstItem.itemVersion.promptTr).toBeDefined();
      expect(firstItem.itemVersion.promptTr.trim().length).toBeGreaterThan(0);
      expect(firstItem.itemVersion.options).toHaveLength(5);

      // Verify pause and resume
      await pauseAssessmentSession(session.id, testUserId, 5);
      const resumed = await getSessionWithDetails(session.id, testUserId);
      expect(resumed.status).toBe('PAUSED');
      expect(resumed.currentStep).toBe(5);
    } finally {
      await prisma.responseRecord.deleteMany({ where: { session: { userId: testUserId } } });
      await prisma.assessmentSession.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } });
    }
  });

  it('should dynamically calculate active question counts in user journey catalog without legacy placeholders', async () => {
    const testUserId = `test_journey_${Date.now()}`;
    await prisma.user.create({
      data: { id: testUserId, email: `${testUserId}@test.local`, name: 'Journey Test' }
    });

    try {
      const journey = await getUserAssessmentJourney(testUserId);
      expect(journey.allAssessments).toHaveLength(16);

      // Verify each assessment item has real count and is playable
      for (const item of journey.allAssessments) {
        expect(item.isPlayable).toBe(true);
        expect(item.contentAvailability).toBe('READY');
        expect(item.itemCount).toBeGreaterThan(0);
        expect(item.startOrResumeUrl).toContain('/assessment?module=');
      }

      // Check specific module counts
      const hexaco = journey.allAssessments.find(a => a.assessmentId === 'mod_core_hexaco_60');
      expect(hexaco?.itemCount).toBe(124);

      const volition = journey.allAssessments.find(a => a.assessmentId === 'mod_volition_impulse');
      expect(volition?.itemCount).toBe(43);

      const agency = journey.allAssessments.find(a => a.assessmentId === 'mod_self_agency');
      expect(agency?.itemCount).toBe(22);
    } finally {
      await prisma.user.delete({ where: { id: testUserId } });
    }
  });
});
