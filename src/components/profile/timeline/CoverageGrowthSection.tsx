'use client';

import React from 'react';
import { DomainCoverageTimelineEntry } from '@/types/longitudinal';
import { Compass, Layers, CheckSquare, Info } from 'lucide-react';

interface CoverageGrowthSectionProps {
  coverageTimeline: DomainCoverageTimelineEntry[];
}

export function CoverageGrowthSection({ coverageTimeline }: CoverageGrowthSectionProps) {
  if (!coverageTimeline || coverageTimeline.length === 0) {
    return null;
  }

  const latest = coverageTimeline[coverageTimeline.length - 1];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-800">
            <Compass className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-semibold">Ölçüm Kapsamının Gelişimi</h3>
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              %{latest.facetPercentage} Keşif Kapsamı
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Tamamlanan değerlendirme oturumları ile 91 alt boyut, 37 yapı ve 11 psikolojik alanın taranma süreci. Kapsam artışı &quot;psikolojik iyileşme&quot; değil, keşif derinliğidir.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-center">
          <span className="text-2xl font-extrabold text-slate-800">
            {latest.measuredFacetsCount} <span className="text-sm font-normal text-slate-400">/ 91</span>
          </span>
          <span className="mt-1 block text-xs font-medium text-slate-600">Ölçülen Alt Boyut</span>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-center">
          <span className="text-2xl font-extrabold text-slate-800">
            {latest.measuredConstructsCount} <span className="text-sm font-normal text-slate-400">/ 37</span>
          </span>
          <span className="mt-1 block text-xs font-medium text-slate-600">Taranan Psikolojik Yapı</span>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-center">
          <span className="text-2xl font-extrabold text-indigo-600">
            {latest.measuredDomainsCount} <span className="text-sm font-normal text-slate-400">/ 11</span>
          </span>
          <span className="mt-1 block text-xs font-medium text-slate-600">Aktif Psikolojik Alan</span>
        </div>
      </div>

      {/* Epoch Growth Progression Steps */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Ölçüm Dönemlerine Göre Kapsam Artışı
        </h4>
        <div className="mt-3 flex flex-col gap-2.5">
          {coverageTimeline.map((entry) => {
            const dateStr = new Date(entry.date).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <div
                key={entry.epochId}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-700">
                    {entry.epochIndex}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-800">Dönem {entry.epochIndex}</span>
                    <span className="ml-2 text-slate-400">{dateStr}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="w-32 hidden sm:block">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${entry.facetPercentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-bold text-slate-700">
                    {entry.measuredFacetsCount} / 91 ({entry.facetPercentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
