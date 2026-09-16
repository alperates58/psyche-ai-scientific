'use client';

import React, { useState } from 'react';
import { Grid, Info, X, Layers, Calendar, FileText } from 'lucide-react';
import { HeatmapMatrixViewModel, HeatmapCellViewModel } from '@/types/heatmap';

interface TraitHeatmapProps {
  matrix: HeatmapMatrixViewModel;
}

export const TraitHeatmap: React.FC<TraitHeatmapProps> = ({ matrix }) => {
  const [selectedCell, setSelectedCell] = useState<HeatmapCellViewModel | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  const { rows, totalCells, measuredCellsCount, legendDisclaimerTr } = matrix;

  const distinctDomains = Array.from(
    new Map(rows.map((r) => [r.domainId, { id: r.domainId, code: r.domainCode, nameTr: r.domainNameTr }])).values()
  );

  const filteredRows =
    selectedDomain === 'ALL'
      ? rows
      : rows.filter((r) => r.domainId === selectedDomain);

  const getCellBgClass = (cell: HeatmapCellViewModel) => {
    if (!cell.isMeasured || cell.cellState === 'UNMEASURED') {
      return 'bg-surface-2/70 text-text-tertiary border-border-subtle hover:border-border-strong hover:bg-surface-2';
    }
    switch (cell.cellState) {
      case 'UPPER_RESPONSE_RANGE':
        return 'bg-brand-600 text-white border-brand-700 shadow-xs';
      case 'MID_RESPONSE_RANGE':
        return 'bg-brand-100 text-brand-900 border-brand-200';
      case 'LOWER_RESPONSE_RANGE':
        return 'bg-slate-200 text-slate-800 border-slate-300';
      default:
        return 'bg-surface-2 text-text-secondary border-border-subtle';
    }
  };

  return (
    <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-border-subtle shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-text-primary">
                Psikolojik Boyut Isı Haritası
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {measuredCellsCount} / {totalCells} Alt Boyut
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Tüm ontoloji alt boyutlarının ölçek-içi yanıt konumu yoğunluk haritası.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-text-tertiary self-start sm:self-auto shrink-0">
          <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <span>Detay için kutucuklara tıklayın</span>
        </div>
      </div>

      {/* Domain Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          type="button"
          onClick={() => setSelectedDomain('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedDomain === 'ALL'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-surface-2/60 border border-border-subtle text-text-secondary hover:bg-surface-2'
          }`}
        >
          Tüm Alanlar ({distinctDomains.length})
        </button>

        {distinctDomains.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelectedDomain(d.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDomain === d.id
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-surface-2/60 border border-border-subtle text-text-secondary hover:bg-surface-2'
            }`}
          >
            {d.nameTr}
          </button>
        ))}
      </div>

      {/* Heatmap High-Density Matrix */}
      <div className="space-y-4">
        {filteredRows.map((row) => (
          <div
            key={row.constructId}
            className="p-3.5 rounded-2xl bg-surface-2/40 border border-border-subtle space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-text-tertiary font-medium">
                  {row.domainNameTr} &rsaquo;{' '}
                </span>
                <span className="font-bold text-text-primary">{row.constructNameTr}</span>
              </div>
              <span className="text-[11px] text-text-tertiary">
                {row.cells.filter((c) => c.isMeasured).length} / {row.cells.length} Ölçüldü
              </span>
            </div>

            {/* Grid of Facet Cells */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {row.cells.map((cell) => {
                const isSelected = selectedCell?.facetId === cell.facetId;
                const bgStyle = getCellBgClass(cell);

                return (
                  <button
                    key={cell.facetId}
                    type="button"
                    onClick={() => setSelectedCell(cell)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[58px] touch-manipulation active:scale-[0.98] ${
                      isSelected ? 'ring-2 ring-brand-600 ring-offset-2 scale-[1.02] shadow-sm' : ''
                    } ${bgStyle}`}
                  >
                    <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                      {cell.facetNameTr}
                    </span>

                    <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
                      {cell.isMeasured && cell.rawScore !== null ? (
                        <>
                          <span className="font-bold opacity-95">
                            {cell.rawScore.toFixed(1)}
                          </span>
                          <span className="opacity-75 font-sans">
                            {cell.itemCount} md.
                          </span>
                        </>
                      ) : (
                        <span className="text-text-tertiary font-sans opacity-70">
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

      {/* Instrument-Specific Descriptive Legend */}
      <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-text-tertiary">
        <span className="font-medium">Ölçek-İçi Yanıt Bölgesi:</span>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px]">
          <span className="px-2 py-0.5 rounded bg-surface-2 text-text-tertiary border border-border-subtle">
            Ölçülmedi
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800">
            Alt Yanıt Bölgesi (&lt;38%)
          </span>
          <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-900 font-medium">
            Orta Yanıt Bölgesi (38–62%)
          </span>
          <span className="px-2 py-0.5 rounded bg-brand-600 text-white font-semibold">
            Üst Yanıt Bölgesi (&gt;62%)
          </span>
        </div>
      </div>

      {/* Inviolable Legend Disclaimer */}
      <div className="flex items-center space-x-2 text-[11px] text-text-tertiary pt-1 border-t border-border-subtle">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>{legendDisclaimerTr}</span>
      </div>

      {/* Cell Detail Modal / Sheet */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-surface-1 rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b border-border-subtle pb-3">
              <div>
                <span className="text-[10px] font-semibold text-brand-600">
                  {selectedCell.domainNameTr} &rsaquo; {selectedCell.constructNameTr}
                </span>
                <h3 className="text-base font-bold text-text-primary mt-0.5">
                  {selectedCell.facetNameTr}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-2"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Response Range */}
            <div className="p-4 rounded-xl bg-surface-2/60 border border-border-subtle flex items-center justify-between">
              <div>
                <div className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">
                  Ölçülen Ham Değer
                </div>
                <div className="text-xl font-bold font-mono text-text-primary mt-0.5">
                  {selectedCell.isMeasured && selectedCell.rawScore !== null ? (
                    <>
                      {selectedCell.rawScore.toFixed(2)}{' '}
                      <span className="text-xs text-text-tertiary font-sans">
                        / {selectedCell.scaleMax?.toFixed(1) || '5.0'}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-normal text-text-tertiary italic">Ölçülmedi</span>
                  )}
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-surface-1 text-text-secondary border border-border-subtle">
                {selectedCell.stateLabelTr}
              </span>
            </div>

            {/* Metadata Parameters */}
            <div className="space-y-2 text-xs divide-y divide-border-subtle">
              <div className="flex justify-between py-1.5">
                <span className="text-text-tertiary">Ölçüm Kanıt Düzeyi:</span>
                <span className="font-semibold text-text-primary">
                  {selectedCell.measurementSupport}
                </span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-text-tertiary">Tamamlanan Madde:</span>
                <span className="font-semibold text-text-primary">
                  {selectedCell.itemCount} madde
                </span>
              </div>

              {selectedCell.instrumentName && (
                <div className="flex justify-between py-1.5">
                  <span className="text-text-tertiary">Kaynak Envanter:</span>
                  <span className="font-semibold text-text-primary truncate max-w-[200px]">
                    {selectedCell.instrumentName}
                  </span>
                </div>
              )}

              {selectedCell.measuredAt && (
                <div className="flex justify-between py-1.5">
                  <span className="text-text-tertiary">Ölçüm Tarihi:</span>
                  <span className="text-text-secondary">
                    {new Date(selectedCell.measuredAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1.5">
                <span className="text-text-tertiary">Norm Kıyaslaması:</span>
                <span className="text-text-secondary italic">Gizlendi (Ön-Kalibrasyon)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCell(null)}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
