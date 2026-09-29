'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { UnifiedPsychologicalProfileV2, DomainProfileV2 } from '@/types/unifiedProfileV2';
import { getDomainIcon } from '@/lib/facetIcons';

interface UnexploredAreasPanelProps {
  profile: UnifiedPsychologicalProfileV2;
}

// Module unlocks and metadata mapping for unexplored domains
const DOMAIN_UNLOCK_MAP: Record<string, { assessmentTitleTr: string; estimatedDurationTr: string; url: string; whatItExploresTr: string }> = {
  social_relational: {
    assessmentTitleTr: 'Kişilerarası Dinamikler & Bağlanma Ölçeği',
    estimatedDurationTr: '6–8 dk',
    url: '/assessment?module=social_relational_native_v1',
    whatItExploresTr: 'Yetişkin bağlanma tarzları, çok boyutlu empati ve ilişkisel sınır dinamikleri.',
  },
  motivation_values: {
    assessmentTitleTr: 'Temel İhtiyaçlar ve Yaşam Amaçları',
    estimatedDurationTr: '5–7 dk',
    url: '/assessment?module=motivation_values_native_v1',
    whatItExploresTr: 'Öz-belirleme (özerklik, yetkinlik, ilişkisellik) ve Schwartz evrensel değer öncelikleri.',
  },
  coping_resilience: {
    assessmentTitleTr: 'Başa Çıkma & Psikolojik Dayanıklılık',
    estimatedDurationTr: '6–8 dk',
    url: '/assessment?module=coping_resilience_native_v1',
    whatItExploresTr: 'Sıkıntı toleransı, stresten hızlı toparlanma ve kriz anı başa çıkma stilleri.',
  },
  wellbeing_vitality: {
    assessmentTitleTr: 'İyi Oluş & Öznel Canlılık Ölçeği',
    estimatedDurationTr: '4–6 dk',
    url: '/assessment?module=wellbeing_vitality_native_v1',
    whatItExploresTr: 'Psikolojik gelişmişlik, yaşam tatmini ve günlük içsel canlılık düzeyi.',
  },
  cognition_decision: {
    assessmentTitleTr: 'Bilişsel Tarz & Karar Verme Envanteri',
    estimatedDurationTr: '5–7 dk',
    url: '/assessment?module=cognition_decision_native_v1',
    whatItExploresTr: 'Analitik düşünme, belirsizliğe tahammül ve karar alma tempo stratejileri.',
  },
  creativity_curiosity: {
    assessmentTitleTr: 'Yaratıcılık & Merak Envanteri',
    estimatedDurationTr: '4–6 dk',
    url: '/assessment?module=creativity_curiosity_native_v1',
    whatItExploresTr: 'Epistemik merak, estetik duyarlık ve sıra dışı problem çözme yaklaşımları.',
  },
  optional_dark_tetrad: {
    assessmentTitleTr: 'Kişilerarası Stratejik Eğilimler (Araştırma)',
    estimatedDurationTr: '5–7 dk',
    url: '/assessment?module=dark_tetrad_native_v1',
    whatItExploresTr: 'Kişilerarası güç, stratejik pragmatizm ve rekabet dinamikleri.',
  },
};

export const UnexploredAreasPanel: React.FC<UnexploredAreasPanelProps> = ({ profile }) => {
  const unmeasuredDomains = profile.domains.filter((d) => d.measuredFacetCount === 0);

  if (unmeasuredDomains.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Compass className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Henüz Keşfetmediğin Alanlar
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Eksik gri kartlar yerine, profilini daha bütüncül kılacak yeni keşif fırsatları.
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span>{unmeasuredDomains.length} Alan Keşfedilmeyi Bekliyor</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {unmeasuredDomains.map((domain) => {
          const unlockInfo = DOMAIN_UNLOCK_MAP[domain.domainId] || {
            assessmentTitleTr: `${domain.nameTr} Değerlendirmesi`,
            estimatedDurationTr: '5–7 dk',
            url: profile.nextBestAssessment?.url || '/assessment',
            whatItExploresTr: domain.descriptionTr,
          };
          const DomainIcon = getDomainIcon(domain.domainId);

          return (
            <div
              key={domain.domainId}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-2xs">
                    <DomainIcon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{unlockInfo.estimatedDurationTr}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {domain.nameTr}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {unlockInfo.whatItExploresTr}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 truncate max-w-[170px]">
                  {unlockInfo.assessmentTitleTr}
                </span>
                <Link
                  href={unlockInfo.url}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-2xs transition-all shrink-0"
                >
                  <span>Başla</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
