'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Layers,
  Info,
} from 'lucide-react';
import { AssessmentResultViewModel } from '@/services/assessmentResultService';

interface ResultSummaryHeroProps {
  result: AssessmentResultViewModel;
}

export const ResultSummaryHero: React.FC<ResultSummaryHeroProps> = ({ result }) => {
  const isClean = result.integrity.isClean;
  const completedDateFormatted = new Date(result.timestamps.completedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

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
                      ? 'bg-brand-600 text-white shadow-xs'
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

      {/* Main Hero Card */}
      <div className="bg-surface-1 p-6 sm:p-8 rounded-panel border border-border-subtle shadow-sm space-y-6 relative overflow-hidden">
        {/* Subtle Decorative Gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 border border-brand-200/60">
              <Layers className="w-3 h-3 mr-1" />
              {result.module.titleTr}
            </span>

            <span className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-bg-subtle text-text-tertiary border border-border-subtle">
              Form Sürümü: {result.formVersion.versionCode}
            </span>

            <span className="inline-flex items-center text-[10px] text-text-tertiary px-2 py-0.5 rounded bg-bg-subtle border border-border-subtle">
              <Calendar className="w-3 h-3 mr-1" />
              {completedDateFormatted}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Değerlendirme Sonuç Raporu
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
            {result.module.descriptionTr ||
              'Bu değerlendirme yanıtlarınız, dondurulmuş form sürümü üzerinden güvenli biçimde işlenmiş ve çok boyutlu psikolojik profilinize aktarılmıştır.'}
          </p>
        </div>

        {/* Score & Integrity Pill Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 relative z-10">
          {/* Pre-Calibration Composite Score or Multi-subscale Indicator */}
          <div className="bg-surface-2/70 p-4 rounded-xl border border-border-subtle space-y-1">
            <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
              {result.compositeScoreFormatted.includes('/') ? 'Ön-Kalibrasyon Puanı' : 'Ölçülen Alt Boyutlar'}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-brand-600 font-mono">
                {result.compositeScoreFormatted.includes('/')
                  ? result.compositeScoreFormatted.split(' ')[0]
                  : `${result.constructs.length} Boyut`}
              </span>
              <span className="text-xs text-text-tertiary font-mono">
                {result.compositeScoreFormatted.includes('/')
                  ? `/ ${result.scoreScale.max.toFixed(1)} Likert`
                  : 'Ayrı Alt Ölçekler'}
              </span>
            </div>
            <p className="text-[10px] text-text-tertiary leading-tight pt-0.5">
              {result.compositeScoreFormatted.includes('/')
                ? `${result.scoreScale.min.toFixed(1)}–${result.scoreScale.max.toFixed(1)} ölçeğinde aritmetik ortalama`
                : 'Her alt ölçek bağımsız olarak değerlendirilir (genel toplam puan üretilmez)'}
            </p>
          </div>

          {/* Response Quality Badge */}
          <div className="bg-surface-2/70 p-4 rounded-xl border border-border-subtle space-y-1">
            <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
              Yanıt Kalitesi & Güvenilirlik
            </div>
            <div className="flex items-center space-x-1.5 pt-0.5">
              {isClean ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">
                    {result.integrity.overallFlag === 'EXCELLENT' ? 'Yüksek Güvenilirlik (Temiz)' : 'Kriterlere Uygun'}
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-bold text-amber-700">
                    {result.integrity.overallFlag === 'QUESTIONABLE' ? 'İnceleme Önerilir' : 'Düşük Güvenilirlik'}
                  </span>
                </>
              )}
            </div>
            <p className="text-[10px] text-text-tertiary leading-tight pt-0.5">
              Süre: {result.timestamps.durationFormatted} • Doğrulama: {result.integrity.attentionCheckPassed ? 'Geçti' : 'Uyarılı'}
            </p>
          </div>

          {/* Norm Status Disclaimer */}
          <div className="bg-surface-2/70 p-4 rounded-xl border border-border-subtle space-y-1">
            <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
              Norm Karşılaştırma Durumu
            </div>
            <div className="text-sm font-bold text-text-primary pt-0.5">
              Ön-Kalibrasyon Modeli
            </div>
            <p className="text-[10px] text-text-tertiary leading-tight pt-0.5">
              Nüfus yüzdelikleri ampirik kalibrasyon tamamlanana kadar dürüstçe kapalı tutulur.
            </p>
          </div>
        </div>

        {/* Key Observations Section */}
        <div className="bg-brand-50/40 rounded-xl p-5 border border-brand-200/50 space-y-3 relative z-10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900">
              Temel Bulgular ve Öne Çıkan Eğilimler
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.keyObservations.map((obs, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 text-xs text-brand-950 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <span>{obs}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
