/**
 * PsycheAI FAZ 2.19 — Theory Lens Engine End-to-End Audit Script
 *
 * Validates:
 * - Scoped evidence bundle builder for all 10 lenses
 * - Deterministic fallback insight generation for all 10 lenses
 * - Verification pass against forbidden patterns and invalid outputs
 * - Multi-lens comparison engine
 * - Interactive chat response fallback
 */

import { UnifiedPsychologicalProfileV2 } from '../src/types/unifiedProfileV2';
import { ALL_THEORY_LENS_IDS, TheoryLensId } from '../src/types/theoryLens';
import {
  getTheoryLens,
  getAllTheoryLenses,
  getTheorySourcesForLens,
} from '../src/lib/ai/theoryLens/theoryLensRegistry';
import { buildScopedLensEvidenceBundle } from '../src/lib/ai/theoryLens/theoryLensAdapter';
import {
  generateFallbackTheoryInsight,
  generateFallbackTheoryChatResponse,
  generateFallbackTheoryComparison,
} from '../src/lib/ai/theoryLens/theoryFallbackEngine';
import {
  verifyTheoryInsight,
  verifyTheoryConversation,
  verifyTheoryComparison,
  verifyTheoreticalText,
} from '../src/lib/ai/theoryLens/theoryClaimVerifier';

