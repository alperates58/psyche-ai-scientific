'use client';

import React, { useState } from 'react';
import { Layers, Scale, Sparkles, Info, HelpCircle, CheckCircle2 } from 'lucide-react';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';

interface TraitInteractionMatrixProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const TraitInteractionMatrix: React.FC<TraitInteractionMatrixProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'synergies' | 'tensions'>('all');

  const synergies = profile.synergies || [];
  const tensions = profile.tensions || [];

  return (
    <div
      id="section-patterns"
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Özellik Etkileşim Matrisi (Profil Etkileşim Haritası)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ölçülen boyutlarının birlikte nasıl çalıştığını gösteren deterministik sinerji ve durumsal denge haritası.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Tümü ({synergies.length + tensions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('synergies')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'synergies'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sinerjiler ({synergies.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tensions')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'tensions'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Denge Alanları ({tensions.length})
          </button>
        </div>
      </div>

      {/* Synergies Section Anchor */}
      {(activeTab === 'all' || activeTab === 'synergies') && (
        <div id="section-synergies" className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              İşine Yarayan Kombinasyonlar (Sinerjiler)
            </h3>
          </div>

          {synergies.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 text-center">
              Bu alanda henüz aktifleşen kayıtlı sinerji kuralı bulunmuyor.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {synergies.map((syn) => (
                <div
                  key={syn.id}
                  className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                      {syn.titleTr}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                      Destekleyici Etkileşim
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {syn.descriptionTr}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {syn.sourceFacetIds?.map((id) => (
                      <span
                        key={id}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tensions / Balance Section Anchor */}
      {(activeTab === 'all' || activeTab === 'tensions') && (
        <div id="section-tensions" className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Hassas Denge Noktaları (İçsel Dengeler)
            </h3>
          </div>

          {tensions.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 text-center">
              Belirgin bir içsel gerilim veya zıt kutup kuralı tetiklenmedi.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tensions.map((ten) => (
                <div
                  key={ten.id}
                  className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                      {ten.titleTr}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                      Bağlamsal Denge
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {ten.descriptionTr}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {ten.sourceFacetIds?.map((id) => (
                      <span
                        key={id}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Scientific Epistemic Note */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
        <strong>Yöntemsel Güvence:</strong> Bu matris tek bir birey üzerinden sahte istatistiksel Pearson veya Spearman korelasyonu hesaplamaz. Psikoloji kuramlarında ve ampirik araştırmalarda tanımlanmış kurallara dayalı deterministik etkileşimleri sunar.
      </div>
    </div>
  );
};
