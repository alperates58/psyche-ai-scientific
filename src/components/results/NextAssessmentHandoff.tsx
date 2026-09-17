'use client';

import React from 'react';
import Link from 'next/link';
import { NextActionDetails } from '@/services/assessmentJourneyService';
import { Sparkles, ArrowRight, Clock, LayoutDashboard } from 'lucide-react';

interface NextAssessmentHandoffProps {
  nextAction: NextActionDetails | null;
}

export const NextAssessmentHandoff: React.FC<NextAssessmentHandoffProps> = ({ nextAction }) => {
  return (
    <div className="bg-gradient-to-br from-brand-50/80 via-surface-1 to-indigo-50/50 p-6 sm:p-8 rounded-panel border border-brand-200/80 shadow-sm relative overflow-hidden space-y-6">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      <div className="relative z-10 space-y-2 max-w-2xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-100/70 text-brand-700 text-xs font-bold border border-brand-200/70">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Sıradaki Yolculuk Adımı</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Profilini Bir Sonraki Adımla Derinleştir
        </h2>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          {nextAction
            ? nextAction.reason
            : 'Tüm temel değerlendirmelerinizi tamamladınız. Profilinizi güncel tutmak ve derinleştirmek için genel bakışa göz atabilirsiniz.'}
        </p>
      </div>

      {nextAction ? (
        <div className="bg-surface-1 rounded-2xl p-5 border border-brand-200/70 shadow-xs relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-text-primary">
                {nextAction.title}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200/60">
                {nextAction.assessment.domainName || 'Önerilen Test'}
              </span>
            </div>

            <div className="flex items-center text-xs text-text-tertiary space-x-3">
              <span className="inline-flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-brand-600" />
                ~{nextAction.estimatedMinutes} dk
              </span>
              <span>•</span>
              <span>{nextAction.assessment.itemCount} soru</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={nextAction.url}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm shadow-brand-600/20 active:scale-[0.99] min-h-[44px]"
            >
              <span>{nextAction.ctaText}</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-white" />
            </Link>

            <Link
              href="/overview"
              className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-surface-2 hover:bg-bg-subtle text-text-primary text-xs font-semibold border border-border-subtle transition-colors min-h-[44px]"
            >
              <LayoutDashboard className="w-3.5 h-3.5 mr-1.5 text-text-secondary" />
              <span>Genel Bakış</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="pt-2 relative z-10 flex items-center space-x-3">
          <Link
            href="/overview"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm shadow-brand-600/20 min-h-[44px]"
          >
            <LayoutDashboard className="w-4 h-4 mr-1.5" />
            <span>Genel Bakışa Dön</span>
          </Link>
        </div>
      )}
    </div>
  );
};
