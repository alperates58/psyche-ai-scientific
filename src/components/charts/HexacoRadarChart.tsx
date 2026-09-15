'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
export interface HexacoTraitData {
  name: string;
  name_tr?: string;
  score: number | null;
  standardError?: number | null;
  ci95?: [number, number] | null;
  facetCount?: number;
  coverage?: number;
}

interface HexacoRadarChartProps {
  data: HexacoTraitData[];
  compact?: boolean;
}

// Custom tick to prevent long Turkish words (e.g., Dürüstlük-Alçakgönüllülük) from clipping
const renderPolarAngleTick = ({ payload, x, y, cx, cy, ...rest }: any) => {
  const value: string = payload.value || '';
  // Break long labels with hyphen or space
  const words = value.includes('-') ? value.split('-') : value.includes(' ') ? value.split(' ') : [value];

  // Offset label slightly outward from center
  return (
    <text
      {...rest}
      x={x}
      y={y}
      textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
      className="fill-text-secondary text-[10px] sm:text-[11px] font-medium select-none"
    >
      {words.length > 1 ? (
        <>
          <tspan x={x} dy={words.length === 2 ? -6 : 0}>
            {words[0]}{value.includes('-') ? '-' : ''}
          </tspan>
          <tspan x={x} dy={12}>
            {words.slice(1).join(' ')}
          </tspan>
        </>
      ) : (
        <tspan x={x} dy={3}>{value}</tspan>
      )}
    </text>
  );
};

export const HexacoRadarChart: React.FC<HexacoRadarChartProps> = ({ data, compact = false }) => {
  const measuredTraits = data.filter((d) => typeof d.score === 'number' && !isNaN(d.score));
  const hasFullSixDimensions = data.length >= 6 && measuredTraits.length === 6;

  // If 0 dimensions measured
  if (measuredTraits.length === 0) {
    return (
      <div className="w-full h-[240px] flex flex-col items-center justify-center p-6 text-center bg-surface-2/50 rounded-xl border border-dashed border-border-subtle">
        <span className="text-xs font-semibold text-text-secondary mb-1">Henüz Kişilik Ölçümü Bulunmuyor</span>
        <span className="text-[11px] text-text-tertiary max-w-sm">
          HEXACO radar grafiği, tüm 6 temel boyut ampirik olarak ölçüldüğünde oluşturulacaktır.
        </span>
      </div>
    );
  }

  // If partial measurement (< 6 dimensions)
  if (!hasFullSixDimensions) {
    return (
      <div className="w-full p-4 bg-surface-2/40 rounded-xl border border-border-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Kısmi Ölçüm
            </span>
            <span className="text-xs text-text-tertiary">({measuredTraits.length} / 6 Boyut Ölçüldü)</span>
          </div>
          <span className="text-[10px] text-text-tertiary">Radar poligonu için 6/6 boyut gereklidir</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Radar poligonu yalnızca tüm 6 HEXACO ana boyutu eksiksiz ölçüldüğünde oluşturulur. Eksik boyutları yapay değerlerle kapatmak bilimsel geçerliliği zedeleyeceği için sadece ölçülen boyutlar gösterilmektedir.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {data.map((d) => {
            const isMeasured = typeof d.score === 'number' && !isNaN(d.score);
            return (
              <div
                key={d.name}
                className={`p-3 rounded-lg border flex flex-col justify-between ${
                  isMeasured ? 'bg-surface-1 border-border-subtle' : 'bg-bg-subtle/60 border-dashed border-border-subtle opacity-70'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className={isMeasured ? 'text-text-primary' : 'text-text-tertiary'}>
                    {d.name_tr || d.name}
                  </span>
                  <span className="font-mono font-bold">
                    {isMeasured ? (
                      <span className="text-brand-600">{d.score} / 100</span>
                    ) : (
                      <span className="text-text-tertiary text-[11px]">Ölçülmedi</span>
                    )}
                  </span>
                </div>
                <div className="w-full bg-border-subtle/60 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={isMeasured ? 'bg-brand-600 h-full rounded-full transition-all duration-500' : 'h-full'}
                    style={{ width: isMeasured ? `${d.score}%` : '0%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // If full 6/6 dimensions measured, render the complete radar chart
  const chartData = data.map((d) => ({
    trait: d.name_tr || d.name,
    score: d.score,
    se: d.standardError,
    ciLow: d.ci95?.[0] ?? 0,
    ciHigh: d.ci95?.[1] ?? 0,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-surface-1 border border-border-subtle p-3 rounded-xl shadow-md text-xs max-w-[240px] z-50">
          <div className="font-semibold text-text-primary mb-1">{item.trait}</div>
          <div className="flex items-center space-x-2 text-brand-600 font-bold text-sm">
            <span>Puan: {item.score}</span>
            <span className="text-[10px] font-normal text-text-tertiary">/ 100</span>
          </div>
          <div className="text-[10px] text-text-tertiary mt-1">
            Ön Kalibrasyon: Geçici betimsel bileşik puan (Nüfus normu ve SEM henüz dahil edilmemiştir).
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full h-[280px] sm:h-[320px] md:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius={compact ? '58%' : '65%'}
            data={chartData}
            margin={{ top: 15, right: 25, bottom: 15, left: 25 }}
          >
            <PolarGrid stroke="#E7EBF0" strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="trait" tick={renderPolarAngleTick} />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#98A2B3', fontSize: 9 }}
              stroke="#DCE2EA"
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Profile Estimate"
              dataKey="score"
              stroke="#5753C8"
              fill="#6865D8"
              fillOpacity={0.22}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-text-tertiary mt-2 flex items-center space-x-2 text-center">
        <span className="w-2.5 h-2.5 rounded-full bg-brand-500/40 border border-brand-600 inline-block shrink-0" />
        <span className="text-left sm:text-center">
          Geçici betimsel bileşik puan (0–100 ölçeği) &bull; Ön kalibrasyon modeli
        </span>
      </div>
    </div>
  );
};
