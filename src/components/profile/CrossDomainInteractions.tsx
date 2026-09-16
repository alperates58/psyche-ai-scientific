'use client';

import React from 'react';
import { GitFork, Sparkles, AlertCircle, Info } from 'lucide-react';
import { UnifiedInteractionViewModel } from '@/types/profile';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';

interface CrossDomainInteractionsProps {
  interactions: UnifiedInteractionViewModel[];
}

export const CrossDomainInteractions: React.FC<CrossDomainInteractionsProps> = ({
  interactions,
}) => {
  return (
    <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-border-subtle shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 mt-0.5">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-text-primary">
                Etkileşim Haritası (Sinerjiler ve Gerilimler)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {interactions.length} Etkileşim Saptandı
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Ölçülen psikolojik boyutların birbirleriyle olan kuramsal ve ampirik dinamikleri (tekil bireysel korelasyon üretilmez; kural tabanlı dinamikler sunulur).
            </p>
          </div>
        </div>
      </div>

      {/* Interactions List or Zero-Match Informative State */}
      {interactions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interactions.map((inter) => {
            const isSynergy = inter.type === 'SYNERGY';

            return (
              <div
                key={inter.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-colors ${
                  isSynergy
                    ? 'bg-purple-50/30 border-purple-200/80 hover:border-purple-300'
                    : 'bg-amber-50/30 border-amber-200/80 hover:border-amber-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isSynergy
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isSynergy ? 'Sinerji' : 'Gerilim'}
                      </span>
                      <h3 className="text-sm font-bold text-text-primary mt-1">
                        {inter.titleTr}
                      </h3>
                    </div>

                    <div className="shrink-0">
                      <EpistemicBadge
                        status={inter.epistemicStatus as any || 'EVIDENCE_SUPPORTED_INTERPRETATION'}
                        size="sm"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {inter.descriptionTr}
                  </p>
                </div>

                <div className="pt-2 border-t border-border-subtle/70 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-text-tertiary">Kaynak Boyutlar:</span>
                  {inter.sourceDimensions.map((dim, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-1 text-text-secondary border border-border-subtle"
                    >
                      {dim}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-surface-2/40 border border-dashed border-border-subtle text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-text-tertiary mx-auto" />
          <h3 className="text-xs font-bold text-text-primary">
            Henüz Belirgin Bir Etkileşim Eşiği Sağlanmadı
          </h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            Etkileşim kuralları, birden fazla tamamlayıcı psikolojik boyutun birlikte ölçülmesini gerektirir. Yeni değerlendirmeleri tamamladıkça olası sinerji ve gerilim örüntüleri haritalandırılacaktır.
          </p>
        </div>
      )}

      {/* Epistemic Note */}
      <div className="flex items-center space-x-2 text-[11px] text-text-tertiary pt-1 border-t border-border-subtle">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>
          Etkileşim analizi, ampirik literatürde tanımlanmış eşik kurallarına dayanır. Tek bir bireyden yapay korelasyon matrisi türetilmez.
        </span>
      </div>
    </div>
  );
};
