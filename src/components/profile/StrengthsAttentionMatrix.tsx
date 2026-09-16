'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, Info } from 'lucide-react';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';

interface StrengthsAttentionMatrixProps {
  strengths: Array<{
    traitName: string;
    point: string;
    sourceConstruct: string;
    sourceInstrument?: string;
    epistemicStatus?: string;
  }>;
  attentionPoints: Array<{
    traitName: string;
    point: string;
    sourceConstruct: string;
    sourceInstrument?: string;
    epistemicStatus?: string;
  }>;
}

export const StrengthsAttentionMatrix: React.FC<StrengthsAttentionMatrixProps> = ({
  strengths,
  attentionPoints,
}) => {
  if (strengths.length === 0 && attentionPoints.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-text-primary flex items-center">
          <Sparkles className="w-5 h-5 text-brand-600 mr-2" />
          Belirgin Eğilimler ve Dikkat Noktaları
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          Ölçülen psikolojik boyutlarınızdan elde edilen ampirik eğilimler ve bağlamsal fırsatlar. Kişilik özellikleri ahlaki olarak iyi ya da kötü şeklinde sınıflandırılmaz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Potansiyel Güçlü Kullanım Alanları */}
        <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-emerald-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm border-b border-border-subtle pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Potansiyel Güçlü Kullanım Alanları</span>
          </div>

          <div className="space-y-3">
            {strengths.map((st, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/60 space-y-2"
              >
                <div className="text-[11px] font-bold text-emerald-900 flex items-center justify-between">
                  <span>{st.traitName}</span>
                  <div className="flex items-center space-x-1.5">
                    {st.sourceInstrument && (
                      <span className="text-[10px] font-sans text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                        {st.sourceInstrument}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-emerald-700 font-normal">
                      {st.sourceConstruct}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  {st.point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Aşırı Kullanımda Dikkat Edilebilecek Noktalar */}
        <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm border-b border-border-subtle pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Aşırı Kullanımda Dikkat Edilebilecek Noktalar</span>
          </div>

          <div className="space-y-3">
            {attentionPoints.map((at, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/60 space-y-2"
              >
                <div className="text-[11px] font-bold text-amber-900 flex items-center justify-between">
                  <span>{at.traitName}</span>
                  <div className="flex items-center space-x-1.5">
                    {at.sourceInstrument && (
                      <span className="text-[10px] font-sans text-amber-700 bg-amber-100/60 px-1.5 py-0.2 rounded">
                        {at.sourceInstrument}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-amber-700 font-normal">
                      {at.sourceConstruct}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  {at.point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
