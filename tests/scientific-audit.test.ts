import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { calculateReverseScore } from '@/psychometrics/scoring';
import {
  calculateProfileCoverage,
  classifyFacetMeasurementStage,
  TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH
} from '@/psychometrics/coverage';
import { INTEGRITY_CONFIG } from '@/config/integrity-config';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getOrCreateAssessmentSession } from '@/services/assessmentService';
import { recordResponse } from '@/services/responseService';
import { finalizeAssessmentAndCreateSnapshot, auditSnapshotProvenance } from '@/services/profileService';
import { evaluateSessionIntegrity } from '@/services/integrityService';

describe('FAZ 1.1 Scientific & Data Integrity Audit', () => {
  let auditUser: any;
  let session: any;
  let snapshotId: string;

  beforeAll(async () => {
    auditUser = await prisma.user.create({
      data: {
        name: 'Scientific Auditor',
        email: `audit_user_${Date.now()}@psycheai.test`,
        isDemoUser: false
      }
    });

    session = await getOrCreateAssessmentSession(auditUser.id, 'MODULE_1_CORE_PERSONALITY');

    // Answer all items to generate a snapshot for audit
    const items = session.formVersion.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const isAttn = item.itemVersion.item.isAttentionCheck;
      const targetValue = isAttn ? 4 : 4;
      const opt = item.itemVersion.options.find((o: any) => o.value === targetValue)!;

      await recordResponse({
        userId: auditUser.id,
        sessionId: session.id,
        formItemId: item.id,
        selectedOptionVersionId: opt.id,
        rawValue: targetValue,
        durationMs: 3000
      });
    }

    const snapshot = await finalizeAssessmentAndCreateSnapshot(session.id, auditUser.id);
    snapshotId = snapshot!.id;
  });

  afterAll(async () => {
    if (auditUser) {
      await prisma.user.delete({ where: { id: auditUser.id } }).catch(() => {});
    }
  });

  // 1. REVERSE SCORING TESTS
  it('correctly reverse-scores on a 1–6 Likert scale using (min + max) - rawValue', () => {
    // 1–6 scale: (1 + 6) - raw = 7 - raw
    expect(calculateReverseScore(1, 1, 6)).toBe(6);
    expect(calculateReverseScore(2, 1, 6)).toBe(5);
    expect(calculateReverseScore(3, 1, 6)).toBe(4);
    expect(calculateReverseScore(4, 1, 6)).toBe(3);
    expect(calculateReverseScore(5, 1, 6)).toBe(2);
    expect(calculateReverseScore(6, 1, 6)).toBe(1);
  });

  it('correctly reverse-scores on an arbitrary scale (e.g. 0–4)', () => {
    // 0–4 scale: (0 + 4) - raw = 4 - raw
    expect(calculateReverseScore(0, 0, 4)).toBe(4);
    expect(calculateReverseScore(1, 0, 4)).toBe(3);
    expect(calculateReverseScore(2, 0, 4)).toBe(2);
    expect(calculateReverseScore(3, 0, 4)).toBe(1);
    expect(calculateReverseScore(4, 0, 4)).toBe(0);
  });

  it('rejects out-of-range raw values when reverse-scoring', () => {
    expect(() => calculateReverseScore(7, 1, 6)).toThrow();
    expect(() => calculateReverseScore(0, 1, 6)).toThrow();
    expect(() => calculateReverseScore(-1, 0, 4)).toThrow();
  });

  // 2. ONTOLOGY DENOMINATOR TEST
  it('confirms ontology denominator is exactly 84 (source-of-truth) and never 65', async () => {
    const dbFacetCount = await prisma.facet.count();
    expect(dbFacetCount).toBe(84);
    expect(TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH).toBe(84);
    expect(dbFacetCount).not.toBe(65);
  });

  // 3. MEASUREMENT ADEQUACY TEST
  it('confirms 1 item does NOT mark a facet as sufficiently measured or high precision', () => {
    const stage = classifyFacetMeasurementStage(1, 3, 6);
    expect(stage).toBe('STARTED');
    expect(stage).not.toBe('SUFFICIENT_FOR_RESEARCH');
    expect(stage).not.toBe('PROVISIONALLY_COVERED');

    const coverage = calculateProfileCoverage({ sincerity: 1, fairness: 1 }, 84, 6);
    expect(coverage.exploredFacetsCount).toBe(2);
    expect(coverage.explorationPercentage).toBe(2); // 2/84 = ~2%
    expect(coverage.isPreliminaryStage).toBe(true);
    expect(coverage.facetsAdequacy.sincerity.isSufficientForLatentClaim).toBe(false);
  });

  // 4. ATTENTION CHECK IS NOT SOLE INVALIDATION
  it('confirms single attention check failure flags for review but does not invalidate alone', async () => {
    const tempSession = await prisma.assessmentSession.create({
      data: {
        userId: auditUser.id,
        formVersionId: session.formVersionId,
        status: 'IN_PROGRESS'
      }
    });

    const items = await prisma.assessmentFormItem.findMany({
      where: { formVersionId: session.formVersionId },
      include: { itemVersion: { include: { item: true, options: true } } }
    });

    const attn = items.find(i => i.itemVersion.item.isAttentionCheck)!;
    const wrongOpt = attn.itemVersion.options.find(o => o.value === 1)!;

    // Record wrong answer on attention check, but with good timing
    await recordResponse({
      userId: auditUser.id,
      sessionId: tempSession.id,
      formItemId: attn.id,
      selectedOptionVersionId: wrongOpt.id,
      rawValue: 1,
      durationMs: 3500
    });

    const integrity = await evaluateSessionIntegrity(tempSession.id);
    expect(integrity.attentionCheckPassed).toBe(false);
    expect(integrity.overallFlag).toBe('QUESTIONABLE');
    expect(integrity.overallFlag).not.toBe('COMPROMISED');
  });

  // 5. PRE-CALIBRATION GUARDRAIL: NO LATENT ESTIMATE / NO POPULATION PERSENTILES
  it('confirms provisional score cannot claim validated measurement or population norms', async () => {
    const snapshot = await prisma.profileSnapshot.findUnique({
      where: { id: snapshotId }
    });

    expect(snapshot?.normStatus).toBe('UNAVAILABLE');
    expect(snapshot?.standardError).toBeNull();
    expect(snapshot?.ci95Lower).toBeNull();
    expect(snapshot?.ci95Upper).toBeNull();
  });

  // 6. SNAPSHOT REPRODUCIBILITY AUDIT
  it('verifies snapshot is 100% reproducible from stored item responses and options metadata', async () => {
    const auditReport = await auditSnapshotProvenance(snapshotId);

    expect(auditReport.isReproducible).toBe(true);
    expect(auditReport.totalResponsesAudited).toBeGreaterThan(0);
    expect(auditReport.storedProvisionalComposite).toBe(auditReport.recomputedProvisionalComposite);
    expect(auditReport.itemLevelAudit.every(a => a.reverseScoredCorrectly)).toBe(true);
  });

  // 7. INTEGRITY CONFIG VERSIONED HEURISTICS
  it('confirms integrity thresholds carry research heuristic metadata', () => {
    expect(INTEGRITY_CONFIG.speedViolationThresholdMs.status).toBe('RESEARCH_HEURISTIC');
    expect(INTEGRITY_CONFIG.straightliningStreakThreshold.status).toBe('RESEARCH_HEURISTIC');
    expect(INTEGRITY_CONFIG.speedViolationThresholdMs.value).toBe(1200);
    expect(INTEGRITY_CONFIG.straightliningStreakThreshold.value).toBe(8);
  });
});
