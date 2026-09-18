'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { FacetTrajectory } from '@/types/longitudinal';

interface FacetTrajectoryChartProps {
  trajectory: FacetTrajectory;
  height?: number;
}

export function FacetTrajectoryChart({ trajectory, height = 240 }: FacetTrajectoryChartProps) {
  if (!trajectory.points || trajectory.points.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
        Bu alt boyut için henüz ölçüm noktası bulunmuyor.
      </div>
    );
  }

  const chartData = trajectory.points.map((p) => {
    const formattedDate = new Date(p.measuredAt).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return {
      name: `Dönem ${p.epochIndex}`,
      dateStr: formattedDate,
      score: p.score,
      itemCount: p.itemCount,
      quality: p.responseQualityStatus,
      rawPoint: p,
    };
  });

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">{trajectory.nameTr}</span>
        <span>Ölçek: 1.00 – 5.00 (Yerel Puan Ortalaması)</span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              domain={[1.0, 5.0]}
              ticks={[1.0, 2.0, 3.0, 4.0, 5.0]}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <ReferenceLine y={3.0} stroke="#cbd5e1" strokeDasharray="2 2" />
            <Tooltip content={<CustomTooltip nameTr={trajectory.nameTr} />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#4f46e5"
              strokeWidth={2.5}
              dot={{ r: 4.5, fill: '#4f46e5', strokeWidth: 1.5, stroke: '#ffffff' }}
              activeDot={{ r: 6.5, fill: '#4338ca', stroke: '#ffffff', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>1.00: Düşük eğilim</span>
        <span>3.00: Orta eğilim</span>
        <span>5.00: Yüksek eğilim</span>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, nameTr }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-md text-xs">
        <div className="font-semibold text-slate-800">{label} ({data.dateStr})</div>
        <div className="mt-1 text-slate-600">
          <span className="font-medium">{nameTr}:</span>{' '}
          <span className="font-bold text-indigo-600">{Number(data.score).toFixed(2)} / 5.00</span>
        </div>
        <div className="mt-0.5 text-[11px] text-slate-400">
          Cevaplanan Soru: {data.itemCount} | Yanıt Kalitesi: {data.quality}
        </div>
      </div>
    );
  }
  return null;
}
