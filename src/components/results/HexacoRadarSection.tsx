'use client';

import React from 'react';
import { HexacoRadarChart, HexacoTraitData } from '@/components/charts/HexacoRadarChart';
import { Compass, Info } from 'lucide-react';

interface HexacoRadarSectionProps {
  radarData: Array<{
    name: string;
    name_tr: string;
    score: number;
    scaleMin: number;
    scaleMax: number;
  }>;
  totalDimensions: number;
}

export const HexacoRadarSection: React.FC<HexacoRadarSectionProps> = ({
  radarData,
  totalDimensions,
}) => {
  const chartData: HexacoTraitData[] = radarData.map((d) => ({
    name: d.name,
    name_tr: d.name_tr,
    score: d.score,
  }));

  return (
    <div className="bg-surface-1 p-6 sm:p-8 rounded-panel border border-border-subtle shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-brand-600" />
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              HEXACO Kişilik Radarı
            </h2>
          </div>
          <p className="text-xs text-text-secondary">
            Kişiliğin 6 temel boyutunun çok eksenli ampirik profil dağılımı.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200/60 self-start sm:self-auto">
          <span>{radarData.length} / {totalDimensions} Boyut Ölçüldü</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left / Top: Interactive Radar Visualization */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-2 bg-surface-2/30 rounded-2xl border border-border-subtle/70">
          <HexacoRadarChart data={chartData} />
        </div>

        {/* Right / Bottom: Dimensions Overview List */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Boyut Değerleri (0–100 İndeksi)</span>
            <span className="font-normal lowercase">Yanıt Ölçeği Mapped</span>
          </div>

          <div className="space-y-2">
            {radarData.map((d) => (
              <div
                key={d.name}
                className="p-2.5 rounded-xl bg-surface-2/50 border border-border-subtle/80 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-text-primary">{d.name_tr}</div>
                  <div className="text-[10px] text-text-tertiary font-mono">
                    Likert: {(d.score / 20).toFixed(1)} / 5.0
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-brand-600 text-sm">{d.score}</span>
                  <div className="w-12 bg-border-subtle h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, d.score))}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start space-x-1.5 text-[10px] text-text-tertiary leading-relaxed pt-2">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-text-tertiary" />
            <span>
              Radar eksenleri, 1–5 aralığındaki yanıt ortalamalarının 0–100 ölçeğine doğrusal izdüşümünü temsil eder.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
