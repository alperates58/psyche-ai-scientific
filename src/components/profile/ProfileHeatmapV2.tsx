'use client';

import React, { useState } from 'react';
import { DomainProfileV2 } from '@/types/unifiedProfileV2';
import {
  Grid,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

interface ProfileHeatmapV2Props {
  domains: DomainProfileV2[];
}

export const ProfileHeatmapV2: React.FC<ProfileHeatmapV2Props> = ({ domains }) => {
  const [activeFacetHover, setActiveFacetHover] = useState<{
    nameTr: string;
    domainNameTr: string;
    constructNameTr: string;
    score: number | null;
    visualCoord: number | null;
    isMeasured: boolean;
  } | null>(null);

  // Helper to resolve cell color intensity based on visual normalized coordinate
  const getCellBgClass = (coord: number | null, isMeasured: boolean) => {
    if (!isMeasured || coord === null) {
      return 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 text-slate-400';
    }
    if (coord < 25) {
      return 'bg-sky-100 dark:bg-sky-950/70 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200';
    }
    if (coord < 50) {
      return 'bg-teal-100 dark:bg-teal-950/70 border-teal-300 dark:border-teal-800 text-teal-900 dark:text-teal-200';
    }
    if (coord < 75) {
      return 'bg-indigo-100 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200';
    }
    return 'bg-purple-100 dark:bg-purple-950/70 border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Hiyerarşik Psikolojik Isı Haritası
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Alan → Boyut → Alt Boyut hiyerarşik görsel koordinat matrisi.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
            Ölçülmedi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800" />
            Düşük
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-teal-100 dark:bg-teal-950 border border-teal-300 dark:border-teal-800" />
            Dengeli
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-800" />
            Yüksek
          </span>
        </div>
      </div>

      {/* Scientific Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Görsel Koordinat Bildirimi:
          </span>{' '}
          Renk yoğunlukları nüfus yüzdeliği (percentile) veya norm puanı değildir. Yalnızca 1.00–5.00 ölçeğindeki yerel yanıt konumunu temsil eden görsel koordinattır.
        </div>
      </div>

      {/* Hierarchical Grid Rows */}
      <div className="space-y-4">
        {domains.map((domain) => (
          <div
            key={domain.domainId}
            className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-3"
          >
            {/* Domain Title Row */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                {domain.nameTr}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {domain.measuredFacetCount}/{domain.facetCount} Alt Boyut
              </span>
            </div>

            {/* Constructs and Facet Cells */}
            <div className="space-y-2">
              {domain.constructs.map((construct) => (
                <div
                  key={construct.constructId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80"
                >
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-56 shrink-0 truncate">
                    {construct.nameTr}
                  </span>

                  {/* Facet Cells Row */}
                  <div className="flex flex-wrap gap-1.5 flex-1 justify-start sm:justify-end">
                    {construct.facets.map((facet) => {
                      const isMeasured = facet.measurementStatus === 'MEASURED_PRECALIBRATION' && facet.score !== null;
                      const bgClass = getCellBgClass(facet.normalizedVisualCoordinate, isMeasured);

                      return (
                        <div
                          key={facet.facetId}
                          onMouseEnter={() =>
                            setActiveFacetHover({
                              nameTr: facet.nameTr,
                              domainNameTr: domain.nameTr,
                              constructNameTr: construct.nameTr,
                              score: facet.score,
                              visualCoord: facet.normalizedVisualCoordinate,
                              isMeasured,
                            })
                          }
                          onMouseLeave={() => setActiveFacetHover(null)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium border cursor-pointer transition-all hover:scale-105 ${bgClass}`}
                          title={`${facet.nameTr}: ${isMeasured ? `${facet.score?.toFixed(2)}/5.00` : 'Ölçülmedi'}`}
                        >
                          <span className="truncate max-w-[120px] inline-block">
                            {facet.nameTr}
                          </span>
                          {isMeasured && (
                            <span className="ml-1 font-bold">
                              {facet.score?.toFixed(1)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hover Info Tooltip Bar */}
      {activeFacetHover && (
        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-xs flex items-center justify-between animate-fadeIn">
          <div>
            <span className="text-slate-500 dark:text-slate-400">
              {activeFacetHover.domainNameTr} → {activeFacetHover.constructNameTr}:
            </span>{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {activeFacetHover.nameTr}
            </span>
          </div>
          <div>
            {activeFacetHover.isMeasured ? (
              <span className="font-bold text-indigo-700 dark:text-indigo-300">
                Puan: {activeFacetHover.score?.toFixed(2)} / 5.00 (Görsel Koordinat: {activeFacetHover.visualCoord}/100)
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500 italic">
                Bu alt boyut henüz ölçülmemiştir.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
