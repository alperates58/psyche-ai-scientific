'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Dna,
  Brain,
  Grid,
  Sun,
  Users,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import { ProfileTabNav } from './ProfileTabNav';
import { PersonalityDNA } from './PersonalityDNA';
import { HexacoRadarV2 } from './HexacoRadarV2';
import { HexacoFacetHeatmap } from './HexacoFacetHeatmap';
import { SchwartzValuesCircle } from './SchwartzValuesCircle';
import { InterpersonalStyleCompass } from './InterpersonalStyleCompass';
import { TraitInteractionMatrix } from './TraitInteractionMatrix';
import { StrengthBalanceMatrix } from './StrengthBalanceMatrix';

interface FlagshipVisualsCanvasProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const FlagshipVisualsCanvas: React.FC<FlagshipVisualsCanvasProps> = ({ profile }) => {
  // Check if Schwartz values facets are measured
  const schwartzFacets = profile.facets.filter(
    (f) =>
      f.facetId.startsWith('schwartz_') &&
      f.measurementStatus !== 'NOT_MEASURED' &&
      f.score !== null
  );
  const hasSchwartzData = schwartzFacets.length > 0;

  // Check interpersonal evidence threshold (agency & communion indicators)
  const interpersonalFacets = profile.facets.filter(
    (f) =>
      ['assertiveness', 'social_boldness', 'social_self_esteem', 'sociability', 'empathic_concern', 'gentleness', 'forgivingness', 'social_connectedness'].includes(f.facetId) &&
      f.measurementStatus !== 'NOT_MEASURED' &&
      f.score !== null
  );
  const hasInterpersonalData = interpersonalFacets.length >= 2;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 6 Top-Level Profile Navigation Tabs */}
      <ProfileTabNav />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-8 sm:p-10 text-white shadow-xl border border-indigo-900/50">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Amiral Gemisi Görseller</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Görsel Profil Haritan
          </h1>
          <p className="text-sm text-indigo-200/80 leading-relaxed">
            Psikolojik profilinizin çok eksenli koordinatlarını, temel kişilik radarını, alt boyut ısı haritasını ve kuramsal ilişkisel tarzınızı yüksek görünürlüklü görsel tuvallerle keşfedin.
          </p>
        </div>
      </div>

      {/* Visual Navigation Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <a
          href="#section-dna"
          className="p-3 rounded-2xl bg-surface-1 border border-border-default hover:border-brand-primary/40 shadow-xs flex items-center gap-2 text-xs font-bold text-text-primary transition-all hover:bg-surface-2"
        >
          <Dna className="w-4 h-4 text-purple-600 shrink-0" />
          <span className="truncate">Kişilik DNA</span>
        </a>
        <a
          href="#section-radar"
          className="p-3 rounded-2xl bg-surface-1 border border-border-default hover:border-brand-primary/40 shadow-xs flex items-center gap-2 text-xs font-bold text-text-primary transition-all hover:bg-surface-2"
        >
          <Brain className="w-4 h-4 text-violet-600 shrink-0" />
          <span className="truncate">HEXACO Radar</span>
        </a>
        <a
          href="#section-heatmap"
          className="p-3 rounded-2xl bg-surface-1 border border-border-default hover:border-brand-primary/40 shadow-xs flex items-center gap-2 text-xs font-bold text-text-primary transition-all hover:bg-surface-2"
        >
          <Grid className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="truncate">24 Isı Haritası</span>
        </a>
        <a
          href="#section-values"
          className="p-3 rounded-2xl bg-surface-1 border border-border-default hover:border-brand-primary/40 shadow-xs flex items-center gap-2 text-xs font-bold text-text-primary transition-all hover:bg-surface-2"
        >
          <Sun className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="truncate">Değerler Çemberi</span>
        </a>
        <a
          href="#section-interpersonal"
          className="p-3 rounded-2xl bg-surface-1 border border-border-default hover:border-brand-primary/40 shadow-xs flex items-center gap-2 text-xs font-bold text-text-primary transition-all hover:bg-surface-2"
        >
          <Users className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="truncate">İlişkisel Tarz</span>
        </a>
        <a
          href="#section-interactions"
          className="p-3 rounded-2xl bg-surface-1 border border-border-default hover:border-brand-primary/40 shadow-xs flex items-center gap-2 text-xs font-bold text-text-primary transition-all hover:bg-surface-2"
        >
          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate">Etkileşimler</span>
        </a>
      </div>

      {/* A. PERSONALITY DNA / PSİKOLOJİK İMZA */}
      <section id="section-dna" className="scroll-mt-20">
        <PersonalityDNA profile={profile} />
      </section>

      {/* B. HEXACO RADAR */}
      <section id="section-radar" className="scroll-mt-20">
        <HexacoRadarV2 profile={profile} />
      </section>

      {/* C. HEXACO 24 FACET HEATMAP */}
      <section id="section-heatmap" className="scroll-mt-20">
        <HexacoFacetHeatmap profile={profile} />
      </section>

      {/* D. SCHWARTZ VALUES CIRCLE (If measured or partial) */}
      <section id="section-values" className="scroll-mt-20">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-text-primary">Değerler Haritam (Schwartz Dairesi)</h2>
            </div>
            <Link
              href="/profile/motivation#values"
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>Motivasyon ve Değerler Sayfasında Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <SchwartzValuesCircle profile={profile} />
        </div>
      </section>

      {/* E. INTERPERSONAL STYLE MAP */}
      <section id="section-interpersonal" className="scroll-mt-20">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-text-primary">İlişkisel Tarz Haritan</h2>
            </div>
            <Link
              href="/profile/relationships"
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>İlişkisel Dinamikler Sayfasında Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <InterpersonalStyleCompass profile={profile} />
        </div>
      </section>

      {/* F. TRAIT INTERACTION MAP */}
      <section id="section-interactions" className="scroll-mt-20 space-y-6">
        <div className="flex items-center gap-2 border-b border-border-default pb-3">
          <Layers className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-lg font-bold text-text-primary">Özellik Etkileşim Haritası</h2>
            <p className="text-xs text-text-secondary">
              Tekil boyutların birbirini nasıl pekiştirdiğini veya dengelediğini gösteren kanıta dayalı dinamikler.
            </p>
          </div>
        </div>
        <TraitInteractionMatrix profile={profile} />
        <StrengthBalanceMatrix profile={profile} />
      </section>

      {/* G. TIMELINE PREVIEW */}
      <section className="p-6 sm:p-8 rounded-3xl bg-surface-1 border border-border-default shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-primary">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Zaman İçinde Profil Seyri</span>
          </div>
          <h3 className="text-xl font-bold text-text-primary">
            Zaman İçinde Değişim ve Tekrarlı Ölçüm
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
            Psikolojik profiliniz statik bir etiket değildir. Tekrarlanan ölçümler ve yansımalar sayesinde zaman içindeki dalgalanmaları, stabil aralıkları ve gelişim trendlerini inceleyebilirsiniz.
          </p>
        </div>

        <Link
          href="/profile/timeline"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-primary text-white text-xs font-bold shadow-md hover:bg-brand-primary/90 transition-all shrink-0 self-start sm:self-auto"
        >
          <span>Zaman Çizelgesini İncele</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
