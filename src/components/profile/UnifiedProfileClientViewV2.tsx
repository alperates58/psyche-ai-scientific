'use client';

import React, { useState } from 'react';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import { UnifiedProfileAISectionData } from '@/types/aiInsightV2';
import { ProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';
import { UnifiedProfileAISectionV2 } from './ai/UnifiedProfileAISectionV2';
import { ProfileOverviewCardV2 } from './ProfileOverviewCardV2';
import { ProfileDomainMapV2 } from './ProfileDomainMapV2';
import { ConstructMatrixV2 } from './ConstructMatrixV2';
import { FacetExplorerV2 } from './FacetExplorerV2';
import { ProfileHeatmapV2 } from './ProfileHeatmapV2';
import { TensionsSynergiesViewV2 } from './TensionsSynergiesViewV2';
import { ProfileCoverageViewV2 } from './ProfileCoverageViewV2';
import {
  Brain,
  Compass,
  Layers,
  Grid,
  Scale,
  ShieldCheck,
  Sparkles,
  Heart,
  Zap,
  Lightbulb,
  Target,
  Users,
  Smile,
  Activity,
} from 'lucide-react';

export type ProfileTabId =
  | 'overview'
  | 'domain_map'
  | 'personality'
  | 'self_system'
  | 'emotion'
  | 'cognition'
  | 'motivation'
  | 'relationships'
  | 'wellbeing'
  | 'tensions'
  | 'coverage';

interface UnifiedProfileClientViewV2Props {
  profile: UnifiedPsychologicalProfileV2;
  aiSectionData?: UnifiedProfileAISectionData;
  evidenceBundle?: ProfileEvidenceBundleV2;
}

export const UnifiedProfileClientViewV2: React.FC<UnifiedProfileClientViewV2Props> = ({
  profile,
  aiSectionData,
  evidenceBundle,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTabId>('overview');
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);

  const handleSelectDomain = (domainId: string) => {
    setSelectedDomainId(domainId);
    // Map domain to relevant tab
    if (domainId === 'core_personality') setActiveTab('personality');
    else if (domainId === 'self_system' || domainId === 'self_regulation') setActiveTab('self_system');
    else if (domainId === 'emotion_regulation' || domainId === 'coping_resilience') setActiveTab('emotion');
    else if (domainId === 'cognition_decision' || domainId === 'creativity_curiosity') setActiveTab('cognition');
    else if (domainId === 'motivation_values') setActiveTab('motivation');
    else if (domainId === 'social_relational' || domainId === 'optional_dark_tetrad') setActiveTab('relationships');
    else if (domainId === 'wellbeing_vitality') setActiveTab('wellbeing');
    else setActiveTab('domain_map');
  };

  const getDomainFiltered = (domainIds: string[]) => {
    return profile.domains.filter((d) => domainIds.includes(d.domainId));
  };

  return (
    <div className="space-y-8">
      {/* Top Overview Card */}
      <ProfileOverviewCardV2 profile={profile} />

      {/* Navigation Tabs (11 Sections Architecture) */}
      <div className="border-b border-slate-200 dark:border-slate-800 sticky top-16 z-20 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab('overview'); setSelectedDomainId(null); }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            1. Profil Özeti & Isı Haritası
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('domain_map'); setSelectedDomainId(null); }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'domain_map'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            2. 11 Alan Haritası
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('personality'); setSelectedDomainId('core_personality'); }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'personality'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            3. Kişilik & Mizaç (HEXACO)
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('self_system'); setSelectedDomainId(null); }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'self_system'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            4. Benlik & Öz-Düzenleme
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('emotion'); setSelectedDomainId(null); }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'emotion'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            5. Duygular & Dayanıklılık
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('cognition'); setSelectedDomainId(null); }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'cognition'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            6. Biliş & Karar Verme
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('motivation'); setSelectedDomainId('motivation_values'); }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'motivation'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            7. Motivasyon & Değerler
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('relationships'); setSelectedDomainId('social_relational'); }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'relationships'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            8. İlişkiler & Sosyal
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('wellbeing'); setSelectedDomainId('wellbeing_vitality'); }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'wellbeing'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            9. İyi Oluş & Başa Çıkma
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('tensions'); setSelectedDomainId(null); }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'tensions'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            10. Gerginlikler & Sinerjiler
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('coverage'); setSelectedDomainId(null); }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'coverage'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            11. Ölçüm Kapsamı
          </button>
        </div>
      </div>

      {/* Tab Content Views */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {aiSectionData && evidenceBundle && (
            <UnifiedProfileAISectionV2
              data={aiSectionData}
              bundle={evidenceBundle}
            />
          )}
          <ProfileDomainMapV2
            domains={profile.domains}
            selectedDomainId={selectedDomainId}
            onSelectDomain={handleSelectDomain}
          />
          <ProfileHeatmapV2 domains={profile.domains} />
          <TensionsSynergiesViewV2
            tensions={profile.tensions}
            synergies={profile.synergies}
            crossDomainPatterns={profile.crossDomainPatterns}
          />
          <FacetExplorerV2 facets={profile.facets} domains={profile.domains} />
        </div>
      )}

      {activeTab === 'domain_map' && (
        <div className="space-y-8">
          <ProfileDomainMapV2
            domains={profile.domains}
            selectedDomainId={selectedDomainId}
            onSelectDomain={handleSelectDomain}
          />
          <ConstructMatrixV2
            domains={profile.domains}
            selectedDomainId={selectedDomainId}
          />
        </div>
      )}

      {activeTab === 'personality' && (
        <div className="space-y-8">
          <ConstructMatrixV2
            domains={getDomainFiltered(['core_personality'])}
            selectedDomainId="core_personality"
          />
          <FacetExplorerV2
            facets={profile.facets.filter((f) => f.domainId === 'core_personality')}
            domains={getDomainFiltered(['core_personality'])}
          />
        </div>
      )}

      {activeTab === 'self_system' && (
        <div className="space-y-8">
          <ConstructMatrixV2
            domains={getDomainFiltered(['self_system', 'self_regulation'])}
            selectedDomainId={null}
          />
          <FacetExplorerV2
            facets={profile.facets.filter(
              (f) => f.domainId === 'self_system' || f.domainId === 'self_regulation'
            )}
            domains={getDomainFiltered(['self_system', 'self_regulation'])}
          />
        </div>
      )}

      {activeTab === 'emotion' && (
        <div className="space-y-8">
          <ConstructMatrixV2
            domains={getDomainFiltered(['emotion_regulation', 'coping_resilience'])}
            selectedDomainId={null}
          />
          <FacetExplorerV2
            facets={profile.facets.filter(
              (f) => f.domainId === 'emotion_regulation' || f.domainId === 'coping_resilience'
            )}
            domains={getDomainFiltered(['emotion_regulation', 'coping_resilience'])}
          />
        </div>
      )}

      {activeTab === 'cognition' && (
        <div className="space-y-8">
          <ConstructMatrixV2
            domains={getDomainFiltered(['cognition_decision', 'creativity_curiosity'])}
            selectedDomainId={null}
          />
          <FacetExplorerV2
            facets={profile.facets.filter(
              (f) => f.domainId === 'cognition_decision' || f.domainId === 'creativity_curiosity'
            )}
            domains={getDomainFiltered(['cognition_decision', 'creativity_curiosity'])}
          />
        </div>
      )}

      {activeTab === 'motivation' && (
        <div className="space-y-8">
          <ConstructMatrixV2
            domains={getDomainFiltered(['motivation_values'])}
            selectedDomainId="motivation_values"
          />
          <FacetExplorerV2
            facets={profile.facets.filter((f) => f.domainId === 'motivation_values')}
            domains={getDomainFiltered(['motivation_values'])}
          />
        </div>
      )}

      {activeTab === 'relationships' && (
        <div className="space-y-8">
          <ConstructMatrixV2
            domains={getDomainFiltered(['social_relational', 'optional_dark_tetrad'])}
            selectedDomainId={null}
          />
          <FacetExplorerV2
            facets={profile.facets.filter(
              (f) => f.domainId === 'social_relational' || f.domainId === 'optional_dark_tetrad'
            )}
            domains={getDomainFiltered(['social_relational', 'optional_dark_tetrad'])}
          />
        </div>
      )}

      {activeTab === 'wellbeing' && (
        <div className="space-y-8">
          <ConstructMatrixV2
            domains={getDomainFiltered(['wellbeing_vitality'])}
            selectedDomainId="wellbeing_vitality"
          />
          <FacetExplorerV2
            facets={profile.facets.filter((f) => f.domainId === 'wellbeing_vitality')}
            domains={getDomainFiltered(['wellbeing_vitality'])}
          />
        </div>
      )}

      {activeTab === 'tensions' && (
        <div className="space-y-8">
          <TensionsSynergiesViewV2
            tensions={profile.tensions}
            synergies={profile.synergies}
            crossDomainPatterns={profile.crossDomainPatterns}
          />
        </div>
      )}

      {activeTab === 'coverage' && (
        <div className="space-y-8">
          <ProfileCoverageViewV2
            coverage={profile.coverage}
            confidenceMap={profile.confidenceMap}
            responseQuality={profile.responseQuality}
            longitudinalReadiness={profile.longitudinalReadiness}
            recentAssessments={profile.recentAssessments}
          />
        </div>
      )}
    </div>
  );
};
