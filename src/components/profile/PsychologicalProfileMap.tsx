'use client';

import React, { useState } from 'react';
import { Layers, X, Info, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { UnifiedDomainViewModel, UnifiedFacetViewModel } from '@/types/profile';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';

interface PsychologicalProfileMapProps {
  domains: UnifiedDomainViewModel[];
  measuredFacetCount: number;
  totalFacetCount: number;
}

export const PsychologicalProfileMap: React.FC<PsychologicalProfileMapProps> = ({
  domains,
  measuredFacetCount,
  totalFacetCount,
}) => {
  const [selectedFacet, setSelectedFacet] = useState<UnifiedFacetViewModel | null>(null);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('ALL');

  const filteredDomains =
    selectedDomainFilter === 'ALL'
      ? domains
      : domains.filter((d) => d.domainId === selectedDomainFilter);

  // Morally neutral violet / slate shading for measured scores
  const getFacetTileStyle = (facet: UnifiedFacetViewModel) => {
    if (!facet.isMeasured || facet.scorePercentage === null) {
      return 'bg-surface-2/70 text-text-tertiary border-border-subtle hover:border-border-strong hover:bg-surface-2';
    }

    const pct = facet.scorePercentage;
    if (pct >= 80) return 'bg-brand-600 text-white border-brand-700 shadow-xs';
    if (pct >= 70) return 'bg-brand-500 text-white border-brand-600';
    if (pct >= 55) return 'bg-brand-100 text-brand-900 border-brand-200';
    if (pct >= 40) return 'bg-slate-200 text-slate-800 border-slate-300';
    return 'bg-slate-100 text-slate-700 border-border-subtle';
  };

  const renderInspectorContent = (facet: UnifiedFacetViewModel) => (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="p-4 rounded-2xl bg-surface-2 border border-border-subtle">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold text-brand-600">
              {facet.domainNameTr} &rsaquo; {facet.constructNameTr}
            </span>
            <h3 className="text-base font-bold text-text-primary mt-0.5">
              {facet.nameTr}
            </h3>
            <div className="text-[10px] text-text-tertiary font-mono">
              Kod: {facet.code}
            </div>
          </div>

          <div className="shrink-0">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                facet.isMeasured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-surface-1 text-text-tertiary border-border-subtle'
              }`}
            >
              {facet.isMeasured ? 'ÖLÇÜLDÜ' : 'ÖLÇÜLMEDİ'}
            </span>
          </div>
        </div>

        {/* Score Display */}
        <div className="mt-4 pt-3 border-t border-border-subtle/80 flex items-baseline justify-between">
          <div>
            <div className="text-[10px] text-text-tertiary uppercase tracking-wider">
              Ölçülen Betimsel Puan
            </div>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              {facet.isMeasured && facet.rawMean !== null ? (
                <>
                  <span className="text-3xl font-bold font-mono text-text-primary">
                    {facet.rawMean.toFixed(2)}
                  </span>
                  <span className="text-xs text-text-tertiary font-mono">
                    / {facet.scale?.scaleMax.toFixed(1) || '5.0'} (Öz-Bildirim Ölçeği)
                  </span>
                </>
              ) : (
                <span className="text-lg font-semibold text-text-tertiary italic">
                  Ölçüm Kaydı Yok
                </span>
              )}
            </div>
          </div>

          {facet.bandInfo && (
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${facet.bandInfo.bgClass} ${facet.bandInfo.colorClass} ${facet.bandInfo.borderClass}`}
            >
              {facet.bandInfo.labelTr}
            </span>
          )}
        </div>
      </div>

      {/* Definition */}
      <div className="space-y-1">
        <div className="text-xs font-semibold text-text-primary">Operasyonel Tanım</div>
        <p className="text-xs text-text-secondary leading-relaxed bg-surface-1 p-3 rounded-xl border border-border-subtle">
          {facet.descriptionTr || 'Tanım literatür kayıtlarında mevcuttur.'}
        </p>
      </div>

      {/* Measurement Parameters */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between py-1.5 border-b border-border-subtle">
          <span className="text-text-tertiary">Ölçüm Hassasiyeti:</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
              facet.precision === 'High'
                ? 'text-teal-700 bg-teal-50'
                : facet.precision === 'Moderate'
                ? 'text-brand-700 bg-brand-50'
                : facet.precision === 'Developing'
                ? 'text-amber-700 bg-amber-50'
                : 'text-text-tertiary bg-surface-2'
            }`}
          >
            {facet.precision === 'High'
              ? 'Araştırma Formu Düzeyi (>=6 Madde)'
              : facet.precision === 'Moderate'
              ? 'Orta Düzey (3-5 Madde)'
              : facet.precision === 'Developing'
              ? 'Başlangıç Teması (1-2 Madde)'
              : 'Ölçüm Yapılmadı (0 Madde)'}
          </span>
        </div>

        <div className="flex justify-between py-1.5 border-b border-border-subtle">
          <span className="text-text-tertiary">Gözlenen Madde Sayısı:</span>
          <span className="font-semibold text-text-primary">
            {facet.itemCount} madde tamamlandı
          </span>
        </div>

        {facet.provenance && (
          <>
            <div className="flex justify-between py-1.5 border-b border-border-subtle">
              <span className="text-text-tertiary">Kaynak Değerlendirme:</span>
              <span className="font-semibold text-text-primary truncate max-w-[200px]">
                {facet.provenance.moduleTitleTr}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-border-subtle">
              <span className="text-text-tertiary">Form & Puanlama Modeli:</span>
              <span className="font-mono text-[11px] text-text-secondary">
                {facet.provenance.formVersionCode} ({facet.provenance.scoringModelCode})
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-border-subtle">
              <span className="text-text-tertiary">Ölçüm Tarihi:</span>
              <span className="text-text-secondary">
                {new Date(facet.provenance.measuredAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </>
        )}

        <div className="flex justify-between py-1.5 border-b border-border-subtle items-center">
          <span className="text-text-tertiary">Epistemik Standart:</span>
          <EpistemicBadge status="PROVISIONAL_POINT_ESTIMATE" size="sm" />
        </div>

        <div className="flex justify-between py-1.5 border-b border-border-subtle">
          <span className="text-text-tertiary">Norm Kıyaslaması:</span>
          <span className="text-text-secondary italic">Gizlendi (Ön-Kalibrasyon)</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">
              84 Alt Boyut Psikolojik Profil Haritası
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {measuredFacetCount} / {totalFacetCount} ÖLÇÜLDÜ
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1 max-w-3xl leading-relaxed">
            Ontolojideki tüm alanlar ve alt boyutlar yapılandırılmış bir matris halinde sunulur. Yalnızca tamamlanan testlerde yer alan boyutlar renk ve değer alır; ölçülmemiş boyutlar kesinlikle boş bırakılmayıp açıkça <strong>"Ölçülmedi"</strong> olarak gösterilir.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-2 text-xs text-text-tertiary bg-surface-1 px-3 py-2 rounded-xl border border-border-subtle self-start sm:self-auto shrink-0">
          <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <span>Detayları görmek için herhangi bir kutuya dokunun.</span>
        </div>
      </div>

      {/* Domain Switcher Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setSelectedDomainFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedDomainFilter === 'ALL'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-surface-1 border border-border-subtle text-text-secondary hover:bg-surface-2'
          }`}
        >
          Tüm Alanlar ({domains.length})
        </button>

        {domains.map((d) => (
          <button
            key={d.domainId}
            type="button"
            onClick={() => setSelectedDomainFilter(d.domainId)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              selectedDomainFilter === d.domainId
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-surface-1 border border-border-subtle text-text-secondary hover:bg-surface-2'
            }`}
          >
            <span>{d.nameTr}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                d.status === 'MEASURED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : d.status === 'PARTIAL'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-surface-2 text-text-tertiary'
              }`}
            >
              {d.measuredFacetCount}/{d.totalFacetCount}
            </span>
          </button>
        ))}
      </div>

      {/* Map Layout Grid: Main Matrix (Left 8 cols) + Inspector Panel (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Matrix Surface */}
        <div className="lg:col-span-8 bg-surface-1 p-5 sm:p-6 rounded-panel border border-border-subtle shadow-xs space-y-6">
          {filteredDomains.map((domain) => (
            <div key={domain.domainId} className="space-y-3 pb-5 border-b border-border-subtle/80 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-text-primary">
                    {domain.nameTr}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      domain.status === 'MEASURED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : domain.status === 'PARTIAL'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-surface-2 text-text-tertiary border-border-subtle'
                    }`}
                  >
                    {domain.status === 'MEASURED'
                      ? 'TAMAMI ÖLÇÜLDÜ'
                      : domain.status === 'PARTIAL'
                      ? 'KISMEN ÖLÇÜLDÜ'
                      : 'ÖLÇÜLMEDİ'}
                  </span>
                </div>

                <span className="text-xs text-text-tertiary">
                  {domain.measuredFacetCount} / {domain.totalFacetCount} Alt Boyut
                </span>
              </div>

              {/* Constructs inside Domain */}
              <div className="space-y-3">
                {domain.constructs.map((construct) => (
                  <div
                    key={construct.constructId}
                    className="p-3.5 rounded-2xl bg-surface-2/40 border border-border-subtle/70 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-primary">
                        {construct.nameTr}
                      </span>
                      {construct.isMeasured && construct.compositeScore !== null && (
                        <span className="font-mono text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60">
                          {construct.compositeScore.toFixed(2)} /{' '}
                          {construct.scale?.scaleMax.toFixed(1) || '5.0'}
                        </span>
                      )}
                    </div>

                    {/* Facet Tiles */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {construct.facets.map((facet) => {
                        const isSelected = selectedFacet?.facetId === facet.facetId;
                        const tileStyle = getFacetTileStyle(facet);

                        return (
                          <button
                            key={facet.facetId}
                            type="button"
                            onClick={() => setSelectedFacet(facet)}
                            className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[58px] touch-manipulation active:scale-[0.98] ${
                              isSelected
                                ? 'ring-2 ring-brand-600 ring-offset-2 scale-[1.02] shadow-sm'
                                : ''
                            } ${tileStyle}`}
                          >
                            <span className="text-xs font-semibold leading-tight line-clamp-2">
                              {facet.nameTr}
                            </span>

                            <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono">
                              {facet.isMeasured && facet.rawMean !== null ? (
                                <>
                                  <span className="font-bold opacity-95">
                                    {facet.rawMean.toFixed(1)}
                                  </span>
                                  <span className="text-[10px] opacity-75 font-sans">
                                    {facet.itemCount} md.
                                  </span>
                                </>
                              ) : (
                                <span className="text-[10px] text-text-tertiary font-sans">
                                  Ölçülmedi
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Neutral Scale Legend */}
          <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-text-tertiary">
            <span className="font-medium">Renk Gösterimi (Betimsel Düzey):</span>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-surface-2 text-text-tertiary border border-border-subtle">
                Ölçülmedi
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                &lt;40 Düşük
              </span>
              <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-900 font-medium">
                55-70 Dengeli/Orta
              </span>
              <span className="px-2 py-0.5 rounded bg-brand-600 text-white font-semibold">
                80+ Yüksek
              </span>
            </div>
          </div>
        </div>

        {/* Right Inspector Drawer (Desktop >= lg) */}
        <div className="hidden lg:block lg:col-span-4 bg-surface-1 p-5 rounded-panel border border-border-subtle shadow-xs sticky top-24">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-text-primary">Alt Boyut Denetçisi</h2>
            <Layers className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-xs text-text-tertiary mb-4">
            {selectedFacet
              ? 'Seçilen alt boyut için bilimsel parametreler ve ölçüm durumu.'
              : 'Ampirik detayları ve kanıt düzeyini görmek için haritadaki herhangi bir kutuyu seçin.'}
          </p>

          {selectedFacet ? (
            renderInspectorContent(selectedFacet)
          ) : (
            <div className="h-64 border border-dashed border-border-default rounded-2xl flex flex-col items-center justify-center text-center p-6 text-xs text-text-tertiary space-y-2">
              <Layers className="w-8 h-8 text-brand-500/40" />
              <span className="max-w-[200px]">
                Ölçüm kapsamını, madde sayısını ve operasyonel tanımı görmek için profil haritasındaki bir alt boyuta tıklayın.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Selected Facet Modal Sheet (< lg) */}
      {selectedFacet && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 p-4 bg-black/40 backdrop-blur-xs animate-in slide-in-from-bottom duration-200">
          <div className="bg-surface-1 rounded-2xl p-5 border border-border-subtle shadow-2xl max-h-[85vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                Alt Boyut Denetçisi
              </span>
              <button
                type="button"
                onClick={() => setSelectedFacet(null)}
                className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-2"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderInspectorContent(selectedFacet)}
          </div>
        </div>
      )}
    </div>
  );
};
