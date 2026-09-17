import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { PageContainer } from '@/components/ui/PageContainer';
import { UnifiedProfileEmptyState } from '@/components/profile/UnifiedProfileEmptyState';
import { UnifiedProfileClientViewV2 } from '@/components/profile/UnifiedProfileClientViewV2';

export const dynamic = 'force-dynamic';

export default async function UnifiedProfilePage() {
  // 1. Authenticated User & Self-Access Only
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/profile');
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  // 2. Fetch authoritative Master Model Unified Psychological Profile V2
  const profile = await resolveUnifiedPsychologicalProfileV2(user.id);

  // 3. Render Zero-Assessment Empty State if no completed assessments
  if (!profile.hasAssessments) {
    return (
      <PageContainer variant="wide" className="space-y-8 pb-16">
        <UnifiedProfileEmptyState
          userName={profile.userName}
          nextAssessmentUrl={profile.nextBestAssessment?.url}
          nextAssessmentTitle={profile.nextBestAssessment?.titleTr}
        />
      </PageContainer>
    );
  }

  // 4. Render 11-Domain Master Model Unified Profile V2 View
  return (
    <PageContainer variant="wide" className="pb-16">
      <UnifiedProfileClientViewV2 profile={profile} />
    </PageContainer>
  );
}
