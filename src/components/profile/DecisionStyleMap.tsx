'use client';

import React from 'react';
import { Lightbulb, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';

interface DecisionStyleMapProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const DecisionStyleMap: React.FC<DecisionStyleMapProps> = ({ profile }) => {
  const facetMap = new Map<string, FacetProfileV2>();
  profile.facets.forEach((f) => {
    if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
      facetMap.set(f.facetId, f);
    }
  });

  const decisionDimensions = [
    { id: 'deliberation', labelTr: 'Enine Boyuna Düşünme (Deliberation)', descTr: 'Karar vermeden önce alternatifleri ve olası sonuçları detaylı tartma' },
    { id: 'prudence', labelTr: 'Sağduyu & İhtiyat', descTr: 'Gereksiz risklerden kaçınma ve adımları güvenli atma eğilimi' },
    { id: 'epistemic_curiosity', labelTr: 'Bilişsel Merak', descTr: 'Karar verirken daha fazla bilgiye ve derin kavrayışa ihtiyaç duyma' },
    { id: 'intolerance_of_uncertainty', labelTr: 'Belirsizliğe Tahammülsüzlük', descTr: 'Net olmayan durumlarda hızla kesinliğe ulaşma arzusu' },
    { id: 'cognitive_flexibility', labelTr: 'Bilişsel Esneklik', descTr: 'Yeni kanıtlar karşısında fikrini ve planını güncelleyebilme' },
    { id: 'need_for_closure', labelTr: 'Bilişsel Kapanma İhtiyacı', descTr: 'Kararı bir an önce kesinleştirip zihnen konuyu kapatma isteği' },
  ];

  const measured = decisionDimensions
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
      <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900/80 dark:text-blue-200/80 space-y-2">
        <div className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300">
          <Lightbulb className="w-4 h-4" />
          <span>Karar Verme Haritan (Ölçüm Bekliyor)</span>
        </div>
        <p>
          Bilişsel karar ve düşünme tarzı ölçekleri tamamlandığında zihninizin karar alma dinamikleri bu alanda görüntülenecektir.
        </p>
      </div>
    );
  }

  const deliberation = facetMap.get('deliberation')?.score ?? facetMap.get('prudence')?.score;
  const curiosity = facetMap.get('epistemic_curiosity')?.score;

  let decisionNarrative = 'Karar süreçlerinizde analitik değerlendirmeler ile durumsal pratikliği dengede tutuyorsunuz.';
  if (deliberation && deliberation >= 3.8) {
    decisionNarrative = 'Karar verirken zihniniz seçenekleri etraflıca tartmayı, olası riskleri önceden öngörmeyi ve sağlam adımlarla ilerlemeyi tercih ediyor. Hızlı ama riskli adımlar yerine güvenli ve planlı kararlar size huzur veriyor.';
  } else if (deliberation && deliberation <= 2.5) {
    decisionNarrative = 'Karar anlarında uzun uzadıya analizlerle vakit kaybetmek yerine durumsal akışa ve pratik çözümlere odaklanıyorsunuz. Hızlı aksiyon alabilme beceriniz sizi çevik kılıyor.';
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Lightbulb className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Karar Verme Haritan
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Karar alırken zihninin nasıl çalıştığını, analitik derinliğini ve tempo dengeni yansıtır.
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          <span>{measured.length} / {decisionDimensions.length} Boyut Ölçüldü</span>
        </div>
      </div>

      {/* Narrative Synthesis */}
      <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
        <div className="font-bold text-blue-950 dark:text-blue-200">
          Karar Verirken Zihnin Nasıl Çalışıyor?
        </div>
        <p>{decisionNarrative}</p>
      </div>

      {/* Decision Dimension Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {measured.map((dim) => {
          const percentage = Math.round((((dim.score ?? 1) - 1) / 4) * 100);
          return (
            <div key={dim.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{dim.labelTr}</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{dim.score?.toFixed(2)}/5</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {dim.descTr}
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, percentage)}%` }}
                />
              </div>
              <div className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold">
                Konum: {dim.bandLabelTr}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
