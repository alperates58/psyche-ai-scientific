import { describe, it, expect } from 'vitest';
import {
  MASTER_DOMAINS,
  MASTER_CONSTRUCTS,
  MASTER_FACETS,
  TOTAL_MASTER_DOMAINS_COUNT,
  TOTAL_MASTER_CONSTRUCTS_COUNT,
  TOTAL_MASTER_FACETS_COUNT,
  TOTAL_ADMINISTERED_ITEMS_COUNT,
  normalizeMasterFacetId,
} from '../../src/lib/profile/masterModelConstants';
import {
  CONSTRUCT_AGGREGATION_RULES,
  resolveConstructAggregation,
  scoreToVisualCoordinate,
  visualCoordinateToScore,
  toVisualNormalizedCoordinate,
  getScoreBandV2,
} from '../../src/lib/profile/constructAggregationResolver';
import { calculateProfileCoverageV2 } from '../../src/lib/profile/profileCoverageResolver';
import {
  deriveFacetConfidenceComponents,
  buildConfidenceMapV2,
} from '../../src/lib/profile/profileConfidenceResolver';
import {
  EVALUATED_PATTERNS,
  generateDeterministicPatterns,
  evaluateCrossDomainPatterns,
} from '../../src/lib/profile/profilePatternEngine';
import {
  SYNERGY_RULES,
  generateDeterministicSynergies,
  evaluateProfileSynergies,
} from '../../src/lib/profile/profileSynergyEngine';
import {
  TENSION_RULES,
  generateDeterministicTensions,
  evaluateProfileTensions,
} from '../../src/lib/profile/profileTensionEngine';
import { buildProfileEvidenceBundleV2 } from '../../src/lib/profile/profileEvidenceBundle';
import { resolveUnifiedPsychologicalProfileV2 } from '../../src/lib/profile/masterProfileResolver';
import { runUnifiedProfileV2Audit } from '../../scripts/audit-unified-profile-v2';
import { FacetProfileV2 } from '../../src/types/unifiedProfileV2';

