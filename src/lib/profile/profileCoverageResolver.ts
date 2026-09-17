/**
 * PsycheAI Profile Coverage Resolver V2
 *
 * Computes pure measurement model coverage across:
 * - 11 Domains
 * - 37 Constructs
 * - 91 Facets
 * - 469 Administered Questions
 *
 * Strictly separates Model Coverage from Psychological Certainty / Confidence.
 */

import {
  TOTAL_MASTER_DOMAINS_COUNT,
  TOTAL_MASTER_CONSTRUCTS_COUNT,
  TOTAL_MASTER_FACETS_COUNT,
  TOTAL_ADMINISTERED_ITEMS_COUNT,
} from './masterModelConstants';
import {
  DomainProfileV2,
  ConstructProfileV2,
  FacetProfileV2,
  ProfileCoverageV2,
} from '@/types/unifiedProfileV2';

export function calculateProfileCoverageV2(params: {
  domains: DomainProfileV2[];
  constructs: ConstructProfileV2[];
  facets: FacetProfileV2[];
  totalAnsweredQuestionsCount?: number;
}): ProfileCoverageV2 {
  const { domains, constructs, facets, totalAnsweredQuestionsCount = 0 } = params;

  // 1. Measured Domains (at least one facet measured in domain)
  const measuredDomainsCount = domains.filter((d) => d.measuredFacetCount > 0).length;
  const domainRatio = TOTAL_MASTER_DOMAINS_COUNT > 0
    ? Number((measuredDomainsCount / TOTAL_MASTER_DOMAINS_COUNT).toFixed(3))
    : 0;
  const domainPercentage = Math.round(domainRatio * 100);

  // 2. Measured Constructs (at least one facet measured in construct)
  const measuredConstructsCount = constructs.filter((c) => c.measuredFacetCount > 0).length;
  const constructRatio = TOTAL_MASTER_CONSTRUCTS_COUNT > 0
    ? Number((measuredConstructsCount / TOTAL_MASTER_CONSTRUCTS_COUNT).toFixed(3))
    : 0;
  const constructPercentage = Math.round(constructRatio * 100);

  // 3. Measured Facets (status === MEASURED_PRECALIBRATION)
  const measuredFacetsCount = facets.filter(
    (f) => f.measurementStatus === 'MEASURED_PRECALIBRATION' && f.score !== null
  ).length;
  const facetRatio = TOTAL_MASTER_FACETS_COUNT > 0
    ? Number((measuredFacetsCount / TOTAL_MASTER_FACETS_COUNT).toFixed(3))
    : 0;
  const facetPercentage = Math.round(facetRatio * 100);

  // 4. Question Coverage
  const actualAnswered = Math.min(
    TOTAL_ADMINISTERED_ITEMS_COUNT,
    Math.max(
      totalAnsweredQuestionsCount,
      facets.reduce((acc, f) => acc + (f.itemCountAnswered || 0), 0)
    )
  );
  const questionRatio = TOTAL_ADMINISTERED_ITEMS_COUNT > 0
    ? Number((actualAnswered / TOTAL_ADMINISTERED_ITEMS_COUNT).toFixed(3))
    : 0;
  const questionPercentage = Math.round(questionRatio * 100);

  return {
    domainCoverage: {
      measuredCount: measuredDomainsCount,
      totalCount: TOTAL_MASTER_DOMAINS_COUNT,
      ratio: domainRatio,
      percentage: domainPercentage,
    },
    constructCoverage: {
      measuredCount: measuredConstructsCount,
      totalCount: TOTAL_MASTER_CONSTRUCTS_COUNT,
      ratio: constructRatio,
      percentage: constructPercentage,
    },
    facetCoverage: {
      measuredCount: measuredFacetsCount,
      totalCount: TOTAL_MASTER_FACETS_COUNT,
      ratio: facetRatio,
      percentage: facetPercentage,
    },
    questionCoverage: {
      answeredCount: actualAnswered,
      totalCount: TOTAL_ADMINISTERED_ITEMS_COUNT,
      ratio: questionRatio,
      percentage: questionPercentage,
    },
    disclaimerTr:
      'Ölçüm kapsamı, PsycheAI Master Psikolojik Modeli (%91 alt boyut) üzerinde taranan alanların oranını gösterir; psikolojik kesinlik veya genel başarı puanı değildir.',
  };
}
