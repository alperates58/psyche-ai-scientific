'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserAssessmentJourney,
  AssessmentJourneyItem,
  AssessmentCategoryGroup,
} from '@/services/assessmentJourneyService';
import {
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  RotateCcw,
  Compass,
  Layers,
  HelpCircle,
  AlertTriangle,
  Info,
  Coffee,
  BookmarkCheck,
  Filter,
  Brain,
  Zap,
  Heart,
  Lightbulb,
  Target,
  Users,
  ShieldAlert,
} from 'lucide-react';

interface AssessmentsJourneyViewProps {
  journey: UserAssessmentJourney;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  PERSONALITY: <Brain className="w-4 h-4" />,
  SELF_REGULATION: <Zap className="w-4 h-4" />,
  EMOTION: <Heart className="w-4 h-4" />,
  COGNITION: <Lightbulb className="w-4 h-4" />,
  MOTIVATION_VALUES: <Target className="w-4 h-4" />,
  RELATIONSHIPS: <Users className="w-4 h-4" />,
  ADVANCED: <ShieldAlert className="w-4 h-4" />,
};

export function AssessmentsJourneyView({ journey }: AssessmentsJourneyViewProps) {
  const [activeTab, setActiveTab] = useState<'journey' | 'catalog'>('journey');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const { profileDepth, nextAction, advisoryBreakNotice, hasLegacyFormsOnly, legacyNotice } = journey;

  // Filter for catalog tab
  const filteredCategories =
    selectedCategory === 'ALL'
      ? journey.categoryGroups
      : journey.categoryGroups.filter((g) => g.categoryKey === selectedCategory);

  const renderAssessmentCard = (item: AssessmentJourneyItem) => {
    const isCompleted = item.status === 'COMPLETED';
    const isInProgress = item.status === 'IN_PROGRESS';
    const isNext = nextAction?.assessment.moduleId === item.moduleId;

    return (
      <div
        key={item.moduleId}
        className={`bg-surface-1 border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all duration-200 ${
          isNext
            ? 'border-brand-300 ring-2 ring-brand-500/20 bg-brand-50/20'
            : isCompleted
            ? 'border-emerald-200/80 bg-surface-1'
            : 'border-border-subtle hover:border-border-default'
        }`}
      >
        <div className="space-y-3">
          {/* Top Classification Badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  item.classification === 'REQUIRED'
                    ? 'bg-brand-50 text-brand-700 border border-brand-200/60'
                    : item.classification === 'RECOMMENDED'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                    : item.classification === 'ADVANCED'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    : 'bg-surface-2 text-text-tertiary border border-border-subtle'
                }`}
              >
                {item.classification === 'REQUIRED'
                  ? 'Temel Profil'
                  : item.classification === 'RECOMMENDED'
                  ? 'Genişletme'
                  : item.classification === 'ADVANCED'
                  ? 'İleri Düzey'
                  : 'Derin Profil'}
              </span>

              {item.domainName && (
                <span className="text-[11px] font-medium text-text-tertiary">
                  {item.domainName}
                </span>
              )}
            </div>

            {/* Completion / Progress Badge */}
            <div>
              {isCompleted ? (
                <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Tamamlandı
                </span>
              ) : isInProgress ? (
                <span className="inline-flex items-center text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                  <RotateCcw className="w-3 h-3 mr-1 animate-spin" />
                  %{item.progressPercentage} Sürüyor
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

        {/* Footer Metrics & Action Button */}
        <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-3">
          <div className="flex items-center text-xs text-text-tertiary space-x-2">
            <span className="inline-flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-brand-600" />
              ~{item.estimatedMinutes} dk
            </span>
            <span>•</span>
            <span>{item.itemCount} soru</span>
          </div>

          <div>
            {isCompleted ? (
              <Link
                href={
                  item.resultUrl ||
                  (item.completedSessionId
                    ? `/assessments/results/${item.completedSessionId}`
                    : '/assessments')
                }
                className="inline-flex items-center px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-bg-subtle text-text-primary text-xs font-semibold border border-border-subtle transition-colors"
              >
                <span>Sonuçlar</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 text-text-tertiary" />
              </Link>
            ) : !item.isPlayable || item.status === 'CONTENT_PENDING' ? (
              <span className="inline-flex items-center px-3.5 py-2 rounded-xl bg-surface-2/60 text-text-tertiary text-xs font-medium border border-border-subtle cursor-not-allowed">
                <span>İçerik Hazırlanıyor</span>
              </span>
            ) : (
              <Link
                href={item.startOrResumeUrl}
                className={`inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isNext
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20'
                    : 'bg-surface-2 hover:bg-bg-subtle text-text-primary border border-border-subtle'
                }`}
              >
                <span>{isInProgress ? 'Devam Et' : 'Başla'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Dual-View Tabs Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-brand-700 font-semibold tracking-wide uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            <span>Psikometrik Değerlendirme Sistemi</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Psikolojik Değerlendirmeler
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            11 psikolojik alan ve 37 boyutta bilimsel envanterlerle psikolojik profilinizi adım adım derinleştirin.
          </p>
        </div>

        {/* View Switcher Pill */}
        <div className="flex items-center p-1 bg-surface-2 border border-border-subtle rounded-2xl text-xs font-semibold self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('journey')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'journey'
                ? 'bg-surface-1 text-brand-700 font-bold shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Compass className="w-3.5 h-3.5 inline mr-1.5" />
            Profil Yolculuğum
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'catalog'
                ? 'bg-surface-1 text-brand-700 font-bold shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1.5" />
            Tüm Değerlendirmeler ({journey.totalAvailableAssessments})
          </button>
        </div>
      </div>

      {/* Legacy Form Isolation Warning (if applicable) */}
      {hasLegacyFormsOnly && legacyNotice && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start space-x-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Önceki Form Sürümü Bilgisi: </span>
            <span>{legacyNotice}</span>
          </div>
        </div>
      )}

      {/* 2. Profile Depth & Coverage Meter Banner */}
      <div className="bg-surface-1 border border-border-subtle rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              Profil Derinlik & Ölçüm Kapsamı Seviyesi
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-text-primary">
                {profileDepth.depthLevel}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-bold">
                %{profileDepth.depthPercentage} Kapsam
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-text-secondary font-medium">
            <div className="text-center sm:text-right">
              <div className="text-text-tertiary text-[11px]">Tamamlanan Modül</div>
              <div className="font-bold text-text-primary">
                {profileDepth.completedModules} / {profileDepth.totalModules}
              </div>
            </div>
            <div className="h-7 w-px bg-border-subtle" />
            <div className="text-center sm:text-right">
              <div className="text-text-tertiary text-[11px]">Yanıtlanan Soru</div>
              <div className="font-bold text-text-primary">
                {profileDepth.completedQuestions} / {profileDepth.totalQuestions}
              </div>
            </div>
            <div className="h-7 w-px bg-border-subtle" />
            <div className="text-center sm:text-right">
              <div className="text-text-tertiary text-[11px]">Ölçülen Alt Boyut</div>
              <div className="font-bold text-text-primary">
                {profileDepth.completedFacets} / {profileDepth.totalFacets}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-2 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(4, profileDepth.depthPercentage)}%` }}
          />
        </div>

        <p className="text-xs text-text-tertiary leading-relaxed">
          {profileDepth.summaryTextTr}{' '}
          <span className="italic text-text-secondary">
            (Bu gösterge yalnızca ölçüm kapsamını ve tamamlanan alt boyutları temsil eder; tanısal veya mutlak doğruluk yüzdesi değildir.)
          </span>
        </p>
      </div>

      {/* Advisory Break Notice (Non-blocking) */}
      {advisoryBreakNotice && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/70 text-indigo-950 text-xs flex items-start space-x-3">
          <Coffee className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Önerilen Dinlenme Molası: </span>
            <span>{advisoryBreakNotice}</span>
          </div>
        </div>
      )}

      {/* Next Action Hero (if exists) */}
      {nextAction && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-50/80 to-surface-1 border border-brand-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-700 bg-brand-100/60 px-2.5 py-0.5 rounded-full border border-brand-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sıradaki Önerilen Değerlendirme</span>
            </div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">
              {nextAction.title}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {nextAction.reason}
            </p>
          </div>

          <Link
            href={nextAction.url}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-600/20 transition-all hover:scale-[1.01] shrink-0 min-h-[46px]"
          >
            <span>{nextAction.ctaText}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: PROFIL YOLCULUĞUM (JOURNEY VIEW)                        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'journey' && (
        <div className="space-y-10">
          {journey.stages.map((stage) => {
            const isStageCompleted = stage.isCompleted;
            const isStageActive = stage.isActive;

            return (
              <div key={stage.stageKey} className="space-y-4">
                {/* Stage Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                        {stage.titleTr}
                      </h2>
                      {isStageCompleted ? (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Tamamlandı ({stage.completedModulesCount}/{stage.totalModulesCount})
                        </span>
                      ) : isStageActive ? (
                        <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                          Aktif Aşama ({stage.completedModulesCount}/{stage.totalModulesCount})
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-text-tertiary bg-surface-2 px-2.5 py-0.5 rounded-full border border-border-subtle">
                          {stage.completedModulesCount}/{stage.totalModulesCount} Modül
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-tertiary mt-1">
                      {stage.descriptionTr}
                    </p>
                  </div>
                </div>

                {/* Stage Module Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {stage.modules.map(renderAssessmentCard)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: TÜM DEĞERLENDİRMELER (DISCOVERY CATALOG VIEW)          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'catalog' && (
        <div className="space-y-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-surface-1 border border-border-subtle text-text-secondary hover:bg-surface-2'
              }`}
            >
              Tüm Kategoriler ({journey.totalAvailableAssessments})
            </button>

            {journey.categoryGroups.map((group) => {
              const isSelected = selectedCategory === group.categoryKey;
              return (
                <button
                  key={group.categoryKey}
                  type="button"
                  onClick={() => setSelectedCategory(group.categoryKey)}
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-surface-1 border border-border-subtle text-text-secondary hover:bg-surface-2'
                  }`}
                >
                  <span className="mr-1.5">{CATEGORY_ICON_MAP[group.categoryKey]}</span>
                  <span>{group.titleTr}</span>
                  <span className="ml-1.5 opacity-70 text-[10px]">({group.assessments.length})</span>
                </button>
              );
            })}
          </div>

          {/* Grouped Category Content */}
          <div className="space-y-10">
            {filteredCategories.map((group) => (
              <div key={group.categoryKey} className="space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-border-subtle pb-3">
                  <div className="p-2 rounded-xl bg-brand-50 text-brand-700 border border-brand-200/60">
                    {CATEGORY_ICON_MAP[group.categoryKey]}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-text-primary tracking-tight">
                      {group.titleTr}
                    </h2>
                    <p className="text-xs text-text-tertiary">{group.descriptionTr}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.assessments.map(renderAssessmentCard)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
