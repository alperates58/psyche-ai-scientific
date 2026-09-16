'use client';

import React, { useState } from 'react';
import { Fingerprint, Info, Eye, Table, Layers, Calendar, FileText } from 'lucide-react';
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
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('ALL');

  if (measuredCount === 0) {
    return null;
  }

  // Group dimensions by domain
  const domainGroups = new Map<string, ProfileFingerprintDimension[]>();
  for (const dim of dimensions) {
    const key = dim.domainNameTr || 'Diğer';
    if (!domainGroups.has(key)) {
      domainGroups.set(key, []);
    }
    domainGroups.get(key)!.push(dim);
  }

  const distinctDomainNames = Array.from(domainGroups.keys());

  const filteredDimensions =
    selectedDomainFilter === 'ALL'
      ? dimensions
      : dimensions.filter((d) => d.domainNameTr === selectedDomainFilter);

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
              <h2 className="text-base sm:text-lg font-bold text-text-primary">
                Profil Parmak İzi V2
              </h2>
              <span className="text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-full">
                {measuredCount} Boyut Haritalandı
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">{summaryText}</p>
          </div>
        </div>

        {/* View Switcher */}
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

      {/* Domain Filters */}
      {distinctDomainNames.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedDomainFilter('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDomainFilter === 'ALL'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-surface-2/60 border border-border-subtle text-text-secondary hover:bg-surface-2'
            }`}
          >
            Tüm Alanlar ({dimensions.length})
          </button>

          {distinctDomainNames.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomainFilter(dom)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDomainFilter === dom
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-surface-2/60 border border-border-subtle text-text-secondary hover:bg-surface-2'
              }`}
            >
              {dom} ({domainGroups.get(dom)?.length})
            </button>
          ))}
        </div>
      )}

      {/* Main Visual or Accessible Table */}
      {!showTableView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredDimensions.map((dim) => {
            const band = dim.bandInfo;
            const normalizedValue = dim.normalizedCoordinate ?? 50;

            return (
              <div
                key={dim.id}
                className="p-3.5 rounded-xl bg-surface-2/50 border border-border-subtle space-y-2.5 flex flex-col justify-between"
              >
                <div>
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
                      {dim.nativeScore !== null ? dim.nativeScore.toFixed(2) : '—'} / {dim.scaleMax.toFixed(1)}
                    </span>
                  </div>

                  {/* Visual Bar Signature (Visual coordinate only) */}
                  <div className="space-y-1 mt-2">
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

                {/* Metadata Footer */}
                <div className="pt-2 border-t border-border-subtle/80 flex items-center justify-between text-[10px] text-text-tertiary">
                  <span className="truncate max-w-[140px]">
                    {dim.instrumentName || 'Ölçüm Formu'}
                  </span>
                  <span className="font-medium text-brand-700">
                    {dim.measurementSupport ? `${dim.measurementSupport} Kanıt` : ''}
                  </span>
                </div>
              </div>
            );
          })}
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
                <th className="p-2.5 font-semibold">Yanıt Bölgesi</th>
                <th className="p-2.5 font-semibold">Kaynak Envanter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredDimensions.map((dim) => (
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
                  <td className="p-2.5 text-text-tertiary truncate max-w-[150px]">
                    {dim.instrumentName || 'Ölçek Formu'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Epistemic Disclaimer */}
      <div className="flex items-center space-x-2 text-[11px] text-text-tertiary pt-1 border-t border-border-subtle">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>
          Profil parmak izi, tamamlanan ampirik ölçeklerin görsel imzasıdır (visual signature). Biyometrik kimlik veya tanısal profil iddiası taşımaz.
        </span>
      </div>
    </div>
  );
};
