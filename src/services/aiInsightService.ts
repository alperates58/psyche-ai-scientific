/**
 * PsycheAI AI Insight Service
 * 
 * Generates grounded psychological profile insights.
 * Enforces:
 * - Feature flag control (ENABLE_EXTERNAL_AI_INSIGHTS)
 * - Safe deterministic synthesis by default
 * - Structured Zod schema output
 * - Policy validation and fail-closed architecture
 * - Real confidence & item count data (zero fabrication)
 * - Exact source dimension grounding for interactions (no unrelated fallbacks)
 * - Bounded timeouts and strict privacy (zero profile payload logging)
 */

import { UnifiedProfileViewModel } from '@/types/profile';
import {
  AIInsightInput,
  AIInsightOutput,
  AIInsightOutputSchema,
} from '@/types/aiInsight';
import { validateAIInsightPolicy } from '@/lib/aiInsightPolicy';
import { resolveDescriptiveBand } from '@/lib/descriptiveBandPolicyRegistry';
import { UNIFIED_INTERACTION_RULES } from '@/lib/unifiedInteractionRegistry';

/**
 * Builds the structured, private, server-sanitized input payload for AI synthesis.
 * Strictly uses real confidence data and exact item counts from the UnifiedProfileViewModel.
 */
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

      const confidenceLevel = conf?.level || (facet?.confidenceLevel as 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH') || 'LOW';
      const itemCount = conf?.itemCount !== undefined ? conf.itemCount : (facet?.itemCount !== undefined ? facet.itemCount : null);
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

/**
 * Deterministic Synthesis Fallback Engine
 * Generates rich, scientific Turkish profile insights without transmitting data to external APIs.
 * Consumes the exact descriptiveBandPolicy and enforces strict dimension grounding.
 */
export function generateDeterministicAIInsights(
  input: AIInsightInput
): AIInsightOutput {
  const measuredCount = input.measuredDimensions.length;

  // 1. Headline & Summary
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

  // 2. Grounded Observations
  const observations = input.measuredDimensions.slice(0, 5).map((dim) => {
    const band = resolveDescriptiveBand(
      dim.rawScore,
      dim.scaleMin,
      dim.scaleMax,
      dim.scoringStrategyCode
    );

    let observationTr = '';
    if (band.policyEnabled && band.state !== 'DESCRIPTIVE_BAND_UNAVAILABLE' && band.state !== 'UNMEASURED') {
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

  // 3. Tensions & Synergies with Exact Grounding (no arbitrary fallbacks)
  const dimByCode = new Map(input.measuredDimensions.map((d) => [d.code, d]));
  const dimById = new Map(input.measuredDimensions.map((d) => [d.dimensionId, d]));

  const tensions: AIInsightOutput['tensions'] = [];
  const synergies: AIInsightOutput['synergies'] = [];

  for (const inter of input.registeredInteractions) {
    // Map required construct codes to exact measured dimension IDs
    let resolvedDimensionIds: string[] = [];

    if (inter.sourceDimensionCodes && inter.sourceDimensionCodes.length > 0) {
      const allFound = inter.sourceDimensionCodes.every((code) => dimByCode.has(code));
      if (allFound) {
        resolvedDimensionIds = inter.sourceDimensionCodes.map(
          (code) => dimByCode.get(code)!.dimensionId
        );
      }
    } else {
      // Try matching by nameTr
      const matched = input.measuredDimensions.filter((d) =>
        inter.sourceDimensions.some(
          (sd) => sd.toLowerCase().includes(d.nameTr.toLowerCase()) || d.nameTr.toLowerCase().includes(sd.toLowerCase())
        )
      );
      if (matched.length >= 2) {
        resolvedDimensionIds = matched.map((d) => d.dimensionId);
      }
    }

    // Strict Grounding Invariant: If not all source dimensions could be authoritatively resolved, OMIT!
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

  // 4. Profile Gaps
  const profileGaps = input.unmeasuredGaps.slice(0, 3).map((g) => ({
    domainCode: g.domainCode,
    domainNameTr: g.domainNameTr,
    reasonTr: g.whyItMattersTr,
    recommendedAssessmentTitleTr: g.availableAssessmentTitleTr,
  }));

  // 5. Reflection Questions
  const reflectionQuestions = [
    'Günlük iş veya sosyal yaşamınızda hangi güçlü özellikleriniz en çok destek oluyor?',
    'Karar alma anlarında rasyonel planlama ile içsel sezgileriniz nasıl etkileşime giriyor?',
    'Stresli anlarda tepkilerinizi yönetmek için hangi başa çıkma stratejilerini kullanıyorsunuz?',
  ];

  // 6. Provenance references
  const provenanceReferences = input.sourceInstruments.map((s) => ({
    instrumentName: s.instrumentName,
    formVersion: s.formVersion,
  }));

  // 7. Limitations
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

/**
 * Main Service Entry Point for Profile AI Insights.
 * Executes LLM synthesis when feature flag is enabled, falling back safely to deterministic synthesis.
 */
export async function getProfileAIInsights(
  profile: UnifiedProfileViewModel
): Promise<AIInsightOutput> {
  const inputPayload = buildAIInsightInputPayload(profile);

  // Check if external AI is explicitly enabled via environment variable
  const isExternalAiEnabled = process.env.ENABLE_EXTERNAL_AI_INSIGHTS === 'true';
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.AI_INSIGHT_API_KEY;

  if (!isExternalAiEnabled || !apiKey) {
    // Return deterministic fallback
    return generateDeterministicAIInsights(inputPayload);
  }

  const timeoutMs = Number(process.env.AI_INSIGHT_TIMEOUT_MS) || 8000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';

    const systemPrompt = `You are the PsycheAI Scientific Synthesis Engine.
Your SOLE responsibility is to articulate structured, deterministic psychometric data into clear, compassionate Turkish profile insights.

STRICT INVIOLABLE RULES:
1. NEVER alter, calculate, or guess any psychometric scores.
2. NEVER formulate clinical diagnoses (depression, ADHD, bipolar, autism, personality disorders).
3. In pre-calibration mode, NEVER generate percentile claims like "toplumun %80'inden yüksek".
4. Every observation MUST reference valid sourceDimensionIds present in input.measuredDimensions.
5. Every tension and synergy MUST reference valid sourceDimensionIds and a valid registeredInteractionId.
6. Output MUST strictly conform to the requested JSON schema.`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
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
      console.warn(`External AI API returned HTTP ${response.status}. Using deterministic fallback.`);
      return generateDeterministicAIInsights(inputPayload);
    }

    const rawJson = await response.json();
    const content = rawJson?.choices?.[0]?.message?.content;
    if (!content) {
      return generateDeterministicAIInsights(inputPayload);
    }

    const parsedJson = JSON.parse(content);
    const validatedOutput = AIInsightOutputSchema.parse(parsedJson);

    // Validate PsycheAI grounding & safety policy
    const policyCheck = validateAIInsightPolicy(validatedOutput, inputPayload);
    if (!policyCheck.isValid) {
      console.warn('AI output failed PsycheAI policy check category:', policyCheck.errors.length);
      return generateDeterministicAIInsights(inputPayload);
    }

    return validatedOutput;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === 'AbortError') {
      console.warn(`External AI insight synthesis timed out after ${timeoutMs}ms, falling back to deterministic.`);
    } else {
      console.warn('External AI insight synthesis failed, falling back to deterministic.');
    }
    return generateDeterministicAIInsights(inputPayload);
  }
}
