'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { History, ChevronDown, ChevronUp, ExternalLink, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { SourceAssessmentProvenance } from '@/types/profile';

interface SourceProvenanceTimelineProps {
  sourceAssessments: SourceAssessmentProvenance[];
}

export const SourceProvenanceTimeline: React.FC<SourceProvenanceTimelineProps> = ({
  sourceAssessments,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (sourceAssessments.length === 0) return null;

  return (
    <div className="bg-surface-1 rounded-panel border border-border-subtle shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-surface-2/40 transition-colors text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-surface-2 border border-border-subtle flex items-center justify-center text-text-secondary shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-text-primary">
              Kaynak Değerlendirmeler ({sourceAssessments.length})
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Bu profili oluşturan tüm tamamlanmış değerlendirme oturumları ve dondurulmuş form sürümleri.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-text-tertiary">
          <span>{isOpen ? 'Gizle' : 'İncele'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 border-t border-border-subtle pt-4 space-y-3">
          <div className="divide-y divide-border-subtle">
            {sourceAssessments.map((item) => (
              <div
                key={item.sessionId}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-text-primary">
                      {item.moduleTitleTr}
                    </span>
                    {item.isLatestForModule && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Aktif Profil Kaynağı
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-text-tertiary text-[11px]">
                    <span>
                      Form: <strong className="font-mono text-text-secondary">{item.formVersionCode}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Model: <strong className="font-mono text-text-secondary">{item.scoringModelCode}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Tamamlanma:{' '}
                      {new Date(item.completedAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      item.integrityFlag === 'EXCELLENT'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : item.integrityFlag === 'ACCEPTABLE'
                        ? 'bg-teal-50 text-teal-800 border-teal-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    Bütünlük: {item.integrityFlag}
                  </span>

                  <Link
                    href={item.resultUrl}
                    className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    <span>Sonuç Raporu</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
