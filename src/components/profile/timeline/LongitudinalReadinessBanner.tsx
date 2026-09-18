'use client';

import React from 'react';
import { LongitudinalReadiness } from '@/types/longitudinal';
import { Calendar, CheckCircle2, Info, AlertTriangle, TrendingUp } from 'lucide-react';

interface LongitudinalReadinessBannerProps {
  readiness: LongitudinalReadiness;
}

export function LongitudinalReadinessBanner({ readiness }: LongitudinalReadinessBannerProps) {
  const isSeries = readiness.level === 'LONGITUDINAL_SERIES';
  const isThreePlus = readiness.level === 'THREE_PLUS_EPOCHS';
  const isTwoEpochs = readiness.level === 'TWO_EPOCHS';
  const isSingle = readiness.level === 'NO_REPEAT_DATA';

  const badgeColor = isSeries
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : isThreePlus
    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
    : isTwoEpochs
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-slate-100 text-slate-700 border-slate-200';

  const icon = isSeries || isThreePlus ? (
    <TrendingUp className="h-5 w-5 text-indigo-600" />
  ) : isTwoEpochs ? (
    <Calendar className="h-5 w-5 text-amber-600" />
  ) : (
    <Info className="h-5 w-5 text-slate-500" />
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">{icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-800">
                Boylamsal Ölçüm ve Zaman İçi Takip Durumu
              </h2>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeColor}`}>
                {readiness.statusLabelTr}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{readiness.explanationTr}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 border-t pt-3 sm:border-t-0 sm:pt-0">
          <div className="text-center">
            <span className="block text-lg font-bold text-slate-800">
              {readiness.measurementEpochsCount}
            </span>
            <span className="text-[11px]">Ölçüm Dönemi</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div className="text-center">
            <span className="block text-lg font-bold text-indigo-600">
              {readiness.repeatedFacetsCount}
            </span>
            <span className="text-[11px]">Tekrarlanan Boyut</span>
          </div>
        </div>
      </div>

      {isTwoEpochs && (
        <div className="mt-4 rounded-lg bg-amber-50/80 border border-amber-200/80 p-3 text-xs text-amber-900 flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <span className="font-semibold">Bilimsel İhtiyat İlkesi:</span> İki zaman noktası arasındaki farklar tek başına bir &quot;trend&quot; veya kalıcı bir kişilik değişimi olarak adlandırılamaz; yalnızca iki ölçüm arasındaki gözlenen puan farkını gösterir.
          </div>
        </div>
      )}

      {isSingle && (
        <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
          <div>
            <span className="font-semibold">İlk Kesitsel Ölçüm:</span> Profilinizdeki boyutları zaman içinde takip etmek ve kararlılık dinamiklerini görmek için belirli aralıklarla değerlendirmelerinizi tekrarlayabilirsiniz.
          </div>
        </div>
      )}
    </div>
  );
}
