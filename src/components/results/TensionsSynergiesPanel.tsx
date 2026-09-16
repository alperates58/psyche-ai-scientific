'use client';

import React from 'react';
import { DynamicInsightViewModel } from '@/services/assessmentResultService';
import { Shuffle, Zap, Scale, Sparkles } from 'lucide-react';

interface TensionsSynergiesPanelProps {
  dynamics: DynamicInsightViewModel[];
}

export const TensionsSynergiesPanel: React.FC<TensionsSynergiesPanelProps> = ({ dynamics }) => {
  return (
    <div className="bg-surface-1 p-6 sm:p-8 rounded-panel border border-border-subtle shadow-sm space-y-6">
      <div className="space-y-1 border-b border-border-subtle pb-4">
        <div className="flex items-center space-x-2">
          <Shuffle className="w-4 h-4 text-brand-600" />
          <h2 className="text-lg font-bold text-text-primary tracking-tight">
            Boyutlar Arası Dinamikler (Birlikte Nasıl Çalışıyor?)
          </h2>
        </div>
        <p className="text-xs text-text-secondary">
          Kişilik boyutları tek başına değil, birbiriyle etkileşim içinde çalışır. Aşağıda profilinizdeki sinerji ve denge alanları gösterilmektedir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dynamics.map((item) => {
          const isSynergy = item.type === 'SYNERGY';
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
                isSynergy
                  ? 'bg-purple-50/40 border-purple-200/70'
                  : 'bg-sky-50/40 border-sky-200/70'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {isSynergy ? (
                      <Zap className="w-4 h-4 text-purple-600 shrink-0" />
                    ) : (
                      <Scale className="w-4 h-4 text-sky-600 shrink-0" />
                    )}
                    <h3 className="text-xs font-bold text-text-primary">
                      {item.titleTr}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isSynergy
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : 'bg-sky-100 text-sky-800 border-sky-200'
                    }`}
                  >
                    {isSynergy ? 'Güçlü Sinerji' : 'Denge Gerektiren Dinamik'}
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.descriptionTr}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
