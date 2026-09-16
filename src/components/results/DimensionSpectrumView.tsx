'use client';

import React from 'react';
import { MeasuredConstructViewModel } from '@/services/assessmentResultService';
import { Target, CheckCircle2, AlertTriangle, Sparkles, Info } from 'lucide-react';

interface DimensionSpectrumViewProps {
  constructs: MeasuredConstructViewModel[];
  moduleTitle: string;
  scoreScale: {
    min: number;
    max: number;
    scoreType: 'MEAN' | 'SUM';
    scoringStrategyCode: string;
  };
}

export const DimensionSpectrumView: React.FC<DimensionSpectrumViewProps> = ({
  constructs,
  moduleTitle,
  scoreScale,
}) => {
  const minScale = scoreScale?.min ?? 1.0;
  const maxScale = scoreScale?.max ?? 5.0;
  const scaleRange = Math.max(0.1, maxScale - minScale);
  const midPoint = (minScale + maxScale) / 2.0;

  return (
    <div className="space-y-6">
      {constructs.map((construct) => {
        const band = construct.bandInfo;
        const interp = construct.interpretation;
        const bandNarrative = interp ? interp.interpretationByBand[band.band] : null;
        const strengths = interp?.strengths[band.band] || [];
        const risks = interp?.risks[band.band] || [];

        const percentage = Math.min(
          100,
          Math.max(0, ((construct.compositeScore - minScale) / scaleRange) * 100)
        );

        return (
          <div
            key={construct.constructId}
            className="bg-surface-1 p-6 sm:p-8 rounded-panel border border-border-subtle shadow-sm space-y-6"
          >
            {/* Dimension Title & Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-brand-600" />
                  <h2 className="text-lg font-bold text-text-primary tracking-tight">
                    {construct.nameTr}
                  </h2>
                </div>
                {construct.descriptionTr && (
                  <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
                    {construct.descriptionTr}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-lg border ${band.bgClass} ${band.colorClass} ${band.borderClass}`}
                >
                  {band.labelTr}
                </span>
              </div>
            </div>

            {/* Score Spectrum Bar & Gauge */}
            <div className="bg-surface-2/40 p-5 rounded-2xl border border-border-subtle space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                  Ölçek Yanıt Dağılımı ({minScale.toFixed(1)} – {maxScale.toFixed(1)} Likert)
                </div>

                <div className="flex items-baseline space-x-1.5 font-mono">
                  <span className="text-2xl font-extrabold text-brand-600">
                    {construct.compositeScore.toFixed(2)}
                  </span>
                  <span className="text-xs text-text-tertiary">/ {maxScale.toFixed(1)}</span>
                </div>
              </div>

              {/* Progress Spectrum Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-border-subtle/80 h-3 rounded-full overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-sky-500 via-emerald-500 to-brand-600 h-full rounded-full transition-all duration-700 shadow-xs"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Scale Markers */}
                <div className="flex justify-between text-[10px] text-text-tertiary font-mono pt-0.5">
                  <span>{minScale.toFixed(1)} (Daha Düşük)</span>
                  <span>{midPoint.toFixed(1)} (Dengeli)</span>
                  <span>{maxScale.toFixed(1)} (Daha Yüksek)</span>
                </div>
              </div>
            </div>

            {/* Scientific Interpretation Narrative */}
            {bandNarrative && (
              <div className="bg-surface-2/60 p-5 rounded-2xl border border-border-subtle space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-text-primary">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span>Boyut Yorumu & Betimsel Anlamı</span>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {bandNarrative}
                </p>
              </div>
            )}

            {/* Strengths & Growth Areas Grid */}
            {(strengths.length > 0 || risks.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {strengths.length > 0 && (
                  <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200/60 space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-950">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Güçlü Yönler & Kaynaklar</span>
                    </div>
                    <ul className="space-y-1 text-xs text-emerald-900 list-disc list-inside">
                      {strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {risks.length > 0 && (
                  <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200/60 space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-950">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Dikkat Noktaları & Kör Noktalar</span>
                    </div>
                    <ul className="space-y-1 text-xs text-amber-900 list-disc list-inside">
                      {risks.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Sub-facets Breakdown (if multiple facets exist) */}
            {construct.facets.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
                  Madde ve Alt Boyut Dağılımı ({construct.facets.length} Alt Faktör)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {construct.facets.map((facet) => (
                    <div
                      key={facet.facetId}
                      className="p-3 rounded-xl bg-surface-2/30 border border-border-subtle flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-text-primary">{facet.nameTr}</span>
                        <span className="text-[10px] text-text-tertiary block">
                          {facet.itemCount} madde ile değerlendirildi
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-brand-600">
                          {facet.rawMean.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-text-tertiary">/ {maxScale.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
