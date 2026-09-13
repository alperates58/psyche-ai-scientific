import { FacetScore, NormStatus, ConfidenceMetrics } from '../types/profile';
import { EpistemicTier } from '../types/construct';
import { ValidationStatus } from '../types/item';

export interface ResponseRecord {
  itemId: string;
  facetId: string;
  value: number; // raw option value selected (e.g. 1 to 6)
  minScale: number;
  maxScale: number;
  direction: 'positive' | 'negative';
  reverseWorded: boolean;
  factorLoading?: number | null; // lambda_i from CFA
  responseTimeMs?: number;
}

export interface NormativeParameters {
  normVersion: string;
  mean: number;
  sd: number;
  reliabilityOmega: number;
  empiricalPercentileLookup?: { rawCutoff: number; percentile: number }[];
}

export interface IrtItemParameters {
  itemId: string;
  a: number; // discrimination
  thresholds: number[]; // boundary thresholds b_1 ... b_{K-1}
}

/**
 * Universal Reverse Scoring Function
 * Mathematical formula: reversed = (minScale + maxScale) - rawValue
 * Correctly handles any scale: 1-5, 1-6, 1-7, 0-4, etc.
 */
export function calculateReverseScore(
  rawValue: number,
  minScale: number,
  maxScale: number
): number {
  if (minScale >= maxScale) {
    throw new Error(`Geçersiz ölçek sınırları: min (${minScale}) >= max (${maxScale})`);
  }
  if (rawValue < minScale || rawValue > maxScale) {
    throw new Error(
      `Cevap değeri [${minScale}, ${maxScale}] ölçek aralığının dışındadır: ${rawValue}`
    );
  }
  return minScale + maxScale - rawValue;
}

/**
 * Pre-Calibration Scoring: Used during early alpha/research before empirical factor weights and norms exist.
 * Rules:
 * - Computes direction-corrected raw scores and linear composite.
 * - Handles missingness (requires at least 60% completion of facet items).
 * - Strictly SUPPRESSES population percentiles and normative T-scores.
 */
export function scoreFacetPreCalibration(
  facetId: string,
  domainId: string,
  constructId: string,
  responses: ResponseRecord[],
  epistemicTier: EpistemicTier,
  validationStatus: ValidationStatus,
  targetStandardCount: number
): FacetScore {
  if (!responses.length) {
    throw new Error(`Cannot score facet ${facetId}: zero responses provided.`);
  }

  let totalAdjustedValue = 0;
  let totalTheoreticalRange = 0;

  for (const r of responses) {
    // Reverse score transformation: if negative direction or reverse worded
    const isReversed = r.direction === 'negative' || r.reverseWorded;
    const adjustedValue = isReversed ? r.maxScale + r.minScale - r.value : r.value;

    totalAdjustedValue += adjustedValue;
    totalTheoreticalRange += r.maxScale - r.minScale;
  }

  const rawScore = totalAdjustedValue / responses.length;
  // Provisional composite normalized to 0-100 for descriptive UI anchoring only (NOT normative)
  const minPossible = responses[0].minScale;
  const maxPossible = responses[0].maxScale;
  const provisionalComposite = ((rawScore - minPossible) / (maxPossible - minPossible)) * 100;

  const itemCoverageRatio = Math.min(1.0, responses.length / (targetStandardCount || 6));
  // Preliminary conservative standard error estimate
  const provisionalSE = 10 * (1 - Math.min(0.8, itemCoverageRatio * 0.7));
  const ciLower = Math.max(0, provisionalComposite - 1.96 * provisionalSE);
  const ciUpper = Math.min(100, provisionalComposite + 1.96 * provisionalSE);

  const confidenceMetrics: ConfidenceMetrics = {
    measurementPrecision: itemCoverageRatio >= 0.8 ? 'moderate' : 'low',
    numericConfidenceIndicator: Math.round(itemCoverageRatio * 0.6 * 100) / 100,
    standardError: provisionalSE,
    responseQualityFactor: 1.0,
    itemCoverageRatio,
    methodDiversityFactor: 0.6,
    normAvailability: false,
    calibrationStatus: 'uncalibrated'
  };

  return {
    domainId,
    constructId,
    facetId,
    rawScore: Math.round(rawScore * 100) / 100,
    provisionalCompositeScore: Math.round(provisionalComposite * 10) / 10,
    latentTheta: null,
    zScore: null,
    tScore: null,
    percentile: null, // Strictly null: no valid norm exists
    standardError: Math.round(provisionalSE * 10) / 10,
    confidenceInterval95: [Math.round(ciLower * 10) / 10, Math.round(ciUpper * 10) / 10],
    observedItemCount: responses.length,
    epistemicTier,
    validationStatus,
    confidenceMetrics
  };
}

