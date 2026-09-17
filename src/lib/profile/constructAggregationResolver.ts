/**
 * PsycheAI Deterministic Construct & Domain Aggregation Resolver
 *
 * Enforces strict scientific principles:
 * - Measurement hierarchy: ITEM -> FACET -> CONSTRUCT -> DOMAIN
 * - Hierarchy does NOT automatically authorize aggregation.
 * - Facet scores are the primary measurement layer.
 * - Construct scores are allowed ONLY where deterministic aggregation is explicitly authorized
 *   AND all constituent facets are measured.
 * - Domain scores are strictly null (no fake global domain totals).
 * - Never midpoint imputes missing facets.
 */

import {
  MASTER_CONSTRUCTS,
  MASTER_CONSTRUCT_BY_ID,
  MasterConstructDefinition,
} from './masterModelConstants';
import {
  AggregationStatus,
  ConstructProfileV2,
  FacetProfileV2,
  ScoreBandDetailsV2,
} from '@/types/unifiedProfileV2';

export interface ConstructAggregationRule {
  constructId: string;
  allowed: boolean;
  minRequiredFacets: number;
  scientificRationaleTr: string;
}

export const CONSTRUCT_AGGREGATION_RULES: Record<string, ConstructAggregationRule> = Object.fromEntries(
  MASTER_CONSTRUCTS.map((c) => [
    c.constructId,
    {
      constructId: c.constructId,
      allowed: c.allowsDirectAggregation,
      minRequiredFacets: c.facetIds.length,
      scientificRationaleTr: c.scientificRationaleTr,
    },
  ])
);

export function getScoreBandV2(score: number | null, maxScale: number = 5.0): ScoreBandDetailsV2 | null {
  if (score === null || typeof score !== 'number' || isNaN(score)) {
    return null;
  }

  // Normalized 1.0–5.0 scale boundaries
  if (score < 2.5) {
    return {
      band: 'LOW',
      labelTr: 'Daha Düşük Eğilim',
      shortLabelTr: 'Düşük',
      colorClass: 'text-sky-600 dark:text-sky-400',
      bgClass: 'bg-sky-50 dark:bg-sky-950/40',
      borderClass: 'border-sky-200 dark:border-sky-800',
    };
  }
  if (score <= 3.5) {
    return {
      band: 'BALANCED',
      labelTr: 'Dengeli / Orta Düzey',
      shortLabelTr: 'Dengeli',
      colorClass: 'text-teal-600 dark:text-teal-400',
      bgClass: 'bg-teal-50 dark:bg-teal-950/40',
      borderClass: 'border-teal-200 dark:border-teal-800',
    };
  }
  return {
    band: 'HIGH',
    labelTr: 'Daha Yüksek Eğilim',
    shortLabelTr: 'Yüksek',
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderClass: 'border-indigo-200 dark:border-indigo-800',
  };
}

/**
 * Normalizes a 1.0–5.0 psychometric score to 0–100 VISUAL rendering coordinate ONLY.
 * Explicitly NOT a percentile, norm, or population score.
 */
export function toVisualNormalizedCoordinate(score: number | null): number | null {
  if (score === null || typeof score !== 'number' || isNaN(score)) {
    return null;
  }
  const min = 1.0;
  const max = 5.0;
  const clamped = Math.max(min, Math.min(max, score));
  const coord = Math.round(((clamped - min) / (max - min)) * 100);
  return Math.max(0, Math.min(100, coord));
}

export function scoreToVisualCoordinate(score: number | null): number | null {
  return toVisualNormalizedCoordinate(score);
}

export function visualCoordinateToScore(coordinate: number | null): number | null {
  if (coordinate === null || typeof coordinate !== 'number' || isNaN(coordinate)) {
    return null;
  }
  const clamped = Math.max(0, Math.min(100, coordinate));
  return Number((1.0 + (clamped / 100) * 4.0).toFixed(2));
}

export interface ResolvedConstructAggregation {
  constructScore: number | null;
  aggregationStatus: AggregationStatus;
  measuredFacetCount: number;
  totalFacetCount: number;
  coverageRatio: number;
  normalizedVisualCoordinate: number | null;
  bandInfo: ScoreBandDetailsV2 | null;
}

/**
 * Resolves construct-level aggregation deterministically from constituent facet profiles.
 */
export function resolveConstructAggregation(
  constructDef: MasterConstructDefinition,
  facets: FacetProfileV2[]
): ResolvedConstructAggregation {
  const totalFacetCount = constructDef.facetIds.length;
  const measuredFacets = facets.filter(
    (f) => f.measurementStatus === 'MEASURED_PRECALIBRATION' && f.score !== null
  );
  const measuredFacetCount = measuredFacets.length;
  const coverageRatio = totalFacetCount > 0 ? Number((measuredFacetCount / totalFacetCount).toFixed(3)) : 0;

  if (measuredFacetCount === 0) {
    return {
      constructScore: null,
      aggregationStatus: 'NOT_MEASURED',
      measuredFacetCount: 0,
      totalFacetCount,
      coverageRatio: 0,
      normalizedVisualCoordinate: null,
      bandInfo: null,
    };
  }

  // If construct allows direct aggregation AND all constituent facets are measured
  if (constructDef.allowsDirectAggregation && measuredFacetCount === totalFacetCount) {
    const sum = measuredFacets.reduce((acc, f) => acc + (f.score ?? 0), 0);
    const mean = Number((sum / measuredFacetCount).toFixed(2));
    const bandInfo = getScoreBandV2(mean);
    const normalizedVisualCoordinate = toVisualNormalizedCoordinate(mean);

    return {
      constructScore: mean,
      aggregationStatus: 'DIRECT_CONSTRUCT_SCORE',
      measuredFacetCount,
      totalFacetCount,
      coverageRatio,
      normalizedVisualCoordinate,
      bandInfo,
    };
  }

  // If some facets are measured but aggregation is not authorized or partial
  if (measuredFacetCount < totalFacetCount) {
    return {
      constructScore: null,
      aggregationStatus: 'PARTIAL_CONSTRUCT_PATTERN',
      measuredFacetCount,
      totalFacetCount,
      coverageRatio,
      normalizedVisualCoordinate: null,
      bandInfo: null,
    };
  }

  // All facets measured but construct does not allow collapsing into single mean
  // (e.g. Schwartz circumplex, ECR attachment space, REI dual process thinking styles, PANAS affective tone)
  return {
    constructScore: null,
    aggregationStatus: 'FACET_PATTERN_ONLY',
    measuredFacetCount,
    totalFacetCount,
    coverageRatio,
    normalizedVisualCoordinate: null,
    bandInfo: null,
  };
}
