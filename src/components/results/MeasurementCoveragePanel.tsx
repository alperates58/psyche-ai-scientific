'use client';

import React from 'react';
import {
  MeasuredConstructViewModel,
  UnmeasuredDomainViewModel,
} from '@/services/assessmentResultService';
import { Layers, CheckCircle2, CircleDashed, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface MeasurementCoveragePanelProps {
  measuredModuleName: string;
  constructs: MeasuredConstructViewModel[];
  unmeasuredDomains: UnmeasuredDomainViewModel[];
}

export const MeasurementCoveragePanel: React.FC<MeasurementCoveragePanelProps> = ({
  measuredModuleName,
  constructs,
  unmeasuredDomains,
}) => {
  const totalMeasuredFacets = constructs.reduce((acc, c) => acc + c.facets.length, 0);

  return (
    <div className="bg-surface-1 p-6 sm:p-8 rounded-panel border border-border-subtle shadow-sm space-y-6">
      <div className="space-y-1 border-b border-border-subtle pb-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-brand-600" />
          <h2 className="text-lg font-bold text-text-primary tracking-tight">
            Ontoloji Kapsamı: Bu Değerlendirme Neyi Ölçtü?
          </h2>
        </div>
        <p className="text-xs text-text-secondary">
          Psikolojik profiliniz tek bir testle sınırlandırılamayacak kadar zengindir. Aşağıda bu değerlendirmenin kapsadığı alanlar ve ileride açılacak katmanlar listelenmiştir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Covered in this test */}
        <div className="bg-surface-2/40 border border-border-subtle rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-text-primary">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bu Testte Ölçülen Boyutlar</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {constructs.length} Boyut • {totalMeasuredFacets} Alt Faktör
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {constructs.map((c) => (
              <div
                key={c.constructId}
                className="bg-surface-1 p-2.5 rounded-xl border border-border-subtle flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-text-primary">{c.nameTr}</span>
                <span className="text-[11px] text-text-tertiary">
                  {c.facets.length} alt faktör işlendi
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Remaining layers to explore */}
        <div className="bg-surface-2/40 border border-border-subtle rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-text-primary">
              <CircleDashed className="w-4 h-4 text-text-tertiary" />
              <span>Sıradaki Psikolojik Katmanlar</span>
            </div>
            <span className="text-[10px] font-semibold text-text-tertiary bg-bg-subtle px-2 py-0.5 rounded border border-border-subtle">
              {unmeasuredDomains.length} Alan Beklemede
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {unmeasuredDomains.slice(0, 4).map((d) => (
              <div
                key={d.domainId}
                className="bg-surface-1/60 p-2.5 rounded-xl border border-dashed border-border-subtle flex items-center justify-between text-xs opacity-80"
              >
                <div className="space-y-0.5">
                  <span className="font-semibold text-text-secondary">{d.nameTr}</span>
                </div>
                <span className="text-[10px] text-text-tertiary">
                  Önerilen değerlendirmelerle açılacak
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/assessments"
              className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              <span>Katalogdaki diğer testleri incele</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
