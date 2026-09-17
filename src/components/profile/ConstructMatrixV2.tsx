'use client';

import React, { useState } from 'react';
import { DomainProfileV2, ConstructProfileV2 } from '@/types/unifiedProfileV2';
import {
  Layers,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
} from 'lucide-react';

interface ConstructMatrixV2Props {
  domains: DomainProfileV2[];
  selectedDomainId: string | null;
}

export const ConstructMatrixV2: React.FC<ConstructMatrixV2Props> = ({
  domains,
  selectedDomainId,
}) => {
  const [expandedConstructIds, setExpandedConstructIds] = useState<Set<string>>(new Set());

  const toggleConstruct = (constructId: string) => {
    setExpandedConstructIds((prev) => {
      const next = new Set(prev);
      if (next.has(constructId)) next.delete(constructId);
      else next.add(constructId);
      return next;
    });
  };

  const filteredDomains = selectedDomainId
    ? domains.filter((d) => d.domainId === selectedDomainId)
    : domains;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            37 Psikolojik Boyut Matrisi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Boyut düzeyinde deterministik skorlama ve alt boyut örüntüleri.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {filteredDomains.map((domain) => (
          <div
            key={domain.domainId}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
          >
            {/* Domain Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Alan {domain.sortOrder}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {domain.nameTr}
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {domain.measuredConstructCount} / {domain.constructCount} Boyut Ölçüldü
              </span>
            </div>

            {/* Constructs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {domain.constructs.map((construct) => {
                const isExpanded = expandedConstructIds.has(construct.constructId);
                const isMeasured = construct.measuredFacetCount > 0;
                const isFull = construct.measuredFacetCount === construct.totalFacetCount;

                return (
                  <div
                    key={construct.constructId}
                    className={`rounded-xl border transition-all p-4 ${
                      isMeasured
                        ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80'
                        : 'bg-slate-50/20 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 opacity-75'
                    }`}
                  >
                    {/* Construct Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {construct.nameTr}
                        </h4>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {construct.measuredFacetCount}/{construct.totalFacetCount} Alt Boyut
                        </div>
                      </div>

                      {/* Status / Score Badge */}
                      {construct.aggregationStatus === 'DIRECT_CONSTRUCT_SCORE' && construct.constructScore !== null ? (
                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60">
                            {construct.constructScore.toFixed(2)} / 5.00
                          </span>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {construct.bandInfo?.shortLabelTr || 'Skor'}
                          </div>
                        </div>
                      ) : construct.aggregationStatus === 'FACET_PATTERN_ONLY' ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60">
                          Örüntü Ölçümü
                        </span>
                      ) : construct.aggregationStatus === 'PARTIAL_CONSTRUCT_PATTERN' ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60">
                          Kısmi Örüntü
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800">
                          Ölçülmedi
                        </span>
                      )}
                    </div>

                    {/* Expand Constituent Facets Button */}
                    <button
                      type="button"
                      onClick={() => toggleConstruct(construct.constructId)}
                      className="w-full flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 font-medium"
                    >
                      <span>Alt Boyutları ({construct.facets.length}) {isExpanded ? 'Gizle' : 'Göster'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Constituent Facets Drawer */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
                        {construct.facets.map((facet) => (
                          <div
                            key={facet.facetId}
                            className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                          >
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {facet.nameTr}
                            </span>
                            {facet.measurementStatus === 'MEASURED_PRECALIBRATION' && facet.score !== null ? (
                              <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                                {facet.score.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">
                                Ölçülmedi
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
