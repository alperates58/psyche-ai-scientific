'use client';

import React from 'react';
import { StabilitySummary, FacetTrajectory } from '@/types/longitudinal';
import { Anchor, CheckCircle, Info } from 'lucide-react';
import { FacetTrajectoryChart } from './FacetTrajectoryChart';

interface StableFacetsSectionProps {
  stabilitySummary: StabilitySummary;
  facetTrajectories: FacetTrajectory[];
  onSelectFacet?: (facetId: string) => void;
  selectedFacetId?: string | null;
}

export function StableFacetsSection({
  stabilitySummary,
  facetTrajectories,
  onSelectFacet,
  selectedFacetId,
}: StableFacetsSectionProps) {
  const stableFacets = stabilitySummary.stableFacets;

  if (stableFacets.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-800">
          <Anchor className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-semibold">Zaman İçinde Benzer Düzeyde Kalan Alanlar</h3>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Henüz yeterli sayıda tekrarlı ölçüm tamamlanmamıştır. Ölçümler tekrarlandıkça zaman içinde kararlılık gösteren boyutlar burada listelenecektir.
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
            <Anchor className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-semibold">Zaman İçinde Benzer Düzeyde Kalan Alanlar</h3>
            <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              {stableFacets.length} Boyut
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Ölçüm dönemleri boyunca puan aralığı benzer seyreden (fark &lt; 0.20 veya dar bantta kalan) alt boyutlar.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stableFacets.map((sf) => {
          const isSelected = selectedFacetId === sf.facetId;
          const traj = facetTrajectories.find((ft) => ft.facetId === sf.facetId);

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
                  <span className="text-[11px] text-slate-400">
                    {sf.epochsCount} ölçüm dönemi boyunca
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800">
                    {sf.meanScore.toFixed(2)}
                  </span>
                  <span className="block text-[10px] text-slate-400">/ 5.00</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2 py-0.5 font-medium text-slate-600">
                  {sf.stability === 'CONSISTENTLY_HIGH'
                    ? 'Yüksek Düzeyde Kararlı'
                    : sf.stability === 'CONSISTENTLY_LOW'
                    ? 'Düşük Düzeyde Kararlı'
                    : 'Orta Düzeyde Kararlı'}
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
