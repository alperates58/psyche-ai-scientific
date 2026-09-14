'use client';

import React from 'react';
import { DemoFacetDetail } from '@/data/demo-profile';

interface FacetWhiskersChartProps {
  facets: DemoFacetDetail[];
  isPreCalibration?: boolean;
}

export const FacetWhiskersChart: React.FC<FacetWhiskersChartProps> = ({
  facets,
  isPreCalibration = true,
}) => {
  // Epistemic Guardrail: In pre-calibration mode or without a calibrated population norm model,
  // we strictly DO NOT render pseudo-statistical 95% CI whiskers or error margins.
  const hasCalibratedIntervals = !isPreCalibration && facets.some(
    (f) => f.ci95 != null && f.standardError != null && f.standardError > 0
  );

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Header Scale Markings */}
      <div className="hidden sm:flex items-center justify-between text-xs text-text-tertiary px-2 pb-2 border-b border-border-subtle">
        <span className="w-48 font-medium">Alt Boyut / Psikolojik Yapı</span>
        <div className="flex-1 flex justify-between px-6 font-mono text-[11px]">
          <span>0</span>
          <span>25</span>
          <span>50 (Ölçek Ortası)</span>
          <span>75</span>
          <span>100</span>
        </div>
        <span className="w-24 text-right font-medium">
          {hasCalibratedIntervals ? 'Kestirim ± SEM' : 'Betimsel Puan'}
        </span>
      </div>

      {facets.map((f) => {
        const pointPercent = Math.min(100, Math.max(0, f.score));
        const canRenderInterval =
          hasCalibratedIntervals &&
          f.ci95 &&
          Array.isArray(f.ci95) &&
          f.ci95[0] != null &&
          f.ci95[1] != null &&
          f.standardError != null &&
          f.standardError > 0;

        const leftPercent = canRenderInterval ? Math.min(100, Math.max(0, f.ci95[0])) : 0;
        const rightPercent = canRenderInterval ? Math.min(100, Math.max(0, f.ci95[1])) : 0;
        const widthPercent = Math.max(2, rightPercent - leftPercent);

        return (
          <div
            key={f.id}
            className="p-3 rounded-xl hover:bg-surface-2 transition-colors border border-transparent hover:border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0"
          >
            {/* Facet identity and score header (stacked on mobile) */}
            <div className="flex items-center justify-between sm:w-48 sm:pr-4">
              <div className="min-w-0 pr-2">
                <div className="text-xs font-semibold text-text-primary truncate">
                  {f.name_tr || f.name}
                </div>
                <div className="text-[11px] text-text-tertiary truncate">{f.constructName}</div>
              </div>

              {/* Mobile-only score display on top row */}
              <div className="sm:hidden text-right font-mono text-xs font-bold text-text-primary shrink-0">
                {f.score}
                <span className="text-[10px] text-text-tertiary font-normal ml-1">/ 100</span>
              </div>
            </div>

            {/* Scale track: full width on mobile, flexible in middle on desktop */}
            <div className="w-full sm:flex-1 px-1 sm:px-6 relative h-6 flex items-center">
              {/* Background scale line */}
              <div className="absolute inset-x-1 sm:inset-x-6 top-1/2 -translate-y-1/2 h-[1px] bg-border-subtle" />
              {/* Center midpoint notch (50) */}
              <div className="absolute left-1/2 top-1.5 bottom-1.5 w-[1px] bg-border-default/80" />

              {/* Real Calibrated 95% Confidence Interval Whisker Bar (ONLY when empirical calibration exists) */}
              {canRenderInterval && (
                <>
                  <div
                    className="absolute h-1.5 bg-brand-200/80 rounded-full"
                    style={{
                      left: `calc(1.5rem + (100% - 3rem) * ${leftPercent / 100})`,
                      width: `calc((100% - 3rem) * ${widthPercent / 100})`,
                    }}
                  />
                  <div
                    className="absolute h-3 w-[2px] bg-brand-500"
                    style={{
                      left: `calc(1.5rem + (100% - 3rem) * ${leftPercent / 100})`,
                    }}
                  />
                  <div
                    className="absolute h-3 w-[2px] bg-brand-500"
                    style={{
                      left: `calc(1.5rem + (100% - 3rem) * ${rightPercent / 100})`,
                    }}
                  />
                </>
              )}

              {/* Point Estimate Dot (Descriptive Score) */}
              <div
                className="absolute w-3.5 h-3.5 bg-brand-600 rounded-full border-2 border-white shadow-xs z-10 -translate-x-1/2"
                style={{
                  left: `calc(0.25rem + (100% - 0.5rem) * ${pointPercent / 100})`,
                }}
                title={
                  canRenderInterval
                    ? `Puan: ${f.score}, %95 GA: [${f.ci95[0]}, ${f.ci95[1]}]`
                    : `Geçici Betimsel Puan: ${f.score} (Ön Kalibrasyon — Güven aralığı dahil edilmemiştir)`
                }
              />
            </div>

            {/* Desktop-only score display */}
            <div className="hidden sm:block w-24 text-right font-mono text-xs font-semibold text-text-primary shrink-0">
              {f.score}
              {canRenderInterval && f.standardError ? (
                <span className="text-[11px] font-normal text-text-tertiary font-sans ml-1">
                  ±{f.standardError}
                </span>
              ) : (
                <span className="text-[10px] text-text-tertiary font-sans ml-1">
                  (Ön-Kalibr.)
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Epistemic Footer / Legend */}
      <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-text-tertiary border-t border-border-subtle px-2">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600 mr-1.5 shrink-0" />
            <span>Nokta kestirimi (Betimsel puan)</span>
          </span>
          {hasCalibratedIntervals && (
            <span className="flex items-center">
              <span className="w-5 h-1.5 bg-brand-200 rounded-full mr-1.5 shrink-0" />
              <span>%95 Güven aralığı</span>
            </span>
          )}
        </div>
        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50 self-start sm:self-auto">
          {hasCalibratedIntervals
            ? 'Madde sayısı arttıkça hata marjı daralır'
            : 'Ön Kalibrasyon: Temsili ulusal norm toplanana kadar sahte güven aralığı hesaplanmaz.'}
        </span>
      </div>
    </div>
  );
};
