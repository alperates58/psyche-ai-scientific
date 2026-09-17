'use client';

import React, { useState, useMemo } from 'react';
import { FacetProfileV2, DomainProfileV2 } from '@/types/unifiedProfileV2';
import {
  Brain,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

interface FacetExplorerV2Props {
  facets: FacetProfileV2[];
  domains: DomainProfileV2[];
}

export const FacetExplorerV2: React.FC<FacetExplorerV2Props> = ({
  facets,
  domains,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'MEASURED' | 'NOT_MEASURED'>('ALL');
  const [expandedFacetId, setExpandedFacetId] = useState<string | null>(null);

  const toggleFacet = (facetId: string) => {
    setExpandedFacetId((prev) => (prev === facetId ? null : facetId));
  };

  const filteredFacets = useMemo(() => {
    return facets.filter((facet) => {
      // Domain filter
      if (selectedDomainFilter !== 'ALL' && facet.domainId !== selectedDomainFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'MEASURED' && facet.measurementStatus !== 'MEASURED_PRECALIBRATION') {
        return false;
      }
      if (statusFilter === 'NOT_MEASURED' && facet.measurementStatus === 'MEASURED_PRECALIBRATION') {
        return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = facet.nameTr.toLowerCase().includes(q) || facet.nameEn.toLowerCase().includes(q);
        const matchesCode = facet.code.toLowerCase().includes(q);
        const matchesDef = facet.scientificDefinitionTr?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesCode && !matchesDef) {
          return false;
        }
      }

      return true;
    });
  }, [facets, selectedDomainFilter, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            91 Alt Boyut Gezgini
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Master modeldeki 91 bilimsel alt boyutun ölçüm puanları ve detayları.
          </p>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Gösterilen: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredFacets.length}</span> / 91 Alt Boyut
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Alt boyut adı, açıklama veya kod ara..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Domain Dropdown */}
          <select
            value={selectedDomainFilter}
            onChange={(e) => setSelectedDomainFilter(e.target.value)}
            aria-label="Alan Filtrele"
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">Tüm Alanlar (11 Alan)</option>
            {domains.map((d) => (
              <option key={d.domainId} value={d.domainId}>
                {d.nameTr}
              </option>
            ))}
          </select>

          {/* Status Segment */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tümü
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('MEASURED')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'MEASURED'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Ölçülenler
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('NOT_MEASURED')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'NOT_MEASURED'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Ölçülmeyenler
            </button>
          </div>
        </div>
      </div>

      {/* Facet Cards List (Progressive Disclosure) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredFacets.map((facet) => {
          const isExpanded = expandedFacetId === facet.facetId;
          const isMeasured = facet.measurementStatus === 'MEASURED_PRECALIBRATION' && facet.score !== null;

          return (
            <div
              key={facet.facetId}
              className={`rounded-xl border transition-all p-4 ${
                isMeasured
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-2xs'
                  : 'bg-slate-50/40 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800/60 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {facet.code}
                    </span>
                    {isMeasured && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Ölçüldü ({facet.itemCountAnswered}/{facet.itemCountExpected})
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {facet.nameTr}
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {facet.nameEn}
                  </div>
                </div>

                {/* Score or Not Measured Badge */}
                {isMeasured && facet.score !== null ? (
                  <div className="text-right">
                    <div className="text-base font-extrabold text-indigo-700 dark:text-indigo-300">
                      {facet.score.toFixed(2)}
                      <span className="text-[10px] font-normal text-slate-400 ml-0.5">/5.00</span>
                    </div>
                    <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {facet.bandInfo?.shortLabelTr || 'Skor'}
                    </div>
                  </div>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                    Ölçülmedi
                  </span>
                )}
              </div>

              {/* Toggle Definition Button */}
              <button
                type="button"
                onClick={() => toggleFacet(facet.facetId)}
                className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800"
              >
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Bilimsel Tanım & Epistemik Detay
                </span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* Collapsible Scientific Details */}
              {isExpanded && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 text-xs">
                  {facet.scientificDefinitionTr && (
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Tanım:{' '}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {facet.scientificDefinitionTr}
                      </span>
                    </div>
                  )}

                  {/* Epistemic Confidence Breakdown */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-[11px]">
                      <div className="text-slate-400 dark:text-slate-500">Kapsam Seviyesi</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {facet.confidenceComponents.coverage}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-[11px]">
                      <div className="text-slate-400 dark:text-slate-500">Yanıt Kalitesi</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {facet.confidenceComponents.responseQuality}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Durum: {facet.epistemicStatus} | Norm Durumu: {facet.confidenceComponents.calibrationStatus}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredFacets.length === 0 && (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Aramanıza uygun alt boyut bulunamadı.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Filtreleri sıfırlayarak tüm 91 alt boyutu görüntüleyebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
};
