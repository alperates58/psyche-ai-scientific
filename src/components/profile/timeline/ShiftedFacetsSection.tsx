'use client';

import React from 'react';
import { ChangeSummary, FacetTrajectory } from '@/types/longitudinal';
import { Activity, AlertCircle, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { FacetTrajectoryChart } from './FacetTrajectoryChart';

interface ShiftedFacetsSectionProps {
  changeSummary: ChangeSummary;
  facetTrajectories: FacetTrajectory[];
  onSelectFacet?: (facetId: string) => void;
  selectedFacetId?: string | null;
}

export function ShiftedFacetsSection({
  changeSummary,
  facetTrajectories,
  onSelectFacet,
  selectedFacetId,
}: ShiftedFacetsSectionProps) {
  const shiftedFacets = changeSummary.shiftedFacets;

  if (shiftedFacets.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-800">
          <Activity className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-semibold">Gözlenen Puan Farklılıkları</h3>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Tekrarlanan ölçümlerde belirlenen eşiklerin (&ge; 0.20 puan) üzerinde bir puan farkı gözlenmemiştir. Ölçümler birbirine yakın seyretmektedir.
        </p>
      </div>
    );
  }

  const selectedTrajectory = selectedFacetId
    ? facetTrajectories.find((ft) => ft.facetId === selectedFacetId)
    : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-800">
            <Activity className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-semibold">Gözlenen Puan Farklılıkları</h3>
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              {shiftedFacets.length} Boyut
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Önceki ölçüm dönemine göre gözlenen puan değişimi kaydedilen alanlar. Puan artışı veya azalışı değer yargısı taşımaksızın betimsel olarak aktarılır.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shiftedFacets.map((sf) => {
          const isSelected = selectedFacetId === sf.facetId;
          const isIncreased = sf.direction === 'INCREASED';
          const isDecreased = sf.direction === 'DECREASED';

          const shiftBadge =
            sf.classification === 'QUALITY_LIMITED'
              ? { label: 'Yanıt Kalitesi Uyarılı', color: 'bg-amber-50 text-amber-700 border-amber-200' }
              : sf.classification === 'LARGE_OBSERVED_SHIFT'
              ? { label: 'Yüksek Düzey Fark (>=0.80)', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
              : sf.classification === 'MODERATE_OBSERVED_SHIFT'
              ? { label: 'Belirgin Fark (0.50-0.79)', color: 'bg-sky-50 text-sky-700 border-sky-200' }
              : { label: 'Hafif Fark (0.20-0.49)', color: 'bg-slate-100 text-slate-700 border-slate-200' };

          return (
            <div
              key={sf.facetId}
              onClick={() => onSelectFacet?.(sf.facetId)}
              className={`cursor-pointer rounded-lg border p-3.5 transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                  : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{sf.nameTr}</h4>
                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <span className="text-slate-400">Önceki:</span>
                    <span className="font-medium text-slate-700">{sf.previousScore.toFixed(2)}</span>
                    <span className="text-slate-300">&rarr;</span>
                    <span className="font-bold text-slate-900">{sf.latestScore.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-0.5 text-xs font-bold text-slate-800">
                    {isIncreased ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-indigo-600" />
                    ) : isDecreased ? (
                      <ArrowDownRight className="h-3.5 w-3.5 text-slate-600" />
                    ) : null}
                    <span>{sf.rawDelta > 0 ? `+${sf.rawDelta.toFixed(2)}` : sf.rawDelta.toFixed(2)}</span>
                  </div>
                  <span className="block text-[10px] text-slate-400">Gözlenen Fark</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px]">
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-medium ${shiftBadge.color}`}>
                  {shiftBadge.label}
                </span>
                <span className="text-indigo-600 hover:underline">Detay Gör</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTrajectory && (
        <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
          <div className="mb-3 flex items-center justify-between border-b border-indigo-100/60 pb-2">
            <span className="text-xs font-semibold text-indigo-900">
              {selectedTrajectory.nameTr} — Boylamsal Seyir Grafiği
            </span>
            <span className="text-[11px] text-slate-500">
              {selectedTrajectory.points.length} Ölçüm Noktası
            </span>
          </div>
          <FacetTrajectoryChart trajectory={selectedTrajectory} height={200} />
          <p className="mt-2 text-xs text-slate-600">
            {selectedTrajectory.neutralChangeDescriptionTr}
          </p>
        </div>
      )}
    </div>
  );
}
