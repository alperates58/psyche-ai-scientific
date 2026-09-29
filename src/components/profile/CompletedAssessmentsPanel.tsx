'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Calendar, Layers } from 'lucide-react';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';

interface CompletedAssessmentsPanelProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const CompletedAssessmentsPanel: React.FC<CompletedAssessmentsPanelProps> = ({ profile }) => {
  const assessments = profile.recentAssessments || [];

  if (assessments.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Tamamladığın Değerlendirmeler
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Profilini oluşturan ampirik değerlendirme oturumları ve sonuç raporları.
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span>{assessments.length} Değerlendirme Tamamlandı</span>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {assessments.map((a) => {
          const dateStr = a.completedAt
            ? new Date(a.completedAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : 'Tamamlandı';

          return (
            <div
              key={a.sessionId}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {a.moduleTitleTr}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Geçerli & Güvenilir
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{dateStr}</span>
                  </span>
                  <span>•</span>
                  <span>Form: {a.formVersionCode}</span>
                </div>
              </div>

              <Link
                href={`/assessment/result/${a.sessionId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors self-start sm:self-auto shrink-0"
              >
                <span>Sonucu Gör</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
