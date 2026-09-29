'use client';

import React from 'react';
import { Zap, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';

interface SelfSystemProfileProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const SelfSystemProfile: React.FC<SelfSystemProfileProps> = ({ profile }) => {
  const facetMap = new Map<string, FacetProfileV2>();
  profile.facets.forEach((f) => {
    if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
      facetMap.set(f.facetId, f);
    }
  });

  const selfDimensions = [
    { id: 'core_self_esteem', labelTr: 'Temel Benlik Saygısı (RSES)', descTr: 'Genel öz-değer ve kendini kabul düzeyi' },
    { id: 'generalized_self_efficacy', labelTr: 'Genel Öz-Yeterlik (GSE)', descTr: 'Zorlukların üstesinden gelebileceğine olan inanç' },
    { id: 'authenticity', labelTr: 'Otantiklik & Özgünlük', descTr: 'Kendi değerlerine ve içsel sesine sadık kalabilme' },
    { id: 'self_concept_clarity', labelTr: 'Benlik Belirginliği', descTr: 'Kendini ne kadar net ve tutarlı algıladığı' },
    { id: 'general_self_control', labelTr: 'Öz-Kontrol & İrade', descTr: 'Anlık dürtüleri erteleyip hedefe sadık kalma' },
    { id: 'long_term_grit', labelTr: 'Uzun Vadeli Azim (Grit)', descTr: 'Engellere rağmen hedeflerden vazgeçmeme' },
  ];

  const measuredDimensions = selfDimensions
    .map((dim) => {
      const facet = facetMap.get(dim.id);
      return {
        ...dim,
        score: facet?.score ?? null,
        isMeasured: !!facet && facet.score !== null,
        bandLabelTr: resolveConsumerScalePosition(facet?.score).labelTr,
      };
    })
    .filter((d) => d.isMeasured && d.score !== null);

  const hasData = measuredDimensions.length >= 1;

  if (!hasData) {
    return (
      <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 text-xs text-indigo-900/80 dark:text-indigo-200/80 space-y-2">
        <div className="flex items-center gap-2 font-bold text-indigo-800 dark:text-indigo-300">
          <Zap className="w-4 h-4" />
          <span>Benlik & Öz-Düzenleme Profili (Ölçüm Bekliyor)</span>
        </div>
        <p>
          Rosenberg Benlik Saygısı ve Öz-Yeterlik değerlendirmeleri tamamlandığında bu alanda benlik dinamikleriniz görüntülenecektir.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Benlik & Öz-Düzenleme Profili
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Öz-saygı, özerklik, irade ve sebat eksenlerinde ölçülen benlik yapısı.
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>{measuredDimensions.length} / {selfDimensions.length} Boyut Ölçüldü</span>
        </div>
      </div>

      {/* Profile Bars */}
      <div className="space-y-4">
        {measuredDimensions.map((dim) => {
          const percentage = Math.round((((dim.score ?? 1) - 1) / 4) * 100);
          return (
            <div key={dim.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{dim.labelTr}</span>
                  <span className="text-[11px] text-slate-400 ml-2 hidden sm:inline">{dim.descTr}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{dim.bandLabelTr}</span>
                  <span className="font-mono text-slate-500 font-bold">{dim.score?.toFixed(2)}/5</span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, percentage)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Narrative Synthesis */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        <strong>Benlik Dinamiğin:</strong> Ölçülen boyutlar, kişinin zorluklarla karşılaştığında kendi kararlarına ve yetkinliklerine olan inancını (öz-yeterlik) ve uzun vadeli hedeflere bağlılığını yansıtır. Bu alan tek bir skora indirgenmeden bağımsız boyutlar olarak ele alınır.
      </div>
    </div>
  );
};
