'use client';

import React from 'react';
import { Heart, Info, ArrowRight, Sparkles } from 'lucide-react';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';

interface EmotionRegulationProfileProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const EmotionRegulationProfile: React.FC<EmotionRegulationProfileProps> = ({ profile }) => {
  const facetMap = new Map<string, FacetProfileV2>();
  profile.facets.forEach((f) => {
    if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
      facetMap.set(f.facetId, f);
    }
  });

  const emotionDimensions = [
    { id: 'cognitive_reappraisal', labelTr: 'Bilişsel Yeniden Değerlendirme (ERQ)', descTr: 'Zorlayıcı durumları farklı ve yapıcı bir çerçeveden görme' },
    { id: 'expressive_suppression', labelTr: 'Duygusal Bastırma (ERQ)', descTr: 'Duygusal tepkileri dışarı yansıtmama ve içe atma' },
    { id: 'distress_tolerance', labelTr: 'Sıkıntıya Dayanma Kapasitesi', descTr: 'Yoğun olumsuz duygular varken paniklemeden durabilme' },
    { id: 'stress_recovery', labelTr: 'Stresten Hızlı Toparlanma', descTr: 'Sarsıcı olayların ardından duygusal dengeye dönebilme hızı' },
    { id: 'anxiety', labelTr: 'Kaygı Eğilimi (Ters Çevrilmemiş)', descTr: 'Geleceğe dair endişe ve tetikte olma hali' },
  ];

  const measured = emotionDimensions
    .map((d) => {
      const f = facetMap.get(d.id);
      return {
        ...d,
        score: f?.score ?? null,
        isMeasured: !!f && f.score !== null,
        bandLabelTr: resolveConsumerScalePosition(f?.score).labelTr,
      };
    })
    .filter((d) => d.isMeasured && d.score !== null);

  const hasData = measured.length >= 1;

  if (!hasData) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-900/80 dark:text-rose-200/80 space-y-2">
        <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
          <Heart className="w-4 h-4" />
          <span>Duygu Düzenleme Profili (Ölçüm Bekliyor)</span>
        </div>
        <p>
          Duygu Düzenleme Ölçeği (ERQ) ve başa çıkma değerlendirmeleri tamamlandığında bu alanda duygusal işleyişiniz görüntülenecektir.
        </p>
      </div>
    );
  }

  const reappraisal = facetMap.get('cognitive_reappraisal')?.score;
  const suppression = facetMap.get('expressive_suppression')?.score;

  let flowSynthesis = 'Duygusal işleyişinizde dengeli bir farkındalık ve durumsal tepki örüntüsü gözleniyor.';
  if (reappraisal && reappraisal >= 3.8 && (!suppression || suppression <= 3.0)) {
    flowSynthesis = 'Duygusal durumlarla başa çıkarken duyguları bastırmak yerine, olaylara farklı pencerelerden bakarak zihinsel çerçeveyi değiştirmeyi (bilişsel yeniden değerlendirme) tercih ediyorsunuz.';
  } else if (suppression && suppression >= 3.8) {
    flowSynthesis = 'Zorlayıcı durumlarda duygularınızı dışarıya hissettirmemeyi ve içsel olarak kontrol altında tutmayı bir savunma mekanizması olarak kullanabiliyorsunuz.';
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Heart className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Duygu Düzenleme Profili
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Duygusal durumları anlama, toparlanma ve tepkileri yönetme stratejileri.
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-rose-500" />
          <span>{measured.length} / {emotionDimensions.length} Boyut Ölçüldü</span>
        </div>
      </div>

      {/* Small Multiple Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {measured.map((dim) => {
          const percentage = Math.round((((dim.score ?? 1) - 1) / 4) * 100);
          return (
            <div key={dim.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{dim.labelTr}</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{dim.score?.toFixed(2)}/5</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {dim.descTr}
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, percentage)}%` }}
                />
              </div>
              <div className="text-[10px] text-rose-700 dark:text-rose-300 font-semibold">
                Konum: {dim.bandLabelTr}
              </div>
            </div>
          );
        })}
      </div>

      {/* Emotion Regulation Flow Synthesis */}
      <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
        <div className="font-bold text-rose-950 dark:text-rose-200">
          Duygusal İşleyişinin Genel Resmi:
        </div>
        <p>{flowSynthesis}</p>
      </div>
    </div>
  );
};
