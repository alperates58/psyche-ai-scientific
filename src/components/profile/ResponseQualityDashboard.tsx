'use client';

import React from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  AlignLeft,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { UnifiedResponseQualitySummary } from '@/types/profile';

interface ResponseQualityDashboardProps {
  responseQuality: UnifiedResponseQualitySummary;
}

export const ResponseQualityDashboard: React.FC<ResponseQualityDashboardProps> = ({
  responseQuality,
}) => {
  const {
    overallFlag,
    isClean,
    totalAssessmentsAudited,
    statusCounts,
    speedViolationsCount,
    straightliningDetected,
    attentionChecksPassed,
    headlineTr,
    explanationTr,
  } = responseQuality;

  return (
    <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-border-subtle shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-start space-x-3">
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
              isClean
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
          >
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-text-primary">
                Yanıt Kalitesi ve Telemetri Paneli
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  overallFlag === 'EXCELLENT'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : overallFlag === 'ACCEPTABLE'
                    ? 'bg-brand-50 text-brand-700 border-brand-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {overallFlag}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">{headlineTr}</p>
          </div>
        </div>
      </div>

      {/* 4 Multi-Signal Cards (Independent telemetry, NO pseudo-statistical percentage) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* 1. Attention Checks */}
        <div className="p-3.5 rounded-xl bg-surface-2/60 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-primary">Dikkat Kontrolleri</span>
            {attentionChecksPassed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="text-sm font-bold font-mono text-text-primary">
            {attentionChecksPassed ? 'Eksiksiz Geçildi' : 'Uyuşmazlık Saptandı'}
          </div>
          <div className="text-[10px] text-text-tertiary">
            Tüm dikkat maddeleri kontrol edildi
          </div>
        </div>

        {/* 2. Speed Signals */}
        <div className="p-3.5 rounded-xl bg-surface-2/60 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-primary">Hızlı Yanıt Sinyalleri</span>
            <Zap className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-sm font-bold font-mono text-text-primary">
            {speedViolationsCount === 0 ? 'Normal Hız' : `${speedViolationsCount} Hızlı Madde`}
          </div>
          <div className="text-[10px] text-text-tertiary">
            &lt;1000ms yanıt süresi eşiği
          </div>
        </div>

        {/* 3. Straightlining */}
        <div className="p-3.5 rounded-xl bg-surface-2/60 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-primary">Düz Yanıtlama</span>
            <AlignLeft className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-sm font-bold font-mono text-text-primary">
            {straightliningDetected ? 'Örüntü Saptandı' : 'Doğal Varyans'}
          </div>
          <div className="text-[10px] text-text-tertiary">
            Aynı seçeneği ardışık işaretleme
          </div>
        </div>

        {/* 4. Audited Sessions */}
        <div className="p-3.5 rounded-xl bg-surface-2/60 border border-border-subtle space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-primary">Denetlenen Oturum</span>
            <ShieldAlert className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-sm font-bold font-mono text-text-primary">
            {totalAssessmentsAudited} Oturum
          </div>
          <div className="text-[10px] text-text-tertiary">
            {statusCounts.excellent + statusCounts.acceptable} kabul edilebilir / temiz
          </div>
        </div>
      </div>

      {/* Explanation Narrative */}
      <div className="p-3.5 rounded-xl bg-surface-2/40 border border-border-subtle text-xs text-text-secondary leading-relaxed">
        <span className="font-semibold text-text-primary block mb-0.5">Telemetri Değerlendirmesi:</span>
        {explanationTr}
      </div>

      {/* Epistemic Note */}
      <div className="flex items-center space-x-2 text-[11px] text-text-tertiary pt-1 border-t border-border-subtle">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>
          Yanıt kalitesi göstergeleri veri geçerliğini doğrular. Yalan tespiti veya genel sosyal beğenirlik iddiası taşımaz.
        </span>
      </div>
    </div>
  );
};
