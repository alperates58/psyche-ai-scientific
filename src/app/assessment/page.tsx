'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

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
  BookOpen,
  Keyboard,
} from 'lucide-react';
import {
  startOrResumeAssessmentAction,
  submitResponseAction,
  pauseAssessmentAction,
  finalizeAssessmentAction,
} from '@/actions/assessment';
import { PageContainer } from '@/components/ui/PageContainer';

function AssessmentRunnerInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedModule = searchParams.get('module') || undefined;

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
              value: resp.rawValue,
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
  }, [requestedModule]);

  // Reset item timer when navigating to a new question
  const resetItemTimer = useCallback(() => {
    itemStartTimeRef.current = Date.now();
    focusLostCountRef.current = 0;
  }, []);

  // Current item helpers
  const items = session?.formVersion?.items || [];
  const currentFormItem = items[currentIndex];
  const itemVersion = currentFormItem?.itemVersion;
  const itemModel = itemVersion?.item;
  const currentAnswer = currentFormItem ? answers[currentFormItem.id] : null;

  // Previous item for section/instrument header check
  const prevFormItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const currentInstrumentName =
    itemModel?.instrument?.fullName || itemModel?.instrument?.name || null;
  const prevInstrumentName =
    prevFormItem?.itemVersion?.item?.instrument?.fullName ||
    prevFormItem?.itemVersion?.item?.instrument?.name ||
    null;
  const isNewInstrumentSection =
    currentInstrumentName && (currentIndex === 0 || currentInstrumentName !== prevInstrumentName);

  // Handle option selection
  const handleSelectOption = useCallback(
    async (option: { id: string; value: number }) => {
      if (!session || !currentFormItem || isSubmitting) return;

      const durationMs = Math.max(100, Date.now() - itemStartTimeRef.current);
      const focusLostCount = focusLostCountRef.current;

      // Optimistic state update
      setAnswers((prev) => ({
        ...prev,
        [currentFormItem.id]: { optionId: option.id, value: option.value },
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
          firstInteractionAt: new Date(itemStartTimeRef.current).toISOString(),
        });

        if (!res.success) {
          setSaveStatus(`Hata: ${res.error}`);
        } else {
          setSaveStatus('Kaydedildi');
          setTimeout(() => setSaveStatus(null), 1500);
        }
      } catch {
        setSaveStatus('Kaydetme hatası');
      } finally {
        setIsSubmitting(false);
      }
    },
    [session, currentFormItem, isSubmitting]
  );

  // Next Question or Finalize
  const handleNext = useCallback(async () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
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
      } catch {
        alert('Değerlendirme tamamlanırken bir hata meydana geldi.');
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [currentIndex, items.length, session, resetItemTimer]);

  // Previous Question
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetItemTimer();
    }
  }, [currentIndex, resetItemTimer]);

  // Keyboard Navigation Support (1..7, ArrowRight/Enter, ArrowLeft)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea or modal is open
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const options = itemVersion?.options || [];
      const numKey = parseInt(e.key, 10);
      if (!isNaN(numKey) && numKey >= 1 && numKey <= options.length) {
        const matchingOption = options.find((o: any) => o.value === numKey);
        if (matchingOption) {
          e.preventDefault();
          handleSelectOption(matchingOption);
        }
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentAnswer && !isSubmitting) {
          e.preventDefault();
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          e.preventDefault();
          handlePrevious();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [itemVersion, currentAnswer, isSubmitting, currentIndex, handleSelectOption, handleNext, handlePrevious]);

  // Pause and Exit
  const handlePauseAndExit = async () => {
    if (!session) return;
    setIsSubmitting(true);
    try {
      await pauseAssessmentAction({
        sessionId: session.id,
        currentStep: currentIndex + 1,
      });
      router.push('/assessments');
    } catch {
      router.push('/assessments');
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

          {/* Advisory Rest Suggestion */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/70 text-indigo-950 text-xs text-left leading-relaxed">
            <span className="font-bold">Öneri: </span>
            Zihinsel yorgunluğu önlemek ve sonraki değerlendirmelerde yanıt kalitesini korumak için 15-30 dakika dinlenme molası verebilir veya istediğiniz zaman devam edebilirsiniz.
          </div>

          {/* Action Hand-offs */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-center gap-3">
            <Link
              href={`/assessments/results/${session.id}`}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>Modül Sonuçlarını Gör</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/assessments"
              className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-surface-2 hover:bg-bg-subtle text-text-primary text-xs font-semibold border border-border-subtle transition-colors"
            >
              <span>Profil Yolculuğuma Dön</span>
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
  const estimatedMinutesLeft = Math.ceil((remainingQuestions * 22) / 60);

  const options = itemVersion?.options || [];
  const optionsCount = options.length;

  // Dynamic grid class based on options count (4, 5, 6, 7)
  const gridColsClass =
    optionsCount === 4
      ? 'sm:grid-cols-4'
      : optionsCount === 6
      ? 'sm:grid-cols-6'
      : optionsCount === 7
      ? 'sm:grid-cols-7'
      : 'sm:grid-cols-5';

  const firstOption = options[0];
  const lastOption = options[options.length - 1];

  return (
    <PageContainer variant="standard" className="space-y-6 pb-20">
      {/* Top Controls & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <Link
          href="/assessments"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-text-primary transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Değerlendirmeler Listesine Dön</span>
        </Link>

        {/* Keyboard hint */}
        <div className="hidden md:flex items-center text-[11px] text-text-tertiary space-x-2">
          <Keyboard className="w-3.5 h-3.5 text-text-tertiary" />
          <span>Seçim: [1-{optionsCount}] | İlerle: [Sağ Ok/Enter]</span>
        </div>
      </div>

      {/* Progress & Save Status Header */}
      <div className="bg-surface-1 p-4 rounded-card border border-border-subtle shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold text-brand-700 uppercase tracking-wider">
            {session?.formVersion?.module?.titleTr || 'Değerlendirme Modülü'}
          </div>
          <div className="text-xs text-text-tertiary mt-0.5">
            Soru {currentIndex + 1} / {totalQuestions}
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
            <span className="whitespace-nowrap">~{estimatedMinutesLeft} dk kaldı</span>
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

      {/* Multi-Instrument Container Section Transition Header */}
      {isNewInstrumentSection && currentInstrumentName && (
        <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200/60 flex items-center space-x-2.5 text-xs text-brand-900 animate-in fade-in">
          <BookOpen className="w-4 h-4 text-brand-600 shrink-0" />
          <div>
            <span className="font-bold">Ölçek Bölümü: </span>
            <span>{currentInstrumentName}</span>
          </div>
        </div>
      )}

      {/* Main Question Surface */}
      {currentFormItem && (
        <div className="bg-surface-1 p-6 sm:p-8 rounded-panel border border-border-subtle shadow-sm space-y-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block px-2.5 py-1 rounded-md bg-bg-subtle text-text-tertiary text-[11px] font-medium border border-border-subtle">
                {itemModel?.facet?.construct?.nameTr || 'Temel Boyut'} &rsaquo;{' '}
                {itemModel?.facet?.nameTr || 'Alt Boyut'}
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

          {/* Dynamic Likert Scale Options */}
          <div className="space-y-3">
            {firstOption && lastOption && (
              <div className="flex justify-between text-xs text-text-tertiary px-1 font-medium">
                <span>
                  {firstOption.labelTr} ({firstOption.value})
                </span>
                <span>
                  {lastOption.labelTr} ({lastOption.value})
                </span>
              </div>
            )}

            {/* Mobile View (< sm): Stacked full-width radio rows */}
            <div className="sm:hidden flex flex-col space-y-2">
              {options.map((opt: any) => {
                const isSelected =
                  currentAnswer?.optionId === opt.id || currentAnswer?.value === opt.value;
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
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold shrink-0 ${
                          isSelected
                            ? 'bg-brand-600 text-white'
                            : 'bg-bg-subtle text-text-secondary border border-border-subtle'
                        }`}
                      >
                        {opt.value}
                      </span>
                      <span className="text-xs font-semibold leading-snug">{opt.labelTr}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-brand-600 bg-brand-600' : 'border-border-strong'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tablet/Desktop View (>= sm): Horizontal dynamic column grid */}
            <div className={`hidden sm:grid ${gridColsClass} gap-2`}>
              {options.map((opt: any) => {
                const isSelected =
                  currentAnswer?.optionId === opt.id || currentAnswer?.value === opt.value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSelectOption(opt)}
                    className={`py-4 px-2 min-h-[56px] rounded-xl text-center border transition-all duration-150 flex flex-col items-center justify-center touch-manipulation ${
                      isSelected
                        ? 'bg-brand-50 border-brand-600 ring-2 ring-brand-600/30 text-brand-700 shadow-xs font-semibold'
                        : 'bg-surface-1 border-border-default hover:border-brand-300 hover:bg-surface-2 text-text-primary'
                    }`}
                  >
                    <span className="font-mono text-base font-bold mb-1">{opt.value}</span>
                    <span className="text-[11px] font-medium leading-tight">{opt.labelTr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 sticky bottom-3 sm:static bg-bg-app/90 backdrop-blur-xs sm:bg-transparent p-2 sm:p-0 rounded-xl z-10 border sm:border-0 border-border-subtle shadow-sm sm:shadow-none">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`inline-flex items-center px-4 py-2.5 rounded-xl border border-border-default bg-surface-1 text-xs font-semibold text-text-secondary transition-colors min-h-[44px] touch-manipulation ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-2'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Önceki Soru</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting || !currentAnswer}
          className={`inline-flex items-center px-6 py-2.5 rounded-xl text-white text-xs font-semibold shadow-xs transition-colors min-h-[44px] touch-manipulation ${
            !currentAnswer
              ? 'bg-brand-300 cursor-not-allowed'
              : 'bg-brand-600 hover:bg-brand-700'
          }`}
        >
          <span>
            {currentIndex === items.length - 1 ? 'Değerlendirmeyi Tamamla' : 'Sonraki Soru'}
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
