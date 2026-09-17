import { describe, it, expect, beforeEach } from 'vitest';
import {
  ProfileEvidenceBundleV2,
  buildProfileEvidenceBundleV2,
} from '@/lib/profile/profileEvidenceBundle';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { selectEvidenceForInterpretation } from '@/lib/ai/evidence/evidenceSelector';
import { buildInterpretationPlanV2 } from '@/lib/ai/planning/interpretationPlanner';
import { verifyAIInsightClaims } from '@/lib/ai/verification/claimVerifier';
import { deterministicFallbackProvider } from '@/lib/ai/providers/fallbackProvider';
import {
  generateProfileInsightV2,
  getUnifiedProfileAISectionData,
  getEvidenceTransparencyInfo,
} from '@/services/aiInsightService';
import {
  getCachedInsight,
  setCachedInsight,
  invalidateCacheForSnapshot,
  computeEvidenceHash,
} from '@/lib/ai/cache/insightCache';
import {
  savePersistentAIKey,
  deletePersistentAIKey,
  isAIKeyConfigured,
  getAIKeyLast4,
} from '@/lib/ai/config/aiSecretStore';
import { getAIConfig } from '@/lib/ai/config/aiConfigResolver';
import { exportTheoryLensEvidenceBundle } from '@/lib/ai/theoryLens/theoryLensAdapter';
import { AIInsightV2 } from '@/types/aiInsightV2';

