'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { LongitudinalProfileV1, FacetTrajectory } from '@/types/longitudinal';
import { MASTER_DOMAINS, MASTER_CONSTRUCTS } from '@/lib/profile/masterModelConstants';
import { LongitudinalReadinessBanner } from './LongitudinalReadinessBanner';
import { StableFacetsSection } from './StableFacetsSection';
import { ShiftedFacetsSection } from './ShiftedFacetsSection';
import { CoverageGrowthSection } from './CoverageGrowthSection';
import { EpochsTimelineSection } from './EpochsTimelineSection';
import { ContextualShiftsSection } from './ContextualShiftsSection';
import { AdminScienceDrawer } from './AdminScienceDrawer';
import { FacetTrajectoryChart } from './FacetTrajectoryChart';
import {
  Calendar,
  Filter,
  Layers,
  ArrowRight,
  RotateCcw,
  Search,
  Activity,
  Anchor,
  Compass,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface ProfileTimelineClientProps {
  longitudinalProfile: LongitudinalProfileV1;
}

export function ProfileTimelineClient({ longitudinalProfile }: ProfileTimelineClientProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedFacetId, setSelectedFacetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'STABLE' | 'SHIFTED' | 'TRAJECTORIES'>('ALL');

  const {
    userId,
    measurementEpochs,
    facetTrajectories,
    domainCoverageTimeline,
    responseQualityTimeline,
    contextualObservations,
    stabilitySummary,
    changeSummary,
    longitudinalReadiness,
  } = longitudinalProfile;

  // Filter trajectories based on domain and search query
  const filteredTrajectories = useMemo(() => {
    return facetTrajectories.filter((ft) => {
      if (selectedDomain !== 'ALL' && ft.domainId !== selectedDomain) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return ft.nameTr.toLowerCase().includes(q) || ft.code.toLowerCase().includes(q);
      }
      return true;
    });
  }, [facetTrajectories, selectedDomain, searchQuery]);

  const repeatedFilteredTrajectories = useMemo(() => {
    return filteredTrajectories.filter((ft) => ft.isRepeatMeasured);
  }, [filteredTrajectories]);

  const activeSelectedTrajectory = useMemo(() => {
    if (!selectedFacetId) {
      return repeatedFilteredTrajectories[0] || filteredTrajectories[0] || null;
    }
    return facetTrajectories.find((ft) => ft.facetId === selectedFacetId) || null;
  }, [selectedFacetId, repeatedFilteredTrajectories, filteredTrajectories, facetTrajectories]);

  return (
    <div className="space-y-8">
      {/* 1. Readiness & Epistemic Banner */}
      <LongitudinalReadinessBanner readiness={longitudinalReadiness} />

      {/* 2. Quick Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tüm Zaman Çizgisi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('STABLE')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'STABLE'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Stabil Alanlar ({stabilitySummary.stableFacetsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SHIFTED')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'SHIFTED'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Değişim Gösterenler ({changeSummary.shiftedFacetsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TRAJECTORIES')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'TRAJECTORIES'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Boyut Seyir Grafikleri ({repeatedFilteredTrajectories.length})
          </button>
        </div>

        <Link
          href="/assessments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Değerlendirmeyi Tekrarla / Yeni Modül</span>
        </Link>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'ALL' && (
        <div className="space-y-8">
          {/* Section 1: Measurement Epochs */}
          <EpochsTimelineSection epochs={measurementEpochs} />

          {/* Section 2 & 3: Stable and Shifted Facets */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <StableFacetsSection
              stabilitySummary={stabilitySummary}
              facetTrajectories={facetTrajectories}
              onSelectFacet={(fId) => setSelectedFacetId(fId)}
              selectedFacetId={selectedFacetId}
            />
            <ShiftedFacetsSection
              changeSummary={changeSummary}
              facetTrajectories={facetTrajectories}
              onSelectFacet={(fId) => setSelectedFacetId(fId)}
              selectedFacetId={selectedFacetId}
            />
          </div>

          {/* Section 4: Coverage Growth */}
          <CoverageGrowthSection coverageTimeline={domainCoverageTimeline} />

          {/* Section 5: Contextual Differences */}
          <ContextualShiftsSection contextualObservations={contextualObservations} />
        </div>
      )}

      {activeTab === 'STABLE' && (
        <StableFacetsSection
          stabilitySummary={stabilitySummary}
          facetTrajectories={facetTrajectories}
          onSelectFacet={(fId) => setSelectedFacetId(fId)}
          selectedFacetId={selectedFacetId}
        />
      )}

      {activeTab === 'SHIFTED' && (
        <ShiftedFacetsSection
          changeSummary={changeSummary}
          facetTrajectories={facetTrajectories}
          onSelectFacet={(fId) => setSelectedFacetId(fId)}
          selectedFacetId={selectedFacetId}
        />
      )}

      {activeTab === 'TRAJECTORIES' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Filter className="h-4 w-4 text-slate-400" />
                <span>Alan Filtresi:</span>
              </div>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="ALL">Tüm Psikolojik Alanlar (11 Alan)</option>
                {MASTER_DOMAINS.map((d) => (
                  <option key={d.domainId} value={d.domainId}>
                    {d.nameTr}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Alt boyut ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Interactive Trajectory Explorer (Master-Detail) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left list: Repeated Facets */}
            <div className="space-y-2 lg:col-span-4 max-h-[560px] overflow-y-auto pr-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Tekrarlanan Alt Boyutlar ({repeatedFilteredTrajectories.length})
              </h4>

              {repeatedFilteredTrajectories.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                  Seçilen filtreye uygun tekrarlanmış boyut bulunamadı.
                </div>
              ) : (
                repeatedFilteredTrajectories.map((ft) => {
                  const isSelected = activeSelectedTrajectory?.facetId === ft.facetId;
                  return (
                    <div
                      key={ft.facetId}
                      onClick={() => setSelectedFacetId(ft.facetId)}
                      className={`cursor-pointer rounded-lg border p-3 text-xs transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{ft.nameTr}</span>
                        <span className="font-bold text-slate-700">
                          {ft.latestScore !== null ? `${ft.latestScore.toFixed(2)}` : '-'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{ft.repeatCount} Ölçüm Noktası</span>
                        <span className="text-indigo-600">
                          {ft.rawDelta !== null ? `${ft.rawDelta > 0 ? '+' : ''}${ft.rawDelta.toFixed(2)}` : 'Stabil'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right details: Selected Trajectory Chart & Data */}
            <div className="lg:col-span-8">
              {activeSelectedTrajectory ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {activeSelectedTrajectory.nameTr}
                      </h3>
                      <span className="text-xs text-slate-500">
                        {activeSelectedTrajectory.repeatCount} ölçüm dönemi kaydedilmiştir.
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-extrabold text-indigo-600">
                        {activeSelectedTrajectory.latestScore !== null
                          ? activeSelectedTrajectory.latestScore.toFixed(2)
                          : '-'}
                      </span>
                      <span className="block text-[10px] text-slate-400">Son Ölçülen Puan / 5.00</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <FacetTrajectoryChart trajectory={activeSelectedTrajectory} height={260} />
                  </div>

                  <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 space-y-2">
                    <div>
                      <span className="font-semibold text-slate-900">Betimsel Yorum:</span>{' '}
                      {activeSelectedTrajectory.neutralChangeDescriptionTr}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>İlk Puan: {activeSelectedTrajectory.firstScore?.toFixed(2) ?? '-'}</span>
                      <span>Son Puan: {activeSelectedTrajectory.latestScore?.toFixed(2) ?? '-'}</span>
                      <span>Gözlenen Fark: {activeSelectedTrajectory.rawDelta ?? '0.00'}</span>
                      <span>Sınıflandırma: {activeSelectedTrajectory.classification}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
                  Görüntülemek için soldan bir alt boyut seçin.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Admin Science Inspection View (Requirement 45) */}
      <AdminScienceDrawer
        epochs={measurementEpochs}
        trajectories={facetTrajectories}
        userId={userId}
      />
    </div>
  );
}
