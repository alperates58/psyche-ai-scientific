'use client';

import React from 'react';
import Link from 'next/link';
import { NextActionDetails } from '@/services/assessmentJourneyService';
import { Sparkles, ArrowRight, Clock, Compass, LayoutDashboard } from 'lucide-react';

interface NextAssessmentHandoffProps {
  nextAction: NextActionDetails | null;
}

export const NextAssessmentHandoff: React.FC<NextAssessmentHandoffProps> = ({ nextAction }) => {
  return (
    <div className="bg-gradient-to-br from-brand-900 to-indigo-950 text-white rounded-panel p-6 sm:p-8 shadow-md relative overflow-hidden space-y-6">
      {/* Subtle Background Rings */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />

      <div className="relative z-10 space-y-3 max-w-2xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-brand-300" />
          <span>Sıradaki Yolculuk Adımı</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Profilini Bir Sonraki Adımla Derinleştir
        </h2>

        <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
          {nextAction
            ? nextAction.reason
            : 'Tüm temel değerlendirmelerinizi tamamladınız. Profilinizi güncel tutmak ve derinleştirmek için genel bakışa göz atabilirsiniz.'}
        </p>
      </div>

      {nextAction ? (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white">
                {nextAction.title}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-white/20 text-indigo-100 font-medium">
                {nextAction.assessment.domainName || 'Önerilen Test'}
              </span>
            </div>

            <div className="flex items-center text-xs text-indigo-200 space-x-3">
              <span className="inline-flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-brand-300" />
                ~{nextAction.estimatedMinutes} dk
              </span>
              <span>•</span>
              <span>{nextAction.assessment.itemCount} soru</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={nextAction.url}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white text-brand-900 hover:bg-indigo-50 text-xs font-bold transition-all shadow-sm active:scale-[0.99]"
            >
              <span>{nextAction.ctaText}</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-brand-900" />
            </Link>

            <Link
              href="/overview"
              className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
              <span>Genel Bakış</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="pt-2 relative z-10 flex items-center space-x-3">
          <Link
            href="/overview"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-brand-900 hover:bg-indigo-50 text-xs font-bold transition-all shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4 mr-1.5" />
            <span>Genel Bakışa Dön</span>
          </Link>
        </div>
      )}
    </div>
  );
};
