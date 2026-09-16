'use client';

import React, { useState } from 'react';
import { Fingerprint, Info, Eye, Table } from 'lucide-react';
import { ProfileFingerprintDimension } from '@/types/profile';

interface ProfileFingerprintProps {
  dimensions: ProfileFingerprintDimension[];
  measuredCount: number;
  totalCount: number;
  summaryText: string;
}

export const ProfileFingerprint: React.FC<ProfileFingerprintProps> = ({
  dimensions,
  measuredCount,
  totalCount,
  summaryText,
}) => {
  const [showTableView, setShowTableView] = useState(false);

  if (measuredCount === 0) {
    return null;
  }

  return (
    <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-border-subtle shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-text-primary">Profil Parmak İzin</h2>
              <span className="text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-full">
                {measuredCount} Boyut Ölçüldü
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              {summaryText}
            </p>
          </div>
        </div>

        {/* View Switcher & Disclaimer */}
        <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowTableView(!showTableView)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-border-subtle bg-surface-2 hover:bg-bg-subtle text-text-secondary transition-colors"
          >
            {showTableView ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Görsel Görünüm</span>
              </>
            ) : (
              <>
                <Table className="w-3.5 h-3.5" />
                <span>Tablo Görünümü</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Visual or Accessible Table */}
      {!showTableView ? (
        <div className="space-y-4">
          {/* Multi-Bar Deterministic Signature */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {dimensions.map((dim) => {
              const band = dim.bandInfo;
              const normalizedValue = dim.normalizedCoordinate ?? 50;

              return (
                <div
                  key={dim.id}
                  className="p-3.5 rounded-xl bg-surface-2/60 border border-border-subtle space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-text-tertiary block font-medium">
                        {dim.domainNameTr}
                      </span>
                      <span className="text-xs font-bold text-text-primary">
                        {dim.nameTr}
                      </span>
                    </div>

                    <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/50 shrink-0">
                      {dim.nativeScore !== null ? dim.nativeScore.toFixed(1) : '—'} / {dim.scaleMax.toFixed(1)}
                    </span>
                  </div>

                  {/* Visual Bar Signature (Visual rendering coordinate only) */}
                  <div className="space-y-1">
                    <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden border border-border-subtle">
                      <div
                        className="bg-brand-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${normalizedValue}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-text-tertiary">
                      <span>{dim.scaleMin.toFixed(1)}</span>
                      {band && (
                        <span className={`font-semibold ${band.colorClass}`}>
                          {band.labelTr}
                        </span>
                      )}
                      <span>{dim.scaleMax.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Accessible Table Alternative */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-2 text-text-tertiary">
                <th className="p-2.5 font-semibold">Psikolojik Boyut</th>
                <th className="p-2.5 font-semibold">Alan</th>
                <th className="p-2.5 font-semibold font-mono">Ölçülen Değer</th>
                <th className="p-2.5 font-semibold">Ölçek Aralığı</th>
                <th className="p-2.5 font-semibold">Eğilim Aralığı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {dimensions.map((dim) => (
                <tr key={dim.id} className="hover:bg-surface-2/40">
                  <td className="p-2.5 font-bold text-text-primary">{dim.nameTr}</td>
                  <td className="p-2.5 text-text-secondary">{dim.domainNameTr}</td>
                  <td className="p-2.5 font-mono font-bold text-brand-700">
                    {dim.nativeScore !== null ? dim.nativeScore.toFixed(2) : '—'}
                  </td>
                  <td className="p-2.5 font-mono text-text-tertiary">
                    {dim.scaleMin.toFixed(1)} – {dim.scaleMax.toFixed(1)}
                  </td>
                  <td className="p-2.5">
                    {dim.bandInfo ? (
                      <span className={`font-semibold ${dim.bandInfo.colorClass}`}>
                        {dim.bandInfo.labelTr}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transparency Callout */}
      <div className="flex items-center space-x-2 text-[11px] text-text-tertiary pt-1 border-t border-border-subtle">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>
          Profil parmak izi, tamamlanan ampirik ölçeklerin yalnızca ölçülen boyutlarını özetleyen ürün görselidir. Temsili nüfus normları veya yüzdelik dilim iddiası taşımaz.
        </span>
      </div>
    </div>
  );
};
