import React from 'react';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth';
import { getSourcesList } from '@/services/scientificService';
import { BookMarked, Search, ChevronRight, ExternalLink, Calendar, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Bilimsel Kaynaklar — PsycheAI Scientific Admin',
  description: 'Bibliyografik kaynaklar, DOI bağlantıları ve kanıt atıf kayıtları',
};

export default async function SourcesPage() {
  await requirePermission('SCIENTIFIC_VIEW');

  const sources = await getSourcesList();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <BookMarked className="w-6 h-6 text-brand-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Bilimsel Kaynak Kaydı
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Ontoloji boyutlarına, geçerlilik kanıtlarına ve psikometrik envanterlere temel oluşturan akademik kaynaklar
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle font-semibold text-text-secondary shadow-xs">
            Toplam: <strong className="text-brand-700">{sources.length}</strong> Kaynak
          </span>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Bibliyografik Kaynaklar Listesi ({sources.length} Kayıt)
          </span>
          <span className="text-[11px] font-semibold text-text-tertiary">
            (Salt Okunur Görünüm)
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2/60 text-text-tertiary font-semibold uppercase tracking-wider border-b border-border-subtle">
              <tr>
                <th className="px-5 py-3">Kısa Anahtar</th>
                <th className="px-5 py-3">Akademik Atıf (APA)</th>
                <th className="px-5 py-3">Yıl</th>
                <th className="px-5 py-3">Bağlı Facet</th>
                <th className="px-5 py-3">Çalışma Kanıtı</th>
                <th className="px-5 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary font-medium">
              {sources.map((src) => (
                <tr key={src.id} className="hover:bg-bg-subtle/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-brand-700">
                    {src.shortKey}
                  </td>
                  <td className="px-5 py-4 max-w-md">
                    <p className="text-xs font-semibold text-text-primary line-clamp-2">
                      {src.citation}
                    </p>
                    {src.doi && (
                      <span className="text-[10px] text-text-tertiary font-mono block mt-0.5">
                        DOI: {src.doi}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-text-primary">
                    {src.year || '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-2 font-semibold text-[11px] text-text-secondary border border-border-subtle">
                      {src._count.facets} Facet
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-2 font-semibold text-[11px] text-text-secondary border border-border-subtle">
                      {src._count.validationStudyEvidences} Çalışma
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/sources/${src.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-1 hover:bg-bg-subtle text-text-primary font-semibold text-xs transition-colors shadow-xs"
                    >
                      Detay
                      <ChevronRight className="w-3.5 h-3.5 ml-1 text-text-tertiary" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-border-subtle">
          {sources.map((src) => (
            <div key={src.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-brand-700">
                  {src.shortKey}
                </span>
                <span className="font-mono text-xs text-text-tertiary font-bold">
                  {src.year || '—'}
                </span>
              </div>

              <p className="text-xs font-semibold text-text-primary line-clamp-3">
                {src.citation}
              </p>

              <div className="flex items-center space-x-2 text-xs text-text-tertiary pt-1">
                <span>{src._count.facets} Bağlı Boyut</span>
                <span>•</span>
                <span>{src._count.validationStudyEvidences} Doğrulama Kanıtı</span>
              </div>

              <div className="pt-2">
                <Link
                  href={`/admin/sources/${src.id}`}
                  className="flex items-center justify-center w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-2 text-xs font-semibold text-text-primary hover:bg-bg-subtle min-h-[44px]"
                >
                  Kaynak Detayını İncele
                  <ChevronRight className="w-4 h-4 ml-1 text-text-tertiary" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
