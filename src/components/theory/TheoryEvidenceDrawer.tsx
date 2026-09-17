'use client';

import React, { useState } from 'react';
import { GroundedFacetDetail } from '@/types/theoryLens';
import { ShieldCheck, ChevronDown, ChevronUp, Layers, CheckCircle } from 'lucide-react';

interface TheoryEvidenceDrawerProps {
  facets: GroundedFacetDetail[];
}

export const TheoryEvidenceDrawer: React.FC<TheoryEvidenceDrawerProps> = ({ facets }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-indigo-100 dark:border-indigo-900/40 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Bu Yorum Neye Dayanıyor? (Ölçüm Kanıtları)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bu kuramsal analiz {facets.length} adet deterministik psikometrik alt boyut ölçümüne dayanmaktadır.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <span>{isOpen ? 'Kanıtları Gizle' : 'Kanıtları İncele'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-indigo-100 dark:border-indigo-900/40 bg-white/70 dark:bg-slate-900/70 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {facets.map((facet) => (
              <div
                key={facet.code}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      [{facet.code}]
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {facet.nameTr}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {facet.domainNameTr}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {facet.score.toFixed(2)}
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {facet.bandLabelTr}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              <strong>Deterministik Güvence:</strong> Kuramsal ekoller psikometrik puanları değiştiremez, puan hesaplayamaz veya eksik boyutları tahmin edemez. Yorumlar salt yukarıdaki ölçülmüş verilere dayanır.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
