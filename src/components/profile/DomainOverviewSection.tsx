'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, CheckCircle2, AlertCircle, Circle } from 'lucide-react';
import { UnifiedDomainViewModel } from '@/types/profile';

interface DomainOverviewSectionProps {
  domains: UnifiedDomainViewModel[];
}

export const DomainOverviewSection: React.FC<DomainOverviewSectionProps> = ({ domains }) => {
  const [expandedDomainId, setExpandedDomainId] = useState<string | null>(null);

  const toggleDomain = (domainId: string) => {
    setExpandedDomainId(expandedDomainId === domainId ? null : domainId);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-text-primary">
          Psikolojik Alanlar ve Kapsam
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          Ontolojideki 9 temel alanın ölçüm durumu, tamamlanan alt boyutları ve betimsel puanları.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((domain) => {
          const isExpanded = expandedDomainId === domain.domainId;

          const getStatusBadge = () => {
            if (domain.status === 'MEASURED') {
              return (
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Ölçüldü</span>
                </span>
              );
            }
            if (domain.status === 'PARTIAL') {
              return (
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span>Kısmen Ölçüldü</span>
                </span>
              );
            }
            return (
              <span className="inline-flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-text-tertiary border border-border-subtle">
                <Circle className="w-2.5 h-2.5" />
                <span>Ölçülmedi</span>
              </span>
            );
          };

          return (
            <div
              key={domain.domainId}
              className={`bg-surface-1 rounded-panel border transition-all duration-150 flex flex-col justify-between shadow-xs ${
                domain.status === 'MEASURED'
                  ? 'border-emerald-200/70'
                  : domain.status === 'PARTIAL'
                  ? 'border-amber-200/70'
                  : 'border-border-subtle'
              }`}
            >
              <div className="p-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-text-primary">
                      {domain.nameTr}
                    </h3>
                    <p className="text-[11px] text-text-tertiary font-mono">
                      {domain.code}
                    </p>
                  </div>
                  {getStatusBadge()}
                </div>

                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {domain.descriptionTr}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-text-tertiary">
                    <span>Ölçülen Alt Boyut</span>
                    <span className="font-semibold text-text-primary">
                      {domain.measuredFacetCount} / {domain.totalFacetCount} (%{domain.coveragePercentage})
                    </span>
                  </div>
                  <div className="w-full bg-bg-subtle h-1.5 rounded-full overflow-hidden border border-border-subtle">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        domain.status === 'MEASURED'
                          ? 'bg-emerald-600'
                          : domain.status === 'PARTIAL'
                          ? 'bg-amber-600'
                          : 'bg-surface-2'
                      }`}
                      style={{ width: `${domain.coveragePercentage}%` }}
                    />
                  </div>
                </div>

                {/* Domain Score if available */}
                {domain.compositeScore !== null && (
                  <div className="p-2 rounded-xl bg-surface-2 border border-border-subtle flex items-center justify-between text-xs">
                    <span className="text-text-tertiary">Bileşik Alan Puanı:</span>
                    <span className="font-mono font-bold text-brand-700 text-sm">
                      {domain.compositeScore.toFixed(2)} / 5.0
                    </span>
                  </div>
                )}
              </div>

              {/* Expandable Drilldown Toggle */}
              {domain.measuredConstructCount > 0 && (
                <div className="border-t border-border-subtle px-5 py-2.5 bg-surface-2/30">
                  <button
                    type="button"
                    onClick={() => toggleDomain(domain.domainId)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors py-1"
                  >
                    <span>
                      {isExpanded ? 'Detayları Gizle' : `Ölçülen Boyutları İncele (${domain.measuredConstructCount})`}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </button>

                  {/* Expanded Constructs & Facets */}
                  {isExpanded && (
                    <div className="mt-3 space-y-2.5 pb-2 text-xs">
                      {domain.constructs
                        .filter((c) => c.isMeasured)
                        .map((c) => (
                          <div
                            key={c.constructId}
                            className="p-3 rounded-xl bg-surface-1 border border-border-subtle space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-text-primary">
                                {c.nameTr}
                              </span>
                              <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/50">
                                {c.compositeScore !== null ? c.compositeScore.toFixed(2) : '—'} /{' '}
                                {c.scale?.scaleMax.toFixed(1) || '5.0'}
                              </span>
                            </div>

                            {c.interpretation && (
                              <p className="text-[11px] text-text-secondary leading-relaxed">
                                {c.interpretation.textTr}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {c.facets
                                .filter((f) => f.isMeasured)
                                .map((f) => (
                                  <span
                                    key={f.facetId}
                                    className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-md bg-surface-2 text-text-secondary border border-border-subtle"
                                  >
                                    <span>{f.nameTr}: </span>
                                    <strong className="ml-1 font-mono font-bold text-text-primary">
                                      {f.rawMean !== null ? f.rawMean.toFixed(1) : '—'}
                                    </strong>
                                  </span>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
