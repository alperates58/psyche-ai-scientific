import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getOrCreateAssessmentSession } from '@/services/assessmentService';
import { recordResponse } from '@/services/responseService';
import { finalizeAssessmentAndCreateSnapshot, getLatestProfileSnapshotForUser } from '@/services/profileService';

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);
if (!hasTestDb) {
  console.warn('SKIPPED: TEST_DATABASE_URL_NOT_CONFIGURED - Database integration tests skipped because TEST_DATABASE_URL is unset');
}

describe.skipIf(!hasTestDb)('End-to-End Demo Assessment Flow', () => {
  it('runs complete Alex Mercer assessment and generates verified pre-calibration snapshot', async () => {
    const user = await getCurrentUser();
    expect(user.name).toBe('Alex Mercer');
    expect(user.isDemoUser).toBe(true);

    const session = await getOrCreateAssessmentSession(user.id, 'MODULE_1_CORE_PERSONALITY');
    expect(session.status).toBe('IN_PROGRESS');

    const items = session.formVersion.items;
    expect(items.length).toBe(17);

    // Answer each item with deliberate timings (> 1200ms)
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const isAttn = item.itemVersion.item.isAttentionCheck;
      // Attention check expects 4 ("Katılıyorum")
      const targetValue = isAttn ? 4 : ((i % 3) + 3);
      const opt = item.itemVersion.options.find((o: any) => o.value === targetValue)!;

      const res = await recordResponse({
        userId: user.id,
        sessionId: session.id,
        formItemId: item.id,
        selectedOptionVersionId: opt.id,
        rawValue: targetValue,
        durationMs: 2200 + (i * 100),
        focusLostCount: 0
      });

      expect(res.recordId).toBeDefined();
    }

    // Finalize
    const snapshot = await finalizeAssessmentAndCreateSnapshot(session.id, user.id);
    expect(snapshot).toBeDefined();
    expect(snapshot?.overallIntegrity).toBe('EXCELLENT');
    expect(snapshot?.normStatus).toBe('UNAVAILABLE');
    expect(snapshot?.standardError).toBeNull();
    expect(snapshot?.ci95Lower).toBeNull();
    expect(snapshot?.ci95Upper).toBeNull();
    expect(snapshot?.provisionalComposite).toBeGreaterThan(0);
    expect(snapshot?.domainScores.length).toBeGreaterThan(0);
    expect(snapshot?.constructScores.length).toBeGreaterThan(0);
    expect(snapshot?.facetScores.length).toBe(16); // 16 non-attention facets

    // Check latest profile snapshot
    const latest = await getLatestProfileSnapshotForUser(user.id);
    expect(latest?.id).toBe(snapshot?.id);
  });
});
