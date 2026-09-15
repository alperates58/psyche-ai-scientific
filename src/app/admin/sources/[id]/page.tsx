import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth';
import { getSourceDetail } from '@/services/scientificService';
import { BookMarked, ArrowLeft, ExternalLink, Calendar, Layers, Scale, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SourceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requirePermission('SCIENTIFIC_VIEW');

  const source = await getSourceDetail(params.id);
  if (!source) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div>
        <Link
          href="/admin/sources"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-brand-600 transition-colors mb-3 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Tüm Bilimsel Kaynaklara Dön
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold shrink-0">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-mono tracking-tight">
                  {source.shortKey}
                </h1>
                {source.year && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-surface-2 text-text-secondary border border-border-subtle">
                    {source.year}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Akademik Kaynak ve Bibliyografik Provenance Detayları
              </p>
            </div>
          </div>

          {source.url && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs min-h-[44px]"
            >
              Kaynak Bağlantısını Aç
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          )}
        </div>
      </div>

      {/* Citation Card */}
      <div className="p-5 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-3">
        <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider block">
          Tam Akademik Atıf (APA Formatı)
        </span>
        <p className="text-sm font-semibold text-text-primary leading-relaxed">
          {source.citation}
        </p>
        {source.doi && (
          <div className="pt-1 text-xs text-text-tertiary font-mono">
            DOI: <a href={`https://doi.org/${source.doi}`} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">{source.doi}</a>
          </div>
        )}
      </div>

      {/* Linked Facets and Study Evidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Linked Facets */}
        <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Temel Oluşturduğu Boyutlar ({source.facets.length})
            </h2>
          </div>

          {source.facets.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-tertiary">
              Bu kaynak henüz doğrudan bir alt boyuta bağlanmamıştır.
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {source.facets.map((f) => (
                <div key={f.facetId} className="p-4 flex items-center justify-between hover:bg-bg-subtle/40">
                  <div>
                    <span className="text-xs font-bold text-text-primary block">{f.facet.nameTr}</span>
                    <span className="text-[10px] text-text-tertiary">{f.facet.construct.nameTr}</span>
                  </div>
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

        {/* Linked Validation Evidence */}
        <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Doğrulama Matrisi Atıfları ({source.validationStudyEvidences.length})
            </h2>
          </div>

          {source.validationStudyEvidences.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-tertiary">
              Bu kaynak için bağımsız bir çalışma kanıt kaydı bulunmamaktadır.
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {source.validationStudyEvidences.map((v) => (
                <div key={v.id} className="p-4 flex items-center justify-between hover:bg-bg-subtle/40">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-text-primary block">
                      {v.validationSummary.facet.nameTr}
                    </span>
                    <span className="text-[10px] text-text-tertiary font-mono">
                      {v.evidenceType} {v.sampleN ? `(N=${v.sampleN})` : ''}
                    </span>
                  </div>
                  <Link
                    href={`/admin/validation/${v.validationSummary.facetId}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg border border-border-subtle bg-surface-1 text-xs font-semibold text-text-primary hover:bg-bg-subtle"
                  >
                    Kanıt &gt;
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
