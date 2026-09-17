/**
 * PsycheAI AI Insight Service V2
 *
 * Authoritative orchestrator for Evidence-Grounded Psychological Interpretation Engine.
 *
 * Enforces:
 * - Deterministic interpretation planning before AI invocation.
 * - Minimum Necessary Data Principle (zero PII, zero raw item responses sent).
 * - Centralized DeepSeek configuration resolution with AES-256-GCM secret store.
 * - DeepSeek V4 Flash primary provider with safe deterministic fallback.
 * - Post-generation anti-hallucination and claim verification pass.
 * - Caching bound to profile snapshots and evidence hashes.
 * - User-facing evidence transparency ("Bu yorum neye dayanıyor?").
 * - Backward compatibility with legacy callers.
 */

import { UnifiedProfileViewModel } from '@/types/profile';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import {
  ProfileEvidenceBundleV2,
  buildProfileEvidenceBundleV2,
} from '@/lib/profile/profileEvidenceBundle';
import {
  AIInsightV2,
  InterpretationPlanV2,
  InsightType,
  UnifiedProfileAISectionData,
  EvidenceTransparencyInfo,
} from '@/types/aiInsightV2';
import {
  AIInsightInput,
  AIInsightOutput,
  AIInsightOutputSchema,
} from '@/types/aiInsight';
import {
  EvidenceSelectionRequest,
} from '@/lib/ai/evidence/evidenceSelector';
import { buildInterpretationPlanV2 } from '@/lib/ai/planning/interpretationPlanner';
import { getAIConfig } from '@/lib/ai/config/aiConfigResolver';
import { deepSeekProvider } from '@/lib/ai/providers/deepseekProvider';
import { deterministicFallbackProvider } from '@/lib/ai/providers/fallbackProvider';
import { verifyAIInsightClaims } from '@/lib/ai/verification/claimVerifier';
import {
  computeEvidenceHash,
  getCachedInsight,
  setCachedInsight,
} from '@/lib/ai/cache/insightCache';
import { PROMPT_VERSION_ID, PROMPT_ENGINE_VERSION } from '@/lib/ai/prompts/promptTemplatesV2';
import { validateAIInsightPolicy } from '@/lib/aiInsightPolicy';
import { resolveDescriptiveBand } from '@/lib/descriptiveBandPolicyRegistry';
import { UNIFIED_INTERACTION_RULES } from '@/lib/unifiedInteractionRegistry';

// =========================================================================
// 1. FAZ 2.18 CORE INSIGHT ENGINE V2 ORCHESTRATOR
// =========================================================================

export async function generateProfileInsightV2(
  bundle: ProfileEvidenceBundleV2,
  request: EvidenceSelectionRequest,
  snapshotId?: string
): Promise<AIInsightV2> {
  // 1. Deterministic Planning
  const plan = buildInterpretationPlanV2(bundle, request);
  const evidenceHash = computeEvidenceHash(plan);
  const resolvedSnapshotId = snapshotId || `snap_${bundle.userId}_${bundle.generatedAt}`;

  // 2. Cache Lookup
  const cached = getCachedInsight(
    resolvedSnapshotId,
    request.requestType,
    evidenceHash,
    PROMPT_VERSION_ID
  );
  if (cached) {
    return cached;
  }

  // 3. Resolve AI Configuration
  const config = await getAIConfig();

  let generatedInsight: AIInsightV2 | null = null;

  // 4. Try External Provider if Enabled and Available
  if (config.isAvailable && config.apiKey) {
    try {
      const externalOutput = await deepSeekProvider.generateStructuredInsight(plan, config);

      // 5. Anti-Hallucination Claim Verification Pass
      const verification = verifyAIInsightClaims(externalOutput, plan);
      if (verification.isValid && verification.metrics.unsupportedClaims === 0) {
        generatedInsight = externalOutput;
      } else {
        console.warn(
          'DeepSeek output failed grounding verification, falling back to deterministic:',
          verification.errors
        );
      }
    } catch (err: any) {
      console.warn('DeepSeek provider call failed, falling back to deterministic:', err.message);
    }
  }

  // 6. Safe Deterministic Fallback if External AI is Disabled or Failed
  if (!generatedInsight) {
    const fallbackOutput = await deterministicFallbackProvider.generateStructuredInsight(
      plan,
      config
    );
    const fallbackVerification = verifyAIInsightClaims(fallbackOutput, plan);
    if (!fallbackVerification.isValid) {
      console.error(
        'Critical: Deterministic fallback failed claim verification:',
        fallbackVerification.errors
      );
    }
    generatedInsight = fallbackOutput;
  }

  // 7. Store in Cache Bound to Snapshot
  setCachedInsight(
    resolvedSnapshotId,
    request.requestType,
    evidenceHash,
    PROMPT_VERSION_ID,
    PROMPT_ENGINE_VERSION,
    generatedInsight
  );

  return generatedInsight;
}

