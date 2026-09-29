'use client';

import React from 'react';
import { Target, Info, Flame } from 'lucide-react';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';

interface NeedsProfileProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const NeedsProfile: React.FC<NeedsProfileProps> = ({ profile }) => {
  const facetMap = new Map<string, FacetProfileV2>();
  profile.facets.forEach((f) => {
    if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
      facetMap.set(f.facetId, f);
    }
  });

  const needs = [
    {
      id: 'autonomy_need_satisfaction',
      nameTr: 'Özerklik İhtiyacı (Autonomy)',
      descTr: 'Kendi seçimlerini yapabilme, eylemlerinin sorumlusu ve öznesi hissetme',
      color: '#F59E0B',
    },
    {
      id: 'competence_need_satisfaction',
      nameTr: 'Yetkinlik İhtiyacı (Competence)',
      descTr: 'Bir alanda ustalaşma, zorlukları aşabilme ve etkili sonuçlar üretme',
      color: '#3B82F6',
    },
    {
      id: 'relatedness_need_satisfaction',
      nameTr: 'İlişkisellik İhtiyacı (Relatedness)',
      descTr: 'Başkalarıyla derin bağlar kurma, ait hissetme ve değer gördüğünü bilme',
      color: '#10B981',
    },
  ];

  const measuredNeeds = needs
    .map((n) => {
      const f = facetMap.get(n.id);
      return {
        ...n,
        score: f?.score ?? null,
        isMeasured: !!f && f.score !== null,
        bandLabelTr: resolveConsumerScalePosition(f?.score).labelTr,
      };
    })
    .filter((n) => n.isMeasured && n.score !== null);

  const hasData = measuredNeeds.length >= 1;

  if (!hasData) {
    return (
      <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900/80 dark:text-amber-200/80 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
          <Flame className="w-4 h-4" />
          <span>Temel Psikolojik İhtiyaçlar (Öz-Belirleme) — Ölçüm Bekliyor</span>
        </div>
        <p>
          Temel Psikolojik İhtiyaçlar (SDT) modülü tamamlandığında Özerklik, Yetkinlik ve İlişkisellik doyum dinamikleriniz bu alanda görüntülenecektir.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Temel Psikolojik İhtiyaçlar Profili (SDT)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Seni ne motive ediyor ve hangi psikolojik gereksinimler enerjini besliyor?
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-500" />
          <span>{measuredNeeds.length} / 3 Temel İhtiyaç Ölçüldü</span>
        </div>
      </div>

      {/* 3-Column Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {measuredNeeds.map((item) => {
          const percentage = Math.round((((item.score ?? 1) - 1) / 4) * 100);
          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.nameTr}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.descTr}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{item.bandLabelTr}</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{item.score?.toFixed(2)}/5</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, percentage)}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Narrative */}
      <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        <strong>Motivasyonel Anlam:</strong> Öz-Belirleme Kuramına göre bu üç temel psikolojik ihtiyaç insanın esenliğinin ve içsel motivasyonunun ana direkleridir. Yüksek doyum gösteren alanlar enerjini en çok besleyen alanlardır.
      </div>
    </div>
  );
};