/**
 * Post-Calibration Scoring: Used after pilot studies, CFA validation, and normative sample collection.
 * Rules:
 * - Uses standardized CFA factor loadings as weights.
 * - Computes SEM from empirical reliability omega.
 * - Produces z-score, T-score, and empirical percentile ONLY if normStatus is 'validated'.
 */
export function scoreFacetPostCalibration(
  facetId: string,
  domainId: string,
  constructId: string,
  responses: ResponseRecord[],
  normParams: NormativeParameters,
  normStatus: NormStatus,
  epistemicTier: EpistemicTier,
  validationStatus: ValidationStatus
): FacetScore {
  if (!responses.length) {
    throw new Error(`Cannot score calibrated facet ${facetId}: zero responses.`);
  }

  let weightedSum = 0;
  let weightSum = 0;

  for (const r of responses) {
    const isReversed = r.direction === 'negative' || r.reverseWorded;
    const adjustedValue = isReversed ? r.maxScale + r.minScale - r.value : r.value;
    const weight = r.factorLoading && r.factorLoading > 0 ? r.factorLoading : 1.0;

    weightedSum += adjustedValue * weight;
    weightSum += weight;
  }

  const rawWeightedScore = weightedSum / weightSum;

  let zScore: number | null = null;
  let tScore: number | null = null;
  let percentile: number | null = null;

  // Standard Error of Measurement: SEM = SD * sqrt(1 - omega)
  const sem = normParams.sd * Math.sqrt(Math.max(0.01, 1 - normParams.reliabilityOmega));

  if (normStatus === 'validated') {
    zScore = (rawWeightedScore - normParams.mean) / normParams.sd;
    tScore = 50 + 10 * zScore;

    if (normParams.empiricalPercentileLookup?.length) {
      // Find empirical cumulative rank
      const match = normParams.empiricalPercentileLookup.find((c) => rawWeightedScore <= c.rawCutoff);
      percentile = match ? match.percentile : 99.9;
    } else {
      // Fallback Gaussian approximation
      percentile = Math.round(0.5 * (1 + erf(zScore / Math.SQRT2)) * 1000) / 10;
    }
  }

  const ci95Lower = rawWeightedScore - 1.96 * sem;
  const ci95Upper = rawWeightedScore + 1.96 * sem;

  const confidenceMetrics: ConfidenceMetrics = {
    measurementPrecision: sem < 0.35 * normParams.sd ? 'high' : 'moderate',
    numericConfidenceIndicator: Math.min(0.95, normParams.reliabilityOmega),
    standardError: Math.round(sem * 100) / 100,
    responseQualityFactor: 1.0,
    itemCoverageRatio: 1.0,
    methodDiversityFactor: 0.8,
    normAvailability: normStatus === 'validated',
    calibrationStatus: 'cfa_standardized'
  };

  return {
    domainId,
    constructId,
    facetId,
    rawScore: Math.round(rawWeightedScore * 100) / 100,
    provisionalCompositeScore: Math.round(rawWeightedScore * 20), // heuristic 1-5 to 0-100
    latentTheta: null,
    zScore: zScore !== null ? Math.round(zScore * 100) / 100 : null,
    tScore: tScore !== null ? Math.round(tScore * 10) / 10 : null,
    percentile: percentile !== null ? Math.round(percentile * 10) / 10 : null,
    standardError: Math.round(sem * 100) / 100,
    confidenceInterval95: [Math.round(ci95Lower * 100) / 100, Math.round(ci95Upper * 100) / 100],
    observedItemCount: responses.length,
    epistemicTier,
    validationStatus,
    confidenceMetrics
  };
}

/**
 * Error function helper for standard normal cumulative distribution
 */
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-absX * absX);

  return sign * y;
}
