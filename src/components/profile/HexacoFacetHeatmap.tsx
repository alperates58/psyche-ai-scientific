'use client';

import React, { useState } from 'react';
import { Grid, Info, ChevronRight, Sparkles, X } from 'lucide-react';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';
import { generatePersonalizedFacetInterpretation } from '@/lib/profile/profileInterpretationGenerator';

interface HexacoFacetHeatmapProps {
  profile: UnifiedPsychologicalProfileV2;
  onFacetClick?: (facetId: string) => void;
}

interface HeatmapFactorConfig {
  constructId: string;
  nameTr: string;
  nameEn: string;
  colorFamily: string;
  facets: Array<{
    id: string;
    nameTr: string;
    nameEn: string;
  }>;
}

const HEXACO_24_STRUCTURE: HeatmapFactorConfig[] = [
  {
    constructId: 'hexaco_honesty_humility',
    nameTr: 'Dürüstlük-Alçakgönüllülük',
    nameEn: 'Honesty-Humility',
    colorFamily: 'violet',
    facets: [
      { id: 'sincerity', nameTr: 'İçtenlik', nameEn: 'Sincerity' },
      { id: 'fairness', nameTr: 'Hakkaniyet', nameEn: 'Fairness' },
      { id: 'greed_avoidance', nameTr: 'Açgözlülükten Kaçınma', nameEn: 'Greed Avoidance' },
      { id: 'modesty', nameTr: 'Alçakgönüllülük', nameEn: 'Modesty' },
    ],
  },
  {
    constructId: 'hexaco_emotionality',
    nameTr: 'Duygusallık',
    nameEn: 'Emotionality',
    colorFamily: 'indigo',
    facets: [
      { id: 'fearfulness', nameTr: 'Korku / Çekinme', nameEn: 'Fearfulness' },
      { id: 'anxiety', nameTr: 'Kaygı Eğilimi', nameEn: 'Anxiety' },
      { id: 'dependence', nameTr: 'Bağlılık İhtiyacı', nameEn: 'Dependence' },
      { id: 'sentimentality', nameTr: 'Duygusallık & Şefkat', nameEn: 'Sentimentality' },
    ],
  },
  {
    constructId: 'hexaco_extraversion',
    nameTr: 'Dışadönüklük',
    nameEn: 'Extraversion',
    colorFamily: 'blue',
    facets: [
      { id: 'social_self_esteem', nameTr: 'Sosyal Öz-Saygı', nameEn: 'Social Self-Esteem' },
      { id: 'social_boldness', nameTr: 'Sosyal Cesaret', nameEn: 'Social Boldness' },
      { id: 'sociability', nameTr: 'Sosyallik', nameEn: 'Sociability' },
      { id: 'liveliness', nameTr: 'Canlılık & Coşku', nameEn: 'Liveliness' },
    ],
  },
  {
    constructId: 'hexaco_agreeableness',
    nameTr: 'Geçimlilik',
    nameEn: 'Agreeableness',
    colorFamily: 'teal',
    facets: [
      { id: 'forgivingness', nameTr: 'Bağışlayıcılık', nameEn: 'Forgivingness' },
      { id: 'gentleness', nameTr: 'Yumuşak Başlılık', nameEn: 'Gentleness' },
      { id: 'flexibility', nameTr: 'Esneklik', nameEn: 'Flexibility' },
      { id: 'patience', nameTr: 'Sabır', nameEn: 'Patience' },
    ],
  },
  {
    constructId: 'hexaco_conscientiousness',
    nameTr: 'Sorumluluk',
    nameEn: 'Conscientiousness',
    colorFamily: 'amber',
    facets: [
      { id: 'organization', nameTr: 'Düzen & Tertip', nameEn: 'Organization' },
      { id: 'diligence', nameTr: 'Çalışkanlık & Çaba', nameEn: 'Diligence' },
      { id: 'perfectionism', nameTr: 'Mükemmeliyetçilik', nameEn: 'Perfectionism' },
      { id: 'prudence', nameTr: 'Sağduyu & İhtiyat', nameEn: 'Prudence' },
    ],
  },
  {
    constructId: 'hexaco_openness_to_experience',
    nameTr: 'Deneyime Açıklık',
    nameEn: 'Openness to Experience',
    colorFamily: 'purple',
    facets: [
      { id: 'aesthetic_appreciation', nameTr: 'Estetik Takdir', nameEn: 'Aesthetic Appreciation' },
      { id: 'inquisitiveness', nameTr: 'Merak & Araştırma', nameEn: 'Inquisitiveness' },
      { id: 'creativity', nameTr: 'Yaratıcılık', nameEn: 'Creativity' },
      { id: 'unconventionality', nameTr: 'Sıra Dışılık', nameEn: 'Unconventionality' },
    ],
  },
];

