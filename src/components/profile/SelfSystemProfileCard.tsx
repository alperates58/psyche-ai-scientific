'use client';

import React from 'react';
import { UserCheck, ShieldCheck, Info } from 'lucide-react';
import { ScoreBandDetails, MeasurementProvenanceMetadata } from '@/types/profile';

interface SelfSystemProfileCardProps {
  rses: {
    isMeasured: boolean;
    score: number | null;
    scaleMin: number;
    scaleMax: number;
    bandInfo: ScoreBandDetails | null;
    titleTr: string;
    measuredAt: string | null;
    itemCount: number;
    provenance: MeasurementProvenanceMetadata | null;
  } | null;
  gse: {
    isMeasured: boolean;
    score: number | null;
    scaleMin: number;
    scaleMax: number;
    bandInfo: ScoreBandDetails | null;
    titleTr: string;
    measuredAt: string | null;
    itemCount: number;
    provenance: MeasurementProvenanceMetadata | null;
  } | null;
}

export const SelfSystemProfileCard: React.FC<SelfSystemProfileCardProps> = ({
  rses,
  gse,
}) => {
  if (!rses && !gse) return null;

  return (
    <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-border-subtle shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-text-primary">
              Benlik ve Öz-Düzenleme Sistemi
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Rosenberg Benlik Saygısı (RSES) ve Genel Öz-Yeterlik (GSE) ölçekleri üzerinden ölçülen temel benlik boyutları (1.0–4.0 ölçeği).
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
          ÖN KALİBRASYON
        </span>
      </div>

      {/* Grid: RSES Card + GSE Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RSES Card */}
        {rses && rses.isMeasured && rses.score !== null && (
          <div className="p-4 rounded-2xl bg-surface-2/60 border border-border-subtle space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                  Rosenberg Ölçeği (RSES)
                </span>
                <h3 className="text-sm font-bold text-text-primary mt-0.5">
                  Temel Benlik Saygısı
                </h3>
              </div>

              {rses.bandInfo && (
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${rses.bandInfo.bgClass} ${rses.bandInfo.colorClass} ${rses.bandInfo.borderClass}`}
                >
                  {rses.bandInfo.labelTr}
                </span>
              )}
            </div>

            {/* Score Metric */}
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold font-mono text-text-primary">
                {rses.score.toFixed(2)}
              </span>
              <span className="text-xs text-text-tertiary font-mono">
                / {rses.scaleMax.toFixed(1)} (1.0–4.0 Likert)
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Bu puan, bireyin kendi öz-değerine dair genel değerlendirmesini 1.0–4.0 Likert aralığında yansıtır. Herhangi bir klinik tanı veya normal/anormal sınıflandırması oluşturmaz.
            </p>

            <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-tertiary">
              <span>{rses.itemCount} madde tamamlandı</span>
              {rses.measuredAt && (
                <span>{new Date(rses.measuredAt).toLocaleDateString('tr-TR')}</span>
              )}
            </div>
          </div>
        )}

        {/* GSE Card */}
        {gse && gse.isMeasured && gse.score !== null && (
          <div className="p-4 rounded-2xl bg-surface-2/60 border border-border-subtle space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  Schwarzer & Jerusalem (GSE)
                </span>
                <h3 className="text-sm font-bold text-text-primary mt-0.5">
                  Genel Öz-Yeterlik
                </h3>
              </div>

              {gse.bandInfo && (
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${gse.bandInfo.bgClass} ${gse.bandInfo.colorClass} ${gse.bandInfo.borderClass}`}
                >
                  {gse.bandInfo.labelTr}
                </span>
              )}
            </div>

            {/* Score Metric */}
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold font-mono text-text-primary">
                {gse.score.toFixed(2)}
              </span>
              <span className="text-xs text-text-tertiary font-mono">
                / {gse.scaleMax.toFixed(1)} (1.0–4.0 Likert)
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Zorlu ve yeni durumlarla karşılaşıldığında hedeflere ulaşma ve engelleri aşabilme inancını 1.0–4.0 Likert ölçeğinde betimler.
            </p>

            <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-tertiary">
              <span>{gse.itemCount} madde tamamlandı</span>
              {gse.measuredAt && (
                <span>{new Date(gse.measuredAt).toLocaleDateString('tr-TR')}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Epistemic Transparency Callout */}
      <div className="flex items-center space-x-2 text-[11px] text-text-tertiary pt-1 border-t border-border-subtle">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>
          Benlik sistemi boyutları bağımsız psikometrik yapılar olup, yapay olarak tek bir bileşik puana dönüştürülmez.
        </span>
      </div>
    </div>
  );
};
