/**
 * PsycheAI Scientific Measurement & Exploration Coverage Model
 *
 * Separates:
 * A) Exploration Coverage (Keşif Kapsamı):
 *    Number of facets touched (observed items >= 1) / Total facets in ontology (84).
 *
 * B) Measurement Adequacy & Coverage (Ölçüm Derinliği):
 *    Classifies each facet into a rigorous scientific measurement adequacy stage:
 *    - UNTOUCHED: 0 items answered
 *    - STARTED: 1 item answered (Preliminary probe; NOT a validated or high-precision measurement)
 *    - PARTIALLY_COVERED: 2 items answered (Below minimum screening target)
 *    - PROVISIONALLY_COVERED: >= 3 items answered (Meets minimum research target for provisional descriptive scoring)
 *    - SUFFICIENT_FOR_RESEARCH: >= 6 items answered (Meets standard form design target)
 */

import { TOTAL_MASTER_FACETS_COUNT } from '@/lib/profile/masterModelConstants';

export const TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH = TOTAL_MASTER_FACETS_COUNT; // 91 active master facets
export const TOTAL_MASTER_FACETS_DENOMINATOR = TOTAL_MASTER_FACETS_COUNT; // 91

export type FacetMeasurementStage =
  | 'UNTOUCHED'
  | 'STARTED'
  | 'PARTIALLY_COVERED'
  | 'PROVISIONALLY_COVERED'
  | 'SUFFICIENT_FOR_RESEARCH';

export interface FacetAdequacyDetail {
  facetId: string;
  observedItemCount: number;
  minimumTarget: number; // e.g. 3
  standardTarget: number; // e.g. 6
  stage: FacetMeasurementStage;
  stageLabelTr: string;
  adequacyRatio: number; // observed / standardTarget, 0.0 to 1.0
  isSufficientForLatentClaim: boolean;
}

export interface ProfileCoverageMetrics {
  totalOntologyFacets: number; // 84
  exploredFacetsCount: number;
  explorationPercentage: number; // (explored / total) * 100
  measurementDepthPercentage: number;
  facetsAdequacy: Record<string, FacetAdequacyDetail>;
  isPreliminaryStage: boolean;
  statusDisclaimerTr: string;
}

/**
 * Classifies the measurement adequacy of a facet based on observed item count.
 */
export function classifyFacetMeasurementStage(
  observedItemCount: number,
  minimumTarget: number = 3,
  standardTarget: number = 6
): FacetMeasurementStage {
  if (observedItemCount <= 0) return 'UNTOUCHED';
  if (observedItemCount === 1) return 'STARTED';
  if (observedItemCount < minimumTarget) return 'PARTIALLY_COVERED';
  if (observedItemCount < standardTarget) return 'PROVISIONALLY_COVERED';
  return 'SUFFICIENT_FOR_RESEARCH';
}

export function getFacetStageLabelTr(stage: FacetMeasurementStage): string {
  switch (stage) {
    case 'UNTOUCHED':
      return 'Henüz Ölçülmedi';
    case 'STARTED':
      return 'Başlangıç Teması (1 Madde - Yetersiz Hassasiyet)';
    case 'PARTIALLY_COVERED':
      return 'Kısmi Ölçüm (Hedef Altı)';
    case 'PROVISIONALLY_COVERED':
      return 'Ön Kalibrasyon İçin Yeterli (>=3 Madde)';
    case 'SUFFICIENT_FOR_RESEARCH':
      return 'Araştırma Formu Düzeyi (>=6 Madde)';
  }
}

/**
 * Computes dual coverage: Exploration Coverage vs Measurement Depth.
 */
export function calculateProfileCoverage(
  facetItemCounts: Record<string, number>,
  totalOntologyFacets: number = TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH,
  standardTargetPerFacet: number = 6
): ProfileCoverageMetrics {
  const facetsAdequacy: Record<string, FacetAdequacyDetail> = {};
  let exploredCount = 0;
  let totalAdequacyRatioSum = 0;

  for (const [facetId, count] of Object.entries(facetItemCounts)) {
    const stage = classifyFacetMeasurementStage(count, 3, standardTargetPerFacet);
    const ratio = Math.min(1.0, count / standardTargetPerFacet);

    if (count > 0) {
      exploredCount++;
      totalAdequacyRatioSum += ratio;
    }

    facetsAdequacy[facetId] = {
      facetId,
      observedItemCount: count,
      minimumTarget: 3,
      standardTarget: standardTargetPerFacet,
      stage,
      stageLabelTr: getFacetStageLabelTr(stage),
      adequacyRatio: Number(ratio.toFixed(2)),
      isSufficientForLatentClaim: stage === 'SUFFICIENT_FOR_RESEARCH'
    };
  }

  const explorationPercentage = Math.round((exploredCount / totalOntologyFacets) * 100);
  const measurementDepthPercentage =
    exploredCount > 0
      ? Math.round((totalAdequacyRatioSum / exploredCount) * 100)
      : 0;

  const isPreliminaryStage = exploredCount > 0 && measurementDepthPercentage <= 35;

  return {
    totalOntologyFacets,
    exploredFacetsCount: exploredCount,
    explorationPercentage,
    measurementDepthPercentage,
    facetsAdequacy,
    isPreliminaryStage,
    statusDisclaimerTr: isPreliminaryStage
      ? 'Ön kalibrasyon aşamasında alt boyutlar henüz 1 madde ile taranmıştır; latent kişilik kestirimi için yeterli psikometrik derinlik bulunmamaktadır.'
      : 'Çok maddeli ölçüm derinliği sağlanmıştır.'
  };
}
