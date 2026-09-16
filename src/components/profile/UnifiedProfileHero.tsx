'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { ProfileMaturityStage } from '@/types/profile';

interface UnifiedProfileHeroProps {
  userName: string;
  maturity: {
    stage: ProfileMaturityStage;
    labelTr: string;
    descriptionTr: string;
    progressPercentage: number;
  };
  measuredDomainsCount: number;
  totalDomainsCount: number;
  exploredFacetsCount: number;
  totalFacetsCount: number;
  completedAssessmentCount: number;
  lastUpdatedAt: string | null;
  responseQualityHeadlineTr: string;
  nextAction: {
    title: string;
    reason: string;
    estimatedMinutes: number;
    url: string;
    ctaText: string;
    status: string;
  } | null;
}

export const UnifiedProfileHero: React.FC<UnifiedProfileHeroProps> = ({
  userName,
  maturity,
  measuredDomainsCount,
  totalDomainsCount,
  exploredFacetsCount,
  totalFacetsCount,
  completedAssessmentCount,
  lastUpdatedAt,
  responseQualityHeadlineTr,
  nextAction,
}) => {
  const formattedDate = lastUpdatedAt
    ? new Date(lastUpdatedAt).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-surface-1 p-6 sm:p-8 rounded-panel border border-border-subtle shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
                <Compass className="w-3.5 h-3.5 text-brand-600" />
                <span>Birleşik Psikolojik Profil</span>
              </span>

              {/* Maturity Stage Badge */}
              <span className="inline-flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-full bg-surface-2 text-text-primary border border-border-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                <span>{maturity.labelTr}</span>
              </span>

              <span className="text-xs text-text-tertiary">
                (Ürün Ölçüm İlerlemesi)
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Psikolojik Profilin
              </h1>
              <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                Profilin şu anda {totalDomainsCount} psikolojik alandan{' '}
                <strong className="text-text-primary font-semibold">
                  {measuredDomainsCount} tanesini
                </strong>{' '}
                ({exploredFacetsCount} / {totalFacetsCount} alt boyut) ölçüyor. Tamamladığınız her yapılandırılmış değerlendirmeyle profiliniz zenginleşir.
              </p>
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary pt-1">
              <span className="inline-flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                {completedAssessmentCount} Değerlendirme Tamamlandı
              </span>

              {formattedDate && (
                <span className="inline-flex items-center">
                  <Calendar className="w-3.5 h-3.5 text-brand-600 mr-1.5" />
                  Son Güncelleme: {formattedDate}
                </span>
              )}

              <span className="inline-flex items-center text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/50">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {responseQualityHeadlineTr}
              </span>
            </div>
          </div>

          {/* Maturity Progress Visual Card */}
          <div className="bg-surface-2 p-4 sm:p-5 rounded-2xl border border-border-subtle shrink-0 w-full lg:w-72 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text-tertiary uppercase tracking-wider">
                Profil Olgunluğu
              </span>
              <span className="font-bold text-brand-700 font-mono">
                {maturity.stage}
              </span>
            </div>

            <div className="w-full bg-bg-subtle h-2.5 rounded-full overflow-hidden border border-border-subtle">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${maturity.progressPercentage}%` }}
              />
            </div>

            <p className="text-[11px] text-text-tertiary leading-normal">
              {maturity.descriptionTr}
            </p>
          </div>
        </div>
      </div>

      {/* Next Recommended Action Banner (if gap exists) */}
      {nextAction && (
        <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-brand-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                <Sparkles className="w-3 h-3 text-brand-600" />
                <span>Profilini Derinleştir</span>
              </span>
              <span className="text-xs text-text-tertiary">Önerilen Sonraki Adım</span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-text-primary">
              {nextAction.title}
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              {nextAction.reason}
            </p>

            <div className="flex items-center text-xs text-text-tertiary pt-0.5">
              <Clock className="w-3.5 h-3.5 text-brand-600 mr-1" />
              <span>Tahmini Süre: ~{nextAction.estimatedMinutes} dk</span>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              href={nextAction.url}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] min-h-[44px]"
            >
              <span>{nextAction.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
