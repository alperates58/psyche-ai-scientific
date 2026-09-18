'use client';

import React from 'react';
import {
  Sparkles,
  Repeat,
  Calendar,
  Layers,
  Info,
  PieChart,
  Tag,
} from 'lucide-react';
import { RepeatedThemeV1, MultiContextThemeV1, ContextFrequencyV1 } from '@/types/journal';

interface JournalRepeatedThemesPanelProps {
  contextFrequencies?: ContextFrequencyV1[];
  repeatedThemes: RepeatedThemeV1[];
  multiContextThemes: MultiContextThemeV1[];
}

export const JournalRepeatedThemesPanel: React.FC<JournalRepeatedThemesPanelProps> = ({
  contextFrequencies = [],
  repeatedThemes = [],
  multiContextThemes = [],
}) => {
  const hasContexts = contextFrequencies.length > 0;
  const hasThemes = repeatedThemes.length > 0 || multiContextThemes.length > 0;

  const getExtractionMethodBadge = (method?: string) => {
    switch (method) {
      case 'DETERMINISTIC_KEYWORD':
        return { label: 'ANAHTAR KELİME ANALİZİ', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'DETERMINISTIC_TOPIC':
        return { label: 'DETERMİNİSTİK TEMA', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'AI_ASSISTED_LABEL':
        return { label: 'AI YANSIMA ETİKETİ', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'USER_TAG_DERIVED':
        return { label: 'KULLANICI ETİKETİ', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'ÖZ-BİLDİRİM TEMA', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Informational Alert */}
      <div className="p-4 bg-brand-50/60 border border-brand-200 rounded-2xl text-xs text-text-secondary flex items-start gap-3">
        <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-text-primary">
            Bağlam Sıklığı ve Tekrarlayan Temalar Arasındaki Fark
          </p>
          <p className="leading-relaxed">
            <strong>Yaşam Alanı Sıklığı:</strong> Yansımalarınızda belirli bir alanın (örn. İş veya İlişkiler) ne sıklıkla geçtiğini gösterir. Bu tek başına bir psikolojik tema oluşturmaz.
          </p>
          <p className="leading-relaxed">
            <strong>Tekrarlayan Temalar:</strong> En az <strong>3 farklı yansıma kaydında</strong> ve en az{' '}
            <strong>2 farklı takvim gününde</strong> ortak bir psikolojik/davranışsal örüntü (örn. İş Stresi, Karar Zorluğu, Sosyal İfade) bildirdiğinizde hesaplanır.
          </p>
        </div>
      </div>

      {/* 1. SECTION: En Sık Geçen Yaşam Alanları (Context Frequency) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
            En Sık Geçen Yaşam Alanları (Bağlam Sıklığı)
          </h3>
        </div>

        {!hasContexts ? (
          <div className="p-4 bg-surface-1 border border-border-subtle rounded-2xl text-xs text-text-tertiary">
            Henüz bağlam etiketi içeren yansıma bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {contextFrequencies.map((cf) => (
              <div
                key={cf.context}
                className="bg-surface-1 border border-border-subtle hover:border-brand-200 rounded-2xl p-4 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                    <span className="text-xs font-bold text-text-primary">{cf.contextLabelTr}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-brand-600">
                    %{cf.percentage}
                  </span>
                </div>
                <div className="w-full bg-bg-subtle rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-brand-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${cf.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-tertiary pt-1">
                  <span>{cf.entryCount} Yansıma Kaydı</span>
                  <span>{cf.distinctDatesCount} Farklı Gün</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. SECTION: Tekrarlayan Gözlemler ve Temalar (Semantic Themes) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
              Tekrarlayan Gözlemler (Semantik Temalar)
            </h3>
          </div>
          <span className="text-xs text-text-tertiary font-mono">
            {repeatedThemes.length + multiContextThemes.length} Tema Tespit Edildi
          </span>
        </div>

        {!hasThemes ? (
          <div className="text-center py-12 bg-surface-1 border border-border-subtle rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-bg-subtle text-text-tertiary flex items-center justify-center mx-auto">
              <Repeat className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">
              Henüz Tekrarlayan Bir Semantik Tema Tespit Edilmedi
            </h3>
            <p className="text-xs text-text-tertiary max-w-md mx-auto leading-relaxed">
              Farklı günlerde en az 3 yansıma kaydında ortak bir konu (örneğin iş stresi, karar verme veya sosyal ifade) ele alındığında doğrulanmış tema burada listelenecektir.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Repeated Themes */}
            {repeatedThemes.map((theme) => {
              const badge = getExtractionMethodBadge(theme.extractionMethod);
              const title = theme.labelTr || theme.themeTitleTr || theme.normalizedThemeKey;
              return (
                <div
                  key={theme.themeId || theme.themeKey || theme.normalizedThemeKey}
                  className="bg-surface-1 border border-border-subtle hover:border-brand-200 rounded-2xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {theme.status}
                      </span>
                      <span className="text-[11px] text-text-tertiary font-mono">
                        {theme.entryCount} Kayıt • {theme.distinctDatesCount} Farklı Gün
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">{theme.summaryTr}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-subtle/60 text-[11px] text-text-tertiary">
                    <div className="flex flex-wrap items-center gap-3">
                      {theme.dateRange && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(theme.dateRange.start).toLocaleDateString('tr-TR')} –{' '}
                            {new Date(theme.dateRange.end).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      )}

                      {theme.contexts && theme.contexts.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          <span>Bağlamlar:</span>
                          {theme.contexts.map((c) => (
                            <span key={c} className="px-1.5 py-0.5 rounded bg-bg-subtle text-text-secondary font-medium">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {theme.relatedFacetIds && theme.relatedFacetIds.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        <span>İlgili Boyutlar: {theme.relatedFacetIds.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Multi-Context Themes */}
            {multiContextThemes.map((mcTheme) => {
              const badge = getExtractionMethodBadge(mcTheme.extractionMethod);
              return (
                <div
                  key={mcTheme.themeId || mcTheme.themeKey}
                  className="bg-purple-50/30 border border-purple-200/80 rounded-2xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <h4 className="text-sm font-semibold text-purple-950">{mcTheme.themeTitleTr}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                        ÇOKLU BAĞLAM ÖRÜNTÜSÜ
                      </span>
                      <span className="text-[11px] text-purple-700 font-mono">
                        {mcTheme.entryCount} Kayıt • {mcTheme.distinctDatesCount} Farklı Gün
                      </span>
                    </div>
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
                    {mcTheme.relatedFacetIds && mcTheme.relatedFacetIds.length > 0 && (
                      <span className="ml-auto text-purple-700">
                        İlgili Boyutlar: {mcTheme.relatedFacetIds.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
