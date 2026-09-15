import React from 'react';
import { Layers, FileCheck2, Binary, Cpu, ShieldCheck } from 'lucide-react';

export interface AdminOntologyStatusProps {
  scientific: {
    domainCount: number;
    constructCount: number;
    facetCount: number;
    liveFormItemCount: number;
    totalBankItemCount: number;
    activeFormVersionCode: string | null;
    activeFormModuleTitle: string | null;
    scoringModelCode: string | null;
    scoringModelAlgorithm: string | null;
    normStatusCode: string | null;
    normSampleSize: number;
  };
}

export const AdminOntologyStatusCard: React.FC<AdminOntologyStatusProps> = ({ scientific }) => {
  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-text-primary">
            Bilimsel Ontoloji ve Ölçüm Durumu
          </h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            Veritabanından dinamik olarak sorgulanan psikometrik varlıklar
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          Kanıta Dayalı
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {/* Ontology Depth */}
        <div className="p-4 rounded-xl bg-bg-subtle border border-border-subtle">
          <div className="flex items-center space-x-2 text-text-tertiary mb-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">Ontoloji Hiyerarşisi</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-text-secondary">Ana Alan (Domain):</span>
              <span className="font-bold text-text-primary font-mono">{scientific.domainCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Yapı (Construct):</span>
              <span className="font-bold text-text-primary font-mono">{scientific.constructCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Alt Boyut (Facet):</span>
              <span className="font-bold text-text-primary font-mono">{scientific.facetCount}</span>
            </div>
          </div>
        </div>

        {/* Live Items & Form */}
        <div className="p-4 rounded-xl bg-bg-subtle border border-border-subtle">
          <div className="flex items-center space-x-2 text-text-tertiary mb-2">
            <FileCheck2 className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">Aktif Form & Madde</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-text-secondary">Aktif Form Sürümü:</span>
              <span className="font-bold text-brand-700 font-mono">
                {scientific.activeFormVersionCode || 'Yok'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Form Maddesi:</span>
              <span className="font-bold text-text-primary font-mono">{scientific.liveFormItemCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Toplam Madde Bankası:</span>
              <span className="font-bold text-text-secondary font-mono">{scientific.totalBankItemCount}</span>
            </div>
            <div className="truncate text-text-tertiary text-[11px] pt-0.5">
              {scientific.activeFormModuleTitle || 'Modül tanımlı değil'}
            </div>
          </div>
        </div>

        {/* Scoring Model */}
        <div className="p-4 rounded-xl bg-bg-subtle border border-border-subtle">
          <div className="flex items-center space-x-2 text-text-tertiary mb-2">
            <Cpu className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">Puanlama Modeli</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-text-secondary">Model Kodu:</span>
              <span className="font-bold text-text-primary font-mono text-[11px] truncate max-w-[110px]">
                {scientific.scoringModelCode || 'Tanımlı Değil'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Algoritma:</span>
              <span className="font-semibold text-text-secondary text-[11px] truncate max-w-[110px]">
                {scientific.scoringModelAlgorithm || 'Deterministik'}
              </span>
            </div>
            <div className="text-amber-700 font-semibold text-[11px] pt-0.5">
              Ön Kalibrasyon Modu Aktif
            </div>
          </div>
        </div>

        {/* Norm Version */}
        <div className="p-4 rounded-xl bg-bg-subtle border border-border-subtle">
          <div className="flex items-center space-x-2 text-text-tertiary mb-2">
            <Binary className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">Norm Durumu</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-text-secondary">Norm Kalibrasyonu:</span>
              <span className="font-bold text-amber-700">
                {scientific.normStatusCode === 'UNAVAILABLE' ? 'Kullanılamaz' : scientific.normStatusCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Örneklem Büyüklüğü:</span>
              <span className="font-bold text-text-primary font-mono">{scientific.normSampleSize}</span>
            </div>
            <div className="text-text-tertiary text-[11px] pt-0.5">
              Yapay yüzdelik üretimi engellenmiştir.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
