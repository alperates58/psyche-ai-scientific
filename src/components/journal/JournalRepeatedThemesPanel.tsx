'use client';

import React from 'react';
import {
  Sparkles,
  Repeat,
  Calendar,
  Layers,
  Info,
} from 'lucide-react';
import { RepeatedThemeV1, MultiContextThemeV1 } from '@/types/journal';

interface JournalRepeatedThemesPanelProps {
  repeatedThemes: RepeatedThemeV1[];
  multiContextThemes: MultiContextThemeV1[];
}

export const JournalRepeatedThemesPanel: React.FC<JournalRepeatedThemesPanelProps> = ({
  repeatedThemes,
  multiContextThemes,
}) => {
  const hasThemes = repeatedThemes.length > 0 || multiContextThemes.length > 0;

  return (
    <div className="space-y-6">
      {/* Informational Alert */}
      <div className="p-4 bg-brand-50/60 border border-brand-200 rounded-2xl text-xs text-text-secondary flex items-start gap-3">
        <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-text-primary">
            Tekrarlayan Temalar Nasıl Hesaplanır?
          </p>
          <p className="leading-relaxed">
            Tekrarlayan temalar, en az <strong>3 farklı yansıma kaydında</strong> ve en az{' '}
            <strong>2 farklı takvim gününde</strong> benzer bağlam veya durumları bildirdiğinizde
            dinamik olarak belirlenir. Bu gözlemler psikometrik bir tanı değil, öz-bildirimlerinizdeki
            örünütülerdir.
          </p>
        </div>
      </div>

      {!hasThemes ? (
        <div className="text-center py-12 bg-surface-1 border border-border-subtle rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-bg-subtle text-text-tertiary flex items-center justify-center mx-auto">
            <Repeat className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary">
            Henüz Tekrarlayan Bir Tema Tespit Edilmedi
          </h3>
          <p className="text-xs text-text-tertiary max-w-md mx-auto leading-relaxed">
            Farklı günlerde en az 3 yansıma kaydı oluşturduğunuzda, odaklandığınız temalar ve
            bağlamsal eğilimleriniz burada listelenecektir.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Repeated Themes */}
          {repeatedThemes.map((theme) => (
            <div
              key={theme.themeKey}
              className="bg-surface-1 border border-border-subtle hover:border-brand-200 rounded-2xl p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                  <h4 className="text-sm font-semibold text-text-primary">{theme.themeTitleTr}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    TEKRARLANAN ÖZ-BİLDİRİM
                  </span>
                  <span className="text-[11px] text-text-tertiary font-mono">
                    {theme.entryCount} Kayıt • {theme.distinctDatesCount} Farklı Gün
                  </span>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">{theme.summaryTr}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-subtle/60 text-[11px] text-text-tertiary">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(theme.dateRange.start).toLocaleDateString('tr-TR')} –{' '}
                    {new Date(theme.dateRange.end).toLocaleDateString('tr-TR')}
                  </span>
                </div>

                {theme.relatedFacetIds.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>İlgili Boyutlar: {theme.relatedFacetIds.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Multi-Context Themes */}
          {multiContextThemes.map((mcTheme) => (
            <div
              key={mcTheme.themeKey}
              className="bg-purple-50/30 border border-purple-200/80 rounded-2xl p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm font-semibold text-purple-950">{mcTheme.themeTitleTr}</h4>
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                  ÇOKLU BAĞLAM ÖRÜNTÜSÜ
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">{mcTheme.summaryTr}</p>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-200/50 text-[11px] text-purple-900">
                <span>Kapsanan Bağlamlar:</span>
                {mcTheme.contexts.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-700 font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
