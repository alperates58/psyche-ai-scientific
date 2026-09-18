/**
 * PsycheAI Longitudinal Profile & Change Tracking Engine Audit (FAZ 2.20)
 *
 * Verifies all 12 Invariants and Test Cases:
 * 1. 1 epoch -> NO_REPEAT_DATA (Cross-sectional point estimate only).
 * 2. 2 epochs same facet -> Pairwise observed difference only, no "trend".
 * 3. 3 epochs -> TRAJECTORY_ELIGIBLE.
 * 4. 5 stable epochs -> Descriptive stability (CONSISTENTLY_HIGH / MID / LOW).
 * 5. Large score difference + questionable response quality -> QUALITY_LIMITED / CHANGE_CONFIDENCE_REDUCED.
 * 6. Legacy 17-item vs Native Battery -> VERSION_INCOMPATIBLE (no direct delta calculation).
 * 7. Native v1 vs Future incompatible v2 -> No direct comparison.
 * 8. Missing middle epoch -> No interpolation / fabricated points.
 * 9. Partial module reassessment -> Only relevant facets get updated trajectory points.
 * 10. Latest trajectory point strictly equals current UnifiedPsychologicalProfileV2 score.
 * 11. AI tries "significant improvement" -> Verifier rejects claim.
 * 12. Domain score null -> No domain numeric trend line.
 */

import {
  MASTER_DOMAINS,
  MASTER_CONSTRUCTS,
  MASTER_FACETS,
  TOTAL_MASTER_FACETS_COUNT,
  TOTAL_MASTER_CONSTRUCTS_COUNT,
  TOTAL_MASTER_DOMAINS_COUNT,
} from '../src/lib/profile/masterModelConstants';
import {
  buildLongitudinalProfile,
  buildLongitudinalEvidenceBundleV1,
  classifyObservedShift,
  evaluateDescriptiveStability,
} from '../src/lib/longitudinal/longitudinalEngine';
import {
  evaluateVersionCompatibility,
  validateSeriesCompatibility,
} from '../src/lib/longitudinal/versionCompatibility';
import { resolveUnifiedPsychologicalProfileV2 } from '../src/lib/profile/masterProfileResolver';
import { verifyAIInsightClaims } from '../src/lib/ai/verification/claimVerifier';
import { buildInterpretationPlanV2 } from '../src/lib/ai/planning/interpretationPlanner';
import { buildProfileEvidenceBundleV2 } from '../src/lib/profile/profileEvidenceBundle';
import { AIInsightV2 } from '../src/types/aiInsightV2';

let errors = 0;
let passes = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    errors++;
  } else {
    console.log(`  ✓ ${message}`);
    passes++;
  }
}

console.log('='.repeat(105));
console.log('PSYCHEAI LONGITUDINAL PROFILE & CHANGE TRACKING AUDIT (FAZ 2.20)');
console.log('='.repeat(105));

