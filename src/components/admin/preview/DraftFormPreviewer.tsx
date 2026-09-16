'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  HelpCircle,
  BarChart3,
  Layers,
} from 'lucide-react';

interface PreviewItem {
  id: string;
  sortOrder: number;
  itemVersion: {
    id: string;
    versionNumber: number;
    promptTr: string;
    promptEn: string;
    options: {
      id: string;
      value: number;
      labelTr: string;
      labelEn: string;
    }[];
    item: {
      itemCode: string;
      isKeyed: boolean;
      isAttentionCheck: boolean;
      facet: {
        nameTr: string;
        construct: {
          nameTr: string;
          domain: {
            nameTr: string;
          };
        };
      };
    };
  };
}

interface DraftFormPreviewerProps {
  form: {
    id: string;
    versionCode: string;
    description: string | null;
    status: string;
    module: {
      titleTr: string;
      code: string;
      estimatedMinutes: number;
    };
    items: PreviewItem[];
  };
}

export const DraftFormPreviewer: React.FC<DraftFormPreviewerProps> = ({ form }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const totalQuestions = form.items.length;
  const currentItem = form.items[currentStep];

  const handleSelectOption = (value: number) => {
    if (!currentItem) return;
    setAnswers((prev) => ({
      ...prev,
      [currentItem.itemVersion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  if (totalQuestions === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto bg-surface-1 border border-border-subtle rounded-2xl shadow-xs text-center space-y-4">
        <HelpCircle className="w-12 h-12 text-text-disabled mx-auto" />
        <h2 className="text-base font-bold text-text-primary">Bu Formda Henüz Madde Yok</h2>
        <p className="text-xs text-text-tertiary">
          Önizleme yapabilmek için önce taslak form düzenleyiciden soru eklemelisiniz.
        </p>
        <Link
          href={`/admin/assessment-forms/${form.id}`}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors"
        >
          Form Düzenleyiciye Dön
        </Link>
      </div>
    );
  }

  // Distribution calculation for completed view
  const distribution = [1, 2, 3, 4, 5].map((val) => {
    const count = Object.values(answers).filter((v) => v === val).length;
    return { val, count };
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Prominent Non-Production Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-900 text-xs shadow-xs">
        <div className="flex items-center space-x-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold block">Taslak Önizleme Modu — Canlı Oturum Açılmaz</span>
            <span className="text-[11px] text-amber-800/90">
              Bu ekrandaki yanıtlar tamamen istemci tarafında tutulur; veritabanına oturum veya yanıt kaydedilmez.
            </span>
          </div>
        </div>

        <Link
          href={`/admin/assessment-forms/${form.id}`}
          className="inline-flex items-center px-3 py-1.5 rounded-xl bg-amber-600/10 hover:bg-amber-600/20 text-amber-900 font-semibold text-xs border border-amber-500/30 transition-colors shrink-0 ml-3"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Düzenleyiciye Dön
        </Link>
      </div>

      {!isCompleted ? (
        /* Question Stepper Card */
        <div className="bg-surface-1 border border-border-subtle rounded-3xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-text-tertiary">
              <span className="font-semibold text-text-primary">
                {form.module.titleTr} ({form.versionCode})
              </span>
              <span className="font-mono font-bold text-brand-700">
                Soru {currentStep + 1} / {totalQuestions}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Information */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-lg border border-brand-200/60">
                {currentItem.itemVersion.item.itemCode}
              </span>
              <span className="text-[11px] text-text-tertiary">
                {currentItem.itemVersion.item.facet.construct.domain.nameTr} &gt;{' '}
                <strong className="text-text-primary">{currentItem.itemVersion.item.facet.nameTr}</strong>
              </span>
              {currentItem.itemVersion.item.isAttentionCheck && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  Dikkat Kontrolü
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary leading-snug">
                {currentItem.itemVersion.promptTr}
              </h2>
              <p className="text-xs sm:text-sm text-text-tertiary italic">
                {currentItem.itemVersion.promptEn}
              </p>
            </div>
          </div>

          {/* Likert 5 Options Radio Group */}
          <div className="space-y-2.5 pt-2">
            {currentItem.itemVersion.options.map((opt) => {
              const isSelected = answers[currentItem.itemVersion.id] === opt.value;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.value)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between min-h-[52px] ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/50 shadow-xs'
                      : 'border-border-subtle bg-surface-1 hover:bg-surface-2/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-border-strong bg-surface-2 text-text-secondary'
                      }`}
                    >
                      {opt.value}
                    </span>
                    <div>
                      <span className={`text-xs sm:text-sm font-semibold block ${isSelected ? 'text-brand-900' : 'text-text-primary'}`}>
                        {opt.labelTr}
                      </span>
                      <span className="text-[11px] text-text-tertiary italic block">
                        {opt.labelEn}
                      </span>
                    </div>
                  </div>

                  {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={handlePrev}
              className="inline-flex items-center px-4 py-2 rounded-xl border border-border-subtle bg-surface-1 hover:bg-surface-2 text-text-secondary text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[42px]"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Önceki Soru
            </button>

            <button
              type="button"
              disabled={answers[currentItem.itemVersion.id] === undefined}
              onClick={handleNext}
              className="inline-flex items-center px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[42px]"
            >
              {currentStep === totalQuestions - 1 ? 'Önizlemeyi Bitir' : 'Sonraki Soru'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      ) : (
        /* Preview Completed Summary */
        <div className="bg-surface-1 border border-border-subtle rounded-3xl shadow-sm p-8 space-y-6 text-center">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-text-primary">Taslak Önizleme Tamamlandı</h2>
            <p className="text-xs text-text-tertiary">
              Form akışı başarıyla test edildi. Hiçbir gerçek katılımcı oturumu açılmamıştır.
            </p>
          </div>

          {/* Answers breakdown */}
          <div className="p-5 bg-surface-2/50 border border-border-subtle rounded-2xl space-y-3 text-left">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
              Simüle Edilen Yanıt Dağılımı ({Object.keys(answers).length} / {totalQuestions} Soru)
            </span>

            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {distribution.map((d) => (
                <div key={d.val} className="p-3 bg-surface-1 border border-border-subtle rounded-xl">
                  <div className="font-mono text-xs font-bold text-brand-700">{d.val} Puan</div>
                  <div className="text-base font-bold text-text-primary mt-1">{d.count}</div>
                  <div className="text-[10px] text-text-tertiary">Seçim</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-border-subtle bg-surface-1 hover:bg-surface-2 text-text-secondary text-xs font-semibold transition-colors min-h-[42px] w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Önizlemeyi Yeniden Başlat
            </button>

            <Link
              href={`/admin/assessment-forms/${form.id}`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors min-h-[42px] w-full sm:w-auto"
            >
              Form Düzenleyiciye Dön
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
