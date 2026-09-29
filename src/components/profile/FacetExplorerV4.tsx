'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Grid,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Sparkles,
  Lock,
  Compass,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { ProfileTabNav } from './ProfileTabNav';
import { FacetInsightCardV3 } from './FacetInsightCardV3';
import { UnexploredAreasPanel } from './UnexploredAreasPanel';
import { getDomainIcon } from '@/lib/facetIcons';

interface FacetExplorerV4Props {
  profile: UnifiedPsychologicalProfileV2;
}

export const FacetExplorerV4: React.FC<FacetExplorerV4Props> = ({ profile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'MEASURED' | 'NOT_MEASURED'>('MEASURED');
  const [sortBy, setSortBy] = useState<'EXTREME' | 'ALPHA' | 'DOMAIN'>('EXTREME');

  // Filtered facets list
  const filteredFacets = useMemo(() => {
    return profile.facets.filter((facet) => {
      // Domain filter
      if (domainFilter !== 'ALL' && facet.domainId !== domainFilter) {
        return false;
      }

      // Status filter
      const isMeasured = facet.measurementStatus !== 'NOT_MEASURED' && facet.score !== null;
      if (statusFilter === 'MEASURED' && !isMeasured) return false;
      if (statusFilter === 'NOT_MEASURED' && isMeasured) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          facet.nameTr.toLowerCase().includes(q) ||
          facet.nameEn.toLowerCase().includes(q) ||
          (facet.scientificDefinitionTr && facet.scientificDefinitionTr.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [profile.facets, domainFilter, statusFilter, searchQuery]);

  // Sorted facets list
  const sortedFacets = useMemo(() => {
    const list = [...filteredFacets];
    if (sortBy === 'EXTREME') {
      return list.sort((a, b) => {
        const distA = a.score !== null ? Math.abs(a.score - 3.0) : -1;
        const distB = b.score !== null ? Math.abs(b.score - 3.0) : -1;
        return distB - distA;
      });
    }
    if (sortBy === 'ALPHA') {
      return list.sort((a, b) => a.nameTr.localeCompare(b.nameTr, 'tr'));
    }
    if (sortBy === 'DOMAIN') {
      return list.sort((a, b) => a.domainId.localeCompare(b.domainId));
    }
    return list;
  }, [filteredFacets, sortBy]);

  // Group sorted facets by domain
  const facetsGroupedByDomain = useMemo(() => {
    const map = new Map<string, FacetProfileV2[]>();
    sortedFacets.forEach((f) => {
      const arr = map.get(f.domainId) || [];
      arr.push(f);
      map.set(f.domainId, arr);
    });
    return map;
  }, [sortedFacets]);

  const measuredTotalCount = profile.facets.filter(
    (f) => f.measurementStatus !== 'NOT_MEASURED' && f.score !== null
  ).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top 6 Navigation Tabs */}
      <ProfileTabNav />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-surface-1 p-6 sm:p-8 border border-border-default shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2">
              <Grid className="w-3.5 h-3.5" />
              <span>91 Alt Boyut Kaşifi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Psikolojik Alt Boyutlar Kataloğu
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
              Master Model bünyesindeki 91 kanonik alt boyutun ampirik ölçüm sonuçları, ölçek konumları, günlük yaşam etkileri ve düşünme soruları.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-surface-2 border border-border-default text-xs font-bold text-text-primary">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{measuredTotalCount} / 91 Ölçüldü</span>
            </span>
          </div>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="pt-2 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Alt boyut veya kavram ara..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-2 border border-border-default text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Domain Filter */}
          <div className="relative">
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              aria-label="Alan Filtrele"
              className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border-default text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="ALL">Tüm Alanlar (11 Alan)</option>
              {profile.domains.map((d) => (
                <option key={d.domainId} value={d.domainId}>
                  {d.nameTr}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-2 border border-border-default text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('MEASURED')}
              className={`flex-1 py-1 px-2 rounded-lg font-semibold transition-all ${
                statusFilter === 'MEASURED'
                  ? 'bg-surface-1 text-brand-primary shadow-2xs'
                  : 'text-text-tertiary hover:text-text-primary'
              }`}
            >
              Ölçülenler ({measuredTotalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('NOT_MEASURED')}
              className={`flex-1 py-1 px-2 rounded-lg font-semibold transition-all ${
                statusFilter === 'NOT_MEASURED'
                  ? 'bg-surface-1 text-brand-primary shadow-2xs'
                  : 'text-text-tertiary hover:text-text-primary'
              }`}
            >
              Ölçülmeyenler
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`flex-1 py-1 px-2 rounded-lg font-semibold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-surface-1 text-brand-primary shadow-2xs'
                  : 'text-text-tertiary hover:text-text-primary'
              }`}
            >
              Tümü (91)
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sıralama Ölçütü"
              className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border-default text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="EXTREME">En Belirgin Konum (Uç Noktalar)</option>
              <option value="ALPHA">Alfabetik Sıralama (A-Z)</option>
              <option value="DOMAIN">Psikolojik Alana Göre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Results Container: Grouped by Domain */}
      {sortedFacets.length === 0 ? (
        <div className="p-12 rounded-3xl bg-surface-1 border border-border-default text-center space-y-3">
          <Grid className="w-8 h-8 text-text-tertiary mx-auto" />
          <h3 className="text-base font-bold text-text-primary">Eşleşen Alt Boyut Bulunamadı</h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            Arama filtrenize uygun alt boyut bulunmuyor. Filtreleri sıfırlayarak tüm kataloğu inceleyebilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setDomainFilter('ALL');
              setStatusFilter('MEASURED');
            }}
            className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-xs hover:bg-brand-primary/90"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(facetsGroupedByDomain.entries()).map(([domainId, facets]) => {
            const domain = profile.domains.find((d) => d.domainId === domainId);
            const DomainIcon = getDomainIcon(domainId);

            return (
              <section key={domainId} className="space-y-4">
                {/* Domain Section Header */}
                <div className="flex items-center justify-between border-b border-border-default pb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: domain?.color || '#5753C8' }}
                    >
                      <DomainIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-text-primary">
                        {domain?.nameTr || domainId}
                      </h2>
                      <span className="text-[11px] text-text-tertiary">
                        {facets.length} Alt Boyut Gösteriliyor
                      </span>
                    </div>
                  </div>
                </div>

                {/* Facet Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facets.map((facet) => (
                    <FacetInsightCardV3
                      key={facet.facetId}
                      facet={facet}
                      allFacets={profile.facets}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Separate Section: Henüz Keşfetmediğin Alanlar (Only compact unlock cards) */}
      <section className="pt-4 border-t border-border-default">
        <UnexploredAreasPanel profile={profile} />
      </section>
    </div>
  );
};
