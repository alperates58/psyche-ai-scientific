'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Compass, Layers, CheckCircle2, ChevronDown } from 'lucide-react';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import { generateProfileHeroSynthesis } from '@/lib/profile/profileInterpretationGenerator';

interface ProfileHeroV3Props {
  profile: UnifiedPsychologicalProfileV2;
  onExploreClick?: () => void;
}

export const ProfileHeroV3: React.FC<ProfileHeroV3Props> = ({ profile, onExploreClick }) => {
  const synthesis = generateProfileHeroSynthesis(profile);
  const { coverage } = profile;

  return (
    <div
      id="section-hero"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 border border-indigo-900/60 shadow-xl space-y-8"
    >
      {/* Background visual ambiance */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Top Bar: Title & Subtitle */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Kişiselleştirilmiş Psikolojik Rapor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {synthesis.headlineTr}
          </h1>
          <p className="text-sm text-indigo-200/80 mt-1 max-w-xl">
            Tamamladığın bilimsel envanterlerin ortak sentezi ve öne çıkan psikolojik dinamiklerin.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {profile.nextBestAssessment && (
            <Link
              href={profile.nextBestAssessment.url}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md hover:shadow-indigo-500/20 transition-all shrink-0"
            >
              <span>Yeni Boyut Keşfet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Narrative Synthesis: "Şu ana kadar profilimde en çok ne öne çıkıyor?" */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
            Şu Ana Kadar En Çok Ne Öne Çıkıyor?
          </div>
          <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
            “{synthesis.synthesisTextTr}”
          </p>

          {/* Theme Chips */}
          <div className="pt-2">
            <div className="text-xs text-slate-400 mb-2 font-medium">Temel Belirleyici Temalar:</div>
            <div className="flex flex-wrap gap-2.5">
              {synthesis.themeChips.map((chip) => (
                <div
                  key={chip.id}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white flex items-center gap-2 backdrop-blur-sm transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                  <span>{chip.labelTr}</span>
                  {chip.highlightScore && (
                    <span className="text-[10px] text-indigo-200 font-mono bg-indigo-500/30 px-1.5 py-0.5 rounded">
                      {chip.highlightScore}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Compact Discovery Progress Strip (Secondary, Not Dominating) */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-indigo-900/60 rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Profil Keşif İlerlemesi</span>
            <span className="text-xs font-mono font-bold text-indigo-300">
              %{coverage.facetCoverage.percentage}
            </span>
          </div>

          {/* Compact Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(4, coverage.facetCoverage.percentage)}%` }}
            />
          </div>

          {/* Secondary Counts Grid */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-base font-bold text-white">
                {coverage.facetCoverage.measuredCount}
                <span className="text-[10px] text-slate-400 font-normal">/{coverage.facetCoverage.totalCount}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Alt Boyut</div>
            </div>

            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-base font-bold text-white">
                {coverage.constructCoverage.measuredCount}
                <span className="text-[10px] text-slate-400 font-normal">/{coverage.constructCoverage.totalCount}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Psikolojik Boyut</div>
            </div>

            <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-base font-bold text-white">
                {coverage.domainCoverage.measuredCount}
                <span className="text-[10px] text-slate-400 font-normal">/{coverage.domainCoverage.totalCount}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Alan</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center leading-tight">
            Yanıtlanan Soru: {coverage.questionCoverage.answeredCount} / {coverage.questionCoverage.totalCount}
          </div>
        </div>
      </div>
    </div>
  );
};
