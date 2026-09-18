'use client';

import React from 'react';
import Link from 'next/link';
import { ModuleRepeatComparison } from '@/types/longitudinal';
import { RotateCcw, ArrowRight, ArrowUpRight, ArrowDownRight, Info, Calendar } from 'lucide-react';

interface ModuleRepeatComparisonPanelProps {
  comparison: ModuleRepeatComparison;
}

export function ModuleRepeatComparisonPanel({ comparison }: ModuleRepeatComparisonPanelProps) {
  if (!comparison || comparison.comparisons.length === 0) {
    return null;
  }

  const prevDate = new Date(comparison.previousCompletedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const currDate = new Date(comparison.currentCompletedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="rounded-2xl border border-indigo-200/80 bg-white p-6 shadow-sm space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Önceki Ölçümle Karşılaştırma (Tekrarlı Ölçüm)
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {comparison.moduleTitleTr} modülü için önceki ölçüm ({prevDate}) ile mevcut ölçüm ({currDate}) arasındaki gözlenen puan farkları.
          </p>
        </div>

        <Link
          href="/profile/timeline"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <span>Profil Zaman Çizelgesinde İncele</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {comparison.comparisons.map((c) => {
          const isIncreased = c.direction === 'INCREASED';
          const isDecreased = c.direction === 'DECREASED';

          const badge =
            c.classification === 'STABLE_RANGE'
              ? { label: 'Stabil Aralık (<0.20)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
              : c.classification === 'QUALITY_LIMITED'
              ? { label: 'Kalite Uyarılı', color: 'bg-amber-50 text-amber-700 border-amber-200' }
              : c.classification === 'SMALL_OBSERVED_SHIFT'
              ? { label: 'Hafif Fark (0.20-0.49)', color: 'bg-slate-100 text-slate-700 border-slate-200' }
              : c.classification === 'MODERATE_OBSERVED_SHIFT'
              ? { label: 'Belirgin Fark (0.50-0.79)', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
              : { label: 'Yüksek Fark (>=0.80)', color: 'bg-purple-50 text-purple-700 border-purple-200' };

          return (
            <div key={c.facetId} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs">
              <div className="flex items-start justify-between">
                <span className="font-semibold text-slate-800">{c.nameTr}</span>
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  {isIncreased ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-indigo-600" />
                  ) : isDecreased ? (
                    <ArrowDownRight className="h-3.5 w-3.5 text-slate-600" />
                  ) : null}
                  <span>{c.observedDelta > 0 ? `+${c.observedDelta.toFixed(2)}` : c.observedDelta.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Önceki: {c.previousScore.toFixed(2)}</span>
                <span className="text-slate-300">&rarr;</span>
                <span className="font-bold text-slate-800">Mevcut: {c.currentScore.toFixed(2)}</span>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="text-[10px] text-slate-400">1.00-5.00 ölçeği</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg bg-indigo-50/50 border border-indigo-100 p-3 text-[11px] text-indigo-900 flex items-start gap-2">
        <Info className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
        <div>
          <span className="font-semibold">Bilimsel Açıklama:</span> {comparison.governanceDisclaimerTr}
        </div>
      </div>
    </div>
  );
}