export const HexacoFacetHeatmap: React.FC<HexacoFacetHeatmapProps> = ({ profile, onFacetClick }) => {
  const [selectedFacetId, setSelectedFacetId] = useState<string | null>(null);

  // Map measured profile facets
  const facetMap = new Map<string, FacetProfileV2>();
  profile.facets.forEach((f) => {
    facetMap.set(f.facetId, f);
  });

  const selectedFacet = selectedFacetId ? facetMap.get(selectedFacetId) : null;
  const selectedInterpretation = selectedFacet
    ? generatePersonalizedFacetInterpretation(selectedFacet, profile.facets)
    : null;

  // Helper for subtle scale-location color tint (value-neutral, not good/bad)
  const getCellBg = (score: number | null) => {
    if (score === null) return 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700';
    if (score >= 4.2) return 'bg-violet-600 text-white border-violet-700 font-semibold';
    if (score >= 3.4) return 'bg-violet-400 dark:bg-violet-500/80 text-white border-violet-500 font-medium';
    if (score >= 2.6) return 'bg-violet-200 dark:bg-violet-900/60 text-violet-950 dark:text-violet-200 border-violet-300 dark:border-violet-700';
    if (score >= 1.8) return 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
              <Grid className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              HEXACO 24 Alt Boyut Isı Haritası
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            6 temel faktör × 4 alt boyut = 24 kanonik hücre. Tıklayarak her boyutun günlük yaşam yansımasını incele.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 self-start sm:self-auto">
          <span>Ölçek Konumu:</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" title="Düşük bölge" />
            <span className="w-3 h-3 rounded bg-violet-200 dark:bg-violet-900/60" title="Orta bölge" />
            <span className="w-3 h-3 rounded bg-violet-400" title="Orta-üst bölge" />
            <span className="w-3 h-3 rounded bg-violet-600" title="Yüksek bölge" />
          </div>
        </div>
      </div>

      {/* 24 Cell Heatmap Grid */}
      <div className="space-y-4">
        {HEXACO_24_STRUCTURE.map((factorGroup) => (
          <div key={factorGroup.constructId} className="space-y-1.5">
            {/* Factor Label */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-1">
              <span>{factorGroup.nameTr}</span>
              <span className="text-[10px] text-slate-400 font-normal">{factorGroup.nameEn}</span>
            </div>

            {/* 4 Facet Cells in a Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {factorGroup.facets.map((facetItem) => {
                const profileFacet = facetMap.get(facetItem.id);
                const score = profileFacet?.score ?? null;
                const pos = resolveConsumerScalePosition(score);
                const isSelected = selectedFacetId === facetItem.id;

                return (
                  <button
                    key={facetItem.id}
                    type="button"
                    onClick={() => {
                      setSelectedFacetId(facetItem.id);
                      if (onFacetClick) onFacetClick(facetItem.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group hover:scale-[1.02] ${getCellBg(
                      score
                    )} ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md' : 'shadow-2xs'}`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-xs font-semibold leading-tight line-clamp-1">
                        {facetItem.nameTr}
                      </span>
                      <span className="text-[10px] font-mono shrink-0 opacity-80">
                        {score !== null ? score.toFixed(1) : '—'}
                      </span>
                    </div>
                    <div className="text-[10px] opacity-90 truncate">
                      {pos.labelTr}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Facet Slide-Out / Detail Box */}
      {selectedFacet && selectedInterpretation && (
        <div className="p-5 sm:p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                  Detaylı Boyut İncelemesi
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-indigo-200 dark:border-indigo-800 font-mono">
                  {selectedFacet.score?.toFixed(2)} / 5.00
                </span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  ({selectedInterpretation.bandLabelTr})
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedFacet.nameTr} ({selectedFacet.nameEn})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setSelectedFacetId(null)}
              className="p-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-500 dark:text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                Kendi Sonucunda Ne Anlama Geliyor?
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedInterpretation.selfMeaningTr}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                Günlük Hayatında Nasıl Görünebilir?
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedInterpretation.dailyLifeTr}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
              <div className="font-bold text-emerald-700 dark:text-emerald-400">
                Hangi Koşullarda İşine Yarar?
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedInterpretation.strengthsContextTr}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
              <div className="font-bold text-amber-700 dark:text-amber-400">
                Hangi Koşullarda Daha Fazla Enerji Gerektirir?
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedInterpretation.energyCostContextTr}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium italic pt-1">
            Düşünme Sorusu: “{selectedInterpretation.reflectionQuestionTr}”
          </div>
        </div>
      )}
    </div>
  );
};
