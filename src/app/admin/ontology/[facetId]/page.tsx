import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth';
import { getFacetDetail } from '@/services/scientificService';
import { EvidenceBadge } from '@/components/admin/scientific/ScientificBadges';
import { Network, ArrowLeft, BookMarked, Scale, Database, Compass, CheckCircle2, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FacetDetailPage({
  params,
}: {
  params: { facetId: string };
}) {
  await requirePermission('SCIENTIFIC_VIEW');

  const facet = await getFacetDetail(params.facetId);
  if (!facet) notFound();

  const evidenceLevel = facet.validationSummary?.overallTurkishEvidenceLevel || 'NO_DIRECT';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div>
        <Link
          href="/admin/ontology"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-brand-600 transition-colors mb-3 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Tüm Ontoloji Haritasına Dön
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold shrink-0">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                  {facet.nameTr}
                </h1>
                <EvidenceBadge level={evidenceLevel} size="md" />
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {facet.construct.domain.nameTr} &gt; {facet.construct.nameTr} &gt; <strong className="text-text-primary font-mono">{facet.code}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Facet Description & Observable Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Bilimsel Tanım & Kapsam
            </h2>
            <p className="text-sm text-text-primary leading-relaxed">
              {facet.descriptionTr}
            </p>
            <p className="text-xs text-text-tertiary italic">
              {facet.descriptionEn}
            </p>
          </div>

          {/* Linked Items */}
          <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
              <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Bu Boyuta Eşleşen Maddeler ({facet.items.length})
              </h2>
            </div>

            {facet.items.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-tertiary">
                Bu alt boyuta henüz doğrudan canlı madde eşlenmemiştir.
              </div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {facet.items.map((itm) => (
                  <div key={itm.id} className="p-4 flex items-center justify-between hover:bg-bg-subtle/40">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-brand-700">{itm.itemCode}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-2">
                          {itm.isKeyed ? 'Düz (+)' : 'Ters (-)'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-text-primary">
                        {itm.versions[0]?.promptTr || '—'}
                      </p>
                    </div>

                    <Link
                      href={`/admin/item-bank/${itm.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-1 text-xs font-semibold text-text-primary hover:bg-bg-subtle shadow-xs"
                    >
                      Detay
                      <ChevronRight className="w-3.5 h-3.5 ml-1 text-text-tertiary" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info (Sources, Lenses, Instruments) */}
        <div className="space-y-6">
          {/* Validation Status Card */}
          <div className="p-5 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Türkçe Doğrulama Durumu
              </span>
              <Scale className="w-4 h-4 text-brand-600" />
            </div>

            <div className="pt-1">
              <EvidenceBadge level={evidenceLevel} size="md" />
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              {facet.validationSummary?.scientificNotes || 'Bu alt boyut için literatür kanıt notu kaydedilmemiştir.'}
            </p>

            <div className="pt-2">
              <Link
                href={`/admin/validation/${facet.id}`}
                className="inline-flex items-center text-xs font-bold text-brand-700 hover:text-brand-800"
              >
                Doğrulama Detaylarını İncele &gt;
              </Link>
            </div>
          </div>

          {/* Scientific Sources */}
          <div className="p-5 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Bibliyografik Kaynaklar ({facet.scientificSources.length})
              </span>
              <BookMarked className="w-4 h-4 text-brand-600" />
            </div>

            <div className="space-y-2 text-xs">
              {facet.scientificSources.map((fsrc) => (
                <div key={fsrc.sourceId} className="p-2.5 rounded-xl bg-surface-2/60 border border-border-subtle">
                  <span className="font-mono font-bold text-brand-700 text-[10px] block">{fsrc.source.shortKey}</span>
                  <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-2">{fsrc.source.citation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
