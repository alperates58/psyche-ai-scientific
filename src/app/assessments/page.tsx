import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getUserAssessmentJourney, AssessmentJourneyItem } from '@/services/assessmentJourneyService';
import { PageContainer } from '@/components/ui/PageContainer';
import {
  FileCheck2,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
  Compass,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AssessmentsCatalogPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/assessments');
  }

  const journey = await getUserAssessmentJourney(user.id);

  const renderAssessmentCard = (item: AssessmentJourneyItem) => {
    const isCompleted = item.status === 'COMPLETED';
    const isInProgress = item.status === 'IN_PROGRESS';
    const isNext = journey.nextAction?.assessment.moduleId === item.moduleId;

    return (
      <div
        key={item.moduleId}
        className={`bg-surface-1 border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
          isNext
            ? 'border-brand-300 ring-2 ring-brand-500/20 bg-brand-50/20'
            : isCompleted
            ? 'border-emerald-200/80 bg-surface-1'
            : 'border-border-subtle hover:border-border-default'
        }`}
      >
        <div className="space-y-3">
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  item.classification === 'REQUIRED'
                    ? 'bg-brand-50 text-brand-700 border border-brand-200/60'
                    : item.classification === 'RECOMMENDED'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                    : 'bg-surface-2 text-text-tertiary border border-border-subtle'
                }`}
              >
                {item.classification === 'REQUIRED'
                  ? 'Zorunlu Başlangıç'
                  : item.classification === 'RECOMMENDED'
                  ? 'Önerilen'
                  : 'Genişletilmiş'}
              </span>

              {item.domainName && (
                <span className="text-[11px] font-medium text-text-tertiary">
                  {item.domainName}
                </span>
              )}
            </div>

            {/* Status Badge */}
            <div>
              {isCompleted ? (
                <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Tamamlandı
                </span>
              ) : isInProgress ? (
                <span className="inline-flex items-center text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                  <RotateCcw className="w-3 h-3 mr-1 animate-spin" />
                  %{item.progressPercentage} Devam Ediyor
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-medium text-text-tertiary bg-surface-2 px-2.5 py-1 rounded-full border border-border-subtle">
                  Başlanmadı
                </span>
              )}
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="text-xs text-text-secondary mt-0.5">{item.subtitle}</p>
            )}
          </div>

          {/* Rationale & Description */}
          <p className="text-xs text-text-tertiary leading-relaxed">
            {item.recommendationReason || item.description}
          </p>
        </div>

        {/* Footer info & Action Button */}
        <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-3">
          <div className="flex items-center text-xs text-text-tertiary space-x-2">
            <span className="inline-flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-brand-600" />
              ~{item.estimatedMinutes} dk
            </span>
            <span>•</span>
            <span className="font-mono text-[11px]">{item.formVersionCode}</span>
          </div>

          <div>
            {isCompleted ? (
              <Link
                href="/profile/personality"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-surface-2 hover:bg-bg-subtle text-text-primary text-xs font-semibold border border-border-subtle transition-colors"
              >
                <span>Sonuçları İncele</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-text-tertiary" />
              </Link>
            ) : (
              <Link
                href={item.startOrResumeUrl}
                className={`inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isNext
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20'
                    : 'bg-surface-2 hover:bg-bg-subtle text-text-primary border border-border-subtle'
                }`}
              >
                <span>{isInProgress ? 'Devam Et' : 'Değerlendirmeye Başla'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageContainer variant="wide" className="py-6 sm:py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-brand-700 font-semibold tracking-wide uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            <span>Psikolojik Değerlendirme Kataloğu</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Değerlendirmeler
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Bilimsel olarak doğrulanmış ve dondurulmuş formlarla psikolojik profilinizi adım adım derinleştirin.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-surface-1 border border-border-subtle font-medium text-text-secondary">
            Tamamlanan:{' '}
            <strong className="text-text-primary font-bold">
              {journey.completedAssessmentsCount} / {journey.totalAvailableAssessments}
            </strong>
          </div>
        </div>
      </div>

      {/* Next Action Hero (if exists) */}
      {journey.nextAction && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-50/80 to-surface-1 border border-brand-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-700 bg-brand-100/60 px-2.5 py-0.5 rounded-full border border-brand-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sıradaki Önerilen Adım</span>
            </div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">
              {journey.nextAction.title}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {journey.nextAction.reason}
            </p>
          </div>

          <Link
            href={journey.nextAction.url}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-600/20 transition-all hover:scale-[1.01] shrink-0 min-h-[46px]"
          >
            <span>{journey.nextAction.ctaText}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      )}

      {/* 1. REQUIRED ASSESSMENTS SECTION */}
      {journey.requiredAssessments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-text-primary tracking-tight flex items-center">
                <span>Başlangıç & Zorunlu Değerlendirmeler</span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/50">
                  {journey.requiredAssessments.length} Modül
                </span>
              </h2>
              <p className="text-xs text-text-tertiary mt-0.5">
                Temel psikolojik profilinizi oluşturmak için gerekli olan ilk adım değerlendirmeleri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {journey.requiredAssessments.map(renderAssessmentCard)}
          </div>
        </div>
      )}

      {/* 2. RECOMMENDED ASSESSMENTS SECTION */}
      {journey.recommendedAssessments.length > 0 && (
        <div className="space-y-4 pt-4">
          <div>
            <h2 className="text-base font-bold text-text-primary tracking-tight flex items-center">
              <span>Önerilen Değerlendirmeler</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/50">
                {journey.recommendedAssessments.length} Modül
              </span>
            </h2>
            <p className="text-xs text-text-tertiary mt-0.5">
              Temel profilinizin üzerine eklenerek duygu, benlik ve uyum örüntülerinizi derinleştiren modüller.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {journey.recommendedAssessments.map(renderAssessmentCard)}
          </div>
        </div>
      )}

      {/* 3. OPTIONAL DEEP-DIVE ASSESSMENTS SECTION */}
      {journey.optionalAssessments.length > 0 && (
        <div className="space-y-4 pt-4">
          <div>
            <h2 className="text-base font-bold text-text-primary tracking-tight flex items-center">
              <span>Derinlemesine İncelemeler (Opsiyonel)</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-2 text-text-tertiary border border-border-subtle">
                {journey.optionalAssessments.length} Modül
              </span>
            </h2>
            <p className="text-xs text-text-tertiary mt-0.5">
              Belirli psikolojik alanlarda özel içgörüler sunan ileri düzey incelemeler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {journey.optionalAssessments.map(renderAssessmentCard)}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
