import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUserOrNull } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getLatestProfileSnapshotForUser } from '@/services/profileService';
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

  const latestSnapshot = await getLatestProfileSnapshotForUser(user.id);
  const isAssessed = !!latestSnapshot && latestSnapshot.facetScores.length > 0;

  const domains = await prisma.domain.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      constructs: {
        orderBy: { sortOrder: 'asc' },
        include: {
          facets: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });

  const snapshotFacetMap = new Map<string, { rawMean: number; itemCount: number }>();
  if (latestSnapshot) {
    for (const fs of latestSnapshot.facetScores) {
      snapshotFacetMap.set(fs.facetId, { rawMean: fs.rawMean, itemCount: fs.itemCount });
    }
  }

  let measuredFacetCount = 0;
  let totalFacetCount = 0;

  const heatmapRows: HeatmapDomainRow[] = domains.map((domain) => {
    const allFacetsInDomain = domain.constructs.flatMap((c) => c.facets);
    totalFacetCount += allFacetsInDomain.length;

    const cells: HeatmapCell[] = allFacetsInDomain.map((f) => {
      const recorded = snapshotFacetMap.get(f.id);
      if (recorded) {
        measuredFacetCount++;
        const normalized = Math.round(((recorded.rawMean - 1) / 4) * 100);
        return {
          facetId: f.id,
          name: f.nameTr || f.nameEn,
          score: normalized,
          precision: recorded.itemCount >= 6 ? 'High' : recorded.itemCount >= 3 ? 'Moderate' : 'Developing',
          items: recorded.itemCount,
        };
      }

      return {
        facetId: f.id,
        name: f.nameTr || f.nameEn,
        score: null,
        precision: 'Unmeasured',
        items: 0,
      };
    });

    return {
      domainId: domain.id,
      domainName: domain.nameTr || domain.nameEn,
      facets: cells,
    };
  });

  return (
    <ProfileHeatmapClient
      initialData={heatmapRows}
      isAssessed={isAssessed}
      measuredFacetCount={measuredFacetCount}
      totalFacetCount={totalFacetCount}
    />
  );
}