/**
 * Builds the complete "Profilinin Anlamı" section data for the Master Unified Profile V2.
 */
export async function getUnifiedProfileAISectionData(
  profile: UnifiedPsychologicalProfileV2,
  snapshotId?: string
): Promise<UnifiedProfileAISectionData> {
  const bundle = buildProfileEvidenceBundleV2(profile);
  const resolvedSnapshotId = snapshotId || `snap_${profile.userId}_${profile.generatedAt}`;

  // 1. Profile Overview
  const overviewInsight = await generateProfileInsightV2(
    bundle,
    { requestType: 'PROFILE_OVERVIEW' },
    resolvedSnapshotId
  );

  // 2. Prominent Patterns (from active cross-domain patterns)
  const prominentPatternInsights: AIInsightV2[] = [];
  for (const pattern of bundle.crossDomainPatterns.slice(0, 3)) {
    const insight = await generateProfileInsightV2(
      bundle,
      {
        requestType: 'CROSS_DOMAIN_PATTERN',
        targetFacetIds: pattern.sourceFacetIds,
      },
      resolvedSnapshotId
    );
    prominentPatternInsights.push(insight);
  }

  // 3. Counterbalancing Traits Insights
  const counterbalancingInsights: AIInsightV2[] = [];
  // Generate insights for top measured traits that have balancing factors
  const plan = buildInterpretationPlanV2(bundle, { requestType: 'PROFILE_OVERVIEW' });
  for (const counter of plan.counterbalancingEvidence.slice(0, 2)) {
    const insight = await generateProfileInsightV2(
      bundle,
      {
        requestType: 'FACET_INTERPRETATION',
        targetFacetIds: [counter.targetId],
      },
      resolvedSnapshotId
    );
    counterbalancingInsights.push(insight);
  }

  // 4. Tension Insights
  const tensionInsights: AIInsightV2[] = [];
  for (const tension of bundle.tensions.slice(0, 3)) {
    const insight = await generateProfileInsightV2(
      bundle,
      {
        requestType: 'TENSION_INTERPRETATION',
        targetFacetIds: tension.sourceFacetIds,
      },
      resolvedSnapshotId
    );
    tensionInsights.push(insight);
  }

  // 5. Synergy Insights
  const synergyInsights: AIInsightV2[] = [];
  for (const synergy of bundle.synergies.slice(0, 3)) {
    const insight = await generateProfileInsightV2(
      bundle,
      {
        requestType: 'SYNERGY_INTERPRETATION',
        targetFacetIds: synergy.sourceFacetIds,
      },
      resolvedSnapshotId
    );
    synergyInsights.push(insight);
  }

  // 6. Unmeasured Areas Guidance
  const unmeasuredAreaInsights: AIInsightV2[] = [];
  const unmeasuredDomains = profile.domains.filter((d) => d.coverageRatio === 0);
  for (const ud of unmeasuredDomains.slice(0, 2)) {
    const insight = await generateProfileInsightV2(
      bundle,
      {
        requestType: 'DOMAIN_INTERPRETATION',
        targetDomainIds: [ud.domainId],
      },
      resolvedSnapshotId
    );
    unmeasuredAreaInsights.push(insight);
  }

  // 7. Next Assessment Recommendation
  let nextAssessmentPrompt: AIInsightV2 | null = null;
  if (profile.nextBestAssessment) {
    nextAssessmentPrompt = await generateProfileInsightV2(
      bundle,
      {
        requestType: 'NEXT_EXPLORATION',
        targetModuleCode: profile.nextBestAssessment.moduleCode,
      },
      resolvedSnapshotId
    );
  }

  return {
    overviewInsight,
    prominentPatternInsights,
    counterbalancingInsights,
    tensionInsights,
    synergyInsights,
    unmeasuredAreaInsights,
    nextAssessmentPrompt,
    generatedAt: new Date().toISOString(),
    isFallback: overviewInsight.isFallback,
  };
}

