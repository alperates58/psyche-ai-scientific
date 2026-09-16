'use client';

import React, { useState } from 'react';
import {
  MeasuredConstructViewModel,
  MeasuredFacetViewModel,
} from '@/services/assessmentResultService';
import { ChevronDown, ChevronUp, Layers, HelpCircle } from 'lucide-react';

interface HexacoFacetProfileProps {
  constructs: MeasuredConstructViewModel[];
}

export const HexacoFacetProfile: React.FC<HexacoFacetProfileProps> = ({ constructs }) => {
  // All expanded by default for full visibility, toggleable
  const [expandedConstructs, setExpandedConstructs] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const c of constructs) {
      init[c.constructId] = true;
    }
    return init;
  });

  const toggleConstruct = (constructId: string) => {
    setExpandedConstructs((prev) => ({
      ...prev,
      [constructId]: !prev[constructId],
    }));
  };

  return (
    <div className="bg-surface-1 p-6 sm:p-8 rounded-panel border border-border-subtle shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              Boyut ve Alt Faktör (Facet) Analizi
            </h2>
          </div>
          <p className="text-xs text-text-secondary">
            Her bir ana kişilik boyutunun ve ona bağlı ampirik alt faktörlerin detaylı incelemesi.
          </p>
        </div>

        <span className="text-[11px] text-text-tertiary">
          Ölçek: 1.0 (En Düşük) — 5.0 (En Yüksek)
        </span>
      </div>

      <div className="space-y-4">
        {constructs.map((construct) => {
          const isExpanded = expandedConstructs[construct.constructId] ?? true;
          const band = construct.bandInfo;
          const interp = construct.interpretation;
          const bandText = interp ? interp.interpretationByBand[band.band] : null;

          return (
            <div
              key={construct.constructId}
              className="bg-surface-2/40 border border-border-subtle rounded-2xl overflow-hidden transition-all"
            >
              {/* Construct Header / Summary */}
              <div
                onClick={() => toggleConstruct(construct.constructId)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-surface-2/70 transition-colors select-none"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-text-primary tracking-tight">
                      {construct.nameTr}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${band.bgClass} ${band.colorClass} ${band.borderClass}`}
                    >
                      {band.labelTr}
                    </span>
                    <span className="text-[10px] text-text-tertiary">
                      ({construct.facets.length} Alt Boyut Ölçüldü)
                    </span>
                  </div>

                  {construct.descriptionTr && (
                    <p className="text-xs text-text-tertiary leading-relaxed max-w-2xl">
                      {construct.descriptionTr}
                    </p>
                  )}
                </div>

                {/* Score & Progress Bar */}
                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right">
                    <div className="text-base font-extrabold font-mono text-brand-600">
                      {construct.compositeScore.toFixed(1)}
                      <span className="text-xs text-text-tertiary font-normal"> / 5.0</span>
                    </div>
                    <div className="w-24 bg-border-subtle h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-brand-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(0, ((construct.compositeScore - 1) / 4) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Ayrıntıları Göster"
                    className="p-1 rounded-lg bg-surface-1 border border-border-subtle text-text-tertiary hover:text-text-primary"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Narrative & Facet List */}
              {isExpanded && (
                <div className="p-5 pt-0 space-y-4 border-t border-border-subtle/60">
                  {/* Descriptive Band Narrative */}
                  {bandText && (
                    <div className="bg-surface-1 p-3.5 rounded-xl border border-border-subtle text-xs text-text-secondary leading-relaxed mt-4">
                      <span className="font-semibold text-text-primary">Eğilim Yorumu: </span>
                      {bandText}
                    </div>
                  )}

                  {/* Sub-facets Table / Cards */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
                      Alt Boyut (Facet) Puanları
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {construct.facets.map((facet) => (
                        <div
                          key={facet.facetId}
                          className="bg-surface-1 p-3.5 rounded-xl border border-border-subtle flex flex-col justify-between space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-text-primary">
                                {facet.nameTr}
                              </span>
                              {facet.definitionTr && (
                                <p className="text-[11px] text-text-tertiary leading-snug line-clamp-2">
                                  {facet.definitionTr}
                                </p>
                              )}
                            </div>

                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border shrink-0 ${facet.bandInfo.bgClass} ${facet.bandInfo.colorClass} ${facet.bandInfo.borderClass}`}
                            >
                              {facet.bandInfo.shortLabelTr}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-border-subtle/50 text-[11px]">
                            <span className="text-text-tertiary">
                              {facet.itemCount} madde ile ölçüldü
                            </span>
                            <span className="font-mono font-bold text-brand-600">
                              {facet.rawMean.toFixed(1)} / 5.0
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
