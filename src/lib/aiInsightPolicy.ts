/**
 * PsycheAI AI Insight Policy & Grounding Validator
 * 
 * Strict scientific guardrails enforcing:
 * 1. Dimension Grounding: Every AI observation must reference valid measured dimension IDs.
 * 2. Structured Policy Verification: Prohibits clinical diagnoses, percentile claims,
 *    causal certainty, and score manipulation.
 * 3. Secondary Keyword Filter for defense-in-depth.
 */

import { AIInsightInput, AIInsightOutput } from '@/types/aiInsight';

const PROHIBITED_CLINICAL_KEYWORDS = [
  'depresyon tanısı',
  'bipolar bozukluk',
  'dehb teşhisi',
  'adhd',
  'otizm spektrum',
  'borderline',
  'şizofreni',
  'narsisistik kişilik bozukluğu',
  'psikiyatrik tanı',
  'klinik patoloji',
  'tedavi edilmeli',
  'ilaç tedavisi',
  'hastalık',
];

const PROHIBITED_PERCENTILE_PATTERNS = [
  /toplumun\s*%\s*\d+/i,
  /nüfusun\s*%\s*\d+/i,
  /yüzdelik\s*dilim/i,
  /percentile/i,
  /türkiye\s*ortalamasının\s*%\s*\d+/i,
];

const PROHIBITED_CAUSAL_PATTERNS = [
  /kesinlikle\s*neden\s*olur/i,
  /sebebi\s*kesin\s*olarak/i,
  /kaçınılmaz\s*olarak\s*sonuçlanır/i,
];

export interface PolicyValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates that an AIInsightOutput conforms to all PsycheAI scientific policies.
 */
export function validateAIInsightPolicy(
  output: AIInsightOutput,
  input: AIInsightInput
): PolicyValidationResult {
  const errors: string[] = [];

  const validDimensionIds = new Set(input.measuredDimensions.map((d) => d.dimensionId));
  const validDimensionCodes = new Set(input.measuredDimensions.map((d) => d.code));
  const validInteractionIds = new Set(input.registeredInteractions.map((i) => i.id));

  // 1. Validate Observations Grounding
  for (let i = 0; i < output.observations.length; i++) {
    const obs = output.observations[i];
    for (const dimId of obs.sourceDimensionIds) {
      if (!validDimensionIds.has(dimId) && !validDimensionCodes.has(dimId)) {
        errors.push(
          `Gözlem #${i + 1} geçerli bir ölçülmüş boyut referansı içermiyor: "${dimId}"`
        );
      }
    }
  }

  // 2. Validate Tensions Grounding
  for (let i = 0; i < output.tensions.length; i++) {
    const tension = output.tensions[i];
    for (const dimId of tension.sourceDimensionIds) {
      if (!validDimensionIds.has(dimId) && !validDimensionCodes.has(dimId)) {
        errors.push(
          `Gerilim #${i + 1} geçerli bir ölçülmüş boyut referansı içermiyor: "${dimId}"`
        );
      }
    }
    if (tension.registeredInteractionId && !validInteractionIds.has(tension.registeredInteractionId)) {
      errors.push(
        `Gerilim #${i + 1} kayıtlı olmayan bir etkileşim ID'si içeriyor: "${tension.registeredInteractionId}"`
      );
    }
  }

  // 3. Validate Synergies Grounding
  for (let i = 0; i < output.synergies.length; i++) {
    const syn = output.synergies[i];
    for (const dimId of syn.sourceDimensionIds) {
      if (!validDimensionIds.has(dimId) && !validDimensionCodes.has(dimId)) {
        errors.push(
          `Sinerji #${i + 1} geçerli bir ölçülmüş boyut referansı içermiyor: "${dimId}"`
        );
      }
    }
  }

  // 4. Validate Text Safety (Diagnostic, Percentile, Causal claims)
  const fullText = [
    output.headline,
    output.summary,
    ...output.observations.map((o) => o.observationTr),
    ...output.tensions.map((t) => `${t.tensionTr} ${t.reflectionQuestionTr}`),
    ...output.synergies.map((s) => s.synergyTr),
    ...output.reflectionQuestions,
  ].join(' ').toLowerCase();

  for (const kw of PROHIBITED_CLINICAL_KEYWORDS) {
    if (fullText.includes(kw)) {
      errors.push(`Yasaklı klinik/tanısal ifade tespit edildi: "${kw}"`);
    }
  }

  for (const pat of PROHIBITED_PERCENTILE_PATTERNS) {
    if (pat.test(fullText)) {
      errors.push(`Ön kalibrasyon aşamasında yasaklı yüzdelik (percentile) iddiası tespit edildi.`);
    }
  }

  for (const pat of PROHIBITED_CAUSAL_PATTERNS) {
    if (pat.test(fullText)) {
      errors.push(`Yasaklı kesin nedensellik iddiası tespit edildi.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