/**
 * Builds module-level AI insight for Assessment Results page.
 */
export async function getAssessmentResultAIInsight(
  bundle: ProfileEvidenceBundleV2,
  moduleCode: string,
  snapshotId?: string
): Promise<AIInsightV2> {
  return generateProfileInsightV2(
    bundle,
    {
      requestType: 'ASSESSMENT_RESULT',
      targetModuleCode: moduleCode,
    },
    snapshotId
  );
}

export { getEvidenceTransparencyInfo } from '@/lib/ai/evidence/evidenceTransparency';

// =========================================================================
// 2. BACKWARD COMPATIBILITY ADAPTERS (LEGACY CALLERS)
// =========================================================================

export function buildAIInsightInputPayload(
  profile: UnifiedProfileViewModel
): AIInsightInput {
  const confidenceByDimId = new Map(
    profile.confidenceMap.dimensions.map((c) => [c.dimensionId, c])
  );
  const facetById = new Map(profile.allFacets84.map((f) => [f.facetId, f]));

  const measuredDimensions = profile.fingerprint.dimensions
    .filter((d) => d.isMeasured && d.nativeScore !== null)
    .map((d) => {
      const conf = confidenceByDimId.get(d.id);
      const facet = facetById.get(d.id);

      const confidenceLevel =
        conf?.level || (facet?.confidenceLevel as 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH') || 'LOW';
      const itemCount =
        conf?.itemCount !== undefined
          ? conf.itemCount
          : facet?.itemCount !== undefined
          ? facet.itemCount
          : null;
      const scoringStrategyCode = facet?.scale?.scoringModelCode || undefined;
      const epistemicStatus = facet?.epistemicStatus || 'PROVISIONAL_POINT_ESTIMATE';
      const instrumentProvenance = d.instrumentName || facet?.provenance?.moduleTitleTr || null;

      return {
        dimensionId: d.id,
        code: d.code,
        nameTr: d.nameTr,
        domainNameTr: d.domainNameTr,
        rawScore: d.nativeScore!,
        scaleMin: d.scaleMin,
        scaleMax: d.scaleMax,
        scoringStrategyCode,
        epistemicStatus,
        confidenceLevel,
        itemCount,
        instrumentProvenance,
      };
    });

  const registeredInteractions = profile.interactions.map((i) => {
    const rule = UNIFIED_INTERACTION_RULES.find((r) => r.id === i.id);
    const sourceDimensionCodes = rule?.requiredConstructCodes || [];

    return {
      id: i.id,
      titleTr: i.titleTr,
      type: i.type as 'SYNERGY' | 'TENSION' | 'MODULATION',
      descriptionTr: i.descriptionTr,
      epistemicStatus: i.epistemicStatus,
      sourceDimensions: i.sourceDimensions,
      sourceDimensionCodes,
    };
  });

  const unmeasuredGaps = profile.unmeasuredDomains.map((u) => ({
    domainCode: u.code,
    domainNameTr: u.nameTr,
    whyItMattersTr: u.whyItMattersTr,
    availableAssessmentTitleTr: u.availableAssessmentTitleTr,
  }));

  const sourceInstruments = profile.sourceAssessments.map((s) => ({
    instrumentName: s.moduleTitleTr,
    formVersion: s.formVersionCode,
    scoringModel: s.scoringModelCode,
    measuredAt: s.completedAt,
  }));

  return {
    userId: profile.userId,
    measuredDimensions,
    responseQualitySummary: {
      overallFlag: profile.responseQuality.overallFlag,
      isClean: profile.responseQuality.isClean,
      headlineTr: profile.responseQuality.headlineTr,
      speedViolationsCount: profile.responseQuality.speedViolationsCount,
      straightliningDetected: profile.responseQuality.straightliningDetected,
      attentionChecksPassed: profile.responseQuality.attentionChecksPassed,
    },
    registeredInteractions,
    unmeasuredGaps,
    sourceInstruments,
  };
}

export function generateDeterministicAIInsights(
  input: AIInsightInput
): AIInsightOutput {
  const measuredCount = input.measuredDimensions.length;

  let headline = 'Psikolojik Ölçüm ve Dinamikler Özeti';
  let summary = '';

  if (measuredCount === 0) {
    headline = 'Henüz Tamamlanmış Psikolojik Ölçüm Bulunmuyor';
    summary =
      'Psikolojik profilinizi oluşturmak ve güçlü yönlerinizi keşfetmek için ilk değerlendirme modülünü tamamlayabilirsiniz.';
  } else {
    headline = `${measuredCount} Psikolojik Boyut Üzerinden Bütünsel Profil Analizi`;
    summary = `Tamamlanan değerlendirmeleriniz, ${measuredCount} ampirik psikolojik boyut üzerinden belirgin eğilimlerinizi, içsel sinerjilerinizi ve bağlamsal etkileşimlerinizi ortaya koymaktadır. Bu analizler tanısal değil, öz-farkındalık ve gelişim odaklıdır.`;
  }

  const observations = input.measuredDimensions.slice(0, 5).map((dim) => {
    const band = resolveDescriptiveBand(
      dim.rawScore,
      dim.scaleMin,
      dim.scaleMax,
      dim.scoringStrategyCode
    );

    let observationTr = '';
    if (
      band.policyEnabled &&
      band.state !== 'DESCRIPTIVE_BAND_UNAVAILABLE' &&
      band.state !== 'UNMEASURED'
    ) {
      observationTr = `${dim.nameTr} boyutu ${dim.rawScore.toFixed(2)} (${dim.scaleMin}–${dim.scaleMax}) puanıyla ${band.labelTr.toLowerCase()} konumlanmaktadır.`;
    } else {
      observationTr = `${dim.nameTr} puanı ${dim.rawScore.toFixed(2)}, ölçek aralığı ${dim.scaleMin}–${dim.scaleMax}.`;
    }

    const epistemicStatus =
      dim.confidenceLevel === 'HIGH'
        ? 'EVIDENCE_SUPPORTED_INTERPRETATION'
        : 'PROVISIONAL_PATTERN';

    return {
      sourceDimensionIds: [dim.dimensionId],
      observationTr,
      confidenceLevel: dim.confidenceLevel,
      epistemicStatus,
    };
  });

  const dimByCode = new Map(input.measuredDimensions.map((d) => [d.code, d]));
  const tensions: AIInsightOutput['tensions'] = [];
  const synergies: AIInsightOutput['synergies'] = [];

  for (const inter of input.registeredInteractions) {
    let resolvedDimensionIds: string[] = [];

    if (inter.sourceDimensionCodes && inter.sourceDimensionCodes.length > 0) {
      const allFound = inter.sourceDimensionCodes.every((code) => dimByCode.has(code));
      if (allFound) {
        resolvedDimensionIds = inter.sourceDimensionCodes.map(
          (code) => dimByCode.get(code)!.dimensionId
        );
      }
    } else {
      const matched = input.measuredDimensions.filter((d) =>
        inter.sourceDimensions.some(
          (sd) =>
            sd.toLowerCase().includes(d.nameTr.toLowerCase()) ||
            d.nameTr.toLowerCase().includes(sd.toLowerCase())
        )
      );
      if (matched.length >= 2) {
        resolvedDimensionIds = matched.map((d) => d.dimensionId);
      }
    }

    if (resolvedDimensionIds.length === 0) {
      continue;
    }

    if (inter.type === 'TENSION' || inter.type === 'MODULATION') {
      tensions.push({
        sourceDimensionIds: resolvedDimensionIds,
        registeredInteractionId: inter.id,
        tensionTr: inter.descriptionTr,
        reflectionQuestionTr:
          'Bu iki eğilimin karşı karşıya geldiği durumlarda hangi tarafın karar süreçlerinizi yönlendirmesini tercih edersiniz?',
      });
    } else if (inter.type === 'SYNERGY') {
      synergies.push({
        sourceDimensionIds: resolvedDimensionIds,
        registeredInteractionId: inter.id,
        synergyTr: inter.descriptionTr,
      });
    }
  }

  const profileGaps = input.unmeasuredGaps.slice(0, 3).map((g) => ({
    domainCode: g.domainCode,
    domainNameTr: g.domainNameTr,
    reasonTr: g.whyItMattersTr,
    recommendedAssessmentTitleTr: g.availableAssessmentTitleTr,
  }));

  const reflectionQuestions = [
    'Günlük iş veya sosyal yaşamınızda hangi güçlü özellikleriniz en çok destek oluyor?',
    'Karar alma anlarında rasyonel planlama ile içsel sezgileriniz nasıl etkileşime giriyor?',
    'Stresli anlarda tepkilerinizi yönetmek için hangi başa çıkma stratejilerini kullanıyorsunuz?',
  ];

  const provenanceReferences = input.sourceInstruments.map((s) => ({
    instrumentName: s.instrumentName,
    formVersion: s.formVersion,
  }));

  const limitations = [
    'Ön-kalibrasyon aşaması: Puanlar yerel ölçek ortalamalarını yansıtır, temsili nüfus yüzdeliği içermez.',
    'Tanısal değildir: Kişilik ve benlik özellikleri klinik tanı veya psikopatoloji değerlendirmesi amacı taşımaz.',
    'Öz-bildirim esası: Sonuçlar kullanıcının ampirik değerlendirmelerdeki öz-bildirim yanıtlarına dayanır.',
  ];

  return {
    headline,
    summary,
    observations,
    tensions,
    synergies,
    profileGaps,
    reflectionQuestions,
    provenanceReferences,
    limitations,
  };
}

export async function getProfileAIInsights(
  profile: UnifiedProfileViewModel
): Promise<AIInsightOutput> {
  const inputPayload = buildAIInsightInputPayload(profile);
  const config = await getAIConfig();

  if (!config.isAvailable || !config.apiKey) {
    return generateDeterministicAIInsights(inputPayload);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs || 8000);

  try {
    const systemPrompt = `You are the PsycheAI Scientific Synthesis Engine.
Your SOLE responsibility is to articulate structured, deterministic psychometric data into clear, compassionate Turkish profile insights.

STRICT INVIOLABLE RULES:
1. NEVER alter, calculate, or guess any psychometric scores.
2. NEVER formulate clinical diagnoses (depression, ADHD, bipolar, autism, personality disorders).
3. In pre-calibration mode, NEVER generate percentile claims like "toplumun %80'inden yüksek".
4. Every observation MUST reference valid sourceDimensionIds present in input.measuredDimensions.
5. Every tension and synergy MUST reference valid sourceDimensionIds and a valid registeredInteractionId.
6. Output MUST strictly conform to the requested JSON schema.`;

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'deepseek-v4-flash',
        max_tokens: 1500,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(inputPayload) },
        ],
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`DeepSeek API returned HTTP ${response.status}. Using deterministic fallback.`);
      return generateDeterministicAIInsights(inputPayload);
    }

    const rawJson = await response.json();
    const content = rawJson?.choices?.[0]?.message?.content;
    if (!content) {
      return generateDeterministicAIInsights(inputPayload);
    }

    const parsedJson = JSON.parse(content);
    const validatedOutput = AIInsightOutputSchema.parse(parsedJson);

    const policyCheck = validateAIInsightPolicy(validatedOutput, inputPayload);
    if (!policyCheck.isValid) {
      console.warn('AI output failed PsycheAI policy check category:', policyCheck.errors.length);
      return generateDeterministicAIInsights(inputPayload);
    }

    return validatedOutput;
  } catch (err: any) {
    clearTimeout(timeoutId);
    return generateDeterministicAIInsights(inputPayload);
  }
}
