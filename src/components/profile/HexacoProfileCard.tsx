'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { HexacoRadarChart, HexacoTraitData } from '@/components/charts/HexacoRadarChart';
import { UnifiedConstructViewModel } from '@/types/profile';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';

interface HexacoProfileCardProps {
  radarData: Array<{
    name: string;
    name_tr: string;
    score: number;
    scaleMin: number;
    scaleMax: number;
  }>;
  constructs: UnifiedConstructViewModel[];
  measuredFacetCount: number;
  totalFacetCount: number;
}

export const HexacoProfileCard: React.FC<HexacoProfileCardProps> = ({
  radarData,
  constructs,
  measuredFacetCount,
  totalFacetCount,
}) => {
  // Format trait data for HexacoRadarChart
  const hexacoRadarTraits: HexacoTraitData[] = constructs.map((c) => ({
    name: c.nameEn,
    name_tr: c.nameTr,
    score: c.isMeasured && c.compositeScore !== null
      ? Math.round(((c.compositeScore - (c.scale?.scaleMin || 1)) / ((c.scale?.scaleMax || 5) - (c.scale?.scaleMin || 1))) * 100)
      : null,
    standardError: null,
    ci95: null,
    facetCount: c.facetCount,
    coverage: c.isMeasured ? Math.round((c.measuredFacetCount / Math.max(1, c.facetCount)) * 100) : 0,
  }));

  return (
    <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-border-subtle shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold text-text-primary">
              Temel Kişilik Yapısı (HEXACO)
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {measuredFacetCount} / {totalFacetCount} ALT BOYUT
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            HEXACO 6 faktör modeli temelinde ölçülen boyutlar. Puanlar ön kalibrasyon döneminde 1.0–5.0 ölçeğindeki unweighted betimsel ortalamaları temsil eder.
          </p>
        </div>

        <Link
          href="/profile/personality"
          className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors self-start sm:self-auto shrink-0"
        >
          <span>Kişilik Detay Sayfası</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* 2-Column Layout: Radar mini view (5 cols) + Factor Breakdown (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Graphic */}
        <div className="lg:col-span-5 bg-surface-2/40 p-4 rounded-2xl border border-border-subtle flex flex-col items-center justify-center">
          <div className="w-full max-w-xs py-2">
            <HexacoRadarChart data={hexacoRadarTraits} compact />
          </div>
          <div className="text-[11px] text-text-tertiary text-center mt-1">
            Görsel radar profili 0–100 ekseninde çizilmiştir; gerçek puanlar 1.0–5.0 aralığındadır.
          </div>
        </div>

        {/* 6 Factor Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {constructs.map((c) => {
            const isMeasured = c.isMeasured && c.compositeScore !== null;
            const band = c.bandInfo;

            return (
              <div
                key={c.constructId}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
                  isMeasured
                    ? 'bg-surface-1 border-border-subtle'
                    : 'bg-surface-2/40 border-dashed border-border-subtle opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-text-primary">
                      {c.nameTr}
                    </span>
                    {isMeasured ? (
                      <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60 shrink-0">
                        {c.compositeScore?.toFixed(2)} / 5.0
                      </span>
                    ) : (
                      <span className="text-[10px] text-text-tertiary">Ölçülmedi</span>
                    )}
                  </div>

                  {c.interpretation && isMeasured && (
                    <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed line-clamp-2">
                      {c.interpretation.textTr}
                    </p>
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-border-subtle flex items-center justify-between text-[10px] text-text-tertiary">
                  <span>
                    {c.measuredFacetCount} / {c.facetCount} Alt Boyut
                  </span>
                  {band && isMeasured && (
                    <span className={`font-semibold ${band.colorClass}`}>
                      {band.labelTr}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
