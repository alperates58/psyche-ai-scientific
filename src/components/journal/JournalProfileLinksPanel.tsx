'use client';

import React from 'react';
import {
  Compass,
  ArrowRight,
  GitFork,
  CheckCircle2,
  HelpCircle,
  Info,
} from 'lucide-react';
import { JournalObservationSummaryV1 } from '@/types/journal';

interface JournalProfileLinksPanelProps {
  summary: JournalObservationSummaryV1 | null;
}

export const JournalProfileLinksPanel: React.FC<JournalProfileLinksPanelProps> = ({ summary }) => {
  if (!summary) {
    return (
      <div className="text-center py-12 bg-surface-1 border border-border-subtle rounded-2xl p-6 text-xs text-text-tertiary">
        Gözlem verileri yükleniyor...
      </div>
    );
  }

  const { contextualVariations, profileAlignedThemes, unmeasuredRelevantAreas } = summary;
  const hasLinks =
    contextualVariations.length > 0 ||
    profileAlignedThemes.length > 0 ||
    unmeasuredRelevantAreas.length > 0;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-brand-50/60 border border-brand-200 rounded-2xl text-xs text-text-secondary flex items-start gap-3">
        <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-text-primary">
            Yansımalar ve Psikometrik Profil İlişkisi
          </p>
          <p className="leading-relaxed">
            Günlük yansımalarınızdaki öz-bildirimler, psikometrik puanlarınızı değiştirmez. Ancak
            genel kişilik profiliniz ile belirli bağlamlardaki (örneğin iş veya ilişkiler) yaşantınız
            arasındaki paralellikleri ve bağlamsal farklılaşmaları görmenizi sağlar.
          </p>
        </div>
      </div>

      {!hasLinks ? (
        <div className="text-center py-12 bg-surface-1 border border-border-subtle rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-bg-subtle text-text-tertiary flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary">
            Henüz Profil Bağlantısı Tespit Edilmedi
          </h3>
          <p className="text-xs text-text-tertiary max-w-md mx-auto leading-relaxed">
            Yansımalar yazdıkça ve değerlendirme modüllerini tamamladıkça, öz-bildirimleriniz ile
            ölçülen boyutlar arasındaki ilişkiler burada görüntülenecektir.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Contextual Variations Section */}
          {contextualVariations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 uppercase tracking-wider">
                <GitFork className="w-4 h-4 text-amber-600" />
                <span>Gözlenen Bağlamsal Farklılaşmalar</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {contextualVariations.map((cv, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-50/40 border border-amber-200 rounded-2xl p-5 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-900">
                          {cv.facetNameTr}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-medium">
                          {cv.context} Bağlamı
                        </span>
                      </div>
                      <span className="text-xs font-mono text-amber-800">
                        Ölçülen Puan: {cv.measuredScore.toFixed(2)}/5.00
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{cv.narrativeTr}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Aligned Themes */}
          {profileAlignedThemes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ölçümle Örtüşen ve Paralel Alanlar</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profileAlignedThemes.map((pat, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-1 border border-border-subtle hover:border-emerald-300 rounded-2xl p-4 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-text-primary">{pat.facetNameTr}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                        ÖLÇÜMLE PARALEL
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{pat.summaryTr}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unmeasured Relevant Areas */}
          {unmeasuredRelevantAreas.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-text-tertiary" />
                <span>Yansımalarda Geçen Ancak Henüz Ölçülmemiş Alanlar</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {unmeasuredRelevantAreas.map((ura, idx) => (
                  <div
                    key={idx}
                    className="bg-bg-subtle/60 border border-border-subtle rounded-2xl p-4 space-y-1.5"
                  >
                    <h4 className="text-xs font-semibold text-text-primary">{ura.areaNameTr}</h4>
                    <p className="text-[11px] text-text-tertiary">
                      {ura.context} bağlamında {ura.entryCount} kayıtta bahsedildi. Henüz doğrudan bir
                      test modülü tamamlanmadı.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
