import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { getOrCreateAssessmentSession } from '@/services/assessmentService';
import { recordResponse } from '@/services/responseService';
import { evaluateSessionIntegrity } from '@/services/integrityService';

const hasDb = Boolean(process.env.DATABASE_URL || process.env.TEST_DATABASE_URL);
if (!hasDb) {
  console.warn('SKIPPED: TEST_DATABASE_URL_NOT_CONFIGURED - Database integration tests skipped because DATABASE_URL is unset');
}

describe.skipIf(!hasDb)('Response Integrity & Telemetry Engine', () => {
  let testUser: any;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        name: 'Test Integrity Subject',
        email: `integrity_test_${Date.now()}@psycheai.test`,
        isDemoUser: false
      }
    });
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
  });

  it('detects speed violations when client duration is below 1200ms', async () => {
    const session = await getOrCreateAssessmentSession(testUser.id, 'MODULE_1_CORE_PERSONALITY');
    const items = session.formVersion.items;

    // Record fast responses (< 1200ms) for first 5 items
    for (let i = 0; i < 5; i++) {
      const item = items[i];
      const opt = item.itemVersion.options[0];
      await recordResponse({
        userId: testUser.id,
        sessionId: session.id,
        formItemId: item.id,
        selectedOptionVersionId: opt.id,
        rawValue: opt.value,
        durationMs: 650 // Speed violation (< 1200ms)
      });
    }

    const integrity = await evaluateSessionIntegrity(session.id);
    expect(integrity.speedViolations).toBe(5);
    expect(integrity.medianDurationMs).toBe(650);
  });

  it('detects straightlining when consecutive answers form an excessive streak', async () => {
    // Create new session for straightlining test
    const session = await prisma.assessmentSession.create({
      data: {
        userId: testUser.id,
        formVersionId: (await prisma.assessmentFormVersion.findFirst())!.id,
        status: 'IN_PROGRESS'
      }
    });

    const items = await prisma.assessmentFormItem.findMany({
      where: { formVersionId: session.formVersionId },
      orderBy: { sortOrder: 'asc' },
      include: { itemVersion: { include: { options: true } } }
    });

    // Answer 9 items in a row with the exact same option (value = 3)
    for (let i = 0; i < 9; i++) {
      const item = items[i];
      const opt3 = item.itemVersion.options.find((o: any) => o.value === 3)!;
      await recordResponse({
        userId: testUser.id,
        sessionId: session.id,
        formItemId: item.id,
        selectedOptionVersionId: opt3.id,
        rawValue: 3,
        durationMs: 3200
      });
    }

    const integrity = await evaluateSessionIntegrity(session.id);
    expect(integrity.longestStreak).toBe(9);
    expect(integrity.straightliningDetected).toBe(true);
    expect(['QUESTIONABLE', 'COMPROMISED']).toContain(integrity.overallFlag);
  });

  it('flags QUESTIONABLE (review suggested) but NOT COMPROMISED when attention check fails alone', async () => {
    const session = await prisma.assessmentSession.create({
      data: {
        userId: testUser.id,
        formVersionId: (await prisma.assessmentFormVersion.findFirst())!.id,
        status: 'IN_PROGRESS'
      }
    });

    const items = await prisma.assessmentFormItem.findMany({
      where: { formVersionId: session.formVersionId },
      include: { itemVersion: { include: { item: true, options: true } } }
    });

    const attentionItem = items.find((it: any) => it.itemVersion.item.isAttentionCheck);
    expect(attentionItem).toBeDefined();

    // Answer incorrectly (select 1 instead of expected 4) with healthy duration (4000ms)
    const opt1 = attentionItem!.itemVersion.options.find((o: any) => o.value === 1)!;
    await recordResponse({
      userId: testUser.id,
      sessionId: session.id,
      formItemId: attentionItem!.id,
      selectedOptionVersionId: opt1.id,
      rawValue: 1,
      durationMs: 4000
    });

    const integrity = await evaluateSessionIntegrity(session.id);
    expect(integrity.attentionCheckPassed).toBe(false);
    // Single failure must flag for review (QUESTIONABLE), NOT automatically COMPROMISED
    expect(integrity.overallFlag).toBe('QUESTIONABLE');
    expect(integrity.overallFlag).not.toBe('COMPROMISED');
  });
});