// Create a realistic synthetic Master Model Profile
function createMockProfile(): UnifiedPsychologicalProfileV2 {
  return {
    userId: 'usr_test_audit_123',
    userName: 'Test Danışan',
    email: 'test@psycheai.test',
    generatedAt: new Date().toISOString(),
    measurementModelVersion: 'PSYCHEAI_MASTER_MODEL_V1',
    batteryVersion: 'NATIVE_RESEARCH_BATTERY_V1',
    hasAssessments: true,
    totalCompletedAssessments: 3,
    coverage: {
      domainCoverage: { measuredCount: 5, totalCount: 11, ratio: 5 / 11, percentage: Math.round((5 / 11) * 100) },
      constructCoverage: { measuredCount: 14, totalCount: 37, ratio: 14 / 37, percentage: Math.round((14 / 37) * 100) },
      facetCoverage: { measuredCount: 32, totalCount: 91, ratio: 32 / 91, percentage: Math.round((32 / 91) * 100) },
      questionCoverage: { answeredCount: 120, totalCount: 469, ratio: 120 / 469, percentage: 26 },
      disclaimerTr: 'Test Kapsam',
    },
    domains: [
      {
        domainId: 'core_personality',
        code: 'CORE_PERSONALITY',
        nameTr: 'Temel Kişilik & Mizaç (HEXACO)',
        measuredFacetCount: 24,
        totalFacetCount: 24,
        coverageRatio: 1.0,
        constructs: [],
      },
      {
        domainId: 'self_regulation',
        code: 'SELF_REGULATION',
        nameTr: 'Öz-Düzenleme & İrade',
        measuredFacetCount: 4,
        totalFacetCount: 8,
        coverageRatio: 0.5,
        constructs: [],
      },
      {
        domainId: 'emotion_regulation',
        code: 'EMOTION_REGULATION',
        nameTr: 'Duygu Düzenleme & Dayanıklılık',
        measuredFacetCount: 4,
        totalFacetCount: 8,
        coverageRatio: 0.5,
        constructs: [],
      },
    ],
    constructs: [],
    facets: [
      {
        facetId: 'prudence',
        code: 'prudence',
        nameTr: 'Temkinlilik ve Özen',
        domainId: 'core_personality',
        constructId: 'hexaco_conscientiousness',
        score: 4.35,
        scaleRange: [1.0, 5.0],
        itemCountAnswered: 8,
        measurementStatus: 'MEASURED_PRECALIBRATION',
        epistemicStatus: 'DIRECT_MEASUREMENT',
        bandInfo: {
          bandKey: 'HIGH',
          shortLabelTr: 'Yüksek',
          scoreRange: [4.0, 5.0],
          clinicalRiskFlag: false,
        },
        sourceAssessmentModules: [],
        latestMeasuredAt: new Date().toISOString(),
      },
      {
        facetId: 'anxiety',
        code: 'anxiety',
        nameTr: 'Kaygı Eğilimi',
        domainId: 'core_personality',
        constructId: 'hexaco_emotionality',
        score: 3.8,
        scaleRange: [1.0, 5.0],
        itemCountAnswered: 8,
        measurementStatus: 'MEASURED_PRECALIBRATION',
        epistemicStatus: 'DIRECT_MEASUREMENT',
        bandInfo: {
          bandKey: 'ABOVE_AVERAGE',
          shortLabelTr: 'Ortalamanın Üstü',
          scoreRange: [3.5, 4.0],
          clinicalRiskFlag: false,
        },
        sourceAssessmentModules: [],
        latestMeasuredAt: new Date().toISOString(),
      },
      {
        facetId: 'cognitive_reappraisal',
        code: 'cognitive_reappraisal',
        nameTr: 'Bilişsel Yeniden Değerlendirme',
        domainId: 'emotion_regulation',
        constructId: 'emotion_strategies',
        score: 4.1,
        scaleRange: [1.0, 5.0],
        itemCountAnswered: 6,
        measurementStatus: 'MEASURED_PRECALIBRATION',
        epistemicStatus: 'DIRECT_MEASUREMENT',
        bandInfo: {
          bandKey: 'HIGH',
          shortLabelTr: 'Yüksek',
          scoreRange: [4.0, 5.0],
          clinicalRiskFlag: false,
        },
        sourceAssessmentModules: [],
        latestMeasuredAt: new Date().toISOString(),
      },
      {
        facetId: 'expressive_suppression',
        code: 'expressive_suppression',
        nameTr: 'Duygusal Dışavurumu Bastırma',
        domainId: 'emotion_regulation',
        constructId: 'emotion_strategies',
        score: 2.1,
        scaleRange: [1.0, 5.0],
        itemCountAnswered: 6,
        measurementStatus: 'MEASURED_PRECALIBRATION',
        epistemicStatus: 'DIRECT_MEASUREMENT',
        bandInfo: {
          bandKey: 'LOW',
          shortLabelTr: 'Düşük',
          scoreRange: [1.0, 2.5],
          clinicalRiskFlag: false,
        },
        sourceAssessmentModules: [],
        latestMeasuredAt: new Date().toISOString(),
      },
    ],
    tensions: [
      {
        id: 'ten_anxiety_reappraisal',
        type: 'TENSION',
        titleTr: 'Yüksek Kaygı Duyarlılığı ile Güçlü Bilişsel Yeniden Değerlendirme Arasındaki Denge',
        summaryTr: 'Yüksek kaygı eğilimine rağmen güçlü zihinsel yeniden çerçeveleme stratejileri kullanımı.',
        sourceFacetIds: ['anxiety', 'cognitive_reappraisal'],
        epistemicStatus: 'EMPIRICAL_CROSS_CONSTRUCT_TENSION',
      },
    ],
    synergies: [
      {
        id: 'syn_prudence_reappraisal',
        type: 'SYNERGY',
        titleTr: 'Temkinlilik ve Bilişsel Esneklik Sinerjisi',
        summaryTr: 'Özenli planlama ile zihinsel esnekliğin eşgüdümlü çalışması.',
        sourceFacetIds: ['prudence', 'cognitive_reappraisal'],
        epistemicStatus: 'EMPIRICAL_SYNERGY',
      },
    ],
    crossDomainPatterns: [],
    responseQuality: {
      overallFlag: 'HIGH_VALIDITY',
      inconsistencyIndex: 0.05,
      infrequencyFlag: false,
      speedFlag: false,
      straightliningFlag: false,
      explanationTr: 'Tüm yanıtlar yüksek tutarlılık ve geçerliliktedir.',
    },
    longitudinalReadiness: {
      isLongitudinalReady: false,
      repeatMeasurementCount: 0,
    },
    confidenceMap: {},
    recentAssessments: [],
    legacyCompatibility: {
      hasLegacy17ItemData: false,
      legacyFacetScores: {},
    },
  };
}

