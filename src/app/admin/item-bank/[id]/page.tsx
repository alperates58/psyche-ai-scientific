import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth';
import { getItemDetail } from '@/services/scientificService';
import { checkItemMetadataMutability } from '@/lib/scientificImmutability';
import { LifecycleBadge, LicenseBadge } from '@/components/admin/scientific/ScientificBadges';
import { normalizeInstrumentLicensingDecision } from '@/lib/licenseNormalization';
import { ItemDetailClient } from '@/components/admin/items/ItemDetailClient';
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
  const metadataMutability = checkItemMetadataMutability(item);

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
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.isKeyed ? 'bg-emerald-50 text-emerald-800' : 'bg-purple-50 text-purple-800'
                  }`}
                >
                  {item.isKeyed ? 'Düz Kodlama (+)' : 'Ters Kodlama (-)'}
                </span>
                {item.isAttentionCheck && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    Dikkat Kontrolü
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {item.facet.construct.domain.nameTr} &gt; {item.facet.construct.nameTr} &gt;{' '}
                <strong className="text-text-primary">{item.facet.nameTr}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!metadataMutability.isMutable ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle text-xs font-semibold text-text-secondary shadow-xs">
                <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                Dondurulmuş Madde Üst Verisi
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Taslak Madde (Değiştirilebilir)
              </span>
            )}
            <LicenseBadge decision={instDecision} size="md" />
          </div>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
            Puanlama Semantiği
          </span>
          <span className="text-sm font-bold text-text-primary mt-1 block">
            {item.isKeyed ? 'Normal / Düz (+)' : 'Ters Puanlama (-)'}
          </span>
          <span className="text-[11px] text-text-secondary mt-0.5 block">
            {item.itemType} Standart Ölçek
          </span>
        </div>

        <div className="p-4 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block">
            Kaynak Envanter
          </span>
          <span className="text-sm font-bold text-text-primary mt-1 block truncate">
            {item.instrument?.name || 'Özgün Araştırma / Bağımsız'}
          </span>
          <span className="text-[11px] text-text-secondary mt-0.5 block font-mono">
            {item.instrument?.licenseType || 'Public Domain'}
          </span>
        </div>
      </div>

      {/* Item Versions History Client Component */}
      <ItemDetailClient
        item={{
          id: item.id,
          itemCode: item.itemCode,
          isKeyed: item.isKeyed,
          isAttentionCheck: item.isAttentionCheck,
          itemType: item.itemType,
          _count: {
            responses: item._count.responses,
          },
          versions: item.versions.map((v) => ({
            id: v.id,
            versionNumber: v.versionNumber,
            promptTr: v.promptTr,
            promptEn: v.promptEn,
            notes: v.notes,
            status: v.status,
            validationStatus: v.validationStatus,
            authorType: v.authorType,
            createdAt: v.createdAt,
            _count: v._count,
            options: v.options.map((o) => ({
              id: o.id,
              value: o.value,
              labelTr: o.labelTr,
              labelEn: o.labelEn,
              sortOrder: o.sortOrder,
            })),
            formItems: v.formItems.map((fi) => ({
              id: fi.id,
              sortOrder: fi.sortOrder,
              formVersion: {
                id: fi.formVersion.id,
                versionCode: fi.formVersion.versionCode,
                status: fi.formVersion.status,
                isPublished: fi.formVersion.isPublished,
                module: {
                  titleTr: fi.formVersion.module.titleTr,
                },
              },
            })),
          })),
        }}
      />
    </div>
  );
}
