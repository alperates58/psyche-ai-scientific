import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { getAllTheoryLenses } from '@/lib/ai/theoryLens/theoryLensRegistry';
import { PageContainer } from '@/components/ui/PageContainer';
import { TheoryCouncilLandingClient } from '@/components/theory/TheoryCouncilLandingClient';

export const dynamic = 'force-dynamic';

export default async function TheoryCouncilPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/theory-council');
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  const profile = await resolveUnifiedPsychologicalProfileV2(user.id);
  const lenses = getAllTheoryLenses();

  return (
    <PageContainer variant="wide" className="pb-16">
      <TheoryCouncilLandingClient
        lenses={lenses}
        coverageRatio={profile.coverage?.facetCoverage?.ratio ?? 0}
        measuredFacetCount={profile.coverage?.facetCoverage?.measuredCount ?? 0}
        totalFacetCount={profile.coverage?.facetCoverage?.totalCount ?? 91}
      />
    </PageContainer>
  );
}
