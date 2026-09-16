'use client';

import React from 'react';
import { GitFork, Sparkles, AlertCircle, Compass, Info } from 'lucide-react';
import { ProfileTensionItem } from '@/lib/unifiedInteractionRegistry';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';

interface ProfileTensionMatrixProps {
  tensionItems: ProfileTensionItem[];
}

export const ProfileTensionMatrix: React.FC<ProfileTensionMatrixProps> = ({
  tensionItems,
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
                Profil Dinamikleri ve Gerilim Matrisi
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {tensionItems.length} Dinamik Saptandı
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Ölçülen boyutların birbirleriyle olan kuramsal sinerjileri, içsel gerilimleri ve bağlamsal modülasyonları.
            </p>
          </div>
        </div>
      </div>

      {/* Tension Items Grid */}
      {tensionItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tensionItems.map((item) => {
            const isSynergy = item.type === 'SYNERGY';
            const isTension = item.type === 'TENSION';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-colors ${
                  isSynergy
                    ? 'bg-purple-50/30 border-purple-200/80 hover:border-purple-300'
                    : isTension
                    ? 'bg-amber-50/30 border-amber-200/80 hover:border-amber-300'
                    : 'bg-blue-50/30 border-blue-200/80 hover:border-blue-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isSynergy
                            ? 'bg-purple-100 text-purple-800'
                            : isTension
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.stateLabelTr}
                      </span>
                      <h3 className="text-sm font-bold text-text-primary mt-1">
                        {item.titleTr}
                      </h3>
                    </div>

                    <div className="shrink-0">
                      <EpistemicBadge
                        status={item.epistemicStatus as any || 'THEORETICAL_INTERPRETATION'}
                        size="sm"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {item.descriptionTr}
                  </p>

                  {/* Reflection Prompt */}
                  <div className="p-3 rounded-xl bg-surface-1/90 border border-border-subtle/80 text-xs space-y-1">
                    <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider flex items-center space-x-1">
                      <Compass className="w-3 h-3 text-brand-600" />
                      <span>Düşünme Sorusu</span>
                    </div>
                    <p className="text-text-primary leading-relaxed">
                      {item.reflectionPromptTr}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle/70 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-text-tertiary">Kaynak Boyutlar:</span>
                  {item.sourceDimensionNames.map((dim, idx) => (
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
            Henüz Belirgin Bir Dinamik Eşiği Saptanmadı
          </h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            Dinamik kuralları, birden fazla tamamlayıcı psikolojik boyutun birlikte ölçülmesini gerektirir. Yeni değerlendirmeleri tamamladıkça sinerji, gerilim ve bağlamsal modülasyonlar haritalandırılacaktır.
          </p>
        </div>
      )}

      {/* Epistemic Note */}
      <div className="flex items-center space-x-2 text-[11px] text-text-tertiary pt-1 border-t border-border-subtle">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>
          Gerilim ve sinerji analizleri ampirik eşik kurallarına dayanır; bireysel farklılıklar patoloji veya çelişki olarak nitelendirilmez.
        </span>
      </div>
    </div>
  );
};
