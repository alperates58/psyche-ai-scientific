import React from 'react';
import { getCurrentUserOrNull } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import {
  ProfileHeatmapClient,
  HeatmapDomainRow,
  HeatmapCell,
} from '@/components/profile/ProfileHeatmapClient';

export const dynamic = 'force-dynamic';

export default async function ProfileHeatmapPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/profile/heatmap');
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  // 1. Fetch authoritative Master Model Unified Psychological Profile V2 (11 Domains, 37 Constructs, 91 Facets)
  const profile = await resolveUnifiedPsychologicalProfileV2(user.id);
  const isAssessed = profile.hasAssessments;

  // 2. Build 11-Domain Master Model Heatmap Rows
  const heatmapRows: HeatmapDomainRow[] = profile.domains.map((domain) => {
    const allFacetsInDomain = domain.constructs.flatMap((c) => c.facets);

    const cells: HeatmapCell[] = allFacetsInDomain.map((f) => {
      const isMeasured = f.measurementStatus !== 'NOT_MEASURED' && f.score !== null;
      const precision: 'High' | 'Moderate' | 'Developing' | 'Unmeasured' = !isMeasured
        ? 'Unmeasured'
        : f.itemCountAnswered >= 6
        ? 'High'
        : f.itemCountAnswered >= 3
        ? 'Moderate'
        : 'Developing';

      return {
        facetId: f.facetId,
        name: f.nameTr || f.nameEn,
        score: isMeasured ? f.normalizedVisualCoordinate : null,
        precision,
        items: f.itemCountAnswered,
      };
    });

    return {
      domainId: domain.domainId,
      domainName: domain.nameTr || domain.nameEn,
      facets: cells,
    };
  });

  return (
    <ProfileHeatmapClient
      initialData={heatmapRows}
      isAssessed={isAssessed}
      measuredFacetCount={profile.coverage.facetCoverage.measuredCount}
      totalFacetCount={profile.coverage.facetCoverage.totalCount}
    />
  );
}
