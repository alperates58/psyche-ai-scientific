'use client';

import React from 'react';
import { DemoFacetDetail } from '@/data/demo-profile';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';

interface FacetWhiskersChartProps {
  facets: DemoFacetDetail[];
}

export const FacetWhiskersChart: React.FC<FacetWhiskersChartProps> = ({ facets }) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-xs text-text-tertiary px-2 pb-2 border-b border-border-subtle">
        <span className="w-48 font-medium">Alt Boyut / Psikolojik Yapı</span>
        <div className="flex-1 flex justify-between px-6 font-mono text-[11px]">
          <span>0</span>
          <span>25</span>
          <span>50 (Ortalama)</span>
          <span>75</span>
          <span>100</span>
        </div>
        <span className="w-24 text-right font-medium">Kestirim ± SEM</span>
      </div>

      {facets.map((f) => {
        const leftPercent = f.ci95[0];
        const rightPercent = f.ci95[1];
        const widthPercent = Math.max(2, rightPercent - leftPercent);
        const pointPercent = f.score;

        return (
          <div
            key={f.id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-2 transition-colors border border-transparent hover:border-border-subtle"
          >
            <div className="w-48 pr-4">
              <div className="text-xs font-semibold text-text-primary flex items-center space-x-1.5">
                <span>{f.name_tr || f.name}</span>
              </div>
              <div className="text-[11px] text-text-tertiary">{f.constructName}</div>
            </div>

            {/* Whiskers track */}
            <div className="flex-1 px-6 relative h-6 flex items-center">
              {/* Background scale markings */}
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-[1px] bg-border-subtle" />
              <div className="absolute left-1/2 top-1 bottom-1 w-[1px] bg-border-default/60" />

              {/* 95% Confidence Interval Whisker Bar */}
              <div
                className="absolute h-1.5 bg-brand-200/80 rounded-full"
                style={{
                  left: `calc(1.5rem + (100% - 3rem) * ${leftPercent / 100})`,
                  width: `calc((100% - 3rem) * ${widthPercent / 100})`,
                }}
              />
              {/* Left Whisker End */}
              <div
                className="absolute h-3 w-[2px] bg-brand-500"
                style={{
                  left: `calc(1.5rem + (100% - 3rem) * ${leftPercent / 100})`,
                }}
              />
              {/* Right Whisker End */}
              <div
                className="absolute h-3 w-[2px] bg-brand-500"
                style={{
                  left: `calc(1.5rem + (100% - 3rem) * ${rightPercent / 100})`,
                }}
              />

              {/* Point Estimate Dot */}
              <div
                className="absolute w-3.5 h-3.5 bg-brand-600 rounded-full border-2 border-white shadow-xs z-10 -translate-x-1/2"
                style={{
                  left: `calc(1.5rem + (100% - 3rem) * ${pointPercent / 100})`,
                }}
                title={`Puan: ${f.score}, %95 GA: [${f.ci95[0]}, ${f.ci95[1]}]`}
              />
            </div>

            <div className="w-24 text-right font-mono text-xs font-semibold text-text-primary">
              {f.score}{' '}
              <span className="text-[11px] font-normal text-text-tertiary font-sans">
                ±{f.standardError}
              </span>
            </div>
          </div>
        );
      })}

      <div className="pt-2 flex items-center justify-between text-[11px] text-text-tertiary border-t border-border-subtle px-2">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600 mr-1.5" /> Nokta kestirimi
          </span>
          <span className="flex items-center">
            <span className="w-5 h-1.5 bg-brand-200 rounded-full mr-1.5" /> %95 Güven aralığı
          </span>
        </div>
        <span>Madde sayısı arttıkça hata marjı daralır</span>
      </div>
    </div>
  );
};
