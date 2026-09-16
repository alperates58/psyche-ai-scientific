'use client';

import React from 'react';
import {
  ShieldCheck,
  Clock,
  Zap,
  MousePointerClick,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
} from 'lucide-react';

interface ResponseQualityPanelProps {
  integrity: {
    overallFlag: string;
    isClean: boolean;
    speedViolations: number;
    straightliningDetected: boolean;
    attentionCheckPassed: boolean;
    focusLostCount: number;
    medianDurationMs: number;
    explanationTr: string;
  };
  durationFormatted: string;
  scoringModelCode: string;
}

export const ResponseQualityPanel: React.FC<ResponseQualityPanelProps> = ({
  integrity,
  durationFormatted,
  scoringModelCode,
}) => {
  return (
    <div className="bg-surface-1 p-6 sm:p-8 rounded-panel border border-border-subtle shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              Yanıt Güvenilirliği ve Psikometrik Bütünlük
            </h2>
          </div>
          <p className="text-xs text-text-secondary">
            Verilerin ampirik güvenilirliğini doğrulamak amacıyla ölçülen oturum içi kalite göstergeleri.
          </p>
        </div>

        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-md border self-start sm:self-auto ${
            integrity.isClean
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {integrity.overallFlag === 'EXCELLENT'
            ? 'Yüksek Kalite Veri'
            : integrity.overallFlag === 'ACCEPTABLE'
            ? 'Geçerli Yanıt Deseni'
            : 'İnceleme Önerilir'}
        </span>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Duration */}
        <div className="bg-surface-2/60 p-4 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center space-x-1.5 text-text-tertiary text-[10px] font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            <span>Tamamlama Süresi</span>
          </div>
          <div className="text-base font-extrabold font-mono text-text-primary pt-0.5">
            {durationFormatted}
          </div>
          <div className="text-[10px] text-text-tertiary">Yeterli düşünme süresi</div>
        </div>

        {/* Metric 2: Attention Check */}
        <div className="bg-surface-2/60 p-4 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center space-x-1.5 text-text-tertiary text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dikkat Kontrolü</span>
          </div>
          <div className="text-base font-extrabold text-emerald-600 pt-0.5">
            {integrity.attentionCheckPassed ? 'Başarılı' : 'Uyarılı'}
          </div>
          <div className="text-[10px] text-text-tertiary">Doğrulama sorusu eşleşmesi</div>
        </div>

        {/* Metric 3: Speed Violations */}
        <div className="bg-surface-2/60 p-4 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center space-x-1.5 text-text-tertiary text-[10px] font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>Hızlı Geçiş İhlali</span>
          </div>
          <div className="text-base font-extrabold font-mono text-text-primary pt-0.5">
            {integrity.speedViolations}
          </div>
          <div className="text-[10px] text-text-tertiary">
            {integrity.speedViolations === 0 ? 'Normal tempo korundu' : 'Hızlı cevaplanan madde'}
          </div>
        </div>

        {/* Metric 4: Straightlining */}
        <div className="bg-surface-2/60 p-4 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center space-x-1.5 text-text-tertiary text-[10px] font-bold uppercase tracking-wider">
            <MousePointerClick className="w-3.5 h-3.5 text-purple-600" />
            <span>Tekdüze Yanıt</span>
          </div>
          <div className="text-base font-extrabold text-text-primary pt-0.5">
            {integrity.straightliningDetected ? 'Tespit Edildi' : 'Yok'}
          </div>
          <div className="text-[10px] text-text-tertiary">Farklılaştırılmış cevaplar</div>
        </div>
      </div>

      {/* Explanatory Footnote */}
      <div className="bg-surface-2/40 p-4 rounded-xl border border-border-subtle flex items-start space-x-3 text-xs text-text-secondary leading-relaxed">
        <Lock className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-text-primary">
            Bilimsel Veri Güvencesi:
          </span>{' '}
          {integrity.explanationTr} Puanlama,{' '}
          <span className="font-mono text-text-primary">{scoringModelCode}</span> dondurulmuş
          aritmetik modeliyle hesaplanmış olup, dışsal manipülasyona karşı kilitlidir.
        </div>
      </div>
    </div>
  );
};
