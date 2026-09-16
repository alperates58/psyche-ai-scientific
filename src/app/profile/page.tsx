import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getUnifiedPsychologicalProfile } from '@/services/unifiedProfileService';
import { PageContainer } from '@/components/ui/PageContainer';
import { UnifiedProfileEmptyState } from '@/components/profile/UnifiedProfileEmptyState';
import { UnifiedProfileClientView } from '@/components/profile/UnifiedProfileClientView';

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

  // 2. Fetch authoritative unified psychological profile
  const profile = await getUnifiedPsychologicalProfile(user.id);

  // 3. Render Zero-Assessment Empty State if no completed assessments
  if (!profile.hasAssessments) {
    return (
      <PageContainer variant="wide" className="space-y-8 pb-16">
        <UnifiedProfileEmptyState
          userName={profile.userName}
          nextAssessmentUrl={profile.nextAction?.url}
          nextAssessmentTitle={profile.nextAction?.title}
        />
      </PageContainer>
    );
  }

  // 4. Render Multi-Layered Unified Profile Client View
  return (
    <PageContainer variant="wide" className="pb-16">
      <UnifiedProfileClientView profile={profile} />
    </PageContainer>
  );
}
