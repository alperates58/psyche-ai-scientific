'use client';

import React from 'react';
import { DomainProfileV2 } from '@/types/unifiedProfileV2';
import {
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ProfileDomainMapV2Props {
  domains: DomainProfileV2[];
  selectedDomainId: string | null;
  onSelectDomain: (domainId: string) => void;
}

export const ProfileDomainMapV2: React.FC<ProfileDomainMapV2Props> = ({
  domains,
  selectedDomainId,
  onSelectDomain,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            11 Psikolojik Alan Haritası
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Master Psikolojik Model kapsamında tanımlanan 11 temel alanın ölçüm durumu.
          </p>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500">
          Detayları görmek için bir alana tıklayın
        </div>
      </div>

      {/* Grid of 11 Domains */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {domains.map((domain) => {
          const isSelected = selectedDomainId === domain.domainId;
          const isMeasured = domain.measuredFacetCount > 0;
          const isFull = domain.measuredFacetCount === domain.facetCount && domain.facetCount > 0;

          return (
            <button
              key={domain.domainId}
              type="button"
              onClick={() => onSelectDomain(domain.domainId)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-sm ring-1 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Alan {domain.sortOrder}
                  </span>
                  {isFull ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      Tamamlandı
                    </span>
                  ) : isMeasured ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3" />
                      Kısmi Ölçüm
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      Henüz Ölçülmedi
                    </span>
                  )}
                </div>

                {/* Domain Title */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                  {domain.nameTr}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {domain.descriptionTr}
                </p>
              </div>

              {/* Footer Progress & Counts */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-400" />
                    {domain.measuredConstructCount}/{domain.constructCount} Boyut
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {domain.measuredFacetCount}/{domain.facetCount} Alt Boyut (%{domain.coveragePercentage})
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull
                        ? 'bg-emerald-500'
                        : isMeasured
                        ? 'bg-amber-500'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    style={{ width: `${domain.coveragePercentage}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
