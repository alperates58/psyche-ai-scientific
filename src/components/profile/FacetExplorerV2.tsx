'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { FacetProfileV2, DomainProfileV2 } from '@/types/unifiedProfileV2';
import { getFacetIcon } from '@/lib/facetIcons';
import { resolveConsumerScalePosition, SCALE_POSITION_EXPLANATION_NOTE } from '@/lib/consumerLanguage';
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
  Sparkles,
  Info,
  ArrowRight,
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
  const [scientificDetailFacetId, setScientificDetailFacetId] = useState<string | null>(null);

  const toggleFacet = (facetId: string) => {
    setExpandedFacetId((prev) => (prev === facetId ? null : facetId));
  };

  const toggleScientificDetail = (facetId: string) => {
    setScientificDetailFacetId((prev) => (prev === facetId ? null : facetId));
  };

  const filteredFacets = useMemo(() => {
    return facets.filter((facet) => {
      // Domain filter
      if (selectedDomainFilter !== 'ALL' && facet.domainId !== selectedDomainFilter) {
        return false;
      }

      // Status filter
      const isMeasured = facet.measurementStatus === 'MEASURED_PRECALIBRATION' && facet.score !== null;
      if (statusFilter === 'MEASURED' && !isMeasured) {
        return false;
      }
      if (statusFilter === 'NOT_MEASURED' && isMeasured) {
        return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = facet.nameTr.toLowerCase().includes(q) || facet.nameEn.toLowerCase().includes(q);
        const matchesDef = facet.scientificDefinitionTr?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesDef) {
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
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-brand-primary" />
            <h3 className="text-base sm:text-lg font-bold text-text-primary">
              91 Alt Boyut Keşif Gezgini
            </h3>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            11 psikolojik alanın altındaki 91 boyutun anlamı, ölçek konumu ve günlük yaşamdaki yansımaları.
          </p>
        </div>
        <div className="text-xs text-text-tertiary font-medium">
          Gösterilen: <span className="text-brand-primary font-bold">{filteredFacets.length}</span> / 91 Alt Boyut
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-surface-1 border border-border-default shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Alt boyut adı veya açıklama ara..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-bg-subtle border border-border-default text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>

          {/* Domain Dropdown */}
          <select
            value={selectedDomainFilter}
            onChange={(e) => setSelectedDomainFilter(e.target.value)}
            aria-label="Alan Filtrele"
            className="px-3 py-2 rounded-xl text-xs bg-bg-subtle border border-border-default text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="ALL">Tüm Alanlar (11 Alan)</option>
            {domains.map((d) => (
              <option key={d.domainId} value={d.domainId}>
                {d.nameTr}
              </option>
            ))}
          </select>

          {/* Status Segment */}
          <div className="flex rounded-xl bg-bg-subtle p-1 text-xs border border-border-default shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-surface-1 text-text-primary shadow-xs font-bold'
                  : 'text-text-tertiary hover:text-text-primary'
              }`}
            >
              Tümü
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('MEASURED')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'MEASURED'
                  ? 'bg-surface-1 text-text-primary shadow-xs font-bold'
                  : 'text-text-tertiary hover:text-text-primary'
              }`}
            >
              Ölçülenler
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('NOT_MEASURED')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'NOT_MEASURED'
                  ? 'bg-surface-1 text-text-primary shadow-xs font-bold'
                  : 'text-text-tertiary hover:text-text-primary'
              }`}
            >
              Keşfedilmeyenler
            </button>
          </div>
        </div>
      </div>

      {/* Facet Cards List (3-Layer Progressive Disclosure) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFacets.map((facet) => {
          const isExpanded = expandedFacetId === facet.facetId;
          const showSciDetail = scientificDetailFacetId === facet.facetId;
          const isMeasured = facet.measurementStatus === 'MEASURED_PRECALIBRATION' && facet.score !== null;
          const Icon = getFacetIcon(facet.code, facet.domainId);
          const scalePos = resolveConsumerScalePosition(facet.score);

          return (
            <div
              key={facet.facetId}
              className={`rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between space-y-4 ${
                isMeasured
                  ? 'bg-surface-1 border-border-default shadow-xs'
                  : 'bg-bg-subtle/60 border-border-subtle opacity-85'
              }`}
            >
              {/* Layer 1: Glance / Headline Card */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isMeasured
                          ? 'bg-brand-primary/10 text-brand-primary'
                          : 'bg-surface-2 text-text-tertiary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                        {domains.find((d) => d.domainId === facet.domainId)?.nameTr || facet.domainId}
                      </div>
                      <h4 className="text-sm font-bold text-text-primary leading-tight">
                        {facet.nameTr}
                      </h4>
                    </div>
                  </div>

                  {/* Score or Scale Position */}
                  {isMeasured && facet.score !== null ? (
                    <div className="text-right shrink-0">
                      <div className="text-base font-extrabold text-brand-primary">
                        {facet.score.toFixed(2)}
                        <span className="text-[10px] font-normal text-text-tertiary ml-0.5">/ 5</span>
                      </div>
                      <span className="inline-block text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {scalePos.labelTr}
                      </span>
                    </div>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-surface-2 text-text-tertiary shrink-0">
                      Henüz Keşfedilmedi
                    </span>
                  )}
                </div>

                {/* Short Consumer Interpretation */}
                <p className="text-xs text-text-secondary leading-relaxed">
                  {facet.scientificDefinitionTr ||
                    `${facet.nameTr}, bu alandaki bireysel eğilimlerinizi ve davranış tercihlerinizdeki yönelimi ifade eder.`}
                </p>
              </div>

              {/* Action / Expand Section */}
              <div className="pt-2 border-t border-border-subtle space-y-3">
                {isMeasured ? (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => toggleFacet(facet.facetId)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-brand-primary hover:underline py-1"
                    >
                      <span>Günlük Yaşam Yansımaları & Anlamı</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Layer 2: Deep Consumer Reflection */}
                    {isExpanded && (
                      <div className="p-4 rounded-xl bg-bg-subtle border border-border-subtle space-y-3 text-xs text-text-secondary animate-in fade-in duration-200">
                        <div>
                          <div className="font-bold text-text-primary mb-1">Bu ne anlama geliyor?</div>
                          <p className="leading-relaxed">
                            Ölçüm ölçeğinde {scalePos.labelTr.toLowerCase()} konumdasınız ({facet.score?.toFixed(2)} / 5).
                            Bu durum, ilgili durumlarda kendiliğinden ortaya çıkan doğal eğilimlerinizi yansıtır.
                          </p>
                        </div>

                        <div>
                          <div className="font-bold text-text-primary mb-1">Hangi koşullarda işinize yarayabilir?</div>
                          <p className="leading-relaxed">
                            Bu özelliğinizi güçlü bir kaynak olarak kullanarak problem çözme, sosyal iletişim veya hedeflere odaklanma süreçlerinde denge sağlayabilirsiniz.
                          </p>
                        </div>

                        <div>
                          <div className="font-bold text-text-primary mb-1">Daha fazla dikkat gerektirebilecek durumlar:</div>
                          <p className="leading-relaxed">
                            Aşırı stres veya yorgunluk anlarında bu eğilim tek taraflı baskın hale gelebilir; dengeyi korumak farkındalık gerektirir.
                          </p>
                        </div>

                        <div className="pt-2 border-t border-border-subtle/80 text-[11px] text-text-tertiary">
                          <p>{SCALE_POSITION_EXPLANATION_NOTE}</p>
                        </div>
                      </div>
                    )}

                    {/* Layer 3: Scientific Detail Toggle */}
                    <div className="flex items-center justify-between text-[11px] text-text-tertiary pt-1">
                      <button
                        type="button"
                        onClick={() => toggleScientificDetail(facet.facetId)}
                        className="hover:text-text-primary underline flex items-center gap-1"
                      >
                        <Info className="w-3 h-3 text-brand-primary" />
                        <span>Bilimsel Detay</span>
                      </button>

                      <span className="font-mono text-[10px]">
                        {facet.itemCountAnswered || 0} Madde Yanıtlandı
                      </span>
                    </div>

                    {showSciDetail && (
                      <div className="p-3 rounded-lg bg-surface-2/60 border border-border-subtle text-[11px] space-y-1.5 font-mono text-text-secondary animate-in fade-in duration-150">
                        <div>Ölçüm Durumu: Ölçüldü (Ön Kalibrasyon)</div>
                        <div>Ölçek: 1.00 – 5.00</div>
                        <div>Norm Durumu: Toplum normlarıyla karşılaştırma henüz sunulmuyor.</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-text-tertiary flex items-center justify-between">
                    <span>Bu alanı keşfetmek için ilgili değerlendirmeyi tamamlayabilirsiniz.</span>
                    <Link
                      href="/assessments"
                      className="text-brand-primary font-bold hover:underline shrink-0 ml-2"
                    >
                      Başla &rsaquo;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredFacets.length === 0 && (
        <div className="text-center py-12 bg-surface-1 rounded-2xl border border-border-default space-y-2">
          <HelpCircle className="w-8 h-8 text-text-tertiary mx-auto" />
          <p className="text-sm font-semibold text-text-primary">
            Aramanıza uygun alt boyut bulunamadı.
          </p>
          <p className="text-xs text-text-secondary">
            Filtreleri sıfırlayarak tüm 91 alt boyutu görüntüleyebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
};
