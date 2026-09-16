'use client';

import React from 'react';
import { Layers, ShieldCheck, Compass, Sliders } from 'lucide-react';
import { UnifiedQualityDimensions } from '@/types/profile';

interface QualityDimensionsPanelProps {
  dimensions: UnifiedQualityDimensions;
}

export const QualityDimensionsPanel: React.FC<QualityDimensionsPanelProps> = ({
  dimensions,
}) => {
  const { coverage, responseQuality, methodDiversity, calibrationStatus } = dimensions;

  const getQualityBadgeColor = (status: string) => {
    switch (status) {
      case 'EXCELLENT':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'ACCEPTABLE':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'QUESTIONABLE':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'COMPROMISED':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-text-tertiary bg-surface-2 border-border-subtle';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
          Bilimsel Güvenilirlik ve Ölçüm Boyutları
        </h2>
        <span className="text-[11px] text-text-tertiary">
          Tek bir yapay güven puanı yerine 4 ayrı psikometrik gösterge sunulur
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Ölçüm Kapsamı */}
        <div className="bg-surface-1 p-4 rounded-card border border-border-subtle shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-text-tertiary flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                Ölçüm Kapsamı
              </span>
              <span className="font-bold text-brand-700 font-mono text-[11px]">
                %{coverage.explorationPercentage}
              </span>
            </div>

            <div className="text-lg font-bold text-text-primary">
              {coverage.measuredDomains} / {coverage.totalDomains}{' '}
              <span className="text-xs font-normal text-text-tertiary">Alan</span>
            </div>

            <div className="text-xs text-text-secondary mt-1">
              {coverage.exploredFacets} / {coverage.totalFacets} alt boyut taranmıştır.
            </div>
          </div>

          <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden border border-border-subtle">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${coverage.explorationPercentage}%` }}
            />
          </div>
        </div>

        {/* 2. Yanıt Kalitesi */}
        <div className="bg-surface-1 p-4 rounded-card border border-border-subtle shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-text-tertiary flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                Yanıt Kalitesi
              </span>
              <span
                className={`font-bold text-[11px] px-2 py-0.5 rounded-full border ${getQualityBadgeColor(
                  responseQuality.status
                )}`}
              >
                {responseQuality.labelTr}
              </span>
            </div>

            <div className="text-sm font-bold text-text-primary mt-1">
              Telemetri Bütünlüğü
            </div>

            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              {responseQuality.detailTr}
            </p>
          </div>

          <div className="text-[11px] text-text-tertiary">
            Hız ve dikkat denetimi aktif
          </div>
        </div>

        {/* 3. Yöntem Çeşitliliği */}
        <div className="bg-surface-1 p-4 rounded-card border border-border-subtle shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-text-tertiary flex items-center">
                <Sliders className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Yöntem Çeşitliliği
              </span>
              <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full text-[11px]">
                {methodDiversity.instrumentCount} Ölçek
              </span>
            </div>

            <div className="text-sm font-bold text-text-primary mt-1">
              {methodDiversity.labelTr}
            </div>

            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              {methodDiversity.detailTr}
            </p>
          </div>

          <div className="text-[11px] text-text-tertiary">
            Öz-bildirim Likert ölçekleri
          </div>
        </div>

        {/* 4. Kalibrasyon Durumu */}
        <div className="bg-surface-1 p-4 rounded-card border border-border-subtle shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-text-tertiary flex items-center">
                <Compass className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                Kalibrasyon
              </span>
              <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[11px]">
                Ön Kalibrasyon
              </span>
            </div>

            <div className="text-sm font-bold text-text-primary mt-1">
              Ulusal Norm Hariç
            </div>

            <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
              Yüzdelik dilimler ve hata payları temsili ulusal norm araştırması sonrasına bırakılmıştır.
            </p>
          </div>

          <div className="text-[11px] text-text-tertiary">
            Betimsel nokta kestirimleri
          </div>
        </div>
      </div>
    </div>
  );
};
