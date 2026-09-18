'use client';

import React from 'react';
import { ContextualObservation } from '@/types/longitudinal';
import { Sparkles, Briefcase, Heart, ShieldAlert, Cpu } from 'lucide-react';

interface ContextualShiftsSectionProps {
  contextualObservations: ContextualObservation[];
}

export function ContextualShiftsSection({ contextualObservations }: ContextualShiftsSectionProps) {
  const hasData = contextualObservations && contextualObservations.length > 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-slate-800">
        <Sparkles className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-semibold">Bağlamsal Farklılıklar (Contextual Shift)</h3>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Genel mizaç eğilimleriniz ile belirli yaşam bağlamlarındaki (iş, ilişkiler, stres, karar anı) tutumlarınız arasındaki farklılıklar. Bağlamsal farklılık bir &quot;tutarsızlık&quot; ya da &quot;çelişki&quot; değil, psikolojik esneklik ve durumsal adaptasyondur.
      </p>

      {!hasData ? (
        <div className="mt-5 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center">
          <p className="text-xs text-slate-500">
            Mevcut envanterler genel mizaç ve benlik yapınızı ölçmektedir. Gelecek modüllerde bağlamsal kişilik değerlendirmeleri tamamlandıkça durumsal farklılıklar bu bölümde raporlanacaktır.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="rounded-md border border-slate-200 bg-white px-2 py-1">İş & Kariyer</span>
            <span className="rounded-md border border-slate-200 bg-white px-2 py-1">İlişkiler & Yakınlık</span>
            <span className="rounded-md border border-slate-200 bg-white px-2 py-1">Stres Anı</span>
            <span className="rounded-md border border-slate-200 bg-white px-2 py-1">Karar Verme</span>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {contextualObservations.map((obs, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 text-xs">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span>{obs.facetNameTr}</span>
                <span className="rounded bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] text-indigo-700">
                  {obs.contextType}
                </span>
              </div>
              <p className="mt-1 text-slate-600">{obs.noteTr}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
