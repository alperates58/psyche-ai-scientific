'use client';

import React, { useState } from 'react';
import { Fingerprint, Info, Eye, Table, Layers, Sparkles, Scale, Compass } from 'lucide-react';
import { resolveConsumerScalePosition, SCALE_POSITION_EXPLANATION_NOTE } from '@/lib/consumerLanguage';
import { getDomainIcon, getFacetIcon } from '@/lib/facetIcons';

export interface FingerprintCoordinate {
  id: string;
  nameTr: string;
  domainId: string;
  domainNameTr: string;
  normalizedScore: number; // 0-100 visual coordinate
  rawScore: number | null;
  scaleMin: number;
  scaleMax: number;
}

interface ProfileFingerprintProps {
  coordinates: FingerprintCoordinate[];
  summaryText?: string;
}

export const ProfileFingerprint: React.FC<ProfileFingerprintProps> = ({
  coordinates,
  summaryText,
}) => {
  const [showTableView, setShowTableView] = useState(false);
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  if (!coordinates || coordinates.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-surface-1 border border-border-default text-center space-y-3">
        <Compass className="w-10 h-10 text-brand-primary mx-auto opacity-70" />
        <h4 className="text-base font-bold text-text-primary">Psikolojik İmza Ölçüm Bekliyor</h4>
        <p className="text-xs text-text-secondary max-w-sm mx-auto">
          Değerlendirmelerinizi tamamladıkça çok boyutlu psikolojik imzanız burada oluşacaktır.
        </p>
      </div>
    );
  }

  // Polar chart parameters
  const size = 340;
  const center = size / 2;
  const radius = 120;
  const totalPoints = coordinates.length;

  // Compute SVG polygon points
  const points = coordinates.map((coord, idx) => {
    const angle = (idx / totalPoints) * 2 * Math.PI - Math.PI / 2;
    const r = (Math.max(10, Math.min(100, coord.normalizedScore)) / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { ...coord, x, y, angle };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  return (
    <div className="bg-surface-1 p-6 sm:p-8 rounded-3xl border border-border-default shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0 mt-0.5">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-bold text-text-primary">
                Psikolojik İmzanız
              </h3>
              <span className="text-[10px] font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2 py-0.5 rounded-full">
                {coordinates.length} Boyut Haritalandı
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              {summaryText || 'Ölçülen psikolojik boyutlarınızın kişisel koordinat deseni.'}
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <button
          type="button"
          onClick={() => setShowTableView(!showTableView)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-border-default bg-surface-2 hover:bg-bg-subtle text-text-secondary transition-colors self-start sm:self-auto"
        >
          {showTableView ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Görsel İmza</span>
            </>
          ) : (
            <>
              <Table className="w-3.5 h-3.5" />
              <span>Tablo Görünümü</span>
            </>
          )}
        </button>
      </div>

      {!showTableView ? (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-4">
          {/* Radial Polar Visual Signature */}
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="overflow-visible select-none">
              {/* Background concentric rings (20%, 40%, 60%, 80%, 100%) */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((level) => (
                <circle
                  key={level}
                  cx={center}
                  cy={center}
                  r={radius * level}
                  fill="none"
                  className="stroke-border-subtle"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              ))}

              {/* Radial axis lines */}
              {points.map((p, idx) => {
                const outerX = center + radius * Math.cos(p.angle);
                const outerY = center + radius * Math.sin(p.angle);
                return (
                  <line
                    key={idx}
                    x1={center}
                    y1={center}
                    x2={outerX}
                    y2={outerY}
                    className="stroke-border-subtle/70"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Filled Polygon Signature */}
              <path
                d={pathD}
                className="fill-brand-primary/20 stroke-brand-primary"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Coordinate Nodes */}
              {points.map((p) => {
                const isHovered = activeHoverId === p.id;
                return (
                  <circle
                    key={p.id}
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4}
                    onMouseEnter={() => setActiveHoverId(p.id)}
                    onMouseLeave={() => setActiveHoverId(null)}
                    className={`cursor-pointer transition-all duration-150 ${
                      isHovered
                        ? 'fill-brand-primary stroke-white stroke-2 shadow-md'
                        : 'fill-brand-primary stroke-surface-1 stroke-1'
                    }`}
                  />
                );
              })}
            </svg>
          </div>

          {/* Dimension Grid / Highlighted Info */}
          <div className="flex-1 w-full space-y-3">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Haritalanan Boyut Koordinatları
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
              {coordinates.map((coord) => {
                const pos = resolveConsumerScalePosition(coord.rawScore);
                const isHovered = activeHoverId === coord.id;
                const Icon = getDomainIcon(coord.domainId);

                return (
                  <div
                    key={coord.id}
                    onMouseEnter={() => setActiveHoverId(coord.id)}
                    onMouseLeave={() => setActiveHoverId(null)}
                    className={`p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                      isHovered
                        ? 'bg-brand-primary/10 border-brand-primary shadow-xs'
                        : 'bg-bg-subtle border-border-subtle'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <Icon className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span className="font-semibold text-text-primary truncate">
                        {coord.nameTr}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 shrink-0">
                      {pos.labelTr}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Accessible Data Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-default bg-bg-subtle text-text-tertiary">
                <th className="p-3 font-semibold">Psikolojik Boyut</th>
                <th className="p-3 font-semibold">Alan</th>
                <th className="p-3 font-semibold">Ölçek Konumu</th>
                <th className="p-3 font-semibold font-mono">Ölçüm Puanı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {coordinates.map((coord) => {
                const pos = resolveConsumerScalePosition(coord.rawScore);
                return (
                  <tr key={coord.id} className="hover:bg-bg-subtle/50">
                    <td className="p-3 font-bold text-text-primary">{coord.nameTr}</td>
                    <td className="p-3 text-text-secondary">{coord.domainNameTr}</td>
                    <td className="p-3">
                      <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 text-[10px]">
                        {pos.labelTr}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-text-primary">
                      {coord.rawScore !== null ? `${coord.rawScore.toFixed(2)} / ${coord.scaleMax}` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Epistemic Note */}
      <div className="pt-2 border-t border-border-subtle flex items-start gap-2 text-[11px] text-text-tertiary">
        <Info className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
        <p>
          Psikolojik imza koordinatları, ampirik olarak ölçülen yapı ve fasetlerin görsel konumlandırmasıdır.
          Alanlar arası sayısal kompozit puan üretilmez; görsel desen benliğinizin çok boyutlu yapısını yansıtır.
        </p>
      </div>
    </div>
  );
};
