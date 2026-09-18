'use client';

import React from 'react';
import Link from 'next/link';
import { PenLine, Sparkles, ChevronRight, Repeat } from 'lucide-react';
import { JournalObservationSummaryV1 } from '@/types/journal';

interface RecentJournalReflectionsSectionProps {
  summary?: JournalObservationSummaryV1 | null;
}

export const RecentJournalReflectionsSection: React.FC<RecentJournalReflectionsSectionProps> = ({
  summary,
}) => {
  if (!summary || summary.entryCount === 0) {
    return (
      <div className="bg-surface-1 border border-border-subtle rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <PenLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Gözlemler & Yansımalar</h3>
              <p className="text-xs text-text-tertiary">
                Kişisel yaşantınızı ve bağlamsal deneyimlerinizi not edin.
              </p>
            </div>
          </div>

          <Link
            href="/journal"
            className="text-xs font-medium px-3.5 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-xs"
          >
            Yansıma Yaz
          </Link>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Günlük kayıtlarınız, psikometrik profilinizle entegre olarak bağlamsal örüntülerinizi ve
          tekrarlayan temalarınızı anlamlandırmanıza yardımcı olur.
        </p>
      </div>
    );
  }

  const { entryCount, repeatedThemes, contextualVariations } = summary;

  return (
    <div className="bg-surface-1 border border-border-subtle rounded-3xl p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <PenLine className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-text-primary">Gözlemler & Yansımalar</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-medium border border-brand-200">
                {entryCount} Kayıt
              </span>
            </div>
            <p className="text-xs text-text-tertiary">
              Kişisel öz-bildirimler ve profil bağlamsal dinamikleri
            </p>
          </div>
        </div>

        <Link
          href="/journal"
          className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
        >
          <span>Tümünü Gör</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Repeated Themes or Contextual Variations */}
      <div className="space-y-3">
        {repeatedThemes.length > 0 ? (
          repeatedThemes.slice(0, 2).map((rt) => (
            <div
              key={rt.themeKey}
              className="p-3.5 bg-surface-2 rounded-xl border border-border-subtle space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5 text-brand-600" />
                  {rt.themeTitleTr}
                </span>
                <span className="text-[10px] text-text-tertiary">{rt.entryCount} kayıt</span>
              </div>
              <p className="text-text-secondary text-[11px] leading-relaxed">{rt.summaryTr}</p>
            </div>
          ))
        ) : contextualVariations.length > 0 ? (
          contextualVariations.slice(0, 1).map((cv, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1 text-xs"
            >
              <span className="font-semibold text-amber-900 block">
                Bağlamsal Farklılaşma: {cv.facetNameTr} ({cv.context})
              </span>
              <p className="text-text-secondary text-[11px] leading-relaxed">{cv.narrativeTr}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-text-secondary leading-relaxed">
            {entryCount} adet yansıma kaydı kaydedildi. Henüz 3 kaydı aşan tekrarlayan bir tema bulunmuyor.
          </p>
        )}
      </div>

      <div className="text-[11px] text-text-tertiary pt-2 border-t border-border-subtle/50">
        * Yansımalar öz-bildirim niteliğindedir; psikometrik puanları ve keşif kapsamını değiştirmez.
      </div>
    </div>
  );
};
