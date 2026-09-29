'use client';

import React from 'react';
import { Target, Info, Sparkles, AlertCircle } from 'lucide-react';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';

interface SchwartzValuesCircleProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const SchwartzValuesCircle: React.FC<SchwartzValuesCircleProps> = ({ profile }) => {
  // Canonical Schwartz 4 Higher-Order Value Facets
  const schwartzFacets = [
    { id: 'schwartz_openness_to_change', nameTr: 'Değişime Açıklık', sectorTr: 'Özgürlük & Yenilik' },
    { id: 'schwartz_self_transcendence', nameTr: 'Öz-Aşkınlık', sectorTr: 'Toplumsal Fayda & Dayanışma' },
    { id: 'schwartz_conservation', nameTr: 'Muhafazacılık / Düzen', sectorTr: 'Gelenek & Güvenlik' },
    { id: 'schwartz_self_enhancement', nameTr: 'Öz-Genişletme', sectorTr: 'Başarı & Güç' },
  ];

  const allSectors = schwartzFacets.map((item) => {
    const facet = profile.facets.find((f) => f.facetId === item.id);
    const isMeasured = facet?.measurementStatus !== 'NOT_MEASURED' && facet?.score !== null && facet?.score !== undefined;
    return {
      ...item,
      score: isMeasured ? facet!.score! : null,
      isMeasured,
      bandLabelTr: isMeasured ? resolveConsumerScalePosition(facet!.score!).labelTr : 'Ölçülmedi',
    };
  });

  const measuredValues = allSectors.filter((v) => v.isMeasured && v.score !== null);
  const measuredCount = measuredValues.length;

  if (measuredCount === 0) {
    return (
      <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h4 className="text-sm font-bold">Schwartz Değerler Çemberi (Henüz Ölçülmedi)</h4>
        </div>
        <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
          Evrensel insan değerleri (Schwartz Value Circumplex) doğrudan ilgili değerler modülü tamamlandığında bu alanda dairesel motivasyonel yapı olarak görüntülenecektir. Bilimsel tarafsızlık gereği kişilik özelliklerinden değer çıkarımı yapılmamaktadır.
        </p>
      </div>
    );
  }

  // Sorted by score for narrative highlighting
  const sortedMeasured = [...measuredValues].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const topValue = sortedMeasured[0];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Target className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Schwartz Değerler Çemberi
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Değerlerini yönlendiren öncelikler ve temel motivasyonel amaçların dairesel modeli.
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <Info className="w-3.5 h-3.5 text-amber-500" />
          <span>{measuredCount} / 4 Değer Boyutu Ölçüldü</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Visual Circular Quadrants (5 Cols) */}
        <div className="md:col-span-5 relative aspect-square max-w-[280px] mx-auto w-full flex items-center justify-center p-4">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-200 dark:border-amber-900/60" />
          <div className="absolute inset-4 rounded-full border border-amber-300/40 dark:border-amber-800/40" />

          {/* 4 Quadrants always fixed in circumplex arrangement */}
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-2 relative z-10">
            {allSectors.map((v) => {
              if (v.isMeasured && v.score !== null) {
                return (
                  <div
                    key={v.id}
                    className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/70 flex flex-col justify-between text-center transition-all shadow-xs"
                  >
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 leading-tight">
                      {v.nameTr}
                    </span>
                    <span className="text-sm font-mono font-bold text-amber-700 dark:text-amber-300">
                      {v.score.toFixed(1)}/5
                    </span>
                    <span className="text-[10px] text-amber-800/80 dark:text-amber-300/80 font-medium">
                      {v.bandLabelTr}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={v.id}
                  className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col justify-between text-center text-slate-400"
                >
                  <span className="text-[11px] font-medium text-slate-400 leading-tight">
                    {v.nameTr}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    —
                  </span>
                  <span className="text-[10px] text-slate-400 italic">
                    Ölçülmedi
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Narrative Interpretation (7 Cols) */}
        <div className="md:col-span-7 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">
              Değerlerini Yönlendiren Öncelikler:
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Ölçülen değerler arasında en belirgin olanı <strong>{topValue.nameTr}</strong> ({topValue.bandLabelTr}) olarak öne çıkıyor. Bu durum yaşam kararlarında ve hedef seçimlerinde bu ilkenin öncelikli bir yön gösterici olduğunu ifade eder.
            </p>
            {measuredCount < 4 && (
              <p className="text-[11px] text-amber-700 dark:text-amber-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                Şu ana kadar 4 değer üst boyutundan {measuredCount} tanesi tamamlanmıştır. Kalan boyutlar ölçüldükçe çemberdeki ilişkiler bütünleşecektir.
              </p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-800">
            <strong>Bilimsel Not:</strong> Değer boyutları iyi veya kötü olarak sıralanmaz; bireyin yaşamındaki motivasyonel öncelik ve dengeleri temsil eder.
          </div>
        </div>
      </div>
    </div>
  );
};