// Helper to create mock responses for specific facets
function createMockResponses(facetIds: string[], score: number = 4.0) {
  return facetIds.flatMap((fId, idx) => [
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
    userId: 'user_audit_longitudinal',
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

async function runAudit() {
  const hexacoHonestyFacets = ['sincerity', 'fairness', 'greed_avoidance', 'modesty'];

  // =========================================================================
  // TEST CASE 1: 1 Epoch -> NO_REPEAT_DATA
  // =========================================================================
  console.log('\n[Test 1] Single Epoch -> NO_REPEAT_DATA Invariant');
  const session1 = createMockSession({
    id: 'sess_1',
    moduleCode: 'mod_hexaco_hh',
    completedAt: new Date('2026-01-01T10:00:00Z'),
    responses: createMockResponses(hexacoHonestyFacets, 4.0),
  });

  const profile1 = buildLongitudinalProfile({
    userId: 'user_test_1',
    sessions: [session1],
  });

  assert(profile1.measurementEpochs.length === 1, 'Exactly 1 measurement epoch formed');
  assert(profile1.longitudinalReadiness.level === 'NO_REPEAT_DATA', 'Readiness is NO_REPEAT_DATA');
  assert(profile1.longitudinalReadiness.trajectoryEligibility === 'NOT_ELIGIBLE', 'Trajectory eligibility is NOT_ELIGIBLE');

  const sincerity1 = profile1.facetTrajectories.find((ft) => ft.facetId === 'sincerity');
  assert(sincerity1?.isRepeatMeasured === false, 'Facet is not marked as repeat measured');
  assert(sincerity1?.classification === 'NO_REPEAT_DATA', 'Classification is NO_REPEAT_DATA');
  assert(sincerity1?.firstScore === 4.0 && sincerity1?.latestScore === 4.0, 'First and latest scores match');
  assert(sincerity1?.absoluteChange === null, 'Absolute change is strictly null for single epoch');

  // =========================================================================
  // TEST CASE 2: 2 Epochs Same Facet -> Pairwise Observed Difference Only (No "Trend")
  // =========================================================================
  console.log('\n[Test 2] 2 Epochs -> PAIRWISE_CHANGE_ONLY (No Trend Claim)');
  const session2 = createMockSession({
    id: 'sess_2',
    moduleCode: 'mod_hexaco_hh',
    completedAt: new Date('2026-02-15T10:00:00Z'), // 45 days later
    responses: createMockResponses(hexacoHonestyFacets, 4.4),
  });

  const profile2 = buildLongitudinalProfile({
    userId: 'user_test_2',
    sessions: [session1, session2],
  });

  assert(profile2.measurementEpochs.length === 2, 'Exactly 2 measurement epochs formed');
  assert(profile2.longitudinalReadiness.level === 'TWO_EPOCHS', 'Readiness is TWO_EPOCHS');
  assert(profile2.longitudinalReadiness.trajectoryEligibility === 'PAIRWISE_CHANGE_ONLY', 'Trajectory eligibility is PAIRWISE_CHANGE_ONLY');

  const sincerity2 = profile2.facetTrajectories.find((ft) => ft.facetId === 'sincerity');
  assert(sincerity2?.isRepeatMeasured === true, 'Facet is marked as repeat measured');
  assert(sincerity2?.repeatCount === 2, 'Repeat count is 2');
  assert(sincerity2?.rawDelta === 0.4, 'Observed delta is 0.40');
  assert(sincerity2?.classification === 'SMALL_OBSERVED_SHIFT', 'Classification is SMALL_OBSERVED_SHIFT');
  assert(sincerity2?.direction === 'INCREASED', 'Direction is INCREASED');
  assert(sincerity2?.stability === 'INSUFFICIENT_DATA', 'Descriptive stability is INSUFFICIENT_DATA (<3 points)');

  // =========================================================================
  // TEST CASE 3: 3 Epochs -> TRAJECTORY_ELIGIBLE
  // =========================================================================
  console.log('\n[Test 3] 3 Epochs -> TRAJECTORY_ELIGIBLE');
  const session3 = createMockSession({
    id: 'sess_3',
    moduleCode: 'mod_hexaco_hh',
    completedAt: new Date('2026-04-01T10:00:00Z'),
    responses: createMockResponses(hexacoHonestyFacets, 4.2),
  });

  const profile3 = buildLongitudinalProfile({
    userId: 'user_test_3',
    sessions: [session1, session2, session3],
  });

  assert(profile3.measurementEpochs.length === 3, 'Exactly 3 measurement epochs formed');
  assert(profile3.longitudinalReadiness.level === 'THREE_PLUS_EPOCHS', 'Readiness is THREE_PLUS_EPOCHS');
  assert(profile3.longitudinalReadiness.trajectoryEligibility === 'TRAJECTORY_ELIGIBLE', 'Trajectory eligibility is TRAJECTORY_ELIGIBLE');

  const sincerity3 = profile3.facetTrajectories.find((ft) => ft.facetId === 'sincerity');
  assert(sincerity3?.points.length === 3, '3 trajectory points recorded');
  assert(sincerity3?.stability !== 'INSUFFICIENT_DATA', 'Descriptive stability is computed for 3+ points');

  // =========================================================================
  // TEST CASE 4: 5 Stable Epochs -> Descriptive Stability (CONSISTENTLY_HIGH / MID)
  // =========================================================================
  console.log('\n[Test 4] 5 Stable Epochs -> Descriptive Stability');
  const session4 = createMockSession({
    id: 'sess_4',
    moduleCode: 'mod_hexaco_hh',
    completedAt: new Date('2026-05-15T10:00:00Z'),
    responses: createMockResponses(hexacoHonestyFacets, 4.3),
  });
  const session5 = createMockSession({
    id: 'sess_5',
    moduleCode: 'mod_hexaco_hh',
    completedAt: new Date('2026-07-01T10:00:00Z'),
    responses: createMockResponses(hexacoHonestyFacets, 4.1),
  });

  const profile5 = buildLongitudinalProfile({
    userId: 'user_test_5',
    sessions: [session1, session2, session3, session4, session5],
  });

  assert(profile5.measurementEpochs.length === 5, 'Exactly 5 measurement epochs formed');
  assert(profile5.longitudinalReadiness.level === 'LONGITUDINAL_SERIES', 'Readiness is LONGITUDINAL_SERIES');
  assert(profile5.longitudinalReadiness.trajectoryEligibility === 'STABILITY_PATTERN_ELIGIBLE', 'Trajectory eligibility is STABILITY_PATTERN_ELIGIBLE');

  const sincerity5 = profile5.facetTrajectories.find((ft) => ft.facetId === 'sincerity');
  assert(sincerity5?.stability === 'CONSISTENTLY_HIGH', `Descriptive stability is CONSISTENTLY_HIGH (got ${sincerity5?.stability})`);
  assert(profile5.stabilitySummary.stableFacetsCount > 0, 'Stability summary contains stable facets');

  // =========================================================================
  // TEST CASE 5: Large Score Difference + Questionable Quality -> QUALITY_LIMITED
  // =========================================================================
  console.log('\n[Test 5] Large Delta + Questionable Response Quality -> QUALITY_LIMITED');
  const sessionQuestionable = createMockSession({
    id: 'sess_quest',
    moduleCode: 'mod_hexaco_hh',
    completedAt: new Date('2026-02-15T10:00:00Z'),
    responses: createMockResponses(hexacoHonestyFacets, 2.0), // large drop from 4.0 to 2.0
    integrityFlag: 'QUESTIONABLE',
  });

  const profileQuality = buildLongitudinalProfile({
    userId: 'user_test_q',
    sessions: [session1, sessionQuestionable],
  });

  const sincerityQ = profileQuality.facetTrajectories.find((ft) => ft.facetId === 'sincerity');
  assert(sincerityQ?.qualityLimited === true, 'qualityLimited is true');
  assert(sincerityQ?.classification === 'QUALITY_LIMITED', `Classification is QUALITY_LIMITED (got ${sincerityQ?.classification})`);
  assert(sincerityQ?.firstScore === 4.0 && sincerityQ?.latestScore === 2.0, 'Scores are NOT modified or altered');
  assert(sincerityQ?.rawDelta === -2.0, 'Raw delta is accurately preserved as -2.00');

  // =========================================================================
  // TEST CASE 6: Legacy 17-item vs Native Battery -> VERSION_INCOMPATIBLE
  // =========================================================================
  console.log('\n[Test 6] Legacy 17-item vs Native Battery -> VERSION_INCOMPATIBLE');
  const legacyCompat = evaluateVersionCompatibility(
    { batteryVersion: 'LEGACY_17_ITEM_FORM', measurementModelVersion: 'LEGACY', scoringVersion: 'LEGACY' },
    { batteryVersion: 'NATIVE_RESEARCH_BATTERY_V1', measurementModelVersion: 'PSYCHEAI_MASTER_MODEL_V1', scoringVersion: 'PRE_CALIBRATION_MEAN_V1' }
  );

  assert(legacyCompat.isCompatible === false, 'Legacy is incompatible with Native Battery');
  assert(legacyCompat.compatibilityType === 'VERSION_INCOMPATIBLE', 'Compatibility type is VERSION_INCOMPATIBLE');
  assert(legacyCompat.allowDirectTrajectory === false, 'Direct trajectory calculation is strictly prohibited');

  // =========================================================================
  // TEST CASE 7: Native v1 vs Future Incompatible v2 -> No Direct Comparison
  // =========================================================================
  console.log('\n[Test 7] Native v1 vs Future Incompatible v2 -> No Direct Comparison');
  const futureCompat = evaluateVersionCompatibility(
    { batteryVersion: 'NATIVE_RESEARCH_BATTERY_V1', scoringVersion: 'PRE_CALIBRATION_MEAN_V1' },
    { batteryVersion: 'FUTURE_UNMAPPED_BATTERY_V2', scoringVersion: 'FUTURE_SCORING_V2' }
  );

  assert(futureCompat.isCompatible === false, 'Future unmapped version is incompatible');
  assert(futureCompat.allowDirectTrajectory === false, 'Future unmapped trajectory is disallowed');

  // =========================================================================
  // TEST CASE 8: Missing Middle Epoch -> No Interpolation / Fabricated Points
  // =========================================================================
  console.log('\n[Test 8] Missing Middle Epoch -> No Interpolation');
  const sessionSelfAgencyEpoch2 = createMockSession({
    id: 'sess_self_agency_2',
    moduleCode: 'mod_self_agency',
    completedAt: new Date('2026-02-15T10:00:00Z'),
    responses: createMockResponses(['core_self_esteem'], 3.8),
  });

  // User completes Honesty in Epoch 1, Self-Agency in Epoch 2, Honesty again in Epoch 3
  const profileGaps = buildLongitudinalProfile({
    userId: 'user_test_gaps',
    sessions: [session1, sessionSelfAgencyEpoch2, session3],
  });

  const sincerityGaps = profileGaps.facetTrajectories.find((ft) => ft.facetId === 'sincerity');
  const selfEsteemGaps = profileGaps.facetTrajectories.find((ft) => ft.facetId === 'core_self_esteem');

  assert(sincerityGaps?.points.length === 2, `Sincerity has 2 points across 3 epochs (got ${sincerityGaps?.points.length})`);
  assert(sincerityGaps?.points[0].epochIndex === 1, 'First point is Epoch 1');
  assert(sincerityGaps?.points[1].epochIndex === 3, 'Second point is Epoch 3 (no fabricated Epoch 2 point)');
  assert(selfEsteemGaps?.points.length === 1, `Self-esteem has 1 point (got ${selfEsteemGaps?.points.length})`);
  assert(selfEsteemGaps?.points[0].epochIndex === 2, 'Self-esteem point is Epoch 2');

  // =========================================================================
  // TEST CASE 9: Partial Module Reassessment -> Only Relevant Facets Updated
  // =========================================================================
  console.log('\n[Test 9] Partial Module Reassessment -> Relevant Facets Only');
  const unrepeatedFacet = profileGaps.facetTrajectories.find((ft) => ft.facetId === 'organization');
  assert(unrepeatedFacet?.isRepeatMeasured === false, 'Unmeasured facet remains unrepeated');
  assert(unrepeatedFacet?.repeatCount === 0, 'Unmeasured facet repeatCount is 0');

  // =========================================================================
  // TEST CASE 10: Latest Trajectory Point == Current Profile Score
  // =========================================================================
  console.log('\n[Test 10] Latest Trajectory Point == Current Profile Score Consistency');
  const currentProfile = await resolveUnifiedPsychologicalProfileV2('user_test_consistency', {
    mockSessions: [session1, session2],
  });

  const longitudinalForConsistency = buildLongitudinalProfile({
    userId: 'user_test_consistency',
    sessions: [session1, session2],
  });

  for (const facetDef of MASTER_FACETS) {
    const currFacet = currentProfile.facets.find((f) => f.facetId === facetDef.facetId);
    const longFacet = longitudinalForConsistency.facetTrajectories.find((f) => f.facetId === facetDef.facetId);

    if (currFacet?.measurementStatus === 'MEASURED_PRECALIBRATION') {
      assert(
        currFacet.score === longFacet?.latestScore,
        `Facet ${facetDef.facetId} latest score matches (${currFacet.score} === ${longFacet?.latestScore})`
      );
    }
  }

  // =========================================================================
  // TEST CASE 11: AI Tries "Significant Improvement" -> Verifier Rejects
  // =========================================================================
  console.log('\n[Test 11] AI Claim Verifier Rejects "Significant Improvement" & Ungrounded Claims');
  const evidenceBundle = buildProfileEvidenceBundleV2(currentProfile);
  const plan = buildInterpretationPlanV2(evidenceBundle, {
    requestType: 'PROFILE_OVERVIEW',
  });

  const badInsight: AIInsightV2 = {
    insightId: 'ins_bad',
    type: 'PROFILE_OVERVIEW',
    titleTr: 'Profil Gelişimi',
    summaryTr: 'Kişiliğinizde significant improvement ve kalıcı değişim sağlandı.',
    bodyTr: 'Test sonuçlarınıza göre kişiliğiniz değişti ve sürekli artıyor.',
    claimStrength: 'DIRECT_MEASUREMENT',
    evidenceRefs: plan.primaryEvidence.map((e) => e.evidenceId),
    primaryEvidenceRefs: plan.primaryEvidence.map((e) => e.evidenceId),
    supportingEvidenceRefs: [],
    counterbalancingEvidenceRefs: [],
    measurementStatus: 'MEASURED_PRECALIBRATION',
    coverageStatus: 'Kapsam: %100',
    responseQualityStatus: 'EXCELLENT',
    reflectionPrompts: ['Düşünün'],
    limitations: ['Ön kalibrasyon'],
    generatedAt: new Date().toISOString(),
    modelProvider: 'TestProvider',
    modelName: 'test',
    promptVersion: 'v2',
    engineVersion: '2.0.0',
    isFallback: false,
  };

  const verification = verifyAIInsightClaims(badInsight, plan);
  assert(verification.isValid === false, 'Claim verifier rejected ungrounded bold longitudinal claim');
  assert(
    verification.errors.some((e) => e.includes('Kanıta dayanmayan')),
    'Caught forbidden ungrounded longitudinal pattern'
  );

  // =========================================================================
  // TEST CASE 12: Domain Score Null -> No Domain Numeric Trend Line
  // =========================================================================
  console.log('\n[Test 12] Domain Scores Strictly Null -> No Numeric Domain Trend Line');
  for (const domain of currentProfile.domains) {
    assert(domain.domainScore === null, `Domain ${domain.domainId} domainScore is strictly null`);
  }

  // Check construct trajectories with non-aggregatable constructs
  const locusConstructTraj = profile2.constructTrajectories.find((ct) => ct.constructId === 'locus_of_control');
  assert(
    locusConstructTraj?.allowsNumericTrend === false,
    'Non-aggregatable construct (locus_of_control) has allowsNumericTrend === false'
  );
  assert(
    locusConstructTraj?.points === null,
    'Non-aggregatable construct trajectory points are strictly null'
  );

  // =========================================================================
  // Summary Report
  // =========================================================================
  console.log('\n' + '='.repeat(105));
  console.log(`AUDIT RESULT: ${passes} passed, ${errors} failed.`);
  console.log('='.repeat(105));

  if (errors > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Fatal error during longitudinal audit:', err);
  process.exit(1);
});
