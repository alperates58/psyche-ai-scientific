'use client';

import React, { useState } from 'react';
import { Layers, Info, CheckCircle2, CircleDashed } from 'lucide-react';
import { UnifiedConstructViewModel, UnifiedFacetViewModel } from '@/types/profile';

interface HexacoFacetProfileProps {
  constructs: UnifiedConstructViewModel[];
  measuredFacetCount: number;
  totalFacetCount: number;
}

export const HexacoFacetProfile: React.FC<HexacoFacetProfileProps> = ({
  constructs,
  measuredFacetCount,
  totalFacetCount,
}) => {
  const [selectedConstructId, setSelectedConstructId] = useState<string>('ALL');

  const filteredConstructs =
    selectedConstructId === 'ALL'
      ? constructs
      : constructs.filter((c) => c.constructId === selectedConstructId);

  return (
    <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-border-subtle shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-text-primary">
                HEXACO Alt Boyut Profili
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {measuredFacetCount} / {totalFacetCount} Alt Boyut Ölçüldü
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              6 ana kişilik faktörü altındaki tüm kanonik alt boyutların ölçüm durumu ve ham puan dağılımı.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-text-tertiary self-start sm:self-auto shrink-0">
          <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <span>Yapay ortalama ile tamamlama yapılmaz</span>
        </div>
      </div>

      {/* Factor Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          type="button"
          onClick={() => setSelectedConstructId('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedConstructId === 'ALL'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-surface-2/60 border border-border-subtle text-text-secondary hover:bg-surface-2'
          }`}
        >
          Tüm Faktörler ({constructs.length})
        </button>

        {constructs.map((c) => (
          <button
            key={c.constructId}
            type="button"
            onClick={() => setSelectedConstructId(c.constructId)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              selectedConstructId === c.constructId
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-surface-2/60 border border-border-subtle text-text-secondary hover:bg-surface-2'
            }`}
          >
            <span>{c.nameTr}</span>
            <span className="text-[10px] opacity-75 font-mono">
              ({c.measuredFacetCount}/{c.facetCount})
            </span>
          </button>
        ))}
      </div>

      {/* Factor Groups & Facets */}
      <div className="space-y-5">
        {filteredConstructs.map((construct) => (
          <div
            key={construct.constructId}
            className="p-4 sm:p-5 rounded-2xl bg-surface-2/30 border border-border-subtle space-y-4"
          >
            {/* Factor Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  {construct.nameTr} ({construct.nameEn})
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  {construct.descriptionTr}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
                {construct.isMeasured && construct.compositeScore !== null ? (
                  <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                    Faktör Puanı: {construct.compositeScore.toFixed(2)} / 5.0
                  </span>
                ) : (
                  <span className="text-xs text-text-tertiary italic">Ölçülmedi</span>
                )}
              </div>
            </div>

            {/* Facets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {construct.facets.map((facet) => {
                const isMeasured = facet.isMeasured && facet.rawMean !== null;

                return (
                  <div
                    key={facet.facetId}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 transition-colors ${
                      isMeasured
                        ? 'bg-surface-1 border-border-subtle'
                        : 'bg-surface-2/40 border-dashed border-border-subtle opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-text-primary">
                          {facet.nameTr}
                        </span>
                        {isMeasured ? (
                          <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 shrink-0">
                            {facet.rawMean?.toFixed(2)} / 5.0
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-tertiary font-sans shrink-0">
                            Ölçülmedi
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                        {facet.descriptionTr || 'Tanım literatür kayıtlarında mevcuttur.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] text-text-tertiary">
                      <span>{facet.itemCount} Madde</span>
                      <span className="font-medium">
                        {isMeasured ? facet.measurementSupport : 'Kayıt Yok'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Scientific Note */}
      <div className="flex items-center space-x-2 text-[11px] text-text-tertiary pt-1 border-t border-border-subtle">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>
          Yalnızca tamamlanan değerlendirme formlarında yer alan alt boyutlar puanlanır. Eksik boyutlar için faktör ortalamasından yapay değer atanmaz veya kestirim yapılmaz.
        </span>
      </div>
    </div>
  );
};