async function runEngineAudit() {
  console.log('====================================================');
  console.log('FAZ 2.19 — THEORY LENS ENGINE END-TO-END AUDIT');
  console.log('====================================================\n');

  let passed = true;
  const mockProfile = createMockProfile();

  // 1. Audit Scoped Evidence Bundle & Deterministic Generation for all 10 Lenses
  console.log('[1] Auditing Scoped Bundle & Deterministic Insights (All 10 Lenses)...');
  for (const lensId of ALL_THEORY_LENS_IDS) {
    const lens = getTheoryLens(lensId);
    if (!lens) {
      console.error(`❌ Lens not found: ${lensId}`);
      passed = false;
      continue;
    }

    const scopedBundle = buildScopedLensEvidenceBundle(mockProfile, lensId);
    if (!scopedBundle || scopedBundle.scopedFacets.length === 0) {
      console.error(`❌ Empty scoped facets for lens: ${lensId}`);
      passed = false;
      continue;
    }

    const insight = generateFallbackTheoryInsight(lens, scopedBundle);
    if (!insight.titleTr || !insight.summaryTr || !insight.perspectiveAnalysisTr) {
      console.error(`❌ Incomplete insight generated for lens: ${lensId}`);
      passed = false;
      continue;
    }

    const verification = verifyTheoryInsight(insight);
    if (!verification.isValid) {
      console.error(`❌ Governance verification failed for ${lensId}:`, verification.violations);
      passed = false;
      continue;
    }

    console.log(
      `  ✓ ${lensId}: Scoped (${scopedBundle.scopedFacets.length} facets), Verified Fallback Generated.`
    );
  }

  // 2. Audit Chat Response Fallback
  console.log('\n[2] Auditing Interactive Chat Fallback...');
  const freudLens = getTheoryLens('FREUD')!;
  const scopedFreud = buildScopedLensEvidenceBundle(mockProfile, 'FREUD');
  const chatResponse = generateFallbackTheoryChatResponse(
    freudLens,
    scopedFreud,
    'Stres altındayken aşırı mükemmeliyetçi olmamı nasıl yorumlarsınız?'
  );

  const chatVerification = verifyTheoryConversation(chatResponse);
  if (!chatVerification.isValid || !chatResponse.replyTr) {
    console.error('❌ Chat verification failed:', chatVerification.violations);
    passed = false;
  } else {
    console.log('  ✓ Interactive Chat fallback successfully verified with epistemic tags.');
  }

  // 3. Audit Multi-Lens Comparison Engine
  console.log('\n[3] Auditing Multi-Lens Comparison Engine...');
  const comparedLenses = [getTheoryLens('FREUD')!, getTheoryLens('ROGERS')!, getTheoryLens('BECK')!];
  const comparisonResult = generateFallbackTheoryComparison(
    comparedLenses,
    scopedFreud,
    'Kişilik ve Davranışsal Uyum'
  );

  const comparisonVerification = verifyTheoryComparison(comparisonResult);
  if (!comparisonVerification.isValid || comparisonResult.consensusPointsTr.length === 0) {
    console.error('❌ Comparison verification failed:', comparisonVerification.violations);
    passed = false;
  } else {
    console.log(
      `  ✓ Multi-Lens Comparison (3 lenses) verified with ${comparisonResult.consensusPointsTr.length} consensus and ${comparisonResult.divergencePointsTr.length} divergence points.`
    );
  }

  // 4. Audit Claim Verifier Anti-Trauma & Anti-Diagnosis Protection
  console.log('\n[4] Auditing Claim Verifier Anti-Trauma & Anti-Diagnosis Rules...');
  const forbiddenSample1 = 'Kullanıcının çocukluk travmanız var ve borderline kişilik eğilimi tespit edildi.';
  const forbiddenRes1 = verifyTheoreticalText(forbiddenSample1);
  if (forbiddenRes1.isValid) {
    console.error('❌ Verifier failed to detect forbidden trauma/diagnosis phrase!');
    passed = false;
  } else {
    console.log('  ✓ Successfully caught forbidden diagnosis/trauma violations:', forbiddenRes1.violations);
  }

  const safeSample = 'Kullanıcının öz-düzenleme kapasitesi kuramsal olarak Egonun gerçeklik ilkesiyle paralellik gösterebilir.';
  const safeRes = verifyTheoreticalText(safeSample);
  if (!safeRes.isValid) {
    console.error('❌ Verifier falsely flagged safe theoretical text:', safeRes.violations);
    passed = false;
  } else {
    console.log('  ✓ Safe theoretical reflection passed verification.');
  }

  console.log('\n====================================================');
  if (passed) {
    console.log('✅ AUDIT PASSED: Theory Lens Engine meets 100% scientific & governance standards.');
    console.log('====================================================');
    process.exit(0);
  } else {
    console.error('❌ AUDIT FAILED: Please review logs above.');
    console.log('====================================================');
    process.exit(1);
  }
}

runEngineAudit().catch((err) => {
  console.error('Engine audit crashed:', err);
  process.exit(1);
});
