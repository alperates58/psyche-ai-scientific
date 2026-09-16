'use client';

import React from 'react';
import {
  MeasuredConstructViewModel,
  UnmeasuredDomainViewModel,
} from '@/services/assessmentResultService';
import { LayoutGrid, EyeOff } from 'lucide-react';

interface TraitHeatmapSectionProps {
  constructs: MeasuredConstructViewModel[];
  unmeasuredDomains: UnmeasuredDomainViewModel[];
}

function getHeatmapColor(score: number): { bg: string; text: string; border: string } {
  if (score < 2.0) return { bg: 'bg-sky-100', text: 'text-sky-900', border: 'border-sky-300' };
  if (score < 2.5) return { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' };
  if (score <= 3.2) return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
  if (score <= 3.8) return { bg: 'bg-brand-50', text: 'text-brand-800', border: 'border-brand-200' };
  if (score <= 4.4) return { bg: 'bg-brand-100', text: 'text-brand-900', border: 'border-brand-300' };
  return { bg: 'bg-brand-200', text: 'text-brand-950', border: 'border-brand-400' };
}

export const TraitHeatmapSection: React.FC<TraitHeatmapSectionProps> = ({
  constructs,
  unmeasuredDomains,
}) => {
  return (
    <div className="bg-surface-1 p-6 sm:p-8 rounded-panel border border-border-subtle shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <LayoutGrid className="w-4 h-4 text-brand-600" />
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              Ölçüm Isı Haritası ve Kapsam Matrisi
            </h2>
          </div>
          <p className="text-xs text-text-secondary">
            Ölçülen alt faktörlerin şiddet dağılımı ve henüz değerlendirilmemiş psikolojik alanlar.
          </p>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center space-x-2 text-[10px] text-text-tertiary">
          <span>Düşük</span>
          <div className="flex items-center space-x-1">
            <span className="w-3.5 h-3.5 rounded bg-sky-100 border border-sky-300" title="1.0 - 2.0" />
            <span className="w-3.5 h-3.5 rounded bg-sky-50 border border-sky-200" title="2.0 - 2.5" />
            <span className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-200" title="2.5 - 3.2" />
            <span className="w-3.5 h-3.5 rounded bg-brand-50 border border-brand-200" title="3.2 - 3.8" />
            <span className="w-3.5 h-3.5 rounded bg-brand-100 border border-brand-300" title="3.8 - 4.4" />
            <span className="w-3.5 h-3.5 rounded bg-brand-200 border border-brand-400" title="4.4 - 5.0" />
          </div>
          <span>Yüksek</span>
        </div>
      </div>

      {/* Measured Matrix */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
          Ölçülen Alt Boyutlar (Ampirik Yanıt Değerleri)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {constructs.flatMap((c) =>
            c.facets.map((f) => {
              const color = getHeatmapColor(f.rawMean);
              return (
                <div
                  key={f.facetId}
                  className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${color.bg} ${color.border}`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-text-tertiary block truncate">
                      {c.nameTr}
                    </span>
                    <span className={`text-xs font-bold ${color.text} block truncate`} title={f.nameTr}>
                      {f.nameTr}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-black/5 font-mono">
                    <span className={`text-sm font-extrabold ${color.text}`}>
                      {f.rawMean.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-text-tertiary">/ 5.0</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Unmeasured Areas Section (Scientific Honesty) */}
      {unmeasuredDomains.length > 0 && (
        <div className="pt-4 border-t border-border-subtle space-y-3">
          <div className="flex items-center space-x-2">
            <EyeOff className="w-4 h-4 text-text-tertiary" />
            <div className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
              Henüz Ölçülmemiş Psikolojik Alanlar ({unmeasuredDomains.length} Alan)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {unmeasuredDomains.map((dom) => (
              <div
                key={dom.domainId}
                className="p-3.5 rounded-xl border border-dashed border-border-subtle bg-surface-2/30 space-y-1 opacity-75"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-secondary">{dom.nameTr}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-bg-subtle text-text-tertiary border border-border-subtle">
                    Ölçülmedi
                  </span>
                </div>
                <p className="text-[11px] text-text-tertiary line-clamp-2">
                  {dom.descriptionTr || 'Bu alan ileriki değerlendirmelerle profilinize eklenecektir.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
