'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Save,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Loader2,
} from 'lucide-react';
import {
  startOrResumeAssessmentAction,
  submitResponseAction,
  pauseAssessmentAction,
  finalizeAssessmentAction
} from '@/actions/assessment';
import { DEMO_PROFILE_DATA } from '@/data/demo-profile';
import { PageContainer } from '@/components/ui/PageContainer';

function AssessmentRunnerInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedModule = searchParams.get('module') || undefined;
  const { scenario } = DEMO_PROFILE_DATA.assessmentSample;

  // Mode switcher: 'live' uses real DB items, 'scenario' shows Phase 0 SJT preview
  const [activeType, setActiveType] = useState<'live' | 'scenario'>('live');
  const [scenarioSelection, setScenarioSelection] = useState<string | null>(null);

  // Live session state
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { optionId: string; value: number }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionResult, setCompletionResult] = useState<any | null>(null);

  // Telemetry references
  const itemStartTimeRef = useRef<number>(Date.now());
  const focusLostCountRef = useRef<number>(0);

  // Window blur listener for focus loss telemetry
  useEffect(() => {
    const handleBlur = () => {
      focusLostCountRef.current += 1;
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  // Initialize or resume session on mount
  useEffect(() => {
    async function initSession() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await startOrResumeAssessmentAction(requestedModule);
        if (!res.success || !res.data) {
          setErrorMessage(res.error || 'Değerlendirme oturumu başlatılamadı.');
          setIsLoading(false);
          return;
        }

        const sessionData = res.data;
        setSession(sessionData);

        // Pre-populate previously recorded answers
        const initialAnswers: Record<string, { optionId: string; value: number }> = {};
        if (sessionData.responses && Array.isArray(sessionData.responses)) {
          for (const resp of sessionData.responses) {
            initialAnswers[resp.formItemId] = {
              optionId: resp.selectedOptionVersionId,
              value: resp.rawValue
            };
          }
        }
        setAnswers(initialAnswers);

        // Restore step
        const items = sessionData.formVersion?.items || [];
        const savedStep = sessionData.currentStep || 1;
        const targetIndex = Math.min(Math.max(0, savedStep - 1), Math.max(0, items.length - 1));
        setCurrentIndex(targetIndex);

        itemStartTimeRef.current = Date.now();
        focusLostCountRef.current = 0;
      } catch (err: any) {
        setErrorMessage(err.message || 'Beklenmeyen bir bağlantı hatası oluştu.');
      } finally {
        setIsLoading(false);
      }
    }

    initSession();
  }, []);

  // Reset item timer when navigating to a new question
  const resetItemTimer = () => {
    itemStartTimeRef.current = Date.now();
    focusLostCountRef.current = 0;
  };

  // Current item helpers
  const items = session?.formVersion?.items || [];
  const currentFormItem = items[currentIndex];
  const itemVersion = currentFormItem?.itemVersion;
  const itemModel = itemVersion?.item;
  const currentAnswer = currentFormItem ? answers[currentFormItem.id] : null;

  // Handle option selection
  const handleSelectOption = async (option: { id: string; value: number }) => {
    if (!session || !currentFormItem || isSubmitting) return;

    const durationMs = Math.max(100, Date.now() - itemStartTimeRef.current);
    const focusLostCount = focusLostCountRef.current;

    // Optimistic state update
    setAnswers(prev => ({
      ...prev,
      [currentFormItem.id]: { optionId: option.id, value: option.value }
    }));

    setIsSubmitting(true);
    setSaveStatus('Kaydediliyor...');

    try {
      const res = await submitResponseAction({
        sessionId: session.id,
        formItemId: currentFormItem.id,
        selectedOptionVersionId: option.id,
        rawValue: option.value,
        durationMs,
        focusLostCount,
        firstInteractionAt: new Date(itemStartTimeRef.current).toISOString()
      });

      if (!res.success) {
        setSaveStatus(`Hata: ${res.error}`);
      } else {
        setSaveStatus('Kaydedildi');
        setTimeout(() => setSaveStatus(null), 1500);
      }
    } catch (err: any) {
      setSaveStatus('Kaydetme hatası');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Next Question or Finalize
  const handleNext = async () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetItemTimer();
    } else {
      // Last question reached - Finalize
      setIsSubmitting(true);
      try {
        const res = await finalizeAssessmentAction({ sessionId: session.id });
        if (res.success && res.data) {
          setIsCompleted(true);
          setCompletionResult(res.data);
        } else {
          alert(res.error || 'Değerlendirme sonlandırılamadı.');
        }
      } catch (err: any) {
        alert('Değerlendirme tamamlanırken bir hata meydana geldi.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Previous Question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetItemTimer();
    }
  };

  // Pause and Exit
  const handlePauseAndExit = async () => {
    if (!session) return;
    setIsSubmitting(true);
    try {
      await pauseAssessmentAction({
        sessionId: session.id,
        currentStep: currentIndex + 1
      });
      router.push('/overview');
    } catch (err) {
      router.push('/overview');
    }
  };

  // ---------------------------------------------------------
  // RENDER: Completion State
  // ---------------------------------------------------------
  if (isCompleted && completionResult) {
    const integrity = completionResult.overallIntegrity;
    const isIntegrityGood = integrity === 'EXCELLENT' || integrity === 'ACCEPTABLE';
    const moduleTitle = session?.formVersion?.module?.titleTr || 'Değerlendirme Modülü';

    return (
      <div className="max-w-2xl mx-auto py-12 space-y-8 animate-in fade-in duration-200">
        <div className="bg-surface-1 p-8 rounded-panel border border-border-subtle shadow-sm text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {moduleTitle} Tamamlandı
            </span>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
              Değerlendirmeniz Başarıyla Kaydedildi
            </h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Cevaplarınız dondurulmuş form sürümü üzerinden güvenli bir şekilde işlenmiş ve profilinize aktarılmıştır.
            </p>
          </div>

          {/* Telemetry & Quality Result */}
          <div className="bg-surface-2 p-5 rounded-xl border border-border-subtle text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Cevap Bütünlüğü ve Kalite Durumu
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                  isIntegrityGood
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {integrity === 'EXCELLENT'
                  ? 'Yanıt Bütünlüğü: Temiz'
                  : integrity === 'ACCEPTABLE'
                  ? 'Belirgin Kalite Sorunu Saptanmadı'
                  : integrity === 'QUESTIONABLE'
                  ? 'İncelenmesi Önerilir'
                  : 'Düşük Veri Kalitesi'}
              </span>
            </div>

            <div className="text-xs text-text-secondary leading-relaxed border-t border-border-subtle pt-3">
              Ön kalibrasyon aşamasında nüfus yüzdelikleri ve standart hatalar henüz dahil edilmemiştir. Ham bileşik puanlarınız psikolojik profilinize yansıtılmıştır.
            </div>
          </div>

          {/* Action Hand-offs */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-center gap-3">
            <Link
              href="/overview"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span>Profilini Geliştirmeye Devam Et</span>
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </Link>

            <Link
              href="/assessments"
              className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-surface-2 hover:bg-bg-subtle text-text-primary text-xs font-semibold border border-border-subtle transition-colors"
            >
              <span>Tüm Değerlendirmeler</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // RENDER: Loading / Error States
  // ---------------------------------------------------------
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-medium text-text-tertiary">
          Değerlendirme oturumu ve dondurulmuş form sürümü yükleniyor...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Oturum Yüklenemedi</h3>
        <p className="text-xs text-text-secondary leading-relaxed">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          <span>Yeniden Dene</span>
        </button>
      </div>
    );
  }

  // Estimate remaining minutes based on remaining questions
  const totalQuestions = items.length;
  const remainingQuestions = Math.max(0, totalQuestions - currentIndex - 1);
  const estimatedMinutesLeft = Math.ceil((remainingQuestions * 25) / 60);

  return (
    <PageContainer variant="standard" className="space-y-6 pb-20">
      {/* Top Controls & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <Link
          href="/overview"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-text-primary transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Genel Bakışa Dön</span>
        </Link>

        {/* Item Type Switcher */}
        <div className="inline-flex p-1 bg-surface-2 border border-border-subtle rounded-xl text-xs font-medium w-full sm:w-auto">
          <button
            onClick={() => setActiveType('live')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors text-center ${
              activeType === 'live'
                ? 'bg-surface-1 text-brand-700 font-semibold shadow-xs'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            1. HEXACO Formu ({totalQuestions} Madde)
          </button>
          <button
            onClick={() => setActiveType('scenario')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors text-center ${
              activeType === 'scenario'
                ? 'bg-surface-1 text-brand-700 font-semibold shadow-xs'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            2. Durumsal Önizleme (SJT)
          </button>
        </div>
      </div>

      {/* Progress & Save Status */}
      <div className="bg-surface-1 p-4 rounded-card border border-border-subtle shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold text-brand-700 uppercase tracking-wider">
            {activeType === 'live'
              ? session?.formVersion?.module?.titleTr || 'Modül 1: Temel Kişilik Boyutları'
              : scenario.moduleName}
          </div>
          <div className="text-xs text-text-tertiary mt-0.5">
            Soru {activeType === 'live' ? currentIndex + 1 : scenario.questionNumber} /{' '}
            {activeType === 'live' ? totalQuestions : 48}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle/50">
          {saveStatus && (
            <span className="text-[11px] font-medium text-brand-700 animate-pulse">
              {saveStatus}
            </span>
          )}

          <div className="flex items-center text-xs text-text-tertiary">
            <Clock className="w-3.5 h-3.5 mr-1 text-brand-600 shrink-0" />
            <span className="whitespace-nowrap">~{activeType === 'live' ? estimatedMinutesLeft : scenario.estimatedMinutesLeft} dk</span>
          </div>

          <button
            type="button"
            onClick={handlePauseAndExit}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-border-subtle text-xs font-semibold text-text-secondary hover:bg-bg-subtle transition-colors min-h-[36px] touch-manipulation"
          >
            <Save className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span>Kaydet & Çık</span>
          </button>
        </div>
      </div>

      {/* Main Question Surface */}
      {activeType === 'live' && currentFormItem ? (
        <div className="bg-surface-1 p-8 rounded-panel border border-border-subtle shadow-sm space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block px-2.5 py-1 rounded-md bg-bg-subtle text-text-tertiary text-[11px] font-medium border border-border-subtle">
                {itemModel?.facet?.construct?.nameTr || 'Temel Boyut'} &rsaquo; {itemModel?.facet?.nameTr || 'Alt Boyut'}
              </span>

              {itemModel?.isAttentionCheck && (
                <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Doğrulama Sorusu
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-semibold text-text-primary leading-snug">
              "{itemVersion?.promptTr}"
            </h2>
          </div>

          {/* 5-Point Likert Options */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-text-tertiary px-1 font-medium">
              <span>Kesinlikle Katılmıyorum (1)</span>
              <span>Kesinlikle Katılıyorum (5)</span>
            </div>

            {/* Mobile View (< sm): Stacked full-width radio rows */}
            <div className="sm:hidden flex flex-col space-y-2">
              {itemVersion?.options?.map((opt: any) => {
                const isSelected = currentAnswer?.optionId === opt.id || currentAnswer?.value === opt.value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full min-h-[48px] p-3 rounded-xl border text-left transition-all duration-150 flex items-center justify-between touch-manipulation active:scale-[0.99] ${
                      isSelected
                        ? 'bg-brand-50 border-brand-600 ring-2 ring-brand-600/30 text-brand-900 shadow-xs'
                        : 'bg-surface-1 border-border-default hover:border-brand-300 hover:bg-surface-2 text-text-primary'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold shrink-0 ${
                        isSelected ? 'bg-brand-600 text-white' : 'bg-bg-subtle text-text-secondary border border-border-subtle'
                      }`}>
                        {opt.value}
                      </span>
                      <span className="text-xs font-semibold leading-snug">
                        {opt.labelTr}
                      </span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-brand-600 bg-brand-600' : 'border-border-strong'
                    }`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tablet/Desktop View (>= sm): Horizontal 5-column grid */}
            <div className="hidden sm:grid sm:grid-cols-5 gap-2.5">
              {itemVersion?.options?.map((opt: any) => {
                const isSelected = currentAnswer?.optionId === opt.id || currentAnswer?.value === opt.value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSelectOption(opt)}
                    className={`py-4 px-2 min-h-[56px] rounded-xl text-center border transition-all duration-150 flex flex-col items-center justify-center touch-manipulation ${
                      isSelected
                        ? 'bg-brand-50 border-brand-600 ring-2 ring-brand-600/30 text-brand-700 shadow-xs'
                        : 'bg-surface-1 border-border-default hover:border-brand-300 hover:bg-surface-2 text-text-primary'
                    }`}
                  >
                    <span className="font-mono text-base font-bold mb-1">{opt.value}</span>
                    <span className="text-[11px] font-medium leading-tight">
                      {opt.labelTr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : activeType === 'scenario' ? (
        /* Situational Judgement Scenario Item (Preview) */
        <div className="bg-surface-1 p-6 sm:p-8 rounded-panel border border-border-subtle shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="inline-block px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-[11px] font-semibold border border-purple-200/60">
              Senaryo Görevi: {scenario.contextTag}
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-text-primary">
              {scenario.text_tr || scenario.text}
            </h2>
          </div>

          <div className="bg-surface-2 p-4 rounded-xl border border-border-subtle text-xs md:text-sm text-text-secondary leading-relaxed">
            {scenario.scenarioBody}
          </div>

          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
              Tipik karar tarzınızı en iyi temsil eden eylemi seçiniz:
            </div>

            <div className="space-y-2.5">
              {scenario.sjtOptions?.map((opt, idx) => {
                const isSelected = scenarioSelection === opt.id;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setScenarioSelection(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start space-x-3.5 min-h-[48px] touch-manipulation ${
                      isSelected
                        ? 'bg-brand-50 border-brand-600 ring-2 ring-brand-600/30 text-brand-900 shadow-xs'
                        : 'bg-surface-1 border-border-default hover:border-brand-200 hover:bg-surface-2 text-text-primary'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-bg-subtle text-text-secondary border border-border-subtle'
                    }`}>
                      {letter}
                    </span>
                    <div className="flex-1 text-xs md:text-sm leading-relaxed">
                      <div className="text-text-primary font-medium">{opt.text_tr || opt.text}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 sticky bottom-3 sm:static bg-bg-app/90 backdrop-blur-xs sm:bg-transparent p-2 sm:p-0 rounded-xl z-10 border sm:border-0 border-border-subtle shadow-sm sm:shadow-none">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0 || activeType !== 'live'}
          className={`inline-flex items-center px-4 py-2.5 rounded-xl border border-border-default bg-surface-1 text-xs font-semibold text-text-secondary transition-colors min-h-[44px] touch-manipulation ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-2'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Geri</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting || (activeType === 'live' && !currentAnswer)}
          className={`inline-flex items-center px-6 py-2.5 rounded-xl text-white text-xs font-semibold shadow-xs transition-colors min-h-[44px] touch-manipulation ${
            activeType === 'live' && !currentAnswer
              ? 'bg-brand-300 cursor-not-allowed'
              : 'bg-brand-600 hover:bg-brand-700'
          }`}
        >
          <span>
            {activeType === 'live' && currentIndex === items.length - 1
              ? 'Değerlendirmeyi Tamamla'
              : 'Devam Et'}
          </span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </PageContainer>
  );
}

export default function AssessmentRunnerPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-brand-600 mx-auto" />
          <p className="text-xs font-medium text-text-tertiary">
            Değerlendirme oturumu yükleniyor...
          </p>
        </div>
      }
    >
      <AssessmentRunnerInner />
    </Suspense>
  );
}

