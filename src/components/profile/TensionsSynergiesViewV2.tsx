'use client';

import React, { useState } from 'react';
import { ProfilePatternItemV2 } from '@/types/unifiedProfileV2';
import {
  Zap,
  Scale,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  BookOpen,
} from 'lucide-react';

interface TensionsSynergiesViewV2Props {
  tensions: ProfilePatternItemV2[];
  synergies: ProfilePatternItemV2[];
  crossDomainPatterns: ProfilePatternItemV2[];
}

export const TensionsSynergiesViewV2: React.FC<TensionsSynergiesViewV2Props> = ({
  tensions,
  synergies,
  crossDomainPatterns,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'SYNERGIES' | 'TENSIONS' | 'PATTERNS'>('ALL');
  const [expandedItemIds, setExpandedItemIds] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setExpandedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allItems = [
    ...synergies,
    ...tensions,
    ...crossDomainPatterns,
  ];

  const filteredItems = allItems.filter((item) => {
    if (activeTab === 'SYNERGIES') return item.type === 'SYNERGY';
    if (activeTab === 'TENSIONS') return item.type === 'TENSION';
    if (activeTab === 'PATTERNS') return item.type === 'CROSS_DOMAIN_PATTERN';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Psikolojik Dinamikler, Gerginlikler ve Sinerjiler
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ölçülen boyutların birbirleriyle etkileşimini açıklayan deterministik kurallar.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'ALL'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Tümü ({allItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SYNERGIES')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'SYNERGIES'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sinerjiler ({synergies.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TENSIONS')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'TENSIONS'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Gerginlikler ({tensions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PATTERNS')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'PATTERNS'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Örüntüler ({crossDomainPatterns.length})
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isExpanded = expandedItemIds.has(item.id);
          const isSynergy = item.type === 'SYNERGY';
          const isTension = item.type === 'TENSION';

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all p-5 space-y-3 ${
                isSynergy
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/60'
                  : isTension
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/60'
                  : 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/70 dark:border-indigo-800/60'
              }`}
            >
              {/* Header Badge & Title */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      isSynergy
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                        : isTension
                        ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                        : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300'
                    }`}
                  >
                    {isSynergy ? <Zap className="w-3 h-3" /> : <Scale className="w-3 h-3" />}
                    {isSynergy ? 'Güçlendirici Sinerji' : isTension ? 'İçsel Gerginlik Noktası' : 'Çapraz Alan Örüntüsü'}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.titleTr}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.descriptionTr}
              </p>

              {/* Evidence Facets Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.sourceFacetNamesTr.map((name, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {name}
                  </span>
                ))}
              </div>

              {/* Reflection Prompt / Rationale Toggle */}
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-medium"
              >
                <span>Öz-Yansıtma & Bilimsel Dayanak</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* Expanded Scientific Details */}
              {isExpanded && (
                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
                  {item.reflectionPromptTr && (
                    <div className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800">
                      <span className="font-bold text-indigo-700 dark:text-indigo-300">
                        Öz-Yansıtma Sorusu:{' '}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 italic">
                        "{item.reflectionPromptTr}"
                      </span>
                    </div>
                  )}

                  {item.scientificRationaleTr && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Dayanak: </span>
                      {item.scientificRationaleTr}
                    </div>
                  )}

                  {item.limitationsTr && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-500 italic">
                      Sınırlar: {item.limitationsTr}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Bu kategoride henüz tetiklenen bir dinamik bulunmuyor.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Daha fazla değerlendirme modülü tamamlandıkça profil dinamikleri otomatik olarak güncellenecektir.
          </p>
        </div>
      )}
    </div>
  );
};
