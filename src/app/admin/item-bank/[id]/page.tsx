import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth';
import { getItemDetail } from '@/services/scientificService';
import { LifecycleBadge, LicenseBadge } from '@/components/admin/scientific/ScientificBadges';
import { normalizeInstrumentLicensingDecision } from '@/lib/licenseNormalization';
import { Database, ArrowLeft, Lock, FileText, CheckCircle2, History, Scale } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ItemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requirePermission('SCIENTIFIC_VIEW');

  const item = await getItemDetail(params.id);
  if (!item) notFound();

  const instDecision = normalizeInstrumentLicensingDecision(item.instrument?.licensingDecision);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div>
        <Link
          href="/admin/item-bank"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-brand-600 transition-colors mb-3 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Madde Bankasına Dön
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-mono tracking-tight">
                  {item.itemCode}
                </h1>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${item.isKeyed ? 'bg-emerald-50 text-emerald-800' : 'bg-purple-50 text-purple-800'}`}>
                  {item.isKeyed ? 'Düz Kodlama (+)' : 'Ters Kodlama (-)'}
                </span>
                {item.isAttentionCheck && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    Dikkat Kontrolü
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {item.facet.construct.domain.nameTr} &gt; {item.facet.construct.nameTr} &gt; <strong className="text-text-primary">{item.facet.nameTr}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <LicenseBadge decision={instDecision} size="md" />
          </div>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block">
            Kayıtlı Sürüm Sayısı
          </span>
          <span className="text-xl font-bold text-text-primary mt-1 block">
            {item.versions.length} Sürüm
          </span>
          <span className="text-[11px] text-text-secondary mt-0.5 block">
            Tarihsel derin sürüm takibi
          </span>
        </div>

        <div className="p-4 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block">
            Toplanan Yanıt Sayısı
          </span>
          <span className="text-xl font-bold text-text-primary mt-1 block">
            {item._count.responses} Yanıt
          </span>
          <span className="text-[11px] text-text-secondary mt-0.5 block">
            Katılımcı değerlendirme verisi
          </span>
        </div>

        <div className="p-4 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block">
            Kaynak Envanter
          </span>
          <span className="text-sm font-bold text-text-primary mt-1 block">
            {item.instrument?.name || 'Özgün Araştırma / Bağımsız'}
          </span>
          <span className="text-[11px] text-text-secondary mt-0.5 block font-mono">
            {item.instrument?.licenseType || 'Public Domain'}
          </span>
        </div>
      </div>

      {/* Item Versions History */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-text-primary tracking-tight">
              Sürüm Geçmişi & Önerme Metinleri
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-text-tertiary">
            (Dondurulmuş Maddeler Değiştirilemez)
          </span>
        </div>

        <div className="divide-y divide-border-subtle">
          {item.versions.map((ver) => (
            <div key={ver.id} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-surface-2 text-text-primary border border-border-subtle">
                    Sürüm v{ver.versionNumber}
                  </span>
                  <LifecycleBadge status={ver.status} />
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-2 text-text-tertiary">
                    Yazar: {ver.authorType || 'LEGACY_UNSPECIFIED'}
                  </span>
                </div>

                <div className="text-xs text-text-tertiary">
                  Oluşturulma: {new Date(ver.createdAt).toLocaleDateString('tr-TR')}
                </div>
              </div>

              {/* Prompts */}
              <div className="space-y-2 p-4 rounded-xl bg-bg-subtle/50 border border-border-subtle">
                <div>
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block">
                    Türkçe Önerme Metni (TR)
                  </span>
                  <p className="text-sm font-semibold text-text-primary mt-0.5">
                    {ver.promptTr}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block">
                    İngilizce Orijinal Metin (EN)
                  </span>
                  <p className="text-xs text-text-secondary italic mt-0.5">
                    {ver.promptEn}
                  </p>
                </div>
              </div>

              {/* Likert Options */}
              <div>
                <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider block mb-2">
                  Cevap Seçenekleri ({ver.options.length} Seviyeli Likert)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {ver.options.map((opt) => (
                    <div key={opt.id} className="p-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-xs">
                      <div className="font-bold text-brand-700 font-mono text-[11px]">{opt.value} Puan</div>
                      <div className="font-semibold text-text-primary text-[11px] mt-0.5">{opt.labelTr}</div>
                      <div className="text-[10px] text-text-tertiary italic mt-0.5">{opt.labelEn}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Usages */}
              {ver.formItems.length > 0 && (
                <div className="text-xs text-text-tertiary pt-1">
                  Kullanıldığı Formlar:{' '}
                  {ver.formItems.map((fi) => (
                    <span key={fi.id} className="font-mono font-semibold text-text-primary mr-2">
                      {fi.formVersion.versionCode} (Sıra: {fi.sortOrder})
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