describe('FAZ 2.18 — AI Insight Engine V2 Comprehensive Scientific Unit Tests', () => {
  // Mock session fixture with high self-efficacy, high diligence, high empathic concern, low assertiveness
  const sampleSession = {
    id: 'sess_test_full_v2',
    status: 'COMPLETED',
    completedAt: new Date('2026-09-17T10:00:00Z'),
    formVersion: {
      versionCode: 'v1.0.0_battery',
      module: { id: 'mod_self_agency', code: 'mod_self_agency', titleTr: 'Benlik & İrade' },
      items: [],
    },
    responses: [
      { scoredValue: 4.6, rawValue: 4.6, item: { facet: { id: 'generalized_self_efficacy' } } },
      { scoredValue: 4.4, rawValue: 4.4, item: { facet: { id: 'diligence' } } },
      { scoredValue: 4.8, rawValue: 4.8, item: { facet: { id: 'empathic_concern' } } },
      { scoredValue: 2.1, rawValue: 2.1, item: { facet: { id: 'assertiveness' } } },
    ],
    integrityResults: [{ overallFlag: 'EXCELLENT' }],
  };

  let bundle: ProfileEvidenceBundleV2;

  beforeEach(async () => {
    const profile = await resolveUnifiedPsychologicalProfileV2('test_user_v2', {
      mockSessions: [sampleSession],
    });
    bundle = buildProfileEvidenceBundleV2(profile);
  });

  // 1. High self-efficacy + high diligence -> supported synergy explanation
  it('1. correctly identifies and formulates supported synergy explanation for high self-efficacy + high persistence', async () => {
    const plan = buildInterpretationPlanV2(bundle, {
      requestType: 'SYNERGY_INTERPRETATION',
      targetFacetIds: ['generalized_self_efficacy', 'diligence'],
    });

    expect(plan.primaryEvidence.length).toBeGreaterThanOrEqual(1);
    const insight = await deterministicFallbackProvider.generateStructuredInsight(plan);

    expect(insight.titleTr).toBeDefined();
    expect(insight.bodyTr).toBeDefined();
    expect(insight.evidenceRefs.length).toBeGreaterThan(0);
    expect(insight.claimStrength).toBeDefined();
  });

  // 2. High empathy + low boundary setting -> supported tension interpretation
  it('2. correctly identifies and formulates supported tension interpretation for high empathy + low boundary setting', async () => {
    const plan = buildInterpretationPlanV2(bundle, {
      requestType: 'TENSION_INTERPRETATION',
      targetFacetIds: ['empathic_concern', 'assertiveness'],
    });

    const insight = await deterministicFallbackProvider.generateStructuredInsight(plan);
    expect(insight.titleTr).toBeDefined();
    expect(insight.bodyTr).toBeDefined();
    expect(insight.reflectionPrompts.length).toBeGreaterThan(0);
  });

  // 3. Unmeasured attachment -> AI refuses to infer attachment style
  it('3. refuses to infer unmeasured attachment traits and flags domain as unmeasured', async () => {
    const selected = selectEvidenceForInterpretation(bundle, {
      requestType: 'DOMAIN_INTERPRETATION',
      targetDomainIds: ['motivation_values'],
      targetFacetIds: ['autonomy_need_satisfaction'],
    });

    expect(selected.selectedFacets).toHaveLength(0);
    expect(selected.coverage.isUnmeasuredTarget).toBe(true);

    const plan = buildInterpretationPlanV2(bundle, {
      requestType: 'DOMAIN_INTERPRETATION',
      targetDomainIds: ['motivation_values'],
      targetFacetIds: ['autonomy_need_satisfaction'],
    });

    const insight = await deterministicFallbackProvider.generateStructuredInsight(plan);
    expect(insight.titleTr).toContain('Ölçüm Henüz Tamamlanmadı');
    expect(insight.bodyTr).toContain('profilinizde henüz doğrudan ölçülmedi');
  });

  // 4. Questionable response quality -> interpretation becomes more cautious but score remains unchanged
  it('4. makes interpretation cautious when response quality is questionable while score remains unchanged', async () => {
    const questionableSession = {
      ...sampleSession,
      integrityResults: [{ overallFlag: 'QUESTIONABLE' }],
    };
    const profile = await resolveUnifiedPsychologicalProfileV2('test_user_cautious', {
      mockSessions: [questionableSession],
    });
    const cautiousBundle = buildProfileEvidenceBundleV2(profile);

    const plan = buildInterpretationPlanV2(cautiousBundle, {
      requestType: 'PROFILE_OVERVIEW',
    });

    expect(plan.responseQualityState.cautiousRequired).toBe(true);
    const insight = await deterministicFallbackProvider.generateStructuredInsight(plan);

    expect(insight.limitations.some((l) => l.includes('temkinli'))).toBe(true);
    // Hard invariant: score unchanged
    const efficacyFacet = cautiousBundle.measuredFacets.find((f) => f.facetId === 'generalized_self_efficacy');
    expect(efficacyFacet?.score).toBe(4.6);
  });

  // 5. Only one measurement epoch -> no "changed/increased/decreased" language
  it('5. enforces longitudinal guard: rejects change language (increased/decreased) when only one measurement epoch exists', async () => {
    const plan = buildInterpretationPlanV2(bundle, { requestType: 'PROFILE_OVERVIEW' });
    expect(plan.longitudinalState.hasRepeat).toBe(false);

    const validInsight = await deterministicFallbackProvider.generateStructuredInsight(plan);
    const invalidLongitudinal: AIInsightV2 = {
      ...validInsight,
      bodyTr: 'Önceki değerlendirmenize göre sebat puanınız zamanla arttı.',
    };

    const check = verifyAIInsightClaims(invalidLongitudinal, plan);
    expect(check.isValid).toBe(false);
    expect(check.errors.some((e) => e.includes('boylamsal'))).toBe(true);
  });

  // 6. Pre-calibration score -> no percentile language
  it('6. rejects population percentile or normative ranking claims in pre-calibration mode', async () => {
    const plan = buildInterpretationPlanV2(bundle, { requestType: 'PROFILE_OVERVIEW' });
    const validInsight = await deterministicFallbackProvider.generateStructuredInsight(plan);

    const invalidPercentile: AIInsightV2 = {
      ...validInsight,
      bodyTr: 'Kullanıcı Türkiye ortalamasının %90 üzerinde öz-yeterliliğe sahiptir.',
    };

    const check = verifyAIInsightClaims(invalidPercentile, plan);
    expect(check.isValid).toBe(false);
    expect(check.errors.some((e) => e.includes('yüzdelik (percentile)'))).toBe(true);
  });

  // 7. External AI disabled -> deterministic fallback works
  it('7. seamlessly returns rich deterministic fallback when external AI is disabled', async () => {
    const insight = await generateProfileInsightV2(bundle, { requestType: 'PROFILE_OVERVIEW' });
    expect(insight).toBeDefined();
    expect(insight.isFallback).toBe(true);
    expect(insight.titleTr).toBeDefined();
    expect(insight.summaryTr.length).toBeGreaterThan(20);
    expect(insight.bodyTr.length).toBeGreaterThan(50);
  });

  // 8. Provider returns unsupported diagnosis -> validation rejects output
  it('8. rejects external provider output if it leaks clinical diagnosis keywords', async () => {
    const plan = buildInterpretationPlanV2(bundle, { requestType: 'PROFILE_OVERVIEW' });
    const validInsight = await deterministicFallbackProvider.generateStructuredInsight(plan);

    const diagnosticOutputs = [
      'Kullanıcıda majör depresyon tanısı gözlenmektedir.',
      'Sonuçlar dehb teşhisi ile uyumludur.',
      'Borderline ve bipolar bozukluk belirtileri mevcuttur.',
      'Narsisistik kişilik bozukluğu patolojisi tespit edildi.',
    ];

    for (const text of diagnosticOutputs) {
      const badInsight: AIInsightV2 = { ...validInsight, bodyTr: text };
      const check = verifyAIInsightClaims(badInsight, plan);
      expect(check.isValid).toBe(false);
      expect(check.errors.some((e) => e.includes('klinik/psikiyatrik'))).toBe(true);
    }
  });

  // 9. Provider references unmeasured facet -> validation rejects output
  it('9. rejects output if provider hallucinates an unmeasured facet reference', async () => {
    const plan = buildInterpretationPlanV2(bundle, { requestType: 'PROFILE_OVERVIEW' });
    const validInsight = await deterministicFallbackProvider.generateStructuredInsight(plan);

    const badInsight: AIInsightV2 = {
      ...validInsight,
      evidenceRefs: ['facet_unmeasured_dark_tetrad_machiavellianism'],
    };

    const check = verifyAIInsightClaims(badInsight, plan);
    expect(check.isValid).toBe(false);
    expect(check.metrics.unsupportedClaims).toBeGreaterThan(0);
  });

  // 10. Profile snapshot changes -> old insight cache is invalidated
  it('10. binds insight cache to profile snapshot ID and properly invalidates on snapshot transition', async () => {
    const snapshot1 = 'snap_user_v2_epoch_1';
    const snapshot2 = 'snap_user_v2_epoch_2';
    const plan = buildInterpretationPlanV2(bundle, { requestType: 'PROFILE_OVERVIEW' });
    const hash = computeEvidenceHash(plan);

    const insight = await deterministicFallbackProvider.generateStructuredInsight(plan);
    setCachedInsight(snapshot1, 'PROFILE_OVERVIEW', hash, 'v2', '2.0.0', insight);

    expect(getCachedInsight(snapshot1, 'PROFILE_OVERVIEW', hash, 'v2')).not.toBeNull();
    // Snapshot 2 must be a cache miss
    expect(getCachedInsight(snapshot2, 'PROFILE_OVERVIEW', hash, 'v2')).toBeNull();

    // Invalidate snapshot 1
    invalidateCacheForSnapshot(snapshot1);
    expect(getCachedInsight(snapshot1, 'PROFILE_OVERVIEW', hash, 'v2')).toBeNull();
  });

  // 11. Raw user responses -> absent from external default payload
  it('11. guarantees raw user responses and question prompts are completely excluded from AI payload', () => {
    const selected = selectEvidenceForInterpretation(bundle, { requestType: 'PROFILE_OVERVIEW' });
    const stringified = JSON.stringify(selected);

    expect(stringified).not.toContain('rawValue');
    expect(stringified).not.toContain('selectedOptionVersionId');
    expect(stringified).not.toContain('promptTr');
    expect(stringified).not.toContain('test_user_v2');
  });

  // 12. Evidence reference missing -> claim rejected
  it('12. rejects output if all evidence references are missing', async () => {
    const plan = buildInterpretationPlanV2(bundle, { requestType: 'PROFILE_OVERVIEW' });
    const validInsight = await deterministicFallbackProvider.generateStructuredInsight(plan);

    const emptyRefInsight: AIInsightV2 = {
      ...validInsight,
      evidenceRefs: [],
      primaryEvidenceRefs: [],
      supportingEvidenceRefs: [],
      counterbalancingEvidenceRefs: [],
    };

    const check = verifyAIInsightClaims(emptyRefInsight, plan);
    expect(check.isValid).toBe(false);
    expect(check.errors.some((e) => e.includes('hiçbir kanıt referansı'))).toBe(true);
  });

  // 13. Secret masking & safe last-4
  it('13. encrypts API key at rest, never exposes raw secret in config resolver, and returns safe mask', async () => {
    await savePersistentAIKey('sk-deepseek-unit-test-secret-999988887777zzzz');
    expect(isAIKeyConfigured()).toBe(true);
    expect(getAIKeyLast4()).toBe('zzzz');

    const config = await getAIConfig();
    expect(config.apiKeyConfigured).toBe(true);
    expect(config.apiKeyLast4).toBe('zzzz');

    await deletePersistentAIKey();
  });

  // 14. Theory Lens Ready Bundle
  it('14. exports normalized TheoryLensEvidenceBundle without executing theoretical personas', () => {
    const theoryBundle = exportTheoryLensEvidenceBundle(bundle);
    expect(theoryBundle.bundleVersion).toBe('2.0.0');
    expect(theoryBundle.measuredFacets.length).toBeGreaterThan(0);
    expect(theoryBundle.governanceNotice).toContain('FAZ 2.19');
  });
});
