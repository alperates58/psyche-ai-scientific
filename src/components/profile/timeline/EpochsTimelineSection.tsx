'use client';

import React from 'react';
import { MeasurementEpoch } from '@/types/longitudinal';
import { Calendar, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';

interface EpochsTimelineSectionProps {
  epochs: MeasurementEpoch[];
}

export function EpochsTimelineSection({ epochs }: EpochsTimelineSectionProps) {
  if (!epochs || epochs.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-slate-800">
        <Calendar className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-semibold">Profil Zaman Çizgisi ve Ölçüm Dönemleri</h3>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        14 günlük operasyonel gruplama penceresi içinde tamamlanan oturumlar tek bir tutarlı ölçüm dönemi (epoch) olarak modellenmiştir.
      </p>

      <div className="relative mt-6 space-y-4 pl-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-[2px] before:bg-slate-200">
        {epochs.map((epoch) => {
          const startDate = new Date(epoch.startedAt).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          const endDate = new Date(epoch.endedAt).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          const isRange = startDate !== endDate;
          const dateLabel = isRange ? `${startDate} – ${endDate}` : startDate;

          const qualityBadge =
            epoch.responseQuality === 'EXCELLENT'
              ? { label: 'Yüksek Yanıt Kalitesi', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
              : epoch.responseQuality === 'ACCEPTABLE'
              ? { label: 'Kabul Edilebilir Bütünlük', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
              : { label: 'Temkinli İnceleme Önerilir', color: 'bg-amber-50 text-amber-700 border-amber-200' };

          return (
            <div key={epoch.epochId} className="relative rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <span className="absolute -left-[30px] top-4 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-white">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
              </span>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Ölçüm Dönemi {epoch.epochIndex}
                    </h4>
                    <span className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${qualityBadge.color}`}>
                      {qualityBadge.label}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{dateLabel}</span>
                </div>

                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{epoch.facetScores.length}</span> alt boyut ölçüldü
                </div>
              </div>

              <div className="mt-3 border-t border-slate-200/60 pt-2 text-xs text-slate-600">
                <span className="font-medium text-slate-700">Tamamlanan Modüller:</span>{' '}
                {epoch.completedModuleTitlesTr.join(', ') || 'Değerlendirme'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
