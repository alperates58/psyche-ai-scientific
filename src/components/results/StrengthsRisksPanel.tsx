'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, Shield, Sparkles } from 'lucide-react';

interface StrengthsRisksPanelProps {
  strengths: Array<{
    traitName: string;
    point: string;
  }>;
  growthAndRisks: Array<{
    traitName: string;
    point: string;
  }>;
}

export const StrengthsRisksPanel: React.FC<StrengthsRisksPanelProps> = ({
  strengths,
  growthAndRisks,
}) => {
  return (
    <div className="bg-surface-1 p-6 sm:p-8 rounded-panel border border-border-subtle shadow-sm space-y-6">
      <div className="space-y-1 border-b border-border-subtle pb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <h2 className="text-lg font-bold text-text-primary tracking-tight">
            Güçlü Yönler ve Potansiyel Aşırı Kullanım Alanları
          </h2>
        </div>
        <p className="text-xs text-text-secondary">
          Kişilik özelliklerinizin günlük yaşam, iş ve ilişkilerde sağladığı avantajlar ile dikkat edilmesi faydalı olabilecek kör noktalar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Strengths */}
        <div className="bg-emerald-50/40 border border-emerald-200/60 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Güçlü Kullanım Alanları
              </h3>
              <p className="text-[11px] text-emerald-800">
                Belirginleşen kişilik eğilimlerinizin sağladığı doğal kaynaklar
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {strengths.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/90 p-3.5 rounded-xl border border-emerald-200/50 space-y-1 shadow-xs"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                  {item.traitName}
                </span>
                <p className="text-xs text-text-primary leading-relaxed">
                  {item.point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Potential Risks / Blind Spots */}
        <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Aşırı Kullanım ve Dikkat Noktaları
              </h3>
              <p className="text-[11px] text-amber-800">
                Aşırıya kaçıldığında sürtüşme yaratabilecek durumsal kör noktalar
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {growthAndRisks.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/90 p-3.5 rounded-xl border border-amber-200/50 space-y-1 shadow-xs"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                  {item.traitName}
                </span>
                <p className="text-xs text-text-primary leading-relaxed">
                  {item.point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
