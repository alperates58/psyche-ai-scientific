import { describe, it, expect } from 'vitest';
import {
  MASTER_DOMAINS,
  MASTER_CONSTRUCTS,
  MASTER_FACETS,
  TOTAL_MASTER_FACETS_COUNT,
  TOTAL_MASTER_CONSTRUCTS_COUNT,
  TOTAL_MASTER_DOMAINS_COUNT,
} from '@/lib/profile/masterModelConstants';
import {
  buildLongitudinalProfile,
  buildLongitudinalEvidenceBundleV1,
  classifyObservedShift,
  evaluateDescriptiveStability,
} from '@/lib/longitudinal/longitudinalEngine';
import {
  evaluateVersionCompatibility,
  validateSeriesCompatibility,
} from '@/lib/longitudinal/versionCompatibility';
import {
  evaluateReassessmentRecommendations,
  compareModuleSessions,
  REASSESSMENT_INTERVALS,
} from '@/lib/longitudinal/reassessmentEngine';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { verifyAIInsightClaims } from '@/lib/ai/verification/claimVerifier';
import { buildInterpretationPlanV2 } from '@/lib/ai/planning/interpretationPlanner';
import { buildProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';
import { AIInsightV2 } from '@/types/aiInsightV2';

function createMockResponses(facetIds: string[], score: number = 4.0) {
  return facetIds.flatMap((fId) => [
    {
      id: `resp_${fId}_1`,
      itemId: `item_${fId}_1`,
      rawValue: score,
      scoredValue: score,
      item: {
        facetId: fId,
        facet: { id: fId, code: fId },
      },
    },
    {
      id: `resp_${fId}_2`,
      itemId: `item_${fId}_2`,
      rawValue: score,
      scoredValue: score,
      item: {
        facetId: fId,
        facet: { id: fId, code: fId },
      },
    },
  ]);
}

function createMockSession(params: {
  id: string;
  moduleCode: string;
  versionCode?: string;
  completedAt: Date;
  responses: any[];
  integrityFlag?: string;
}) {
  return {
    id: params.id,
    userId: 'user_unit_longitudinal',
    status: 'COMPLETED',
    startedAt: new Date(params.completedAt.getTime() - 1000 * 60 * 15),
    completedAt: params.completedAt,
    formVersion: {
      versionCode: params.versionCode || 'v1.0.0_battery',
      module: {
        id: `mod_${params.moduleCode}`,
        code: params.moduleCode,
        titleTr: `Modül ${params.moduleCode}`,
      },
      items: [],
    },
    responses: params.responses,
    integrityResults: [
      {
        overallFlag: params.integrityFlag || 'EXCELLENT',
        speedViolations: 0,
        straightliningDetected: false,
        attentionCheckPassed: true,
      },
    ],
  };
}

describe('FAZ 2.20 — Longitudinal Profile & Change Tracking Engine', () => {
  const honestyFacets = ['sincerity', 'fairness', 'greed_avoidance', 'modesty'];

  it('1. Single epoch produces NO_REPEAT_DATA with zero trajectory claims', () => {
    const s1 = createMockSession({
      id: 'sess_1',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-01-01T10:00:00Z'),
      responses: createMockResponses(honestyFacets, 4.0),
    });

    const profile = buildLongitudinalProfile({
      userId: 'user_test_1',
      sessions: [s1],
    });

    expect(profile.measurementEpochs.length).toBe(1);
    expect(profile.longitudinalReadiness.level).toBe('NO_REPEAT_DATA');
    expect(profile.longitudinalReadiness.trajectoryEligibility).toBe('NOT_ELIGIBLE');

    const sincerity = profile.facetTrajectories.find((f) => f.facetId === 'sincerity');
    expect(sincerity?.isRepeatMeasured).toBe(false);
    expect(sincerity?.classification).toBe('NO_REPEAT_DATA');
    expect(sincerity?.absoluteChange).toBeNull();
  });

  it('2. 2 epochs produces pairwise observed difference only and prohibits trend inference', () => {
    const s1 = createMockSession({
      id: 'sess_1',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-01-01T10:00:00Z'),
      responses: createMockResponses(honestyFacets, 4.0),
    });
    const s2 = createMockSession({
      id: 'sess_2',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-02-15T10:00:00Z'),
      responses: createMockResponses(honestyFacets, 4.4),
    });

    const profile = buildLongitudinalProfile({
      userId: 'user_test_2',
      sessions: [s1, s2],
    });

    expect(profile.measurementEpochs.length).toBe(2);
    expect(profile.longitudinalReadiness.level).toBe('TWO_EPOCHS');
    expect(profile.longitudinalReadiness.trajectoryEligibility).toBe('PAIRWISE_CHANGE_ONLY');

    const sincerity = profile.facetTrajectories.find((f) => f.facetId === 'sincerity');
    expect(sincerity?.isRepeatMeasured).toBe(true);
    expect(sincerity?.repeatCount).toBe(2);
    expect(sincerity?.rawDelta).toBe(0.4);
    expect(sincerity?.classification).toBe('SMALL_OBSERVED_SHIFT');
    expect(sincerity?.stability).toBe('INSUFFICIENT_DATA');
  });

  it('3. 3 epochs is trajectory eligible with descriptive stability calculation', () => {
    const s1 = createMockSession({
      id: 'sess_1',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-01-01T10:00:00Z'),
      responses: createMockResponses(honestyFacets, 4.0),
    });
    const s2 = createMockSession({
      id: 'sess_2',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-02-15T10:00:00Z'),
      responses: createMockResponses(honestyFacets, 4.4),
    });
    const s3 = createMockSession({
      id: 'sess_3',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-04-01T10:00:00Z'),
      responses: createMockResponses(honestyFacets, 4.2),
    });

    const profile = buildLongitudinalProfile({
      userId: 'user_test_3',
      sessions: [s1, s2, s3],
    });

    expect(profile.measurementEpochs.length).toBe(3);
    expect(profile.longitudinalReadiness.level).toBe('THREE_PLUS_EPOCHS');
    expect(profile.longitudinalReadiness.trajectoryEligibility).toBe('TRAJECTORY_ELIGIBLE');

    const sincerity = profile.facetTrajectories.find((f) => f.facetId === 'sincerity');
    expect(sincerity?.points.length).toBe(3);
    expect(sincerity?.stability).not.toBe('INSUFFICIENT_DATA');
  });

  it('4. 5 stable epochs produces CONSISTENTLY_HIGH descriptive stability', () => {
    const sessions = [
      createMockSession({ id: 's1', moduleCode: 'mod_hexaco_hh', completedAt: new Date('2026-01-01'), responses: createMockResponses(honestyFacets, 4.0) }),
      createMockSession({ id: 's2', moduleCode: 'mod_hexaco_hh', completedAt: new Date('2026-02-15'), responses: createMockResponses(honestyFacets, 4.3) }),
      createMockSession({ id: 's3', moduleCode: 'mod_hexaco_hh', completedAt: new Date('2026-04-01'), responses: createMockResponses(honestyFacets, 4.1) }),
      createMockSession({ id: 's4', moduleCode: 'mod_hexaco_hh', completedAt: new Date('2026-05-15'), responses: createMockResponses(honestyFacets, 4.2) }),
      createMockSession({ id: 's5', moduleCode: 'mod_hexaco_hh', completedAt: new Date('2026-07-01'), responses: createMockResponses(honestyFacets, 4.1) }),
    ];

    const profile = buildLongitudinalProfile({
      userId: 'user_test_5',
      sessions,
    });

    expect(profile.longitudinalReadiness.level).toBe('LONGITUDINAL_SERIES');
    expect(profile.longitudinalReadiness.trajectoryEligibility).toBe('STABILITY_PATTERN_ELIGIBLE');

    const sincerity = profile.facetTrajectories.find((f) => f.facetId === 'sincerity');
    expect(sincerity?.stability).toBe('CONSISTENTLY_HIGH');
    expect(profile.stabilitySummary.stableFacetsCount).toBeGreaterThan(0);
  });

  it('5. Large score difference with questionable response quality triggers QUALITY_LIMITED', () => {
    const s1 = createMockSession({
      id: 's1',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-01-01'),
      responses: createMockResponses(honestyFacets, 4.5),
    });
    const s2 = createMockSession({
      id: 's2',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-02-15'),
      responses: createMockResponses(honestyFacets, 2.0),
      integrityFlag: 'QUESTIONABLE',
    });

    const profile = buildLongitudinalProfile({
      userId: 'user_test_q',
      sessions: [s1, s2],
    });

    const sincerity = profile.facetTrajectories.find((f) => f.facetId === 'sincerity');
    expect(sincerity?.qualityLimited).toBe(true);
    expect(sincerity?.classification).toBe('QUALITY_LIMITED');
    expect(sincerity?.rawDelta).toBe(-2.5);
    expect(sincerity?.latestScore).toBe(2.0); // Score is never modified or erased
  });

  it('6. Legacy 17-item form is VERSION_INCOMPATIBLE with Native Battery', () => {
    const res = evaluateVersionCompatibility(
      { batteryVersion: 'LEGACY_17_ITEM_FORM' },
      { batteryVersion: 'NATIVE_RESEARCH_BATTERY_V1' }
    );

    expect(res.isCompatible).toBe(false);
    expect(res.compatibilityType).toBe('VERSION_INCOMPATIBLE');
    expect(res.allowDirectTrajectory).toBe(false);
  });

  it('7. Native v1 vs Future unmapped v2 is incompatible', () => {
    const res = evaluateVersionCompatibility(
      { batteryVersion: 'NATIVE_RESEARCH_BATTERY_V1' },
      { batteryVersion: 'FUTURE_UNMAPPED_V2' }
    );

    expect(res.isCompatible).toBe(false);
    expect(res.allowDirectTrajectory).toBe(false);
  });

  it('8. Missing middle epoch contains zero interpolated points', () => {
    const s1 = createMockSession({
      id: 's1',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-01-01'),
      responses: createMockResponses(honestyFacets, 4.0),
    });
    const s2 = createMockSession({
      id: 's2',
      moduleCode: 'mod_self_agency',
      completedAt: new Date('2026-02-15'),
      responses: createMockResponses(['core_self_esteem'], 3.5),
    });
    const s3 = createMockSession({
      id: 's3',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-04-01'),
      responses: createMockResponses(honestyFacets, 4.3),
    });

    const profile = buildLongitudinalProfile({
      userId: 'user_test_gaps',
      sessions: [s1, s2, s3],
    });

    const sincerity = profile.facetTrajectories.find((f) => f.facetId === 'sincerity');
    expect(sincerity?.points.length).toBe(2);
    expect(sincerity?.points[0].epochIndex).toBe(1);
    expect(sincerity?.points[1].epochIndex).toBe(3);
  });

  it('9. Partial reassessment updates only relevant facets', () => {
    const s1 = createMockSession({
      id: 's1',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-01-01'),
      responses: createMockResponses(honestyFacets, 4.0),
    });
    const s2 = createMockSession({
      id: 's2',
      moduleCode: 'mod_self_agency',
      completedAt: new Date('2026-02-15'),
      responses: createMockResponses(['core_self_esteem'], 4.2),
    });

    const profile = buildLongitudinalProfile({
      userId: 'user_test_partial',
      sessions: [s1, s2],
    });

    const sincerity = profile.facetTrajectories.find((f) => f.facetId === 'sincerity');
    const selfEsteem = profile.facetTrajectories.find((f) => f.facetId === 'core_self_esteem');
    const unmeasured = profile.facetTrajectories.find((f) => f.facetId === 'creativity');

    expect(sincerity?.points.length).toBe(1);
    expect(selfEsteem?.points.length).toBe(1);
    expect(unmeasured?.points.length).toBe(0);
  });

  it('10. Latest trajectory point equals current UnifiedPsychologicalProfileV2 score', async () => {
    const s1 = createMockSession({
      id: 's1',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-01-01'),
      responses: createMockResponses(honestyFacets, 4.0),
    });
    const s2 = createMockSession({
      id: 's2',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-02-15'),
      responses: createMockResponses(honestyFacets, 4.6),
    });

    const currentProfile = await resolveUnifiedPsychologicalProfileV2('user_test_consistency', {
      mockSessions: [s1, s2],
    });

    const longitudinal = buildLongitudinalProfile({
      userId: 'user_test_consistency',
      sessions: [s1, s2],
    });

    for (const fId of honestyFacets) {
      const curr = currentProfile.facets.find((f) => f.facetId === fId);
      const long = longitudinal.facetTrajectories.find((f) => f.facetId === fId);
      expect(curr?.score).toBe(4.6);
      expect(long?.latestScore).toBe(4.6);
      expect(curr?.score).toBe(long?.latestScore);
    }
  });

  it('11. AI claim verifier rejects ungrounded bold longitudinal claims', async () => {
    const s1 = createMockSession({
      id: 's1',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-01-01'),
      responses: createMockResponses(honestyFacets, 4.0),
    });

    const currentProfile = await resolveUnifiedPsychologicalProfileV2('user_test_ai', {
      mockSessions: [s1],
    });
    const evidenceBundle = buildProfileEvidenceBundleV2(currentProfile);
    const plan = buildInterpretationPlanV2(evidenceBundle, { requestType: 'PROFILE_OVERVIEW' });

    const forbiddenInsight: AIInsightV2 = {
      insightId: 'ins_forbid',
      type: 'PROFILE_OVERVIEW',
      titleTr: 'Profil Analizi',
      summaryTr: 'Kişiliğinizde significant improvement tespit edildi.',
      bodyTr: 'Sonuçlarınıza göre bu özellik sürekli artıyor ve kalıcı olarak değişti.',
      claimStrength: 'DIRECT_MEASUREMENT',
      evidenceRefs: plan.primaryEvidence.map((e) => e.evidenceId),
      primaryEvidenceRefs: plan.primaryEvidence.map((e) => e.evidenceId),
      supportingEvidenceRefs: [],
      counterbalancingEvidenceRefs: [],
      measurementStatus: 'MEASURED_PRECALIBRATION',
      coverageStatus: 'Kapsam: %100',
      responseQualityStatus: 'EXCELLENT',
      reflectionPrompts: [],
      limitations: [],
      generatedAt: new Date().toISOString(),
      modelProvider: 'Test',
      modelName: 'test',
      promptVersion: 'v2',
      engineVersion: '2.0.0',
      isFallback: false,
    };

    const verification = verifyAIInsightClaims(forbiddenInsight, plan);
    expect(verification.isValid).toBe(false);
    expect(verification.errors.length).toBeGreaterThan(0);
  });

  it('12. Domain scores strictly null and non-aggregatable construct has null trajectory', () => {
    const s1 = createMockSession({
      id: 's1',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-01-01'),
      responses: createMockResponses(honestyFacets, 4.0),
    });

    const profile = buildLongitudinalProfile({
      userId: 'user_test_domain',
      sessions: [s1],
    });

    const locus = profile.constructTrajectories.find((c) => c.constructId === 'locus_of_control');
    expect(locus?.allowsNumericTrend).toBe(false);
    expect(locus?.points).toBeNull();
  });

  it('13. Reassessment recommendation prioritizes elapsed time and never suggests tests because a score is bad', () => {
    const s1 = createMockSession({
      id: 's1',
      moduleCode: 'mod_core_hexaco_60',
      completedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // 100 days ago (>90d standard interval)
      responses: createMockResponses(['sincerity'], 1.0), // low score
    });

    const recommendations = evaluateReassessmentRecommendations([s1]);
    const hexacoRec = recommendations.find((r) => r.moduleCode === 'mod_core_hexaco_60');

    expect(hexacoRec?.urgency).toBe('HIGH');
    expect(hexacoRec?.daysSinceLastCompletion).toBeGreaterThanOrEqual(99);
    expect(hexacoRec?.reasonTr).toContain('gün geçti');
    expect(hexacoRec?.reasonTr).not.toContain('düşük');
  });

  it('14. Module repeat comparison accurately computes observed delta and classifications', () => {
    const s1 = createMockSession({
      id: 's1',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-01-01'),
      responses: createMockResponses(honestyFacets, 3.5),
    });
    const s2 = createMockSession({
      id: 's2',
      moduleCode: 'mod_hexaco_hh',
      completedAt: new Date('2026-02-15'),
      responses: createMockResponses(honestyFacets, 4.2),
    });

    const comparison = compareModuleSessions(s1, s2);
    expect(comparison.comparisons.length).toBe(4);

    const sincerityComp = comparison.comparisons.find((c) => c.facetId === 'sincerity');
    expect(sincerityComp?.previousScore).toBe(3.5);
    expect(sincerityComp?.currentScore).toBe(4.2);
    expect(sincerityComp?.observedDelta).toBe(0.7);
    expect(sincerityComp?.classification).toBe('MODERATE_OBSERVED_SHIFT');
    expect(sincerityComp?.direction).toBe('INCREASED');
  });
});
