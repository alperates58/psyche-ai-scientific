import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getUserAssessmentJourney } from '@/services/assessmentJourneyService';
import { PageContainer } from '@/components/ui/PageContainer';
import { AssessmentsJourneyView } from '@/components/assessments/AssessmentsJourneyView';

export const dynamic = 'force-dynamic';

export default async function AssessmentsCatalogPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/assessments');
  }

  const journey = await getUserAssessmentJourney(user.id);

  return (
    <PageContainer variant="wide" className="py-6 sm:py-8">
      <AssessmentsJourneyView journey={journey} />
    </PageContainer>
  );
}

