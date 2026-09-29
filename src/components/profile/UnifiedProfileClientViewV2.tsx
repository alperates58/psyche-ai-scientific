'use client';

import React, { useState } from 'react';
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
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sun,
  Users,
  Heart,
  Zap,
  Shield,
  Activity,
} from 'lucide-react';

import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import { UnifiedProfileAISectionData } from '@/types/aiInsightV2';
import { ProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';

// Profile Components
import { ProfileTabNav } from './ProfileTabNav';
import { ProfileHeroV3 } from './ProfileHeroV3';
import { PersonalityDNA } from './PersonalityDNA';
import { ProfileNarrative } from './ProfileNarrative';
import { FacetInsightCardV3 } from './FacetInsightCardV3';
import { TraitInteractionMatrix } from './TraitInteractionMatrix';
import { StrengthBalanceMatrix } from './StrengthBalanceMatrix';
import { TheoryLensPreviewSection } from './TheoryLensPreviewSection';
import { CompletedAssessmentsPanel } from './CompletedAssessmentsPanel';

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
  // Filter top distinctive measured facets for main profile (6-8 facets only)
  const measuredFacets = profile.facets.filter(
    (f) => f.measurementStatus !== 'NOT_MEASURED' && f.score !== null
  );

  const topDistinctiveFacets = [...measuredFacets]
    .sort((a, b) => Math.abs((b.score ?? 3.0) - 3.0) - Math.abs((a.score ?? 3.0) - 3.0))
    .slice(0, 6);

  // 7 Domain Cards Configurations with family colors
  const domainCards = [
    {
      id: 'personality',
      titleTr: 'Temel Kişilik Yapısı',
      subtitleTr: 'HEXACO 6 faktör ve 24 alt boyut',
      href: '/profile/personality',
      color: 'bg-purple-600',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Brain,
      domainId: 'core_personality',
      count: profile.facets.filter((f) => (f.domainId === 'core_personality' || f.domainId === 'domain_personality_hexaco') && f.score !== null).length,
      total: 24,
      descTr: 'Sosyal cesaret, samimiyet, duygusal hassasiyet ve çalışma standartlarınızın kanonik haritası.',
    },
    {
      id: 'self',
      titleTr: 'Benlik & Öz-Düzenleme',
      subtitleTr: 'Benlik saygısı, öz-yeterlik ve otantiklik',
      href: '/profile/self',
      color: 'bg-indigo-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Zap,
      domainId: 'self_system',
      count: profile.facets.filter((f) => ['core_self_esteem', 'generalized_self_efficacy', 'authenticity', 'self_concept_clarity', 'general_self_control', 'long_term_grit'].includes(f.facetId) && f.score !== null).length,
      total: 6,
      descTr: 'Kendinle ilişkin ve kendini yönetme biçimin. Hedeflere bağlılık ve içsel denetim odağın.',
    },
    {
      id: 'emotions',
      titleTr: 'Duygusal İşleyiş',
      subtitleTr: 'Yeniden çerçeveleme, baskılama ve sıkıntı toleransı',
      href: '/profile/emotions',
      color: 'bg-rose-600',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: Heart,
      domainId: 'emotion_regulation',
      count: profile.facets.filter((f) => f.domainId === 'emotion_regulation' && f.score !== null).length,
      total: 9,
      descTr: 'Duygularınla nasıl çalışıyorsun? Stres anlarında anlamlandırma ve hisleri düzenleme kapasiten.',
    },
    {
      id: 'cognition',
      titleTr: 'Biliş & Karar Verme',
      subtitleTr: 'Analitik düşünme, sezgi ve belirsizlik toleransı',
      href: '/profile/cognition',
      color: 'bg-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Lightbulb,
      domainId: 'cognition_decision',
      count: profile.facets.filter((f) => f.domainId === 'cognition_decision' && f.score !== null).length,
      total: 9,
      descTr: 'Bilgiyi nasıl işlediğin, karar alma tempon ve karmaşık durumlar karşısındaki esnekliğin.',
    },
    {
      id: 'motivation',
      titleTr: 'Motivasyon & Değerler',
      subtitleTr: 'Temel ihtiyaçlar ve Schwartz değerler modeli',
      href: '/profile/motivation',
      color: 'bg-amber-600',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Sun,
      domainId: 'motivation_values',
      count: profile.facets.filter((f) => f.domainId === 'motivation_values' && f.score !== null).length,
      total: 9,
      descTr: 'Seni ne harekete geçiriyor? Özerklik, yetkinlik, evrensel değerler ve anlam kaynakların.',
    },
    {
      id: 'relationships',
      titleTr: 'İlişkisel Tarz',
      subtitleTr: 'Kişilerarası çember ve sosyal yaklaşım',
      href: '/profile/relationships',
      color: 'bg-teal-600',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: Users,
      domainId: 'social_relational',
      count: profile.facets.filter((f) => f.domainId === 'social_relational' && f.score !== null).length,
      total: 9,
      descTr: 'İnsanlarla nasıl yakınlık kuruyorsun ve sosyal ortamlarda kendini nasıl konumlandırıyorsun?',
    },
    {
      id: 'resilience',
      titleTr: 'Stres & Dayanıklılık',
      subtitleTr: 'Zorlanma, başa çıkma ve toparlanma dinamikleri',
      href: '/profile/resilience',
      color: 'bg-cyan-600',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: Shield,
      domainId: 'coping_resilience',
      count: profile.facets.filter((f) => f.domainId === 'coping_resilience' && f.score !== null).length,
      total: 4,
      descTr: 'Zorlukları göğüsleme, toparlanma hızı ve stres sonrası dengeni yeniden inşa etme tarzın.',
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Sticky top-14 navigation container with horizontal scroll (matches V3 & V4 audit invariant) */}
      <div className="sticky top-14 z-20 bg-bg-app/95 backdrop-blur-md py-2 overflow-x-auto no-scrollbar">
        <ProfileTabNav />
      </div>

      {/* ========================================================================= */}
      {/* 1. PROFILE SUMMARY SECTION (Hero + Narrative Report)                      */}
      {/* ========================================================================= */}
      <section id="section-summary" className="space-y-6">
        <div id="section-hero">
          <ProfileHeroV3 profile={profile} />
        </div>
        <ProfileNarrative
          profile={profile}
          evidenceBundle={evidenceBundle}
        />
      </section>

      {/* ========================================================================= */}
      {/* 2. PSYCHOLOGICAL SIGNATURE (PersonalityDNA - 8 Higher-Level Themes)       */}
      {/* ========================================================================= */}
      <section id="section-fingerprint" className="space-y-4">
        <PersonalityDNA profile={profile} />
      </section>

      {/* ========================================================================= */}
      {/* 3. FLAGSHIP VISUALS PREVIEW (Links directly to /profile/map)              */}
      {/* ========================================================================= */}
      <section id="section-visuals" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Amiral Gemisi Görseller</span>
            </div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">
              Görsel Profil Haritaları
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Çok boyutlu radar, 24 hücreli ısı haritası, değerler çemberi ve ilişkisel pusula.
            </p>
          </div>

          <Link
            href="/profile/map"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-xs hover:bg-brand-primary/90 transition-all shrink-0 self-start sm:self-auto"
          >
            <span>Tüm Haritaları İncele</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Flagship Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            id="section-hexaco"
            href="/profile/map#section-radar"
            className="p-5 rounded-2xl bg-surface-1 border border-border-default hover:border-purple-300 dark:hover:border-purple-700 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-text-primary group-hover:text-purple-600 transition-colors">
                HEXACO Kişilik Radarı
              </h3>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                6 temel faktörün çok eksenli radar gösterimi ve öne çıkan eğilimleriniz.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
              <span>Radara Git</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/profile/map#section-heatmap"
            className="p-5 rounded-2xl bg-surface-1 border border-border-default hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <Grid className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-text-primary group-hover:text-indigo-600 transition-colors">
                24 Alt Boyut Isı Haritası
              </h3>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                6 faktör × 4 boyut = 24 kanonik hücre. Tıklayarak günlük hayat yansımalarını incele.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
              <span>Isı Haritasına Git</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/profile/map#section-values"
            className="p-5 rounded-2xl bg-surface-1 border border-border-default hover:border-amber-300 dark:hover:border-amber-700 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-text-primary group-hover:text-amber-600 transition-colors">
                Değerler Haritası (Schwartz)
              </h3>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                4 kadranlı dairesel düzen: Açıklık, Aşkınlık, Muhafazacılık ve Gelişim değerleri.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
              <span>Değerler Çemberine Git</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/profile/map#section-interpersonal"
            className="p-5 rounded-2xl bg-surface-1 border border-border-default hover:border-teal-300 dark:hover:border-teal-700 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-text-primary group-hover:text-teal-600 transition-colors">
                İlişkisel Tarz Haritası
              </h3>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Sosyal yönlendiricilik (Ajans) ve sıcaklık/bağlanma (Komünyon) koordinatları.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
              <span>İlişkisel Haritaya Git</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PSYCHOLOGICAL AREAS (7 Domain Cards with Family Color Identities)      */}
      {/* ========================================================================= */}
      <section id="section-domains" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Derinlemesine Keşif</span>
            </div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">
              7 Temel Psikolojik Alan
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Her alan kendi kuramsal modelleri, özel görselleştirmeleri ve alt boyutlarıyla ayrı bir derinlik sayfası sunar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domainCards.map((domain) => {
            const Icon = domain.icon;
            const isMeasured = domain.count > 0;

            return (
              <Link
                key={domain.id}
                href={domain.href}
                className="p-6 rounded-3xl bg-surface-1 border border-border-default hover:border-brand-primary/40 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${domain.color} shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${domain.badgeColor}`}>
                      {isMeasured ? `${domain.count} Boyut Ölçüldü` : 'Ölçüm Bekliyor'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                      {domain.titleTr}
                    </h3>
                    <p className="text-[11px] text-text-tertiary font-medium">
                      {domain.subtitleTr}
                    </p>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {domain.descTr}
                  </p>
                </div>

                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-bold text-brand-primary">
                  <span>Alanı İncele</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TRAIT INTERACTIONS (Synergies & Tensions Dynamic Interactions)         */}
      {/* ========================================================================= */}
      <section id="section-patterns" className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border-default pb-3">
          <Layers className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">
              Özellik Etkileşimleri ve Denge Noktaları
            </h2>
            <p className="text-xs text-text-secondary">
              Tekil boyutların birbirini pekiştiren sinerjileri ve hassas denge gerektiren kombinasyonları.
            </p>
          </div>
        </div>

        <div id="section-synergies">
          <TraitInteractionMatrix profile={profile} />
        </div>
        <div id="section-tensions">
          <StrengthBalanceMatrix profile={profile} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TIMELINE & THEORY PREVIEW + TOP FACETS                                 */}
      {/* ========================================================================= */}
      <section id="section-previews" className="space-y-8">
        {/* Top Distinctive Facets (6 Facets only on main profile - never dumps all 91) */}
        {topDistinctiveFacets.length > 0 && (
          <div id="section-facets" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-xs font-bold mb-1">
                  <Grid className="w-3.5 h-3.5" />
                  <span>Öne Çıkan Özellikler</span>
                </div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">
                  Öne Çıkan Alt Boyutların
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Ölçülen kanonik boyutlar arasında profilinde en belirgin ayrışmayı sunan ilk 6 özellik.
                </p>
              </div>

              <Link
                href="/profile/facets"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-2 border border-border-default hover:border-brand-primary text-text-primary text-xs font-bold shadow-xs transition-all shrink-0 self-start sm:self-auto"
              >
                <span>Tüm 91 Alt Boyutu Keşfet</span>
                <ArrowRight className="w-4 h-4 text-brand-primary" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topDistinctiveFacets.map((facet) => (
                <FacetInsightCardV3
                  key={facet.facetId}
                  facet={facet}
                  allFacets={profile.facets}
                />
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/profile/facets"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-primary text-white text-xs font-bold shadow-md hover:bg-brand-primary/90 transition-all"
              >
                <span>Tüm 91 Alt Boyut Kataloğunu Aç</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Theory Council Preview */}
        <div id="section-theory-council">
          <div id="section-comparisons">
            <TheoryLensPreviewSection profile={profile} />
          </div>
        </div>

        {/* Completed Assessments & Reassessment Action */}
        <div id="section-stability">
          <div id="section-exports">
            <CompletedAssessmentsPanel profile={profile} />
          </div>
        </div>

        {/* Scientific Methodology Gateway */}
        <div id="section-science">
          <div id="section-growth-prep" className="p-6 rounded-3xl bg-surface-1 border border-border-default shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-brand-primary" />
                <span>Psikometrik Standartlar ve Metodolojik Sınırlar</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ölçüm modelleri, norm durumu (toplum normlarıyla karşılaştırma henüz sunulmuyor), yanıt kalitesi ve sıfır PII yapay zeka güvenceleri.
              </p>
            </div>

            <Link
              href="/profile/science"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 hover:bg-bg-subtle border border-border-default text-text-primary text-xs font-bold transition-colors shrink-0"
            >
              <span>Metodolojiyi İncele</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
