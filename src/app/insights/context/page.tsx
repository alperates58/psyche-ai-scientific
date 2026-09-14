import React from 'react';
import Link from 'next/link';
import { ArrowLeft, GitFork, CheckCircle2 } from 'lucide-react';
import { DEMO_PROFILE_DATA } from '@/data/demo-profile';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { PageContainer } from '@/components/ui/PageContainer';

export default function ContextShiftsPage() {
  const { contextShifts } = DEMO_PROFILE_DATA;

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
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Bağlamsal Değişim Analizi</h1>
              <span className="text-[11px] sm:text-xs bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold px-2 py-0.5 rounded-full shrink-0">
                ÖNİZLEME VERİSİ
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 max-w-2xl">
              İnsan kişiliği çevreye duyarlıdır. İş ortamı, yakın ilişkiler ve stres altındaki davranışsal değişimler içsel bir tutarsızlık değil, durumsal adaptasyon esnekliğini yansıtır.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-surface-1 px-3 py-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
            <GitFork className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Çok Bağlamlı Gözlem Modeli</span>
          </div>
        </div>
      </div>

      {/* Conceptual Explanation Banner */}
      <div className="bg-surface-1 p-4 rounded-card border border-border-subtle shadow-xs flex items-start space-x-3">
        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary leading-relaxed">
          <span className="font-bold text-text-primary">Bilimsel İlke:</span> Sosyal bağlamlar arasındaki davranışsal değişim, bağlama özgü durumsal zekâ göstergesidir; patolojik çelişki olarak nitelendirilmez.
        </div>
      </div>

      {/* Context Comparison Cards */}
      <div className="space-y-5">
        {contextShifts.map((shift) => (
          <div
            key={shift.constructName}
            className="bg-surface-1 p-4 sm:p-6 rounded-card border border-border-subtle shadow-xs space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
              <div>
                <h2 className="text-base font-bold text-text-primary">{shift.constructName_tr || shift.constructName}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <EpistemicBadge status="CONTEXTUAL_PATTERN" size="sm" />
                <span className="text-xs font-mono font-semibold text-text-tertiary bg-surface-2 px-2 py-0.5 rounded border border-border-subtle">
                  Değişkenlik İndeksi: {shift.variabilityIndex}
                </span>
              </div>
            </div>

            {/* Multi-Context Bar Comparisons (1 col mobile, 2 col tablet, 4 col desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* General */}
              <div className="bg-surface-2 p-3.5 rounded-xl border border-border-subtle">
                <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                  Genel / Temel Çizgi
                </div>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-2xl font-bold font-mono text-text-primary">{shift.general}</span>
                  <span className="text-[11px] text-text-tertiary">/ 100</span>
                </div>
                <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-slate-500 h-full rounded-full" style={{ width: `${shift.general}%` }} />
                </div>
              </div>

              {/* Work */}
              <div className="bg-brand-50/50 p-3.5 rounded-xl border border-brand-200/60">
                <div className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider">
                  İş / Profesyonel
                </div>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-2xl font-bold font-mono text-brand-700">{shift.work}</span>
                  <span className="text-[11px] text-text-tertiary">/ 100</span>
                </div>
                <div className="w-full bg-brand-200/80 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: `${shift.work}%` }} />
                </div>
              </div>

              {/* Relationship */}
              <div className="bg-teal-50/40 p-3.5 rounded-xl border border-teal-200/50">
                <div className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
                  Yakın İlişkiler
                </div>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-2xl font-bold font-mono text-teal-700">{shift.relationship}</span>
                  <span className="text-[11px] text-text-tertiary">/ 100</span>
                </div>
                <div className="w-full bg-teal-200/70 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: `${shift.relationship}%` }} />
                </div>
              </div>

              {/* Stress */}
              <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-200/50">
                <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                  Akut Stres Altında
                </div>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-2xl font-bold font-mono text-amber-800">{shift.stress}</span>
                  <span className="text-[11px] text-text-tertiary">/ 100</span>
                </div>
                <div className="w-full bg-amber-200/70 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: `${shift.stress}%` }} />
                </div>
              </div>
            </div>

            {/* Contextual Narrative */}
            <div className="p-3.5 rounded-xl bg-surface-2 border border-border-subtle/80 text-xs text-text-secondary leading-relaxed">
              <span className="font-semibold text-text-primary">Gözlenen Davranışsal Değişim:</span> {shift.interpretation}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
