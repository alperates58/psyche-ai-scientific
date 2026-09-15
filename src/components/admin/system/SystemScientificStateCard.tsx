import React from 'react';
import { SystemHealthReport } from '@/services/adminUserService';
import { Layers, FileCheck2, Scale, Binary, AlertCircle } from 'lucide-react';

export interface SystemScientificStateCardProps {
  scientificState: SystemHealthReport['scientificState'];
}

export const SystemScientificStateCard: React.FC<SystemScientificStateCardProps> = ({
  scientificState,
}) => {
  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Bilimsel Durum & Ontoloji Katmanı
          </h3>
        </div>

        <span className="inline-flex items-center text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
          Canlı DB Durumu
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1">
          <div className="text-[10px] text-text-tertiary font-semibold uppercase">Alan Sayısı</div>
          <div className="text-lg font-bold text-text-primary">{scientificState.domainCount}</div>
        </div>

        <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1">
          <div className="text-[10px] text-text-tertiary font-semibold uppercase">Yapı Sayısı</div>
          <div className="text-lg font-bold text-text-primary">{scientificState.constructCount}</div>
        </div>

        <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1">
          <div className="text-[10px] text-text-tertiary font-semibold uppercase">Alt Boyut Sayısı</div>
          <div className="text-lg font-bold text-text-primary">{scientificState.facetCount}</div>
        </div>

        <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1">
          <div className="text-[10px] text-text-tertiary font-semibold uppercase">Canlı Madde</div>
          <div className="text-lg font-bold text-brand-700">{scientificState.liveItemCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
        <div className="p-3.5 bg-bg-subtle/40 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center text-text-tertiary font-semibold uppercase text-[10px] space-x-1">
            <FileCheck2 className="w-3.5 h-3.5 text-brand-600" />
            <span>Aktif Form Sürümü</span>
          </div>
          <div className="font-bold text-text-primary">
            {scientificState.activeFormVersionCode || 'Tanımsız'}
          </div>
          <div className="text-[11px] text-text-secondary truncate">
            {scientificState.activeFormModuleTitle || '—'}
          </div>
        </div>

        <div className="p-3.5 bg-bg-subtle/40 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center text-text-tertiary font-semibold uppercase text-[10px] space-x-1">
            <Scale className="w-3.5 h-3.5 text-brand-600" />
            <span>Puanlama Modeli</span>
          </div>
          <div className="font-bold text-text-primary font-mono text-[11px]">
            {scientificState.scoringModelCode || 'Tanımsız'}
          </div>
          <div className="text-[11px] text-text-secondary">
            {scientificState.scoringAlgorithm || '—'}
          </div>
        </div>

        <div className="p-3.5 bg-bg-subtle/40 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center text-text-tertiary font-semibold uppercase text-[10px] space-x-1">
            <Binary className="w-3.5 h-3.5 text-brand-600" />
            <span>Norm Tablosu Durumu</span>
          </div>
          <div className="font-bold text-text-primary">
            {scientificState.normStatusCode}
          </div>
          <div className="text-[11px] text-text-secondary">
            Örneklem: {scientificState.normSampleSize}
          </div>
        </div>
      </div>
    </div>
  );
};
