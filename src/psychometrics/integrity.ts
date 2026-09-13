import { ResponseIntegrityReport, QualityGrade, RiskLevel } from '../types/profile';

export interface IntegrityItemResponse {
  itemId: string;
  facetId: string;
  value: number;
  minScale: number;
  maxScale: number;
  responseTimeMs: number;
  isAttentionCheck?: boolean;
  expectedAttentionValue?: number;
  pairedItemId?: string | null;
  direction: 'positive' | 'negative';
}

/**
 * Calculates maximum continuous run of identical responses (Longstring Index)
 */
export function calculateLongstring(values: number[]): number {
  if (values.length === 0) return 0;
  let maxRun = 1;
  let currentRun = 1;

  for (let i = 1; i < values.length; i++) {
    if (values[i] === values[i - 1]) {
      currentRun++;
      if (currentRun > maxRun) maxRun = currentRun;
    } else {
      currentRun = 1;
    }
  }

  return maxRun;
}

/**
 * Computes semantic pair inconsistency across matched direct/reverse items
 */
export function calculateSemanticPairInconsistency(
  responses: IntegrityItemResponse[]
): number {
  const responseMap = new Map<string, IntegrityItemResponse>();
  responses.forEach((r) => responseMap.set(r.itemId, r));

  let totalDiscrepancy = 0;
  let pairCount = 0;

  for (const r of responses) {
    if (r.pairedItemId && responseMap.has(r.pairedItemId)) {
      const paired = responseMap.get(r.pairedItemId)!;
      // Discrepancy is deviation between direct and inverted reverse score
      const invertedPairedValue = paired.maxScale + paired.minScale - paired.value;
      const diff = Math.abs(r.value - invertedPairedValue);
      totalDiscrepancy += diff;
      pairCount++;
    }
  }

  if (pairCount === 0) return 0.0;
  return totalDiscrepancy / pairCount;
}

/**
 * Multi-Signal Response Integrity Assessment
 * Never invalidates based on a single metric (except failed instructed attention checks).
 */
export function evaluateResponseIntegrity(
  responses: IntegrityItemResponse[],
  rapidThresholdMs: number = 1200
): ResponseIntegrityReport {
  const values = responses.map((r) => r.value);
  const longstring = calculateLongstring(values);

  let rapidCount = 0;
  let attentionChecksPassed = true;
  let extremeEndpointCount = 0;
  let acquiescenceHighCount = 0;

  for (const r of responses) {
    if (r.responseTimeMs < rapidThresholdMs) {
      rapidCount++;
    }
    if (r.isAttentionCheck && r.expectedAttentionValue !== undefined) {
      if (r.value !== r.expectedAttentionValue) {
        attentionChecksPassed = false;
      }
    }
    if (r.value === r.minScale || r.value === r.maxScale) {
      extremeEndpointCount++;
    }
    if (r.value >= r.maxScale - 1) {
      acquiescenceHighCount++;
    }
  }

  const semanticInconsistency = calculateSemanticPairInconsistency(responses);
  const total = responses.length || 1;

  const extremeRatio = extremeEndpointCount / total;
  const acquiescenceRatio = acquiescenceHighCount / total;
  const rapidRatio = rapidCount / total;

  const extremeResponseBias: RiskLevel =
    extremeRatio > 0.65 ? 'high' : extremeRatio > 0.45 ? 'moderate' : 'low';

  const acquiescenceBias: RiskLevel =
    acquiescenceRatio > 0.7 ? 'high' : acquiescenceRatio > 0.5 ? 'moderate' : 'low';

  // Careless responding multi-signal risk index
  let riskScore = 0;
  if (!attentionChecksPassed) riskScore += 3;
  if (longstring > 8) riskScore += 2;
  if (rapidRatio > 0.25) riskScore += 2;
  if (semanticInconsistency > 2.2) riskScore += 2;

  const carelessResponseRisk: RiskLevel =
    riskScore >= 4 ? 'high' : riskScore >= 2 ? 'moderate' : 'low';

  let overallQualityGrade: QualityGrade = 'strong';
  if (!attentionChecksPassed || riskScore >= 5) {
    overallQualityGrade = 'compromised';
  } else if (riskScore >= 2) {
    overallQualityGrade = 'review_suggested';
  } else if (riskScore === 1) {
    overallQualityGrade = 'acceptable';
  }

  return {
    overallQualityGrade,
    attentionChecksPassed,
    carelessResponseRisk,
    longstringCount: longstring,
    rapidResponseItemCount: rapidCount,
    semanticInconsistencyScore: Math.round(semanticInconsistency * 100) / 100,
    impressionManagementIndex: 0.0, // populated when BIDR items are present
    selfDeceptiveEnhancementIndex: 0.0,
    extremeResponseBias,
    acquiescenceBias
  };
}
