'use client';

import React from 'react';
import { Sparkles, Scale, CheckCircle2, AlertCircle } from 'lucide-react';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';

interface StrengthBalanceMatrixProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const StrengthBalanceMatrix: React.FC<StrengthBalanceMatrixProps> = ({ profile }) => {
  const facetMap = new Map<string, FacetProfileV2>();
  profile.facets.forEach((f) => {
    if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
      facetMap.set(f.facetId, f);
    }
  });

  // Evaluate combinations with actual measured evidence
  const combinations: Array<{
    titleTr: string;
    traits: Array<{ nameTr: string; score: number }>;
    advantageTr: string;
    balanceNoteTr: string;
    type: 'synergy' | 'balance';
  }> = [];

  const perfectionism = facetMap.get('perfectionism');
  const grit = facetMap.get('long_term_grit');
  if (perfectionism?.score && grit?.score && perfectionism.score >= 3.8 && grit.score >= 3.8) {
    combinations.push({
      titleTr: 'Yüksek Standart & Uzun Vadeli Sebat',
      traits: [
        { nameTr: 'Mükemmeliyetçilik', score: perfectionism.score },
        { nameTr: 'Uzun Vadeli Azim', score: grit.score },
      ],
      advantageTr: 'Uzun ve zorlu projelerde detaylardan ödün vermeden yüksek kalite standartlarını sonuna kadar sürdürebilme.',
      balanceNoteTr: 'Ayrıntılara fazla zaman ayırdığın durumlarda genel proje temposu yavaşlayabilir; teslim tarihlerini dengede tutmak gerekebilir.',
      type: 'synergy',
    });
  }

  const curiosity = facetMap.get('epistemic_curiosity');
  const diligence = facetMap.get('diligence');
  if (curiosity?.score && diligence?.score && curiosity.score >= 3.8 && diligence.score >= 3.8) {
    combinations.push({
      titleTr: 'Zihinsel Merak & Çalışma Disiplini',
      traits: [
        { nameTr: 'Bilişsel Merak', score: curiosity.score },
        { nameTr: 'Çalışkanlık & Çaba', score: diligence.score },
      ],
      advantageTr: 'Yalnızca yeni fikirler üretmekle kalmayıp, bu fikirleri disiplinli bir çabayla somut sonuçlara dönüştürebilme.',
      balanceNoteTr: 'Sürekli yeni konular araştırma arzusu ana odağı dağıtabilir; odaklanılacak konuları seçici belirlemek önemlidir.',
      type: 'synergy',
    });
  }

  const sincerity = facetMap.get('sincerity');
  const assertiveness = facetMap.get('assertiveness');
  if (sincerity?.score && assertiveness?.score && sincerity.score >= 3.8 && assertiveness.score <= 2.8) {
    combinations.push({
      titleTr: 'Yüksek İçtenlik & Alçakgönüllü Sınır Dinamiği',
      traits: [
        { nameTr: 'İçtenlik', score: sincerity.score },
        { nameTr: 'Atılganlık', score: assertiveness.score },
      ],
      advantageTr: 'Sosyal ilişkilerde karşılıksız güven oluşturan, yapmacıksız ve kabul edici bir yaklaşım sergileme.',
      balanceNoteTr: 'Haksızlığa uğradığında veya sınır koyman gerektiğinde kendi haklarını savunmak fazladan enerji gerektirebilir.',
      type: 'balance',
    });
  }

  const anxiety = facetMap.get('anxiety');
  const prudence = facetMap.get('prudence');
  if (anxiety?.score && prudence?.score && anxiety.score <= 2.5 && prudence.score <= 2.8) {
    combinations.push({
      titleTr: 'Düşük Kaygı & Cesur Hızlı Eylem',
      traits: [
        { nameTr: 'Kaygı', score: anxiety.score },
        { nameTr: 'Sağduyu & İhtiyat', score: prudence.score },
      ],
      advantageTr: 'Baskı altında korkusuzca hızlı aksiyon alabilme, fırsatları beklemeden değerlendirme çevikliği.',
      balanceNoteTr: 'Riskleri yeterince detaylı tartmadan adım atıldığında öngörülemeyen sonuçlarla karşılaşma ihtimali artabilir.',
      type: 'balance',
    });
  }

  // Fallback combination if no specific rules match
  if (combinations.length === 0 && profile.synergies && profile.synergies.length > 0) {
    const syn = profile.synergies[0];
    combinations.push({
      titleTr: syn.titleTr,
      traits: syn.sourceFacetIds?.map((id) => ({
        nameTr: facetMap.get(id)?.nameTr || id,
        score: facetMap.get(id)?.score ?? 4.0,
      })) || [],
      advantageTr: syn.descriptionTr,
      balanceNoteTr: 'Bu iki güçlü eğilimin farklı durumlarda sağladığı dengeyi gözetmek faydalıdır.',
      type: 'synergy',
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Güçlü Kombinasyonlar ve Hassas Denge Noktaları
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Özelliklerinin birlikte yarattığı avantajlar ve dikkat gerektirebilecek durumsal denge alanları.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {combinations.map((combo, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border space-y-3.5 ${
              combo.type === 'synergy'
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60'
                : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {combo.titleTr}
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  combo.type === 'synergy'
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                }`}
              >
                {combo.type === 'synergy' ? 'İşine Yarayan Kombinasyon' : 'Hassas Denge'}
              </span>
            </div>

            {/* Trait badges */}
            <div className="flex flex-wrap gap-2">
              {combo.traits.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                >
                  <span>{t.nameTr}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                    ({t.score.toFixed(1)})
                  </span>
                </span>
              ))}
            </div>

            {/* Advantage */}
            <div className="space-y-1 text-xs">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>İşine Yarayan Yönü:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                {combo.advantageTr}
              </p>
            </div>

            {/* Balance Note */}
            <div className="space-y-1 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span>Hassas Denge Noktası:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                {combo.balanceNoteTr}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
