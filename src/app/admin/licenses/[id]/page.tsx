import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth';
import { getLicenseDetail } from '@/services/scientificService';
import { LicenseBadge } from '@/components/admin/scientific/ScientificBadges';
import { KeyRound, ArrowLeft, ShieldCheck, FileText, Database, Layers, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LicenseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requirePermission('SCIENTIFIC_VIEW');

  const inst = await getLicenseDetail(params.id);
  if (!inst) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div>
        <Link
          href="/admin/licenses"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-brand-600 transition-colors mb-3 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Tüm Lisans Kayıtlarına Dön
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-mono tracking-tight">
                  {inst.code}
                </h1>
                <LicenseBadge decision={inst.normalizedDecision} size="md" />
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {inst.name} {inst.fullName ? `— ${inst.fullName}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* License Summary Card */}
      <div className="p-5 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-3">
        <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider block">
          Hukuki Lisans ve Kullanım Notları
        </span>
        <div className="text-xs text-text-secondary space-y-1">
          <p><strong>Lisans Türü:</strong> {inst.licenseType}</p>
          <p><strong>Karar:</strong> {inst.licensingDecision}</p>
          {inst.citation && (
            <p className="pt-1 text-text-primary">
              <strong>Atıf / Notlar:</strong> {inst.citation}
            </p>
          )}
        </div>
      </div>

      {/* Linked Items and Facets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Bağlı Maddeler ({inst.items.length})
            </h2>
          </div>

          {inst.items.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-tertiary">
              Bu envantere doğrudan bağlı canlı madde bulunmamaktadır.
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {inst.items.map((itm) => (
                <div key={itm.id} className="p-4 flex items-center justify-between hover:bg-bg-subtle/40">
                  <span className="font-mono text-xs font-bold text-brand-700">{itm.itemCode}</span>
                  <Link
                    href={`/admin/item-bank/${itm.id}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg border border-border-subtle bg-surface-1 text-xs font-semibold text-text-primary hover:bg-bg-subtle"
                  >
                    Detay &gt;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Eşleşen Alt Boyutlar ({inst.facets.length})
            </h2>
          </div>

          {inst.facets.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-tertiary">
              Bu envanter doğrudan bir boyuta bağlanmamıştır.
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {inst.facets.map((f) => (
                <div key={f.facetId} className="p-4 flex items-center justify-between hover:bg-bg-subtle/40">
                  <span className="text-xs font-bold text-text-primary">{f.facet.nameTr}</span>
                  <Link
                    href={`/admin/ontology/${f.facetId}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg border border-border-subtle bg-surface-1 text-xs font-semibold text-text-primary hover:bg-bg-subtle"
                  >
                    Facet &gt;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
