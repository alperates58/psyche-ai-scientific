/**
 * PsycheAI AI Insight Service
 * 
 * Generates grounded psychological profile insights.
 * Enforces:
 * - Feature flag control (ENABLE_EXTERNAL_AI_INSIGHTS)
 * - Safe deterministic synthesis by default
 * - Structured Zod schema output
 * - Policy validation and fail-closed architecture
 */

import { UnifiedProfileViewModel } from '@/types/profile';
import {
  AIInsightInput,
  AIInsightOutput,
  AIInsightOutputSchema,
} from '@/types/aiInsight';
import { validateAIInsightPolicy } from '@/lib/aiInsightPolicy';

/**
 * Builds the structured, private, server-sanitized input payload for AI synthesis.
 */
export function buildAIInsightInputPayload(
  profile: UnifiedProfileViewModel
): AIInsightInput {
  const measuredDimensions = profile.fingerprint.dimensions
    .filter((d) => d.isMeasured && d.nativeScore !== null)
    .map((d) => {
      // Find corresponding facet/construct to extract confidence
      return {
        dimensionId: d.id,
        code: d.code,
        nameTr: d.nameTr,
        domainNameTr: d.domainNameTr,
        rawScore: d.nativeScore!,
        scaleMin: d.scaleMin,
        scaleMax: d.scaleMax,
        epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
        confidenceLevel: (d.bandInfo ? 'MODERATE' : 'LOW') as 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH',
        itemCount: 4, // Conservative estimate
      };
    });

  const registeredInteractions = profile.interactions.map((i) => ({
    id: i.id,
    titleTr: i.titleTr,
    type: i.type as 'SYNERGY' | 'TENSION' | 'MODULATION',
    descriptionTr: i.descriptionTr,
    epistemicStatus: i.epistemicStatus,
    sourceDimensions: i.sourceDimensions,
  }));

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
    const ratio = (dim.rawScore - dim.scaleMin) / Math.max(0.1, dim.scaleMax - dim.scaleMin);
    let bandText = 'dengeli bir düzeyde';
    if (ratio >= 0.65) bandText = 'belirgin bir üst eğilim bölgesinde';
    else if (ratio <= 0.35) bandText = 'daha temkinli / alt yanıt bölgesinde';

    return {
      sourceDimensionIds: [dim.dimensionId],
      observationTr: `${dim.nameTr} boyutu ${dim.rawScore.toFixed(2)} (${dim.scaleMin}–${dim.scaleMax}) puanıyla ${bandText} konumlanmaktadır.`,
      confidenceLevel: dim.confidenceLevel,
      epistemicStatus: dim.epistemicStatus,
    };
  });

  // 3. Tensions & Synergies from registered interactions
  const tensions = input.registeredInteractions
    .filter((i) => i.type === 'TENSION' || i.type === 'MODULATION')
    .map((inter) => ({
      sourceDimensionIds: input.measuredDimensions
        .filter((d) => inter.sourceDimensions.some((sd) => sd.toLowerCase().includes(d.nameTr.toLowerCase())))
        .map((d) => d.dimensionId).concat(input.measuredDimensions.length > 0 ? [input.measuredDimensions[0].dimensionId] : []),
      registeredInteractionId: inter.id,
      tensionTr: inter.descriptionTr,
      reflectionQuestionTr:
        'Bu iki eğilimin karşı karşıya geldiği durumlarda hangi tarafın karar süreçlerinizi yönlendirmesini tercih edersiniz?',
    }));

  const synergies = input.registeredInteractions
    .filter((i) => i.type === 'SYNERGY')
    .map((inter) => ({
      sourceDimensionIds: input.measuredDimensions
        .filter((d) => inter.sourceDimensions.some((sd) => sd.toLowerCase().includes(d.nameTr.toLowerCase())))
        .map((d) => d.dimensionId).concat(input.measuredDimensions.length > 0 ? [input.measuredDimensions[0].dimensionId] : []),
      registeredInteractionId: inter.id,
      synergyTr: inter.descriptionTr,
    }));

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
5. Every tension and synergy MUST reference valid sourceDimensionIds.
6. Output MUST strictly conform to the requested JSON schema.`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(inputPayload) },
        ],
      }),
    });

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
      console.warn('AI output failed PsycheAI scientific policy:', policyCheck.errors);
      return generateDeterministicAIInsights(inputPayload);
    }

    return validatedOutput;
  } catch (err) {
    console.warn('Error during external AI insight synthesis, falling back to deterministic:', err);
    return generateDeterministicAIInsights(inputPayload);
  }
}
