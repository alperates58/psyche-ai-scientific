'use client';

import React from 'react';
import { DomainProfileV2 } from '@/types/unifiedProfileV2';
import { getDomainIcon } from '@/lib/facetIcons';
import { CheckCircle2, Clock, HelpCircle, Layers, ChevronRight, Sparkles } from 'lucide-react';

interface DomainWheelProps {
  domains: DomainProfileV2[];
  selectedDomainId: string | null;
  onSelectDomain: (domainId: string) => void;
}

export const DomainWheel: React.FC<DomainWheelProps> = ({
  domains,
  selectedDomainId,
  onSelectDomain,
}) => {
  return (
    <div className="bg-surface-1 p-6 sm:p-8 rounded-3xl border border-border-default shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-brand-primary" />
            <h3 className="text-base sm:text-lg font-bold text-text-primary">
              11 Alan Keşif Haritası
            </h3>
          </div>
          <p className="text-xs text-text-secondary">
            Bütünsel psikolojik modeldeki 11 temel araştırma alanınız. Tıklayarak o alanın alt boyutlarını ve kuramsal anlamını inceleyin.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-text-tertiary">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Keşfedildi
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Kısmen Keşfedildi
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            Henüz Keşfedilmedi
          </span>
        </div>
      </div>

      {/* 11 Domains Grid (Non-ranking, exploratory layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {domains.map((domain) => {
          const Icon = getDomainIcon(domain.domainId);
          const isSelected = selectedDomainId === domain.domainId;
          const ratio = domain.coverageRatio;

          let stateColor = 'border-border-subtle bg-bg-subtle/50 text-text-tertiary';
          let stateBadge = (
            <span className="inline-flex items-center text-[10px] text-text-tertiary bg-surface-2 px-2 py-0.5 rounded-md">
              Henüz Başlanmadı
            </span>
          );

          if (ratio >= 0.8) {
            stateColor = 'border-emerald-200 bg-emerald-50/30 text-emerald-950';
            stateBadge = (
              <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Tamamlandı
              </span>
            );
          } else if (ratio > 0) {
            stateColor = 'border-amber-200 bg-amber-50/30 text-amber-950';
            stateBadge = (
              <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Clock className="w-3 h-3 mr-1" />
                %{Math.round(ratio * 100)} Keşfedildi
              </span>
            );
          }

          return (
            <button
              key={domain.domainId}
              type="button"
              onClick={() => onSelectDomain(domain.domainId)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 hover:scale-[1.01] active:scale-[0.99] ${stateColor} ${
                isSelected
                  ? 'ring-2 ring-brand-primary border-brand-primary shadow-sm bg-surface-1'
                  : 'hover:bg-surface-1 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      ratio > 0
                        ? 'bg-brand-primary/10 text-brand-primary'
                        : 'bg-surface-2 text-text-tertiary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-text-primary truncate">
                      {domain.nameTr}
                    </h4>
                    <span className="text-[10px] text-text-tertiary truncate block">
                      {domain.constructs.length} Yapı • {domain.totalFacetCount} Alt Boyut
                    </span>
                  </div>
                </div>

                <div className="shrink-0">{stateBadge}</div>
              </div>

              <div className="w-full space-y-1.5 pt-1">
                {/* Progress mini bar */}
                <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ratio >= 0.8
                        ? 'bg-emerald-500'
                        : ratio > 0
                        ? 'bg-amber-500'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${Math.max(4, Math.round(ratio * 100))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-text-tertiary pt-0.5">
                  <span>{domain.measuredFacetCount} / {domain.totalFacetCount} Boyut Ölçüldü</span>
                  <span className="font-semibold text-brand-primary flex items-center">
                    İncele <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-[11px] text-text-tertiary flex items-center gap-1.5 pt-1 border-t border-border-subtle">
        <Sparkles className="w-3.5 h-3.5 text-brand-primary shrink-0" />
        <span>
          Bu harita alanları başarı veya sıralama açısından değerlendirmez; çok boyutlu benliğinizin keşif derinliğini temsil eder.
        </span>
      </div>
    </div>
  );
};
