import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getTheoryLens, getTheorySourcesForLens } from '@/lib/ai/theoryLens/theoryLensRegistry';
import { generateTheoryInsight } from '@/services/theoryLensService';
import { PageContainer } from '@/components/ui/PageContainer';
import { TheoryLensDetailClient } from '@/components/theory/TheoryLensDetailClient';
import { isTheoryLensId } from '@/lib/ai/theoryLens/theoryLensRegistry';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ lensId: string }>;
}

export default async function TheoryLensDetailPage({ params }: PageProps) {
  const { lensId } = await params;

  if (!lensId || !isTheoryLensId(lensId)) {
    notFound();
  }

  const lens = getTheoryLens(lensId);
  if (!lens) {
    notFound();
  }

  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect(`/login?callbackUrl=/theory-council/${lensId.toLowerCase()}`);
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  const sources = getTheorySourcesForLens(lens.lensId);
  const initialInsight = await generateTheoryInsight(user.id, lens.lensId);

  return (
    <PageContainer variant="wide" className="pb-16">
      <TheoryLensDetailClient
        lens={lens}
        sources={sources}
        initialInsight={initialInsight}
      />
    </PageContainer>
  );
}
