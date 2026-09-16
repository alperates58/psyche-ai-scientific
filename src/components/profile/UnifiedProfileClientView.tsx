'use client';

import React, { useState } from 'react';
import { UnifiedProfileViewModel } from '@/types/profile';
import {
  ProfileLayerNavigation,
  ProfileLayerId,
} from './ProfileLayerNavigation';
import { UnifiedProfileHero } from './UnifiedProfileHero';
import { QualityDimensionsPanel } from './QualityDimensionsPanel';
import { ProfileFingerprint } from './ProfileFingerprint';
import { ProfileConfidenceMap } from './ProfileConfidenceMap';
import { TraitHeatmap } from './TraitHeatmap';
import { HexacoProfileCard } from './HexacoProfileCard';
import { HexacoFacetProfile } from './HexacoFacetProfile';
import { SelfSystemProfileCard } from './SelfSystemProfileCard';
import { StrengthsAttentionMatrix } from './StrengthsAttentionMatrix';
import { ProfileTensionMatrix } from './ProfileTensionMatrix';
import { ResponseQualityDashboard } from './ResponseQualityDashboard';
import { PsychologicalProfileMap } from './PsychologicalProfileMap';
import { DomainOverviewSection } from './DomainOverviewSection';
import { MissingDomainsCatalogue } from './MissingDomainsCatalogue';
import { SourceProvenanceTimeline } from './SourceProvenanceTimeline';
import { AiInsightCard } from './AiInsightCard';
import { ShieldCheck, Info } from 'lucide-react';

interface UnifiedProfileClientViewProps {
  profile: UnifiedProfileViewModel;
}

