/**
 * PsycheAI AI Insight Policy & Grounding Validator
 * 
 * Strict scientific guardrails enforcing:
 * 1. Structural Grounding:
 *    - Every observation, tension, and synergy MUST have non-empty sourceDimensionIds.
 *    - Every referenced dimension ID must exist in input.measuredDimensions.
 *    - Every tension and synergy MUST reference a valid registeredInteractionId.
 *    - Preserves the epistemic ceiling: cannot claim confirmed evidence for provisional/low-confidence sources.
 * 2. Secondary Keyword & Pattern Filters:
 *    - Prohibits clinical diagnoses, percentile claims, and absolute causal certainty.
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
  'patoloji',
];

const PROHIBITED_PERCENTILE_PATTERNS = [
  /toplumun\s*%\s*\d+/i,
  /nüfusun\s*%\s*\d+/i,
  /yüzdelik\s*dilim/i,
  /percentile/i,
  /türkiye\s*ortalamasının\s*%\s*\d+/i,
  /popülasyonun\s*%\s*\d+/i,
];

const PROHIBITED_CAUSAL_PATTERNS = [
  /kesinlikle\s*neden\s*olur/i,
  /sebebi\s*kesin\s*olarak/i,
  /kaçınılmaz\s*olarak\s*sonuçlanır/i,
  /doğrudan\s*kaynaklanmaktadır\s*ve\s*kaçınılmazdır/i,
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

  const validDimensionsMap = new Map(
    input.measuredDimensions.map((d) => [d.dimensionId, d])
  );
  // Also support code lookup
  for (const d of input.measuredDimensions) {
    validDimensionsMap.set(d.code, d);
  }

  const validInteractionIds = new Set(input.registeredInteractions.map((i) => i.id));

  // 1. Validate Observations Grounding & Epistemic Ceiling
  for (let i = 0; i < output.observations.length; i++) {
    const obs = output.observations[i];
    if (!obs.sourceDimensionIds || obs.sourceDimensionIds.length === 0) {
      errors.push(`Gözlem #${i + 1} boş kaynak boyut listesi içeriyor (sourceDimensionIds boş olamaz).`);
      continue;
    }

    for (const dimId of obs.sourceDimensionIds) {
      const dim = validDimensionsMap.get(dimId);
      if (!dim) {
        errors.push(
          `Gözlem #${i + 1} geçerli bir ölçülmüş boyut referansı içermiyor: "${dimId}"`
        );
      } else {
        // Epistemic ceiling: If dimension confidence is LOW or VERY_LOW, cannot upgrade to EVIDENCE_SUPPORTED_INTERPRETATION
        if (
          (dim.confidenceLevel === 'LOW' || dim.confidenceLevel === 'VERY_LOW') &&
          obs.epistemicStatus === 'EVIDENCE_SUPPORTED_INTERPRETATION'
        ) {
          errors.push(
            `Gözlem #${i + 1}, düşük güvenilirlikli "${dim.nameTr}" boyutunu kanıt destekli yoruma (EVIDENCE_SUPPORTED_INTERPRETATION) yükseltemez.`
          );
        }
      }
    }
  }

  // 2. Validate Tensions Grounding & Mandatory Interaction ID
  for (let i = 0; i < output.tensions.length; i++) {
    const tension = output.tensions[i];
    if (!tension.sourceDimensionIds || tension.sourceDimensionIds.length === 0) {
      errors.push(`Gerilim #${i + 1} boş kaynak boyut listesi içeriyor (sourceDimensionIds boş olamaz).`);
      continue;
    }

    for (const dimId of tension.sourceDimensionIds) {
      if (!validDimensionsMap.has(dimId)) {
        errors.push(
          `Gerilim #${i + 1} geçerli bir ölçülmüş boyut referansı içermiyor: "${dimId}"`
        );
      }
    }

    if (!tension.registeredInteractionId || !validInteractionIds.has(tension.registeredInteractionId)) {
      errors.push(
        `Gerilim #${i + 1} kayıtlı ve geçerli bir etkileşim ID'si içermiyor: "${tension.registeredInteractionId}"`
      );
    }
  }

  // 3. Validate Synergies Grounding & Mandatory Interaction ID
  for (let i = 0; i < output.synergies.length; i++) {
    const syn = output.synergies[i];
    if (!syn.sourceDimensionIds || syn.sourceDimensionIds.length === 0) {
      errors.push(`Sinerji #${i + 1} boş kaynak boyut listesi içeriyor (sourceDimensionIds boş olamaz).`);
      continue;
    }

    for (const dimId of syn.sourceDimensionIds) {
      if (!validDimensionsMap.has(dimId)) {
        errors.push(
          `Sinerji #${i + 1} geçerli bir ölçülmüş boyut referansı içermiyor: "${dimId}"`
        );
      }
    }

    if (!syn.registeredInteractionId || !validInteractionIds.has(syn.registeredInteractionId)) {
      errors.push(
        `Sinerji #${i + 1} kayıtlı ve geçerli bir etkileşim ID'si içermiyor: "${syn.registeredInteractionId}"`
      );
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
