'use client';

import React from 'react';
import { ShieldCheck, Info, Smile } from 'lucide-react';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';

interface ResilienceProfileProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const ResilienceProfile: React.FC<ResilienceProfileProps> = ({ profile }) => {
  const facetMap = new Map<string, FacetProfileV2>();
  profile.facets.forEach((f) => {
    if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
      facetMap.set(f.facetId, f);
    }
  });

  const resilienceDimensions = [
    { id: 'distress_tolerance', labelTr: 'Sıkıntı Toleransı (DTS)', descTr: 'Zorlayıcı ve olumsuz duygular anında kontrolü kaybetmeden durabilme' },
    { id: 'stress_recovery', labelTr: 'Stres Sonrası Toparlanma Hızı', descTr: 'Gerginlik yaratan bir olayın ardından olağan dengeye dönebilme' },
    { id: 'flourishing_scale', labelTr: 'Psikolojik İlerleme & İyilik Hali', descTr: 'Kişisel amaçlar ve ilişkiler ekseninde kendini gelişiyor hissetme' },
    { id: 'subjective_vitality', labelTr: 'Öznel Canlılık & Enerji', descTr: 'Güne başlarken ve günlük süreçlerde hissedilen içsel canlılık' },
  ];

  const measured = resilienceDimensions
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
      <div className="p-6 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/60 dark:border-cyan-900/40 text-xs text-cyan-900/80 dark:text-cyan-200/80 space-y-2">
        <div className="flex items-center gap-2 font-bold text-cyan-800 dark:text-cyan-300">
          <ShieldCheck className="w-4 h-4" />
          <span>Zorlanma ve Toparlanma Profili (Ölçüm Bekliyor)</span>
        </div>
        <p>
          Psikolojik Dayanıklılık ve İyilik Hali modülleri tamamlandığında toparlanma dinamikleriniz bu alanda görüntülenecektir.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Zorlanma ve Toparlanma Profili
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Zorlayıcı durumlarda toparlanma kapasitesine ilişkin ölçülen ampirik örüntüler.
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-500" />
          <span>{measured.length} / {resilienceDimensions.length} Boyut Ölçüldü</span>
        </div>
      </div>

      {/* Narrative Header */}
      <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        <strong>Ölçülen Örüntüler:</strong> Bu göstergeler sabit bir &apos;güçlü/zayıf insan&apos; yargısı üretmez. Beklenmedik stres unsurları karşısında zihnin ve bedenin dengesini yeniden kurma potansiyelini betimler.
      </div>

      {/* Grid of Dimension Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {measured.map((dim) => {
          const percentage = Math.round((((dim.score ?? 1) - 1) / 4) * 100);
          return (
            <div key={dim.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{dim.labelTr}</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{dim.score?.toFixed(2)}/5</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {dim.descTr}
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, percentage)}%` }}
                />
              </div>
              <div className="text-[10px] text-cyan-700 dark:text-cyan-300 font-semibold">
                Konum: {dim.bandLabelTr}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
