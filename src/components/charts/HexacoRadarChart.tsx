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
      {/* Chart container with mobile-adapted height */}
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
            <PolarAngleAxis
              dataKey="trait"
              tick={renderPolarAngleTick}
            />
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

      {/* Trait values summary */}
      <div className="text-[11px] text-text-tertiary mt-2 flex items-center space-x-2 text-center">
        <span className="w-2.5 h-2.5 rounded-full bg-brand-500/40 border border-brand-600 inline-block shrink-0" />
        <span className="text-left sm:text-center">
          Geçici betimsel bileşik puan (0–100 ölçeği) &bull; Ön kalibrasyon modeli
        </span>
      </div>
    </div>
  );
};
