'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Layers,
  RotateCcw,
  Info,
} from 'lucide-react';
import { AssessmentResultViewModel } from '@/services/assessmentResultService';
import { resolveConsumerScalePosition, SCALE_POSITION_EXPLANATION_NOTE } from '@/lib/consumerLanguage';

interface ResultSummaryHeroProps {
  result: AssessmentResultViewModel;
}

export const ResultSummaryHero: React.FC<ResultSummaryHeroProps> = ({ result }) => {
  const [showScientificDetail, setShowScientificDetail] = useState(false);
  const isClean = result.integrity.isClean;
  const completedDateFormatted = new Date(result.timestamps.completedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate overall scale position if numeric composite exists
  const numericScore = result.compositeScoreFormatted.includes('/')
    ? parseFloat(result.compositeScoreFormatted.split(' ')[0])
    : null;
  const scalePosition = resolveConsumerScalePosition(numericScore);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & History Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <Link
          href="/assessments"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-text-primary transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Tüm Değerlendirmelere Dön</span>
        </Link>

        {/* Historical sessions selector if user repeated this test */}
        {result.historicalSessions.length > 1 && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-text-tertiary">Geçmiş Sonuçlar:</span>
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
              {result.historicalSessions.map((h, idx) => (
                <Link
                  key={h.sessionId}
                  href={`/assessments/results/${h.sessionId}`}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    h.isCurrent
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'bg-surface-2 hover:bg-bg-subtle text-text-secondary border border-border-subtle'
                  }`}
                >
                  #{result.historicalSessions.length - idx} ({new Date(h.completedAt).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })})
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Material Quality Warning (Only shown if material issue exists) */}
      {!isClean && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900 shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Ölçüm Kalitesi Notu: </span>
            <span>
              Bu değerlendirmedeki bazı yanıt örüntüleri sonucu yorumlarken daha temkinli olmayı gerektiriyor.
              İsterseniz değerlendirmeyi daha sonra tekrar edebilirsiniz.
            </span>
          </div>
        </div>
      )}

      {/* Main Hero Card */}
      <div className="bg-surface-1 p-6 sm:p-8 rounded-3xl border border-border-default shadow-sm space-y-6 relative overflow-hidden">
        {/* Subtle Decorative Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                <Layers className="w-3 h-3 mr-1" />
                {result.module.titleTr}
              </span>

              <span className="inline-flex items-center text-[10px] text-text-tertiary px-2 py-0.5 rounded bg-bg-subtle border border-border-subtle">
                <Calendar className="w-3 h-3 mr-1" />
                {completedDateFormatted}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Değerlendirme Sonuç Raporu
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
              {result.module.descriptionTr ||
                'Bu değerlendirmede verdiğiniz yanıtlar, çok boyutlu psikolojik profilinizi zenginleştirmek üzere analiz edilmiştir.'}
            </p>
          </div>

          <div className="shrink-0 pt-1">
            <Link
              href={`/assessment?module=${encodeURIComponent(result.module.code)}&retake=true`}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-surface-2 hover:bg-bg-subtle text-text-primary text-xs font-bold border border-border-default transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-brand-primary" />
              <span>Yeniden Çöz</span>
            </Link>
          </div>
        </div>

        {/* Score Position & Scale Interpretation Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 relative z-10">
          {/* Scale Position Summary */}
          <div className="bg-bg-subtle p-4 rounded-2xl border border-border-subtle space-y-1">
            <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
              {numericScore !== null ? 'Ölçek Konumu' : 'Ölçülen Boyutlar'}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-extrabold text-brand-primary">
                {numericScore !== null ? scalePosition.labelTr : `${result.constructs.length} Boyut`}
              </span>
              {numericScore !== null && (
                <span className="text-xs text-text-tertiary font-mono">
                  ({numericScore.toFixed(2)} / {result.scoreScale.max.toFixed(1)})
                </span>
              )}
            </div>
            <p className="text-[10px] text-text-tertiary leading-tight pt-0.5">
              {SCALE_POSITION_EXPLANATION_NOTE}
            </p>
          </div>

          {/* Measurement Integrity Notice */}
          <div className="bg-bg-subtle p-4 rounded-2xl border border-border-subtle space-y-1 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                Ölçüm Tutarlılığı
              </div>
              <div className="flex items-center space-x-1.5 pt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700">
                  {isClean ? 'Yüksek Ölçüm Tutarlılığı' : 'Standart Ölçüm'}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-text-tertiary leading-tight">
              Toplum normlarıyla karşılaştırma henüz sunulmuyor.
            </p>
          </div>
        </div>

        {/* Standout Findings / Key Observations */}
        <div className="bg-brand-primary/5 rounded-2xl p-5 border border-brand-primary/20 space-y-3 relative z-10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Öne Çıkan Eğilimleriniz
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.keyObservations.map((obs, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 text-xs text-text-primary leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                <span>{obs}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expandable Scientific Detail Drawer */}
        <div className="pt-2 border-t border-border-subtle">
          <button
            type="button"
            onClick={() => setShowScientificDetail(!showScientificDetail)}
            className="w-full flex items-center justify-between text-xs text-text-tertiary hover:text-text-primary py-2 transition-colors"
          >
            <span className="flex items-center gap-1.5 font-semibold">
              <Info className="w-3.5 h-3.5 text-brand-primary" />
              Bilimsel Ölçüm ve Metodoloji Detayları
            </span>
            {showScientificDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showScientificDetail && (
            <div className="mt-3 p-4 rounded-xl bg-bg-subtle border border-border-subtle space-y-3 text-xs text-text-secondary animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-surface-1 border border-border-subtle space-y-0.5">
                  <div className="text-[10px] text-text-tertiary">Form Sürümü</div>
                  <div className="font-mono font-bold text-text-primary">{result.formVersion.versionCode}</div>
                </div>
                <div className="p-3 rounded-lg bg-surface-1 border border-border-subtle space-y-0.5">
                  <div className="text-[10px] text-text-tertiary">Ölçüm Modeli</div>
                  <div className="font-mono font-bold text-text-primary">{result.snapshot.scoringModelCode}</div>
                </div>
                <div className="p-3 rounded-lg bg-surface-1 border border-border-subtle space-y-0.5">
                  <div className="text-[10px] text-text-tertiary">Tamamlama Süresi</div>
                  <div className="font-bold text-text-primary">{result.timestamps.durationFormatted}</div>
                </div>
              </div>
              <p className="text-[11px] text-text-tertiary leading-relaxed">
                Puanlar deterministik psikometrik modellerle hesaplanmıştır. Temsili nüfus normları entegre edilene kadar tüm veriler ön-kalibrasyon ölçek standartlarında işlenmektedir.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
