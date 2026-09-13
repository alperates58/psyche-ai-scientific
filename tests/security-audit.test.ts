import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { getOrCreateAssessmentSession, getSessionWithDetails } from '@/services/assessmentService';
import { recordResponse } from '@/services/responseService';
import { finalizeAssessmentAndCreateSnapshot } from '@/services/profileService';
import { submitResponseAction } from '@/actions/assessment';

describe('Security, Audit Revision History & Double-Finalization Prevention', () => {
  let userA: any;
  let userB: any;

  beforeAll(async () => {
    userA = await prisma.user.create({
      data: {
        name: 'Audit Subject A',
        email: `audit_a_${Date.now()}@psycheai.test`,
        isDemoUser: false
      }
    });

    userB = await prisma.user.create({
      data: {
        name: 'Audit Subject B',
        email: `audit_b_${Date.now()}@psycheai.test`,
        isDemoUser: false
      }
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: { in: [userA?.id, userB?.id] } }
    }).catch(() => {});
  });

  it('preserves immutable revision history when an item response is revised', async () => {
    const session = await getOrCreateAssessmentSession(userA.id, 'MODULE_1_CORE_PERSONALITY');
    const formItem = session.formVersion.items[0];
    const opt2 = formItem.itemVersion.options.find((o: any) => o.value === 2)!;
    const opt4 = formItem.itemVersion.options.find((o: any) => o.value === 4)!;

    // 1st answer: value 2
    const firstResult = await recordResponse({
      userId: userA.id,
      sessionId: session.id,
      formItemId: formItem.id,
      selectedOptionVersionId: opt2.id,
      rawValue: 2,
      durationMs: 3000
    });
    expect(firstResult.sequence).toBe(1);
    expect(firstResult.isRevision).toBe(false);

    // 2nd answer (revision): change to value 4
    const secondResult = await recordResponse({
      userId: userA.id,
      sessionId: session.id,
      formItemId: formItem.id,
      selectedOptionVersionId: opt4.id,
      rawValue: 4,
      durationMs: 4500
    });
    expect(secondResult.sequence).toBe(2);
    expect(secondResult.isRevision).toBe(true);

    // Verify revisions in database
    const revisions = await prisma.responseRevision.findMany({
      where: { responseRecordId: secondResult.recordId },
      orderBy: { sequence: 'asc' }
    });

    expect(revisions.length).toBe(2);
    expect(revisions[0].sequence).toBe(1);
    expect(revisions[0].rawValue).toBe(2);
    expect(revisions[1].sequence).toBe(2);
    expect(revisions[1].rawValue).toBe(4);
  });

  it('rejects unauthorized access when user B tries to access user A session', async () => {
    const sessionA = await getOrCreateAssessmentSession(userA.id, 'MODULE_1_CORE_PERSONALITY');

    await expect(getSessionWithDetails(sessionA.id, userB.id)).rejects.toThrow(
      'Yetkisiz oturum erişimi'
    );
  });

  it('prevents double-finalization of an assessment session', async () => {
    const session = await getOrCreateAssessmentSession(userA.id, 'MODULE_1_CORE_PERSONALITY');
    const formItem = session.formVersion.items[0];
    const opt3 = formItem.itemVersion.options.find((o: any) => o.value === 3)!;

    await recordResponse({
      userId: userA.id,
      sessionId: session.id,
      formItemId: formItem.id,
      selectedOptionVersionId: opt3.id,
      rawValue: 3,
      durationMs: 2500
    });

    // First finalization must succeed
    const snapshot1 = await finalizeAssessmentAndCreateSnapshot(session.id, userA.id);
    expect(snapshot1).toBeDefined();

    // Second finalization attempt MUST fail
    await expect(
      finalizeAssessmentAndCreateSnapshot(session.id, userA.id)
    ).rejects.toThrow('Bu değerlendirme oturumu zaten tamamlanmış ve dondurulmuştur.');
  });

  it('strictly rejects client injection of scoredValue or standardError via Server Action', async () => {
    const invalidPayload: any = {
      sessionId: 'some-session-id',
      formItemId: 'some-item-id',
      selectedOptionVersionId: 'some-opt-id',
      rawValue: 4,
      durationMs: 2500,
      scoredValue: 999, // FORBIDDEN INJECTION
      standardError: 0.05 // FORBIDDEN INJECTION
    };

    const actionResult = await submitResponseAction(invalidPayload);
    expect(actionResult.success).toBe(false);
    expect(actionResult.error).toBeDefined();
  });
});
