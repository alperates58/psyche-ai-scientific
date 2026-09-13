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
import { DemoCoreTrait } from '@/data/demo-profile';

interface HexacoRadarChartProps {
  data: DemoCoreTrait[];
  compact?: boolean;
}

export const HexacoRadarChart: React.FC<HexacoRadarChartProps> = ({ data, compact = false }) => {
  const chartData = data.map((d) => ({
    trait: d.name_tr || d.name,
    score: d.score,
    se: d.standardError,
    ciLow: d.ci95[0],
    ciHigh: d.ci95[1],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-surface-1 border border-border-subtle p-3 rounded-xl shadow-md text-xs">
          <div className="font-semibold text-text-primary mb-1">{item.trait}</div>
          <div className="flex items-center space-x-2 text-brand-600 font-bold text-sm">
            <span>Puan: {item.score}</span>
            <span className="text-[10px] font-normal text-text-tertiary">/ 100</span>
          </div>
          {item.se > 0 ? (
            <>
              <div className="text-[11px] text-text-secondary mt-1">
                %95 GA: [{item.ciLow}, {item.ciHigh}]
              </div>
              <div className="text-[10px] text-text-tertiary">
                Standart Hata (SE): ±{item.se} (Önizleme Modeli)
              </div>
            </>
          ) : (
            <div className="text-[10px] text-text-tertiary mt-1">
              Ön Kalibrasyon: Geçici betimsel puan (Nüfus normu ve SEM henüz dahil edilmemiştir)
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-[320px] md:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius={compact ? '70%' : '75%'} data={chartData}>
            <PolarGrid stroke="#E7EBF0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="trait"
              tick={{ fill: '#475467', fontSize: compact ? 11 : 12, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#98A2B3', fontSize: 10 }}
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

      <div className="text-[11px] text-text-tertiary mt-2 flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full bg-brand-500/40 border border-brand-600 inline-block flex-shrink-0" />
        <span>Geçici betimsel bileşik puan (0–100 ölçeği) • Bu değer ön kalibrasyon döneminde cevapların betimsel bileşimidir; normlanmış kişilik puanı veya örtük özellik kestirimi değildir.</span>
      </div>
    </div>
  );
};