describe('FAZ 2.17: Unified Psychological Profile V2 & Master Model Adoption', () => {
  // ---------------------------------------------------------------------------
  // 1. Audit Script Verification
  // ---------------------------------------------------------------------------
  it('Invariant 0: Unified Profile V2 automated scientific audit runs with 0 errors', async () => {
    const auditResult = await runUnifiedProfileV2Audit();
    expect(auditResult.errors).toEqual([]);
    expect(auditResult.success).toBe(true);
    expect(auditResult.metrics.masterDomainsCount).toBe(11);
    expect(auditResult.metrics.masterConstructsCount).toBe(37);
    expect(auditResult.metrics.masterFacetsCount).toBe(91);
    expect(auditResult.metrics.constructAggregationRulesCount).toBe(37);
  });

  // ---------------------------------------------------------------------------
  // 2. Hierarchy Integrity
  // ---------------------------------------------------------------------------
  it('Invariant 1: Hierarchy integrity (11 Domains -> 37 Constructs -> 91 Facets -> 469 Administered Items)', () => {
    expect(MASTER_DOMAINS.length).toBe(TOTAL_MASTER_DOMAINS_COUNT);
    expect(MASTER_CONSTRUCTS.length).toBe(TOTAL_MASTER_CONSTRUCTS_COUNT);
    expect(MASTER_FACETS.length).toBe(TOTAL_MASTER_FACETS_COUNT);

    // Sum of constructs across domains equals 37
    const domainConstructTotal = MASTER_DOMAINS.reduce((acc, d) => acc + d.constructIds.length, 0);
    expect(domainConstructTotal).toBe(37);

    // Sum of facets across constructs equals 91
    const constructFacetTotal = MASTER_CONSTRUCTS.reduce((acc, c) => acc + c.facetIds.length, 0);
    expect(constructFacetTotal).toBe(91);

    // Every facet belongs to a valid construct and domain
    for (const facet of MASTER_FACETS) {
      const construct = MASTER_CONSTRUCTS.find((c) => c.constructId === facet.constructId);
      expect(construct).toBeDefined();
      expect(construct?.domainId).toBe(facet.domainId);
      expect(construct?.facetIds).toContain(facet.facetId);
    }
  });

  // ---------------------------------------------------------------------------
  // 3. Facet Score Boundaries & NOT_MEASURED State
  // ---------------------------------------------------------------------------
  it('Invariant 2: Facet scores are 1.00–5.00 only when items exist, else NOT_MEASURED', async () => {
    const emptyProfile = await resolveUnifiedPsychologicalProfileV2('test-user-inv2', {
      mockSessions: [],
    });

    for (const facet of emptyProfile.facets) {
      expect(facet.measurementStatus).toBe('NOT_MEASURED');
      expect(facet.score).toBeNull();
      expect(facet.normalizedVisualCoordinate).toBeNull();
      expect(facet.itemCountAnswered).toBe(0);
    }
  });

  // ---------------------------------------------------------------------------
  // 4. Zero Midpoint Imputation
  // ---------------------------------------------------------------------------
  it('Invariant 3: Missing facets are NEVER midpoint (3.00) imputed', async () => {
    const partialSession = {
      id: 'sess_partial',
      status: 'COMPLETED',
      completedAt: new Date(),
      formVersion: {
        versionCode: 'v1.0.0_battery',
        module: { id: 'mod_sincerity', code: 'mod_sincerity', titleTr: 'İçtenlik' },
        items: [],
      },
      responses: [
        { scoredValue: 4.8, rawValue: 4.8, item: { facet: { id: 'sincerity' } } },
      ],
      integrityResults: [{ overallFlag: 'EXCELLENT' }],
    };

    const profile = await resolveUnifiedPsychologicalProfileV2('test-user-inv3', {
      mockSessions: [partialSession],
    });

    const sincerity = profile.facets.find((f) => f.facetId === 'sincerity');
    const fairness = profile.facets.find((f) => f.facetId === 'fairness');

    expect(sincerity?.measurementStatus).toBe('MEASURED_PRECALIBRATION');
    expect(sincerity?.score).toBe(4.8);

    expect(fairness?.measurementStatus).toBe('NOT_MEASURED');
    expect(fairness?.score).toBeNull(); // Strictly null, NEVER 3.00
  });

  // ---------------------------------------------------------------------------
  // 5. Domain Scores Strictly Null (No Collapsing)
  // ---------------------------------------------------------------------------
  it('Invariant 4: Domain scores are strictly null (no fake global domain averages)', async () => {
    const profile = await resolveUnifiedPsychologicalProfileV2('test-user-inv4', {
      mockSessions: [],
    });

    for (const domain of profile.domains) {
      expect(domain.domainScore).toBeNull();
    }
  });

  // ---------------------------------------------------------------------------
  // 6. Strict Construct Aggregation Rules
  // ---------------------------------------------------------------------------
  it('Invariant 5: Construct aggregation strictly adheres to authorization and completion rules', () => {
    // 1. Honesty-Humility allows aggregation if ALL 4 facets are measured
    const hhDef = MASTER_CONSTRUCTS.find((c) => c.constructId === 'hexaco_honesty_humility')!;
    expect(hhDef.allowsDirectAggregation).toBe(true);

    const fullFacetsHH: FacetProfileV2[] = [
      { facetId: 'sincerity', score: 4.0, measurementStatus: 'MEASURED_PRECALIBRATION' } as any,
      { facetId: 'fairness', score: 4.0, measurementStatus: 'MEASURED_PRECALIBRATION' } as any,
      { facetId: 'greed_avoidance', score: 4.0, measurementStatus: 'MEASURED_PRECALIBRATION' } as any,
      { facetId: 'modesty', score: 4.0, measurementStatus: 'MEASURED_PRECALIBRATION' } as any,
    ];
    const fullAggregation = resolveConstructAggregation(hhDef, fullFacetsHH);
    expect(fullAggregation.aggregationStatus).toBe('DIRECT_CONSTRUCT_SCORE');
    expect(fullAggregation.constructScore).toBe(4.0);

    // Partial facets -> PARTIAL_CONSTRUCT_PATTERN, score is null
    const partialFacetsHH: FacetProfileV2[] = [
      { facetId: 'sincerity', score: 4.0, measurementStatus: 'MEASURED_PRECALIBRATION' } as any,
      { facetId: 'fairness', score: null, measurementStatus: 'NOT_MEASURED' } as any,
    ];
    const partialAggregation = resolveConstructAggregation(hhDef, partialFacetsHH);
    expect(partialAggregation.aggregationStatus).toBe('PARTIAL_CONSTRUCT_PATTERN');
    expect(partialAggregation.constructScore).toBeNull();

    // 2. Locus of Control DISALLOWS direct aggregation -> FACET_PATTERN_ONLY, score is null
    const locDef = MASTER_CONSTRUCTS.find((c) => c.constructId === 'locus_of_control')!;
    expect(locDef.allowsDirectAggregation).toBe(false);

    const fullFacetsLOC: FacetProfileV2[] = [
      { facetId: 'locus_of_control_internal', score: 4.5, measurementStatus: 'MEASURED_PRECALIBRATION' } as any,
      { facetId: 'locus_of_control_external', score: 2.0, measurementStatus: 'MEASURED_PRECALIBRATION' } as any,
    ];
    const locAggregation = resolveConstructAggregation(locDef, fullFacetsLOC);
    expect(locAggregation.aggregationStatus).toBe('FACET_PATTERN_ONLY');
    expect(locAggregation.constructScore).toBeNull();
  });

  // ---------------------------------------------------------------------------
  // 7. Visual Coordinates Linear Mapping [1,5] -> [0,100]
  // ---------------------------------------------------------------------------
  it('Invariant 6: Visual coordinates use strict linear mapping [1.0, 5.0] -> [0, 100]', () => {
    expect(scoreToVisualCoordinate(1.0)).toBe(0);
    expect(scoreToVisualCoordinate(2.0)).toBe(25);
    expect(scoreToVisualCoordinate(3.0)).toBe(50);
    expect(scoreToVisualCoordinate(4.0)).toBe(75);
    expect(scoreToVisualCoordinate(5.0)).toBe(100);
    expect(scoreToVisualCoordinate(null)).toBeNull();

    expect(visualCoordinateToScore(0)).toBe(1.0);
    expect(visualCoordinateToScore(50)).toBe(3.0);
    expect(visualCoordinateToScore(100)).toBe(5.0);
    expect(visualCoordinateToScore(null)).toBeNull();
  });

  // ---------------------------------------------------------------------------
  // 8. Coverage Calculation Distinct from Confidence
  // ---------------------------------------------------------------------------
  it('Invariant 7: Profile Coverage calculates separate Domain, Construct, Facet, Question coverage', () => {
    const mockDomains = MASTER_DOMAINS.map((d) => ({
      domainId: d.domainId,
      measuredFacetCount: d.domainId === 'core_personality' ? 24 : 0,
    })) as any;

    const mockConstructs = MASTER_CONSTRUCTS.map((c) => ({
      constructId: c.constructId,
      measuredFacetCount: c.domainId === 'core_personality' ? 4 : 0,
    })) as any;

    const mockFacets = MASTER_FACETS.map((f) => ({
      facetId: f.facetId,
      measurementStatus: f.domainId === 'core_personality' ? 'MEASURED_PRECALIBRATION' : 'NOT_MEASURED',
      score: f.domainId === 'core_personality' ? 4.0 : null,
      itemCountAnswered: f.domainId === 'core_personality' ? 5 : 0,
    })) as any;

    const coverage = calculateProfileCoverageV2({
      domains: mockDomains,
      constructs: mockConstructs,
      facets: mockFacets,
    });

    expect(coverage.domainCoverage.measuredCount).toBe(1);
    expect(coverage.domainCoverage.totalCount).toBe(11);
    expect(coverage.facetCoverage.measuredCount).toBe(24);
    expect(coverage.facetCoverage.totalCount).toBe(91);
    expect(coverage.questionCoverage.answeredCount).toBe(120); // 24 * 5
  });

  // ---------------------------------------------------------------------------
  // 9. 6-Dimensional Epistemic Confidence Map
  // ---------------------------------------------------------------------------
  it('Invariant 8: Confidence Map V2 includes 6 epistemic dimensions without single fake percentages', () => {
    const confMap = buildConfidenceMapV2({
      measuredFacetsCount: 30,
      totalFacetsCount: 91,
      responseQuality: { overallFlag: 'EXCELLENT' } as any,
      hasRepeatMeasurements: false,
      distinctInstrumentsCount: 2,
    });

    expect(confMap.measurementCoverage).toBe('LOW'); // 30/91 < 35%
    expect(confMap.responseQuality).toBe('EXCELLENT');
    expect(confMap.itemCompletion).toBe('ADEQUATE');
    expect(confMap.repeatMeasurement).toBe('NONE');
    expect(confMap.methodDiversity).toBe('MULTI_INVENTORY');
    expect(confMap.calibrationStatus).toBe('PRE_CALIBRATION');
    expect((confMap as any).globalPercentage).toBeUndefined(); // Invariant: No fake percentage
  });

  // ---------------------------------------------------------------------------
  // 10. Deterministic Cross-Domain Patterns
  // ---------------------------------------------------------------------------
  it('Invariant 9: Evaluates all 8 cross-domain patterns deterministically', () => {
    expect(EVALUATED_PATTERNS.length).toBe(8);

    // Analytical pattern test (NFC >= 3.6, RAT >= 3.6, INQ >= 3.5)
    const analyticalScores = new Map<string, number>([
      ['need_for_cognition', 4.2],
      ['rational_analytical_thinking', 4.0],
      ['inquisitiveness', 3.8],
    ]);

    const patterns = generateDeterministicPatterns(analyticalScores);
    expect(patterns.length).toBe(1);
    expect(patterns[0].id).toBe('pat_analytical_epistemic_style');

    // Missing facet -> fails safely
    const incompleteScores = new Map<string, number>([
      ['need_for_cognition', 4.2],
      ['rational_analytical_thinking', 4.0],
    ]);
    expect(generateDeterministicPatterns(incompleteScores).length).toBe(0);
  });

  // ---------------------------------------------------------------------------
  // 11. Deterministic Synergies & Tensions
  // ---------------------------------------------------------------------------
  it('Invariant 10: Evaluates all 8 synergies and 8 tensions deterministically', () => {
    expect(SYNERGY_RULES.length).toBe(8);
    expect(TENSION_RULES.length).toBe(8);

    // Synergy test: Self-efficacy + grit + diligence
    const synergyScores = new Map<string, number>([
      ['generalized_self_efficacy', 4.0],
      ['long_term_grit', 4.2],
      ['diligence', 3.8],
    ]);
    const synergies = generateDeterministicSynergies(synergyScores);
    expect(synergies.length).toBe(1);
    expect(synergies[0].id).toBe('syn_self_efficacy_persistence');

    // Tension test: Cognitive closure vs openness (NFCS >= 3.6, INQ >= 3.6)
    const tensionScores = new Map<string, number>([
      ['need_for_cognitive_closure', 4.2],
      ['inquisitiveness', 4.0],
      ['unconventionality', 3.0],
    ]);
    const tensions = generateDeterministicTensions(tensionScores);
    expect(tensions.length).toBe(1);
    expect(tensions[0].id).toBe('ten_closure_vs_openness');
  });

  // ---------------------------------------------------------------------------
  // 12. Response Quality Propagation
  // ---------------------------------------------------------------------------
  it('Invariant 11: Response quality propagates flags, speed violations, and attention checks', async () => {
    const compromisedSession = {
      id: 'sess_compromised',
      status: 'COMPLETED',
      completedAt: new Date(),
      formVersion: {
        versionCode: 'v1.0.0_battery',
        module: { id: 'mod_1', code: 'mod_1', titleTr: 'Test Modülü' },
        items: [],
      },
      responses: [
        { scoredValue: 3.0, rawValue: 3.0, item: { facet: { id: 'sincerity' } } },
      ],
      integrityResults: [
        {
          overallFlag: 'COMPROMISED',
          speedViolations: 4,
          straightliningDetected: true,
          attentionCheckPassed: false,
          inconsistencyViolations: 2,
        },
      ],
    };

    const profile = await resolveUnifiedPsychologicalProfileV2('test-user-rq', {
      mockSessions: [compromisedSession],
    });

    expect(profile.responseQuality.overallFlag).toBe('COMPROMISED');
    expect(profile.responseQuality.speedViolationsCount).toBe(4);
    expect(profile.responseQuality.straightliningDetected).toBe(true);
    expect(profile.responseQuality.attentionChecksPassed).toBe(false);
    expect(profile.responseQuality.cautiousInterpretationRequired).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // 13. Longitudinal Readiness
  // ---------------------------------------------------------------------------
  it('Invariant 12: Longitudinal readiness tracks epochs and trajectory calculation viability', async () => {
    const session1 = {
      id: 'sess_1',
      status: 'COMPLETED',
      completedAt: new Date('2026-01-01'),
      formVersion: { versionCode: 'v1.0.0_battery', module: { id: 'm1', code: 'm1', titleTr: 'M1' } },
      responses: [],
      integrityResults: [{ overallFlag: 'EXCELLENT' }],
    };
    const session2 = {
      id: 'sess_2',
      status: 'COMPLETED',
      completedAt: new Date('2026-06-01'),
      formVersion: { versionCode: 'v1.0.0_battery', module: { id: 'm2', code: 'm2', titleTr: 'M2' } },
      responses: [],
      integrityResults: [{ overallFlag: 'EXCELLENT' }],
    };

    const profile2 = await resolveUnifiedPsychologicalProfileV2('test-user-long', {
      mockSessions: [session1, session2],
    });

    expect(profile2.longitudinalReadiness.hasRepeatMeasurements).toBe(true);
    expect(profile2.longitudinalReadiness.measurementEpochsCount).toBe(2);
    expect(profile2.longitudinalReadiness.canComputeTrajectories).toBe(false); // requires >= 3
  });

  // ---------------------------------------------------------------------------
  // 14. Self-System & Contextual Views
  // ---------------------------------------------------------------------------
  it('Invariant 13: Self-System reflects Actual Self only; Ideal/Social and Contextual views are strictly null', async () => {
    const profile = await resolveUnifiedPsychologicalProfileV2('test-user-views', {
      mockSessions: [],
    });

    expect(profile.selfSystemViews.idealSelf).toBeNull();
    expect(profile.selfSystemViews.socialSelf).toBeNull();
    expect(profile.contextualViews.work).toBeNull();
    expect(profile.contextualViews.relationships).toBeNull();
    expect(profile.contextualViews.stress).toBeNull();
    expect(profile.contextualViews.decisionMaking).toBeNull();
  });

  // ---------------------------------------------------------------------------
  // 15. Evidence Bundle Export (FAZ 2.18 Grounding Invariant)
  // ---------------------------------------------------------------------------
  it('Invariant 14: Evidence bundle produces complete grounding with ZERO scoring role for AI', async () => {
    const profile = await resolveUnifiedPsychologicalProfileV2('test-user-bundle', {
      mockSessions: [],
    });

    const bundle = buildProfileEvidenceBundleV2(profile);
    expect(bundle.bundleVersion).toBe('2.0.0');
    expect(bundle.aiGovernanceRule).toContain('AI Insight Engine MUST consume this bundle as authoritative grounding');
    expect(bundle.aiGovernanceRule).toContain('MUST NOT calculate, modify, or invent psychometric trait scores');
    expect(bundle.evidenceEntries).toBeDefined();
    expect(bundle.measurementStatuses).toBeDefined();
    expect(Object.keys(bundle.measurementStatuses).length).toBe(91);
  });

  // ---------------------------------------------------------------------------
  // 16. Legacy Compatibility Isolation
  // ---------------------------------------------------------------------------
  it('Invariant 15: Legacy 17-item data is isolated in legacyCompatibility and does not pollute V2 Master Facets', async () => {
    const legacySession = {
      id: 'sess_legacy',
      status: 'COMPLETED',
      completedAt: new Date(),
      formVersion: {
        versionCode: 'v1.0.0_legacy_17',
        module: { id: 'LEGACY_FORM_HEXACO', code: 'LEGACY_FORM_HEXACO', titleTr: 'Eski Tarama' },
        items: [],
      },
      responses: [
        { scoredValue: 3.5, rawValue: 3.5, item: { facet: { id: 'sincerity' } } },
      ],
      integrityResults: [{ overallFlag: 'ACCEPTABLE' }],
    };

    const profile = await resolveUnifiedPsychologicalProfileV2('test-user-legacy', {
      mockSessions: [legacySession],
    });

    expect(profile.legacyCompatibility.hasLegacy17ItemData).toBe(true);
    expect(profile.legacyCompatibility.legacyFacetScores['sincerity']).toBe(3.5);

    // Native Master Model facet remains NOT_MEASURED because legacy session was isolated
    const nativeSincerity = profile.facets.find((f) => f.facetId === 'sincerity');
    expect(nativeSincerity?.measurementStatus).toBe('NOT_MEASURED');
    expect(nativeSincerity?.score).toBeNull();
  });

  // ---------------------------------------------------------------------------
  // 17. Next Best Assessment Recommendation
  // ---------------------------------------------------------------------------
  it('Invariant 16: Next Best Assessment recommends uncompleted assessments based on uncovered coverage', async () => {
    const profile = await resolveUnifiedPsychologicalProfileV2('test-user-next', {
      mockSessions: [],
    });

    expect(profile.nextBestAssessment).not.toBeNull();
    expect(profile.nextBestAssessment?.moduleCode).toBeDefined();
    expect(profile.nextBestAssessment?.url).toContain('/assessment?module=');
    expect(profile.nextBestAssessment?.targetUncoveredFacetsCount).toBeGreaterThan(0);
  });
});