export const UnifiedProfileClientView: React.FC<UnifiedProfileClientViewProps> = ({
  profile,
}) => {
  const [activeLayer, setActiveLayer] = useState<ProfileLayerId>('summary');

  // Determine available domain layers
  const coreDomain = profile.domains.find((d) => d.code === 'core_personality');
  const selfDomain = profile.domains.find((d) => d.code === 'self_system');
  const emotionDomain = profile.domains.find((d) => d.code === 'emotional_affective');
  const relDomain = profile.domains.find((d) => d.code === 'relational_interpersonal');
  const motDomain = profile.domains.find((d) => d.code === 'motivational_value');
  const cogDomain = profile.domains.find((d) => d.code === 'cognitive_epistemic');

  const availableLayers = {
    hasPersonality: Boolean(coreDomain && coreDomain.status !== 'UNMEASURED'),
    hasSelfSystem: Boolean(selfDomain && selfDomain.status !== 'UNMEASURED'),
    hasEmotion: Boolean(emotionDomain && emotionDomain.status !== 'UNMEASURED'),
    hasRelationships: Boolean(relDomain && relDomain.status !== 'UNMEASURED'),
    hasMotivation: Boolean(motDomain && motDomain.status !== 'UNMEASURED'),
    hasCognition: Boolean(cogDomain && cogDomain.status !== 'UNMEASURED'),
    hasBehavior: profile.tensionMatrix.length > 0 || profile.interactions.length > 0,
  };

  return (
    <div className="space-y-8">
      {/* 1. Hero Summary (Always top-level) */}
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

      {/* 2. Layer Navigation Bar */}
      <ProfileLayerNavigation
        activeLayer={activeLayer}
        onSelectLayer={setActiveLayer}
        availableLayers={availableLayers}
      />

      {/* 3. Layer Content Views */}
      {activeLayer === 'summary' && (
        <div className="space-y-8">
          {/* Grounded AI Insight Card */}
          <AiInsightCard />

          {/* Quality Dimensions Overview */}
          <QualityDimensionsPanel dimensions={profile.qualityDimensions} />

          {/* Profile Fingerprint V2 */}
          <ProfileFingerprint
            dimensions={profile.fingerprint.dimensions}
            measuredCount={profile.fingerprint.measuredCount}
            totalCount={profile.fingerprint.totalCount}
            summaryText={profile.fingerprint.summaryText}
          />

          {/* Strengths & Attention Points Matrix */}
          <StrengthsAttentionMatrix
            strengths={profile.strengths}
            attentionPoints={profile.attentionPoints}
          />

          {/* Profile Tension Matrix */}
          <ProfileTensionMatrix tensionItems={profile.tensionMatrix} />

          {/* Trait Heatmap High-Density Matrix */}
          <TraitHeatmap matrix={profile.traitHeatmap} />
        </div>
      )}

      {activeLayer === 'personality' && profile.hexacoSection && (
        <div className="space-y-8">
          {/* HEXACO Radar & Factors */}
          <HexacoProfileCard
            radarData={profile.hexacoSection.radarData}
            constructs={profile.hexacoSection.constructs}
            measuredFacetCount={profile.hexacoSection.measuredFacetCount}
            totalFacetCount={profile.hexacoSection.totalFacetCount}
          />

          {/* Full HEXACO Facet Profile */}
          <HexacoFacetProfile
            constructs={profile.hexacoSection.constructs}
            measuredFacetCount={profile.hexacoSection.measuredFacetCount}
            totalFacetCount={profile.hexacoSection.totalFacetCount}
          />
        </div>
      )}

      {activeLayer === 'self_system' && profile.selfSystemSection && (
        <div className="space-y-8">
          <SelfSystemProfileCard
            rses={profile.selfSystemSection.rses}
            gse={profile.selfSystemSection.gse}
          />
        </div>
      )}

      {activeLayer === 'behavior' && (
        <div className="space-y-8">
          <ProfileTensionMatrix tensionItems={profile.tensionMatrix} />
        </div>
      )}

      {activeLayer === 'quality' && (
        <div className="space-y-8">
          {/* Profile Confidence Map */}
          <ProfileConfidenceMap confidenceMap={profile.confidenceMap} />

          {/* Response Quality Telemetry Dashboard */}
          <ResponseQualityDashboard responseQuality={profile.responseQuality} />

          {/* 84-Facet Map */}
          <PsychologicalProfileMap
            domains={profile.domains}
            measuredFacetCount={profile.qualityDimensions.coverage.exploredFacets}
            totalFacetCount={profile.qualityDimensions.coverage.totalFacets}
          />
        </div>
      )}

      {activeLayer === 'sources' && (
        <div className="space-y-8">
          {/* Master Visual Registry Status Table */}
          <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-border-subtle shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-border-subtle pb-3">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <h2 className="text-base font-bold text-text-primary">
                Görselleştirme ve Bilimsel Uygunluk Kütüğü (Master Visual Registry)
              </h2>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Her psikolojik görselleştirmenin ampirik kanıt ve kalibrasyon gereksinimleri katı bilimsel kurallarla yönetilir. Yeterli ampirik veri veya kalibrasyon normu bulunmayan grafikler kesinlikle engellenir.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-2 text-text-tertiary">
                    <th className="p-2.5 font-semibold">Görselleştirme</th>
                    <th className="p-2.5 font-semibold">Tip</th>
                    <th className="p-2.5 font-semibold">Durum</th>
                    <th className="p-2.5 font-semibold">Bilimsel Gerekçe / Engelleme Sebebi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {[
                    ...profile.visualRegistry.active,
                    ...profile.visualRegistry.conditional,
                    ...profile.visualRegistry.blocked,
                    ...profile.visualRegistry.future,
                  ].map((def) => {
                    let badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    if (def.status === 'CONDITIONAL') badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
                    else if (def.status === 'BLOCKED') badgeClass = 'bg-rose-50 text-rose-800 border-rose-200';
                    else if (def.status === 'FUTURE') badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';

                    return (
                      <tr key={def.id} className="hover:bg-surface-2/40">
                        <td className="p-2.5 font-bold text-text-primary">{def.titleTr}</td>
                        <td className="p-2.5 font-mono text-text-tertiary">{def.visualType}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                            {def.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-text-secondary max-w-md">
                          {def.status === 'BLOCKED' || def.status === 'FUTURE'
                            ? def.blockedWhen
                            : def.descriptionTr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Source Assessments Timeline */}
          <SourceProvenanceTimeline sourceAssessments={profile.sourceAssessments} />

          {/* Missing Domains Catalogue */}
          <MissingDomainsCatalogue unmeasuredDomains={profile.unmeasuredDomains} />

          {/* Domains Overview Drill-Down */}
          <DomainOverviewSection domains={profile.domains} />
        </div>
      )}
    </div>
  );
};
