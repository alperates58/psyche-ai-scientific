import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth';
import { getAssessmentFormDetail } from '@/services/scientificService';
import { LifecycleBadge, LicenseBadge } from '@/components/admin/scientific/ScientificBadges';
import { normalizeInstrumentLicensingDecision } from '@/lib/licenseNormalization';
import { FileCheck2, ArrowLeft, Layers, ShieldCheck, Lock, Users, Clock, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AssessmentFormDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requirePermission('SCIENTIFIC_VIEW');

  const form = await getAssessmentFormDetail(params.id);
  if (!form) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation & Breadcrumb */}
      <div>
        <Link
          href="/admin/assessment-forms"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-brand-600 transition-colors mb-3 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Tüm Değerlendirme Formlarına Dön
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-mono tracking-tight">
                  {form.versionCode}
                </h1>
                <LifecycleBadge status={form.status} />
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {form.module.titleTr} ({form.module.code})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle text-xs font-semibold text-text-secondary shadow-xs">
              <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              Yayınlanmış Form — Salt Okunur
            </span>
          </div>
        </div>
      </div>

      {/* Metadata Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block">
            Toplam Madde
          </span>
          <span className="text-xl font-bold text-text-primary mt-1 block">
            {form.items.length} Soru
          </span>
          <span className="text-[11px] text-text-secondary mt-0.5 block">
            Dondurulmuş sıralı madde dizilimi
          </span>
        </div>

        <div className="p-4 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block">
            Canlı Oturum Sayısı
          </span>
          <span className="text-xl font-bold text-text-primary mt-1 block">
            {form._count.sessions} Oturum
          </span>
          <span className="text-[11px] text-text-secondary mt-0.5 block">
            Bu form ile başlatılan toplam test
          </span>
        </div>

        <div className="p-4 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block">
            Tahmini Tamamlama
          </span>
          <span className="text-xl font-bold text-text-primary mt-1 block">
            ~{form.module.estimatedMinutes} Dakika
          </span>
          <span className="text-[11px] text-text-secondary mt-0.5 block">
            5 seçenekli standart Likert ölçeği
          </span>
        </div>

        <div className="p-4 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block">
            Yayınlanma Zamanı
          </span>
          <span className="text-sm font-bold text-text-primary mt-1 block font-mono">
            {form.publishedAt ? new Date(form.publishedAt).toLocaleString('tr-TR') : '—'}
          </span>
          <span className="text-[11px] text-emerald-700 mt-0.5 block font-medium">
            Tarihsel referans değişmezliği aktif
          </span>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-text-primary tracking-tight">
              Dondurulmuş Madde Dizilimi ({form.items.length} Madde)
            </h2>
            <p className="text-xs text-text-tertiary mt-0.5">
              Katılımcılara sunulan sıra, madde sürüm kodları ve eşleşen psikolojik boyutlar
            </p>
          </div>
        </div>

        <div className="divide-y divide-border-subtle">
          {form.items.map((formItem) => {
            const itm = formItem.itemVersion.item;
            const ver = formItem.itemVersion;
            const instDecision = normalizeInstrumentLicensingDecision(itm.instrument?.licensingDecision);

            return (
              <div key={formItem.id} className="p-5 hover:bg-bg-subtle/40 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-7 h-7 rounded-lg bg-surface-2 border border-border-subtle font-mono text-xs font-bold text-text-secondary flex items-center justify-center shrink-0">
                      {formItem.sortOrder}
                    </span>
                    <span className="font-mono text-xs font-bold text-brand-700">
                      {itm.itemCode}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-2 text-text-secondary border border-border-subtle">
                      v{ver.versionNumber}
                    </span>
                    {itm.isAttentionCheck && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        Dikkat Kontrolü
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-text-tertiary font-medium">
                      {itm.facet.construct.domain.nameTr} &gt; {itm.facet.construct.nameTr} &gt; <strong className="text-text-primary">{itm.facet.nameTr}</strong>
                    </span>
                  </div>
                </div>

                {/* Prompt texts */}
                <div className="space-y-1.5 pl-9">
                  <p className="text-sm font-semibold text-text-primary">
                    {ver.promptTr}
                  </p>
                  <p className="text-xs text-text-tertiary italic">
                    {ver.promptEn}
                  </p>
                </div>

                {/* Options and licensing metadata */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 pl-9 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-text-tertiary font-medium">
                      Ölçek: {itm.itemType} ({itm.isKeyed ? 'Düz Kodlama +' : 'Ters Kodlama -'})
                    </span>
                    <span className="text-text-disabled">•</span>
                    <span className="text-[11px] text-text-tertiary font-medium">
                      Envanter: {itm.instrument?.name || 'Özgün Araştırma'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <LicenseBadge decision={instDecision} size="sm" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
