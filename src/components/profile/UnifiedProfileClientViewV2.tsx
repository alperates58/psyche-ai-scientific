'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Dna,
  BookOpen,
  Compass,
  Brain,
  Grid,
  Layers,
  Scale,
  Clock,
  Lightbulb,
  BarChart3,
  ShieldCheck,
  Download,
  Zap,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { UnifiedProfileAISectionData } from '@/types/aiInsightV2';
import { ProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';

// V3 Profile Components
import { ProfileHeroV3 } from './ProfileHeroV3';
import { PersonalityDNA } from './PersonalityDNA';
import { ProfileNarrative } from './ProfileNarrative';
import { HexacoRadarV2 } from './HexacoRadarV2';
import { HexacoFacetHeatmap } from './HexacoFacetHeatmap';
import { FacetInsightCardV3 } from './FacetInsightCardV3';
import { TraitInteractionMatrix } from './TraitInteractionMatrix';
import { StrengthBalanceMatrix } from './StrengthBalanceMatrix';
import { CompletedAssessmentsPanel } from './CompletedAssessmentsPanel';
import { TheoryLensPreviewSection } from './TheoryLensPreviewSection';
import { ScientificDetailPanelV2 } from './ScientificDetailPanelV2';
import { UnexploredAreasPanel } from './UnexploredAreasPanel';

// Specialized Domain Components
import { SelfSystemProfile } from './SelfSystemProfile';
import { EmotionRegulationProfile } from './EmotionRegulationProfile';
import { DecisionStyleMap } from './DecisionStyleMap';
import { NeedsProfile } from './NeedsProfile';
import { ResilienceProfile } from './ResilienceProfile';
import { SchwartzValuesCircle } from './SchwartzValuesCircle';
import { InterpersonalStyleCompass } from './InterpersonalStyleCompass';
import { UnifiedProfileAISectionV2 } from './ai/UnifiedProfileAISectionV2';

interface UnifiedProfileClientViewV2Props {
  profile: UnifiedPsychologicalProfileV2;
  aiSectionData?: UnifiedProfileAISectionData;
  evidenceBundle?: ProfileEvidenceBundleV2;
}

interface NavSectionItem {
  id: string;
  labelTr: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAVIGATION_SECTIONS: NavSectionItem[] = [
  { id: 'section-hero', labelTr: 'Genel Bakış', icon: Sparkles },
  { id: 'section-fingerprint', labelTr: 'Kişilik DNA', icon: Dna },
  { id: 'section-summary', labelTr: 'Psikolojik Rapor', icon: BookOpen },
  { id: 'section-domains', labelTr: '11 Boyut', icon: Compass },
  { id: 'section-hexaco', labelTr: 'HEXACO Radar', icon: Brain },
  { id: 'section-facets', labelTr: '91 Alt Boyut', icon: Grid },
  { id: 'section-patterns', labelTr: 'Etkileşimler', icon: Layers },
  { id: 'section-synergies', labelTr: 'Sinerjiler', icon: Sparkles },
  { id: 'section-tensions', labelTr: 'Denge Noktaları', icon: Scale },
  { id: 'section-stability', labelTr: 'Ölçüm Geçmişi', icon: Clock },
  { id: 'section-theory-council', labelTr: 'Kuramlar Konseyi', icon: Lightbulb },
  { id: 'section-comparisons', labelTr: 'Popülasyon Normları', icon: BarChart3 },
  { id: 'section-science', labelTr: 'Bilimsel Kalite', icon: ShieldCheck },
  { id: 'section-exports', labelTr: 'Dışa Aktar', icon: Download },
  { id: 'section-growth-prep', labelTr: 'Gelişim Yolculuğu', icon: Zap },
];

export const UnifiedProfileClientViewV2: React.FC<UnifiedProfileClientViewV2Props> = ({
  profile,
  aiSectionData,
  evidenceBundle,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('section-hero');
  const [selectedDomainTab, setSelectedDomainTab] = useState<string>('self_system');
  const [facetSearchQuery, setFacetSearchQuery] = useState('');
  const [facetDomainFilter, setFacetDomainFilter] = useState('ALL');
  const [facetStatusFilter, setFacetStatusFilter] = useState<'ALL' | 'MEASURED' | 'NOT_MEASURED'>('MEASURED');
  const [showAllMeasuredFacets, setShowAllMeasuredFacets] = useState(false);

  // Smooth scroll handler
  const handleNavClick = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Offset for sticky navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Scroll spy to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (let i = NAVIGATION_SECTIONS.length - 1; i >= 0; i--) {
        const section = document.getElementById(NAVIGATION_SECTIONS[i].id);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSectionId(NAVIGATION_SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter facets for 91 facet catalog
  const filteredFacets = useMemo(() => {
    return profile.facets.filter((facet) => {
      if (facetDomainFilter !== 'ALL' && facet.domainId !== facetDomainFilter) {
        return false;
      }
      const isMeasured = facet.measurementStatus !== 'NOT_MEASURED' && facet.score !== null;
      if (facetStatusFilter === 'MEASURED' && !isMeasured) return false;
      if (facetStatusFilter === 'NOT_MEASURED' && isMeasured) return false;

      if (facetSearchQuery.trim()) {
        const query = facetSearchQuery.toLowerCase();
        return (
          facet.nameTr.toLowerCase().includes(query) ||
          facet.nameEn.toLowerCase().includes(query) ||
          (facet.scientificDefinitionTr && facet.scientificDefinitionTr.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [profile.facets, facetDomainFilter, facetStatusFilter, facetSearchQuery]);

  const measuredFacetsList = useMemo(() => {
    return filteredFacets.filter((f) => f.measurementStatus !== 'NOT_MEASURED' && f.score !== null);
  }, [filteredFacets]);

  const unmeasuredFacetsList = useMemo(() => {
    return filteredFacets.filter((f) => f.measurementStatus === 'NOT_MEASURED' || f.score === null);
  }, [filteredFacets]);

  const displayedMeasuredFacets = showAllMeasuredFacets
    ? measuredFacetsList
    : measuredFacetsList.slice(0, 8);

  return (
    <div className="w-full space-y-10 pb-20">
      {/* ========================================================================= */}
      {/* 1. STICKY TOP JUMP NAVIGATION BAR (Replacing rejected permanent sidebar) */}
      {/* ========================================================================= */}
      <div className="sticky top-14 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2.5 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {NAVIGATION_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleNavClick(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.labelTr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL-WIDTH PROFILE CANVAS (~1300-1440px) */}
      {/* ========================================================================= */}
      <div className="space-y-12">
        {/* SECTION 1: PROFIL KAHRAMANI (HERO) */}
        <section id="section-hero" className="scroll-mt-24">
          <ProfileHeroV3
            profile={profile}
            onExploreClick={() => handleNavClick('section-facets')}
          />
        </section>

        {/* SECTION 2: PSİKOLOJİK İMZA / KİŞİLİK DNA'SI */}
        <section id="section-fingerprint" className="scroll-mt-24">
          <PersonalityDNA profile={profile} />
        </section>

        {/* SECTION 3: PSİKOLOJİK ANLATI RAPORU VE AI SENTEZİ */}
        <section id="section-summary" className="scroll-mt-24 space-y-8">
          {aiSectionData && evidenceBundle && (
            <UnifiedProfileAISectionV2
              data={aiSectionData}
              bundle={evidenceBundle}
            />
          )}
          <ProfileNarrative
            profile={profile}
            evidenceBundle={evidenceBundle}
          />
        </section>

        {/* SECTION 4: 11 ALAN İNCELEMESİ (DOMAIN EXPLORATION) */}
        <section id="section-domains" className="scroll-mt-24 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Compass className="w-4 h-4" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    11 Boyutlu Psikolojik Evren İncelemesi
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Her psikolojik alanı kendine özgü bilimsel çerçevesi ve ölçülen göstergeleriyle derinlemesine keşfet.
                </p>
              </div>
            </div>

            {/* Domain Tab Selector */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              {[
                { id: 'self_system', label: 'Benlik & Öz-Düzenleme' },
                { id: 'emotion_regulation', label: 'Duygular & Dayanıklılık' },
                { id: 'cognition_decision', label: 'Biliş & Karar Verme' },
                { id: 'motivation_values', label: 'Motivasyon & Değerler' },
                { id: 'social_relational', label: 'İlişkiler & Sosyal' },
                { id: 'coping_resilience', label: 'Zorlanma & Toparlanma' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedDomainTab(tab.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedDomainTab === tab.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Specialized Domain Content Area */}
            <div className="pt-2">
              {selectedDomainTab === 'self_system' && (
                <SelfSystemProfile profile={profile} />
              )}
              {selectedDomainTab === 'emotion_regulation' && (
                <EmotionRegulationProfile profile={profile} />
              )}
              {selectedDomainTab === 'cognition_decision' && (
                <DecisionStyleMap profile={profile} />
              )}
              {selectedDomainTab === 'motivation_values' && (
                <div className="space-y-6">
                  <NeedsProfile profile={profile} />
                  <SchwartzValuesCircle profile={profile} />
                </div>
              )}
              {selectedDomainTab === 'social_relational' && (
                <InterpersonalStyleCompass profile={profile} />
              )}
              {selectedDomainTab === 'coping_resilience' && (
                <ResilienceProfile profile={profile} />
              )}
            </div>
          </div>

          {/* Unexplored Areas Invitation */}
          <UnexploredAreasPanel profile={profile} />
        </section>

        {/* SECTION 5: HEXACO RADAR & 24 FASET HEATMAP */}
        <section id="section-hexaco" className="scroll-mt-24 space-y-6">
          <HexacoRadarV2 profile={profile} />
          <HexacoFacetHeatmap profile={profile} />
        </section>

        {/* SECTION 6: 91 ALT BOYUT KATALOĞU (FACET EXPLORER) */}
        <section id="section-facets" className="scroll-mt-24 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Header & Filter Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Grid className="w-4 h-4" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    91 Alt Boyut Kataloğu ve Zengin Yorumlar
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Her alt boyut için günlük yaşam anlamı, avantajlar, enerji maliyeti ve öz-düşünüm soruları.
                </p>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-semibold self-start lg:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setFacetStatusFilter('MEASURED')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    facetStatusFilter === 'MEASURED'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Ölçülenler ({profile.facets.filter((f) => f.measurementStatus !== 'NOT_MEASURED' && f.score !== null).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFacetStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    facetStatusFilter === 'ALL'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Tüm Boyutlar (91)
                </button>
                <button
                  type="button"
                  onClick={() => setFacetStatusFilter('NOT_MEASURED')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    facetStatusFilter === 'NOT_MEASURED'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Henüz Ölçülmeyenler ({profile.facets.filter((f) => f.measurementStatus === 'NOT_MEASURED' || f.score === null).length})
                </button>
              </div>
            </div>

            {/* Search and Domain Select Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Boyut adı veya anahtar kelime ara..."
                  value={facetSearchQuery}
                  onChange={(e) => setFacetSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <select
                value={facetDomainFilter}
                onChange={(e) => setFacetDomainFilter(e.target.value)}
                className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 shrink-0"
              >
                <option value="ALL">Tüm Alanlar</option>
                {profile.domains.map((d) => (
                  <option key={d.domainId} value={d.domainId}>
                    {d.nameTr}
                  </option>
                ))}
              </select>
            </div>

            {/* Measured Facets Grid with FacetInsightCardV3 */}
            {facetStatusFilter !== 'NOT_MEASURED' && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ölçülen Boyutlar ({measuredFacetsList.length})
                </div>

                {displayedMeasuredFacets.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
                    Arama kriterlerine uygun ölçülmüş boyut bulunamadı.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayedMeasuredFacets.map((facet) => (
                      <FacetInsightCardV3
                        key={facet.facetId}
                        facet={facet}
                        allFacets={profile.facets}
                      />
                    ))}
                  </div>
                )}

                {measuredFacetsList.length > 8 && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAllMeasuredFacets(!showAllMeasuredFacets)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
                    >
                      <span>
                        {showAllMeasuredFacets
                          ? 'Daha Az Göster'
                          : `Kalan ${measuredFacetsList.length - 8} Ölçülen Boyutu Göster`}
                      </span>
                      {showAllMeasuredFacets ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Unmeasured Facets Grid */}
            {facetStatusFilter !== 'MEASURED' && unmeasuredFacetsList.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Henüz Ölçülmeyen Boyutlar ({unmeasuredFacetsList.length})
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {unmeasuredFacetsList.slice(0, 15).map((facet) => (
                    <div
                      key={facet.facetId}
                      className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                          {facet.nameTr}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {facet.nameEn}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
                        Ölçülmedi
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 7: ÖZELLİK ETKİLEŞİM MATRİSİ */}
        <section id="section-patterns" className="scroll-mt-24">
          <TraitInteractionMatrix profile={profile} />
        </section>

        {/* SECTION 8: GÜÇLÜ KOMBİNASYONLAR (SİNERJİLER) */}
        <section id="section-synergies" className="scroll-mt-24">
          <StrengthBalanceMatrix profile={profile} />
        </section>

        {/* SECTION 9: HASSAS DENGE NOKTALARI (GERİLİMLER) */}
        <section id="section-tensions" className="scroll-mt-24">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                    <Scale className="w-4 h-4" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Hassas Denge Noktaları ve Durumsal Gerilimler
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Farklı bağlamlarda birbiriyle yarışabilen iki güçlü eğiliminin dengesini koruma alanları.
                </p>
              </div>
            </div>

            {profile.tensions && profile.tensions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.tensions.map((ten) => (
                  <div
                    key={ten.id}
                    className="p-5 rounded-2xl bg-amber-50/30 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {ten.titleTr}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                        Denge Alanı
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ten.descriptionTr}
                    </p>
                    {ten.reflectionPromptTr && (
                      <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-100 dark:border-amber-900/30 text-xs text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-amber-700 dark:text-amber-400 mr-1.5">Öz-Düşünüm Sorusu:</span>
                        {ten.reflectionPromptTr}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-center text-xs text-slate-500">
                Tamamlanan ampirik değerlendirmeler arttıkça hassas denge noktalarınız burada listelenir.
              </div>
            )}
          </div>
        </section>

        {/* SECTION 10: ÖLÇÜM GEÇMİŞİ VE KARARLILIK (STABILITY) */}
        <section id="section-stability" className="scroll-mt-24 space-y-6">
          <CompletedAssessmentsPanel profile={profile} />

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Clock className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Ölçüm Kararlılığı ve Boylamsal Takip
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Kişilik ve benlik özellikleri zaman içinde görece kararlı kalırken; stres toleransı, duygu düzenleme ve öznel iyi oluş çevresel faktörlere göre dalgalanabilir. PsycheAI, tekrarlanan ölçümler arasındaki değişimleri nedensel iddialar üretmeden betimsel olarak izler.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
              <span>Boylamsal Tekrar Ölçüm Durumu:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {profile.longitudinalReadiness.hasRepeatMeasurements
                  ? 'Tekrarlı Ölçüm Kaydedildi'
                  : 'İlk Ölçüm Dönemi (Referans Baseline)'}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 11: KURAMLAR KONSEYİ ENTEGRASYONU */}
        <section id="section-theory-council" className="scroll-mt-24">
          <TheoryLensPreviewSection profile={profile} />
        </section>

        {/* SECTION 12: POPÜLASYON NORMLARI VE KARŞILAŞTIRMALI PERSPEKTİF */}
        <section id="section-comparisons" className="scroll-mt-24">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <BarChart3 className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Popülasyon Normları ve Karşılaştırmalı Analiz
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-3">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    Bilimsel Şeffaflık Taahhüdü: Toplum Normlarıyla Karşılaştırma Henüz Sunulmuyor
                  </div>
                  <p>
                    PsycheAI, temsil edici ulusal örneklem kalibrasyon çalışmaları tamamlanmadan kullanıcılara varsayımsal veya uydurma persentil (yüzdelik dilim) değerleri sunmayı reddeder.
                  </p>
                  <p>
                    Gördüğünüz tüm puanlar, ilgili bilimsel ölçeğin mutlak aralığındaki (1.00 - 5.00) konumunuzu temsil eder. Gelecek dönemde ulusal norm kohortları tamamlandığında, temsil gücü yüksek referans gruplarıyla karşılaştırmalar isteğe bağlı olarak açılacaktır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 13: BİLİMSEL METODOLOJİ VE KALİTE */}
        <section id="section-science" className="scroll-mt-24">
          <ScientificDetailPanelV2 profile={profile} />
        </section>

        {/* SECTION 14: DIŞA AKTARMA VE VERİ TAŞINABİLİRLİĞİ */}
        <section id="section-exports" className="scroll-mt-24">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Download className="w-4 h-4" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Rapor Dışa Aktarma ve Veri Taşınabilirliği
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ölçülen psikolojik profilinizi yazdırılabilir formatta kaydedin veya araştırma verinizi indirin.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Yazdırılabilir Özet Rapor (PDF)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Kişilik DNA&apos;sı, HEXACO radar grafiği ve 10 bölümlük psikolojik anlatı sentezinizi içeren temiz PDF çıktısı.
                </p>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Raporu Yazdır / PDF İndir</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Ham Veri Taşınabilirliği (JSON)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  91 alt boyut puanınızı, yanıt güvenilirlik telemetrinizi ve kanıt paketini içeren yapılandırılmış JSON verisi.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
                    const dlAnchor = document.createElement('a');
                    dlAnchor.setAttribute('href', dataStr);
                    dlAnchor.setAttribute('download', `psycheai_profile_${profile.userId}_v2.json`);
                    dlAnchor.click();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-xs font-bold transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>JSON Verisini İndir</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 15: KİŞİSEL GELİŞİM YOLCULUĞU (FAZ 2.22 HAZIRLIĞI) */}
        <section id="section-growth-prep" className="scroll-mt-24">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-6 sm:p-8 text-white border border-indigo-800/50 shadow-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-indigo-300" />
              <span>Gelişim Yolculuğu &amp; Eylem Motoru (Faz 2.22)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ölçümden Eyleme: Kişisel Gelişim Motoru Çok Yakında
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed max-w-3xl">
              Ölçülen güçlü kombinasyonlarınız, içsel sinerjileriniz ve hassas denge noktalarınız; Faz 2.22 kapsamında günlük mikro-eylemlere, bağlamsal farkındalık hatırlatıcılarına ve kanıta dayalı gelişim pratiklerine dönüştürülecektir.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-indigo-300/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ampirik profiliniz hazır; gelişim motoru entegrasyonu aşamasında doğrudan kullanılacaktır.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
