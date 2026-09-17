import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getAllTheoryLenses } from '@/lib/ai/theoryLens/theoryLensRegistry';
import { PageContainer } from '@/components/ui/PageContainer';
import { TheoryComparisonClient } from '@/components/theory/TheoryComparisonClient';

export const dynamic = 'force-dynamic';

export default async function TheoryCouncilComparePage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/theory-council/compare');
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  const allLenses = getAllTheoryLenses();

  return (
    <PageContainer variant="wide" className="pb-16">
      <TheoryComparisonClient allLenses={allLenses} />
    </PageContainer>
  );
}
