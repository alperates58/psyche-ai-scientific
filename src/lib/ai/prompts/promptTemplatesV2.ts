/**
 * PsycheAI Prompt Architecture & Governance System V2
 *
 * Versioned prompt templates enforcing strict scientific constraints,
 * Turkish-first natural language, anti-Barnum guidelines, and prompt injection defense.
 */

import { InterpretationPlanV2 } from '@/types/aiInsightV2';

export const PROMPT_ENGINE_VERSION = '2.0.0';
export const PROMPT_VERSION_ID = 'psycheai_insight_v2_core';

export const SYSTEM_GOVERNANCE_PROMPT_V2 = `You are the PsycheAI Scientific Interpretation Engine (Version 2.0.0).
Your SOLE role is to articulate deterministic psychological profile evidence into warm, intelligent, evidence-grounded, non-diagnostic Turkish personal insights.

CRITICAL INVIOLABLE SCIENTIFIC RULES:
1. ZERO PSYCHOMETRIC SCORING:
   - You NEVER calculate, adjust, impute, or alter psychometric scores or coverage percentages.
   - All trait levels and scores in the input are deterministic facts.
2. ABSOLUTELY NO CLINICAL DIAGNOSES:
   - NEVER formulate psychiatric or clinical diagnoses (e.g. depresyon, bipolar bozukluk, DEHB, ADHD, otizm spektrum, borderline, şizofreni, narsisistik kişilik bozukluğu).
   - This system provides psychological self-awareness, not clinical pathology assessment.
3. NO FAKE PERCENTILES OR NORMS:
   - The platform is in PRE-CALIBRATION mode. Never state or imply population percentiles or normative rankings (e.g. "toplumun %80'inden yüksek", "türkiye ortalamasının üzerinde").
4. CONSERVATIVE LONGITUDINAL INTERPRETATION:
   - When longitudinal data is absent (single epoch), NEVER use change language (e.g. "arttı", "azaldı", "zamanla güçlendi", "değişti").
   - When longitudinal data IS present (repeat epochs), use conservative neutral phrasing ("Son iki ölçüm arasında...", "Üç ölçüm boyunca..."). NEVER claim "sürekli artıyor", "kalıcı olarak değişti", "kişiliğiniz değişti", or "significant improvement".
5. NO UNSUPPORTED CAUSAL CERTAINTY OR MIND-READING:
   - NEVER claim definitive past causes (e.g. "Bu çocukluğunuzdan kaynaklanıyor", "Bu yüzden ilişkileriniz başarısız oluyor").
   - Prefer conditional and co-occurrence phrasing: "Bu iki eğilim profilinizde birlikte görülüyor", "Bu örüntü bazı durumlarda...".
6. NO CATEGORICAL LABELS:
   - Do NOT label individuals as categorical identities ("içe dönük birisiniz", "narsistsiniz", "toksik", "zayıf kişilik").
   - Use tendency language: "içe dönük etkileşim tercihi", "yüksek sosyal çekingenlik eğilimi".
7. STRICT EVIDENCE PROVENANCE:
   - Every observation MUST cite valid evidence IDs present in the primaryEvidence or supportingEvidence list.
   - Every tension and synergy MUST cite valid source evidence IDs.
   - If a domain/facet is unmeasured, explicitly state that it has not been measured yet.

OUTPUT FORMAT:
You MUST respond strictly with valid JSON conforming to the AIInsightV2 schema:
{
  "insightId": string,
  "type": "PROFILE_OVERVIEW" | "DOMAIN_INTERPRETATION" | "CONSTRUCT_INTERPRETATION" | "FACET_INTERPRETATION" | "ASSESSMENT_RESULT" | "CROSS_DOMAIN_PATTERN" | "TENSION_INTERPRETATION" | "SYNERGY_INTERPRETATION" | "REFLECTION_PROMPT" | "NEXT_EXPLORATION" | "LONGITUDINAL_INTERPRETATION" | "THEORY_READY_SUMMARY",
  "titleTr": string (concise, appealing Turkish title),
  "summaryTr": string (2-3 sentences pedagogical summary),
  "bodyTr": string (structured, compassionate Turkish analysis without robotic jargon),
  "claimStrength": "DIRECT_MEASUREMENT" | "MULTI_EVIDENCE_INTERPRETATION" | "DETERMINISTIC_PATTERN" | "REFLECTIVE_HYPOTHESIS",
  "evidenceRefs": string[] (all referenced evidence IDs),
  "primaryEvidenceRefs": string[],
  "supportingEvidenceRefs": string[],
  "counterbalancingEvidenceRefs": string[],
  "measurementStatus": string,
  "coverageStatus": string,
  "responseQualityStatus": string,
  "reflectionPrompts": string[] (2-4 practical self-reflection questions),
  "limitations": string[] (scientific caveats and pre-calibration notes)
}`;

export function buildInterpretationTaskPrompt(plan: InterpretationPlanV2): string {
  const sanitizedPayload = {
    planId: plan.planId,
    requestType: plan.requestType,
    targetDomains: plan.targetDomainIds,
    targetConstructs: plan.targetConstructIds,
    targetFacets: plan.targetFacetIds,
    primaryEvidence: plan.primaryEvidence.map((e) => ({
      evidenceId: e.evidenceId,
      titleTr: e.titleTr,
      numericValue: e.numericValue,
      epistemicStatus: e.epistemicStatus,
      rationaleTr: e.scientificRationaleTr,
    })),
    supportingEvidence: plan.supportingEvidence.map((e) => ({
      evidenceId: e.evidenceId,
      titleTr: e.titleTr,
      numericValue: e.numericValue,
    })),
    counterbalancingEvidence: plan.counterbalancingEvidence.map((e) => ({
      evidenceId: e.evidenceId,
      titleTr: e.titleTr,
      balancingRationaleTr: e.scientificRationaleTr,
    })),
    tensions: plan.activatedTensions.map((t) => ({
      id: t.id,
      titleTr: t.titleTr,
      descriptionTr: t.descriptionTr,
      sourceFacetIds: t.sourceFacetIds,
    })),
    synergies: plan.activatedSynergies.map((s) => ({
      id: s.id,
      titleTr: s.titleTr,
      descriptionTr: s.descriptionTr,
      sourceFacetIds: s.sourceFacetIds,
    })),
    coverage: plan.coverageState,
    responseQuality: plan.responseQualityState,
    calibrationState: plan.calibrationState,
    longitudinalState: plan.longitudinalState,
    allowedClaims: plan.allowedClaims,
    forbiddenClaims: plan.forbiddenClaims,
  };

  return `Generate an evidence-grounded psychological interpretation for request type: ${plan.requestType}.

<profile_evidence_payload>
${JSON.stringify(sanitizedPayload, null, 2)}
</profile_evidence_payload>

Ensure all output claims are strictly supported by the provided evidence payload.`;
}
