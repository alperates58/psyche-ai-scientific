'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ProfileConfidenceMapViewModel, DimensionConfidence } from '@/types/confidence';

interface ProfileConfidenceMapProps {
  confidenceMap: ProfileConfidenceMapViewModel;
}

export const ProfileConfidenceMap: React.FC<ProfileConfidenceMapProps> = ({
  confidenceMap,
}) => {
  const [selectedDimension, setSelectedDimension] = useState<DimensionConfidence | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const { distribution, dimensions, headlineTr, overallNoteTr } = confidenceMap;

  if (distribution.totalMeasured === 0) {
    return (
      <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-border-subtle shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <h2 className="text-base font-bold text-text-primary">Profil Güven ve Kanıt Haritası</h2>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Tamamlanmış bir psikolojik değerlendirme bulunmadığından henüz kanıt gücü haritası oluşturulamamıştır. Değerlendirmeleri tamamladıkça her boyutun veri kalitesi ve kanıt düzeyi burada haritalandırılır.
        </p>
      </div>
    );
  }

  const filteredDimensions =
    filterLevel === 'ALL'
      ? dimensions
      : dimensions.filter((d) => d.level === filterLevel);

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'MODERATE':
        return 'bg-brand-50 text-brand-700 border-brand-200';
      case 'LOW':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-border-subtle shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-text-primary">
                Profil Güven ve Kanıt Haritası
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {distribution.totalMeasured} Boyut Analiz Edildi
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">{headlineTr}</p>
          </div>
        </div>
      </div>

      {/* Distribution Summary Cards (NO mathematical averaging) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setFilterLevel(filterLevel === 'HIGH' ? 'ALL' : 'HIGH')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            filterLevel === 'HIGH'
              ? 'ring-2 ring-emerald-600 bg-emerald-50/60 border-emerald-300'
              : 'bg-surface-2/60 border-border-subtle hover:bg-surface-2'
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-800">Yüksek Kanıt Gücü</div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-900">{distribution.high}</span>
            <span className="text-xs text-emerald-700">boyut</span>
          </div>
          <div className="text-[10px] text-text-tertiary mt-1">&ge;6 md. + temiz veri</div>
        </button>

        <button
          type="button"
          onClick={() => setFilterLevel(filterLevel === 'MODERATE' ? 'ALL' : 'MODERATE')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            filterLevel === 'MODERATE'
              ? 'ring-2 ring-brand-600 bg-brand-50/60 border-brand-300'
              : 'bg-surface-2/60 border-border-subtle hover:bg-surface-2'
          }`}
        >
          <div className="text-[11px] font-bold text-brand-700">Orta Kanıt Gücü</div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-bold font-mono text-brand-900">{distribution.moderate}</span>
            <span className="text-xs text-brand-700">boyut</span>
          </div>
          <div className="text-[10px] text-text-tertiary mt-1">3–5 md. ampirik ölçek</div>
        </button>

        <button
          type="button"
          onClick={() => setFilterLevel(filterLevel === 'LOW' ? 'ALL' : 'LOW')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            filterLevel === 'LOW'
              ? 'ring-2 ring-amber-600 bg-amber-50/60 border-amber-300'
              : 'bg-surface-2/60 border-border-subtle hover:bg-surface-2'
          }`}
        >
          <div className="text-[11px] font-bold text-amber-800">Düşük / Başlangıç</div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-900">{distribution.low}</span>
            <span className="text-xs text-amber-700">boyut</span>
          </div>
          <div className="text-[10px] text-text-tertiary mt-1">1–2 md. veya telemetri uyarısı</div>
        </button>

        <button
          type="button"
          onClick={() => setFilterLevel(filterLevel === 'VERY_LOW' ? 'ALL' : 'VERY_LOW')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            filterLevel === 'VERY_LOW'
              ? 'ring-2 ring-slate-600 bg-slate-100 border-slate-300'
              : 'bg-surface-2/60 border-border-subtle hover:bg-surface-2'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-700">Ölçülmedi / Yetersiz</div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">{distribution.veryLow}</span>
            <span className="text-xs text-slate-700">boyut</span>
          </div>
          <div className="text-[10px] text-text-tertiary mt-1">Ölçüm kaydı yok</div>
        </button>
      </div>

      {/* Grid of Dimension Confidence Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <span>
            {filterLevel === 'ALL'
              ? `Tüm Ölçülen Boyutlar (${filteredDimensions.length})`
              : `Filtrelenen Boyutlar (${filteredDimensions.length})`}
          </span>
          <span>Nedenini görmek için karta dokunun</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredDimensions.map((dim) => {
            const isSelected = selectedDimension?.dimensionId === dim.dimensionId;
            const badgeClass = getBadgeStyle(dim.level);

            return (
              <button
                key={dim.dimensionId}
                type="button"
                onClick={() => setSelectedDimension(dim)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'ring-2 ring-brand-600 ring-offset-2 bg-surface-1 shadow-sm'
                    : 'bg-surface-2/50 hover:bg-surface-2 border-border-subtle'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-text-tertiary block font-medium">
                        {dim.domainNameTr}
                      </span>
                      <span className="text-xs font-bold text-text-primary">
                        {dim.dimensionNameTr}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${badgeClass}`}
                    >
                      {dim.levelLabelTr}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                    {dim.explanationTr}
                  </p>
                </div>

                <div className="pt-2 border-t border-border-subtle/80 flex items-center justify-between text-[10px] text-text-tertiary">
                  <span>{dim.itemCount} Madde</span>
                  <span>{dim.temporalSignal === 'SINGLE_MEASUREMENT' ? 'Tekil Ölçüm' : 'Tekrarlı'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Dimension Detail Inspector Modal / Sheet */}
      {selectedDimension && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-surface-1 rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border-subtle pb-3">
              <div>
                <span className="text-[10px] font-semibold text-brand-600">
                  {selectedDimension.domainNameTr} &rsaquo; Kanıt Analizi
                </span>
                <h3 className="text-base font-bold text-text-primary mt-0.5">
                  {selectedDimension.dimensionNameTr}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDimension(null)}
                className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-2"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Confidence Level Badge & Summary */}
            <div className="p-3.5 rounded-xl bg-surface-2/60 border border-border-subtle flex items-center justify-between">
              <div>
                <div className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">
                  Ölçüm Güven Düzeyi
                </div>
                <div className="text-sm font-bold text-text-primary mt-0.5">
                  {selectedDimension.levelLabelTr}
                </div>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-lg border ${getBadgeStyle(
                  selectedDimension.level
                )}`}
              >
                {selectedDimension.level}
              </span>
            </div>

            {/* Positive Evidences */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Destekleyen Kanıt Faktörleri</span>
              </div>
              <ul className="space-y-1.5 text-xs text-text-secondary bg-emerald-50/40 p-3 rounded-xl border border-emerald-200/60">
                {selectedDimension.positiveFactors.map((pf, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-700 font-bold shrink-0">+</span>
                    <span>{pf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Uncertainties & Limiting Signals */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Sınırlılıklar ve Belirsizlik Noktaları</span>
              </div>
              <ul className="space-y-1.5 text-xs text-text-secondary bg-amber-50/40 p-3 rounded-xl border border-amber-200/60">
                {selectedDimension.uncertainties.map((unc, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-700 font-bold shrink-0">&bull;</span>
                    <div>
                      <strong className="text-amber-950 font-semibold">{unc.labelTr}: </strong>
                      <span>{unc.descriptionTr}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explanation Narrative */}
            <div className="p-3.5 rounded-xl bg-surface-2 border border-border-subtle text-xs text-text-secondary leading-relaxed">
              <span className="font-semibold text-text-primary block mb-1">Bilimsel Açıklama:</span>
              {selectedDimension.explanationTr}
            </div>

            {/* Close CTA */}
            <button
              type="button"
              onClick={() => setSelectedDimension(null)}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Anladım, Kapat
            </button>
          </div>
        </div>
      )}

      {/* Epistemic Transparency Disclaimer */}
      <div className="flex items-center space-x-2 text-[11px] text-text-tertiary pt-2 border-t border-border-subtle">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>{overallNoteTr}</span>
      </div>
    </div>
  );
};
