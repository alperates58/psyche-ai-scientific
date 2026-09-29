'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, HelpCircle, Layers, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { FacetProfileV2 } from '@/types/unifiedProfileV2';
import { getFacetIcon } from '@/lib/facetIcons';
import { generatePersonalizedFacetInterpretation } from '@/lib/profile/profileInterpretationGenerator';

interface FacetInsightCardV3Props {
  facet: FacetProfileV2;
  allFacets: FacetProfileV2[];
}

export const FacetInsightCardV3: React.FC<FacetInsightCardV3Props> = ({ facet, allFacets }) => {
  const [showScientificDetails, setShowScientificDetails] = useState(false);
  const interpretation = generatePersonalizedFacetInterpretation(facet, allFacets);
  const FacetIcon = getFacetIcon(facet.facetId);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      {/* Top Header: Icon + Name + Scale Position + Score */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <FacetIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {facet.nameTr}
            </h3>
            <div className="text-[11px] text-slate-400 font-medium">
              {facet.nameEn}
            </div>
          </div>
        </div>

        {/* Position and Score Badge */}
        <div className="text-right shrink-0">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-800/60">
            {interpretation.bandLabelTr}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            {facet.score !== null ? `${facet.score.toFixed(2)} / 5.00` : 'Ölçülmedi'}
          </div>
        </div>
      </div>

      {/* 4 Core Personalized Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Block 1: Kendi sonucunda ne anlama geliyor? */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-1">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Kendi Sonucunda Ne Anlama Geliyor?</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
            {interpretation.selfMeaningTr}
          </p>
        </div>

        {/* Block 2: Günlük hayatında nasıl görünebilir? */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-1">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>Günlük Hayatında Nasıl Görünebilir?</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
            {interpretation.dailyLifeTr}
          </p>
        </div>

        {/* Block 3: Bu eğilim hangi koşullarda işine yarayabilir? */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 space-y-1">
          <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hangi Koşullarda İşine Yarar?</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
            {interpretation.strengthsContextTr}
          </p>
        </div>

        {/* Block 4: Hangi koşullarda daha fazla enerji gerektirebilir? */}
        <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 space-y-1">
          <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Hangi Koşullarda Enerji İster?</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
            {interpretation.energyCostContextTr}
          </p>
        </div>
      </div>

      {/* Related Traits & Reflection Question */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
        {interpretation.relatedTraitsTr.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-medium">İlgili Özellikler:</span>
            {interpretation.relatedTraitsTr.map((rel) => (
              <span
                key={rel.facetId}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium"
              >
                {rel.nameTr} {rel.score !== null ? `(${rel.score.toFixed(1)})` : ''}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowScientificDetails(!showScientificDetails)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 self-start sm:self-auto shrink-0 transition-colors"
        >
          <span>{showScientificDetails ? 'Bilimsel Detayı Gizle' : 'Bilimsel Detay & Tanım'}</span>
          {showScientificDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Reflection Question */}
      <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100/80 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 italic flex items-start gap-2">
        <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
        <span>Düşünme Sorusu: “{interpretation.reflectionQuestionTr}”</span>
      </div>

      {/* Expandable Scientific Definition Drawer */}
      {showScientificDetails && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2 animate-in fade-in duration-150">
          <div className="font-bold text-slate-800 dark:text-slate-200">
            Bilimsel Tanım & Metodoloji:
          </div>
          <p className="leading-relaxed">
            {interpretation.scientificDefinitionTr}
          </p>
          <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 pt-1 font-mono">
            <span>Kod: {facet.code}</span>
            <span>Madde Sayısı: {facet.itemCountAnswered} / {facet.itemCountExpected}</span>
            <span>Tamamlanma: %{Math.round(facet.completionRatio * 100)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
