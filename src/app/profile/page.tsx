import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getUnifiedPsychologicalProfile } from '@/services/unifiedProfileService';
import { PageContainer } from '@/components/ui/PageContainer';
import { UnifiedProfileHero } from '@/components/profile/UnifiedProfileHero';
import { QualityDimensionsPanel } from '@/components/profile/QualityDimensionsPanel';
import { ProfileFingerprint } from '@/components/profile/ProfileFingerprint';
import { PsychologicalProfileMap } from '@/components/profile/PsychologicalProfileMap';
import { HexacoProfileCard } from '@/components/profile/HexacoProfileCard';
import { SelfSystemProfileCard } from '@/components/profile/SelfSystemProfileCard';
import { StrengthsAttentionMatrix } from '@/components/profile/StrengthsAttentionMatrix';
import { CrossDomainInteractions } from '@/components/profile/CrossDomainInteractions';
import { DomainOverviewSection } from '@/components/profile/DomainOverviewSection';
import { MissingDomainsCatalogue } from '@/components/profile/MissingDomainsCatalogue';
import { SourceProvenanceTimeline } from '@/components/profile/SourceProvenanceTimeline';
import { UnifiedProfileEmptyState } from '@/components/profile/UnifiedProfileEmptyState';

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

  return (
    <PageContainer variant="wide" className="space-y-10 pb-16">
      {/* 1. Profile Hero with Maturity, Coverage & Next Action */}
      <UnifiedProfileHero
        userName={profile.userName}
        maturity={profile.maturity}
        measuredDomainsCount={profile.qualityDimensions.coverage.measuredDomains}
        totalDomainsCount={profile.qualityDimensions.coverage.totalDomains}
        exploredFacetsCount={profile.qualityDimensions.coverage.exploredFacets}
        totalFacetsCount={profile.qualityDimensions.coverage.totalFacets}
        completedAssessmentCount={profile.completedAssessmentCount}
        lastUpdatedAt={profile.lastUpdatedAt}
        responseQualityHeadlineTr={profile.responseQuality.headlineTr}
        nextAction={profile.nextAction}
      />

      {/* 2. Scientific Quality Dimensions Panel */}
      <QualityDimensionsPanel dimensions={profile.qualityDimensions} />

      {/* 3. Visual Profile Fingerprint (Deterministic summary of measured traits) */}
      <ProfileFingerprint
        dimensions={profile.fingerprint.dimensions}
        measuredCount={profile.fingerprint.measuredCount}
        totalCount={profile.fingerprint.totalCount}
        summaryText={profile.fingerprint.summaryText}
      />

      {/* 4. Signature 84-Facet Psychological Profile Map */}
      <PsychologicalProfileMap
        domains={profile.domains}
        measuredFacetCount={profile.qualityDimensions.coverage.exploredFacets}
        totalFacetCount={profile.qualityDimensions.coverage.totalFacets}
      />

      {/* 5. Specialized HEXACO Section (if measured) */}
      {profile.hexacoSection && profile.hexacoSection.isMeasured && (
        <HexacoProfileCard
          radarData={profile.hexacoSection.radarData}
          constructs={profile.hexacoSection.constructs}
          measuredFacetCount={profile.hexacoSection.measuredFacetCount}
          totalFacetCount={profile.hexacoSection.totalFacetCount}
        />
      )}

      {/* 6. Specialized Self-System Section (if measured) */}
      {profile.selfSystemSection && profile.selfSystemSection.isMeasured && (
        <SelfSystemProfileCard
          rses={profile.selfSystemSection.rses}
          gse={profile.selfSystemSection.gse}
        />
      )}

      {/* 7. Strengths & Attention Points Matrix */}
      <StrengthsAttentionMatrix
        strengths={profile.strengths}
        attentionPoints={profile.attentionPoints}
      />

      {/* 8. Cross-Domain Interaction Map (Synergies & Tensions) */}
      <CrossDomainInteractions interactions={profile.interactions} />

      {/* 9. Canonical Domains Overview & Drill-Down */}
      <DomainOverviewSection domains={profile.domains} />

      {/* 10. What is not yet known (Missing Domains Catalogue) */}
      <MissingDomainsCatalogue unmeasuredDomains={profile.unmeasuredDomains} />

      {/* 11. Source Assessment Provenance Timeline */}
      <SourceProvenanceTimeline sourceAssessments={profile.sourceAssessments} />
    </PageContainer>
  );
}
