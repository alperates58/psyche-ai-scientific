'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Info, Layers, X, Compass } from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';

export interface HeatmapCell {
  facetId: string;
  name: string;
  score: number | null;
  precision: 'High' | 'Moderate' | 'Developing' | 'Unmeasured';
  items: number;
}

export interface HeatmapDomainRow {
  domainId: string;
  domainName: string;
  facets: HeatmapCell[];
}

interface ProfileHeatmapClientProps {
  initialData: HeatmapDomainRow[];
  isAssessed: boolean;
  measuredFacetCount: number;
  totalFacetCount: number;
}

export const ProfileHeatmapClient: React.FC<ProfileHeatmapClientProps> = ({
  initialData,
  isAssessed,
  measuredFacetCount,
  totalFacetCount,
}) => {
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);

  // Morally neutral violet/slate intensity based on score
  const getCellShade = (score: number | null) => {
    if (score === null) return 'bg-slate-100 text-slate-500 border-border-subtle';
    if (score >= 80) return 'bg-brand-600 text-white border-brand-700';
    if (score >= 70) return 'bg-brand-500/80 text-white border-brand-600';
    if (score >= 60) return 'bg-brand-200 text-brand-900 border-brand-300';
    if (score >= 50) return 'bg-brand-100 text-brand-800 border-brand-200';
    if (score >= 40) return 'bg-slate-200 text-slate-800 border-slate-300';
    return 'bg-slate-100 text-slate-700 border-border-subtle';
  };

  const renderInspectorContent = (cell: HeatmapCell) => (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-surface-2 border border-border-subtle">
        <div className="text-base font-bold text-text-primary">{cell.name}</div>
        <div className="text-xs text-brand-600 font-medium mt-0.5">Alt Boyut Kodu: {cell.facetId}</div>

        <div className="mt-4 flex items-baseline space-x-2">
          {cell.score !== null ? (
            <>
              <span className="text-3xl font-bold font-mono text-text-primary">{cell.score}</span>
              <span className="text-xs text-text-tertiary">/ 100 betimsel düzey</span>
            </>
          ) : (
            <span className="text-lg font-semibold text-text-tertiary">Henüz Ölçülmedi</span>
          )}
        </div>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between py-1.5 border-b border-border-subtle">
          <span className="text-text-tertiary">Ölçüm Derinliği:</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
              cell.precision === 'High'
                ? 'text-teal-700 bg-teal-50'
                : cell.precision === 'Moderate'
                ? 'text-brand-700 bg-brand-50'
                : cell.precision === 'Developing'
                ? 'text-amber-700 bg-amber-50'
                : 'text-text-tertiary bg-surface-2'
            }`}
          >
            {cell.precision === 'High'
              ? 'Araştırma Formu Düzeyi'
              : cell.precision === 'Moderate'
              ? 'Orta Düzey'
              : cell.precision === 'Developing'
              ? 'Başlangıç Düzeyi (Ön Kalibrasyon)'
              : 'Ölçüm Yapılmadı (0 Madde)'}
          </span>
        </div>

        <div className="flex justify-between py-1.5 border-b border-border-subtle">
          <span className="text-text-tertiary">Gözlenen Maddeler:</span>
          <span className="font-semibold text-text-primary">{cell.items} madde tamamlandı</span>
        </div>

        <div className="flex justify-between py-1.5 border-b border-border-subtle">
          <span className="text-text-tertiary">Epistemik Kademe:</span>
          <span className="font-semibold text-text-primary">A Kademesi (Literatür Tanımlı)</span>
        </div>

        <div className="flex justify-between py-1.5 border-b border-border-subtle">
          <span className="text-text-tertiary">Norm Kıyaslaması:</span>
          <span className="text-text-secondary italic">Gizlendi (Ön-Kalibrasyon Aşaması)</span>
        </div>
      </div>
    </div>
  );

  return (
    <PageContainer variant="wide" className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-border-subtle pb-5">
        <Link
          href="/overview"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-text-primary transition-colors mb-2 py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span>Genel Bakışa Dön</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Psikolojik Profil Haritası</h1>
              <span
                className={`text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 border ${
                  isAssessed
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                    : 'bg-surface-2 text-text-tertiary border-border-subtle'
                }`}
              >
                {isAssessed ? `${measuredFacetCount} / ${totalFacetCount} ALT BOYUT` : 'HENÜZ ÖLÇÜLMEDİ'}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 max-w-2xl">
              Alanlar arası yoğunluk matrisi. Renk tonu, boyutsal ölçek üzerindeki kestirilen özellik düzeyini gösterir; ahlaki iyi/kötü yargılarından tamamen bağımsızdır.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-surface-1 px-3 py-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
            <Info className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Hassasiyeti ve gözlenen madde sayısını incelemek için herhangi bir hücreye dokunun.</span>
          </div>
        </div>
      </div>

      {/* Zero Assessment Info Banner */}
      {!isAssessed && (
        <div className="bg-surface-1 p-5 rounded-card border border-border-subtle shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-text-primary">
                Henüz tamamlanmış bir değerlendirmeniz bulunmuyor.
              </div>
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                Aşağıdaki ontoloji haritasında tüm alt boyutlar başlangıç durumunda listelenmiştir. Değerlendirmeleri tamamladıkça ölçülen boyutlar renklendirilecektir.
              </p>
            </div>
          </div>
          <Link
            href="/assessment"
            className="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
          >
            <span>Değerlendirmeye Başla</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      )}

      {/* Heatmap Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Heatmap Matrix */}
        <div className="lg:col-span-8 bg-surface-1 p-4 sm:p-6 rounded-card border border-border-subtle shadow-xs space-y-6">
          {initialData.map((domain) => (
            <div key={domain.domainId} className="space-y-2.5">
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center justify-between">
                <span>{domain.domainName}</span>
                <span className="text-[11px] font-normal text-text-tertiary">{domain.facets.length} Alt Boyut</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {domain.facets.map((facet) => {
                  const isSelected = selectedCell?.facetId === facet.facetId;
                  const shade = getCellShade(facet.score);

                  return (
                    <button
                      key={facet.facetId}
                      type="button"
                      onClick={() => setSelectedCell(facet)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 border flex items-center space-x-2 min-h-[38px] touch-manipulation active:scale-95 ${
                        isSelected
                          ? 'ring-2 ring-brand-600 ring-offset-2 scale-105 shadow-sm'
                          : 'hover:opacity-90'
                      } ${shade}`}
                    >
                      <span className="text-left break-words">{facet.name}</span>
                      <span className="font-mono font-bold text-[11px] opacity-90 shrink-0">
                        {facet.score !== null ? facet.score : '—'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Neutral Legend */}
          <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-text-tertiary">
            <span className="font-medium">Ölçek Gösterimi:</span>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-border-subtle">Ölçülmedi</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">&lt;40 Düşük</span>
              <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-800">50 Orta</span>
              <span className="px-2 py-0.5 rounded bg-brand-200 text-brand-900">60-70 Belirgin</span>
              <span className="px-2 py-0.5 rounded bg-brand-600 text-white font-semibold">80+ Çok Yüksek</span>
            </div>
          </div>
        </div>

        {/* Right Inspector Drawer (Desktop >= lg) */}
        <div className="hidden lg:block lg:col-span-4 bg-surface-1 p-5 rounded-card border border-border-subtle shadow-xs sticky top-24">
          <h2 className="text-sm font-bold text-text-primary mb-1">Alt Boyut Denetçisi</h2>
          <p className="text-xs text-text-tertiary mb-4">
            {selectedCell ? 'Seçilen hücre için ayrıntılı ölçüm parametreleri.' : 'Ampirik parametreleri incelemek için haritadaki herhangi bir hücreyi seçin.'}
          </p>

          {selectedCell ? (
            renderInspectorContent(selectedCell)
          ) : (
            <div className="h-48 border border-dashed border-border-default rounded-xl flex flex-col items-center justify-center text-center p-4 text-xs text-text-tertiary">
              <Layers className="w-8 h-8 text-brand-500/40 mb-2" />
              <span>Ölçüm kapsamını ve hassasiyetini görmek için profil haritasındaki bir alt boyuta tıklayın.</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Selected Cell Modal Sheet (< lg) */}
      {selectedCell && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 p-4 bg-black/40 backdrop-blur-xs animate-in slide-in-from-bottom duration-200">
          <div className="bg-surface-1 rounded-2xl p-5 border border-border-subtle shadow-2xl max-h-[80vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">Alt Boyut Denetçisi</span>
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-subtle"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderInspectorContent(selectedCell)}
          </div>
        </div>
      )}
    </PageContainer>
  );
};
