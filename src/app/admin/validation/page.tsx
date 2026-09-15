import React from 'react';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth';
import { getValidationMatrixList } from '@/services/scientificService';
import { EvidenceBadge } from '@/components/admin/scientific/ScientificBadges';
import { Scale, ChevronRight, Layers, CheckCircle2, AlertTriangle, Eye, HelpCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Doğrulama Matrisi — PsycheAI Scientific Admin',
  description: '84 alt boyutun Türkçe psikometrik kanıt düzeyleri ve geçerlilik haritası',
};

export default async function ValidationMatrixPage() {
  await requirePermission('SCIENTIFIC_VIEW');

  const { summaries, stats } = await getValidationMatrixList();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Scale className="w-6 h-6 text-brand-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Türkçe Doğrulama Matrisi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            PsycheAI ontolojisindeki 84 facet için ampirik literatür ve psikometrik geçerlilik kanıt haritası
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle font-semibold text-text-secondary shadow-xs">
            Toplam: <strong className="text-brand-700">{stats.total}</strong> Boyut Kanıtı
          </span>
        </div>
      </div>

      {/* 4 Aggregate Level Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-1 border border-emerald-200/60 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              DIRECT (Doğrudan)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">
            {stats.levelCounts.DIRECT} Boyut
          </span>
          <span className="text-[11px] text-text-tertiary mt-0.5 block">
            Doğrudan Türkçe psikometrik uyarlama
          </span>
        </div>

        <div className="p-4 bg-surface-1 border border-blue-200/60 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              LEXICAL (Leksikal)
            </span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-blue-700 mt-1 block">
            {stats.levelCounts.LEXICAL} Boyut
          </span>
          <span className="text-[11px] text-text-tertiary mt-0.5 block">
            Geniş faktör leksikal yakınsama
          </span>
        </div>

        <div className="p-4 bg-surface-1 border border-amber-200/60 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              RELATED (İlişkili)
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-bold text-amber-700 mt-1 block">
            {stats.levelCounts.RELATED} Boyut
          </span>
          <span className="text-[11px] text-text-tertiary mt-0.5 block">
            Komşu psikolojik yapı kanıtı
          </span>
        </div>

        <div className="p-4 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
              NO_DIRECT (Doğrudan Yok)
            </span>
            <HelpCircle className="w-4 h-4 text-text-tertiary" />
          </div>
          <span className="text-2xl font-bold text-text-primary mt-1 block">
            {stats.levelCounts.NO_DIRECT} Boyut
          </span>
          <span className="text-[11px] text-text-tertiary mt-0.5 block">
            Uluslararası yapı + uzman çevirisi
          </span>
        </div>
      </div>

      {/* Validation Matrix Table */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
            84 Alt Boyut Kanıt Durumu (100% Veritabanı Kaynaklı)
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
                <th className="px-5 py-3">Boyut Kodu & Adı</th>
                <th className="px-5 py-3">Alan & Yapı</th>
                <th className="px-5 py-3">Türkçe Kanıt Düzeyi</th>
                <th className="px-5 py-3">Örneklem & Metod</th>
                <th className="px-5 py-3">Çalışma / Güvenilirlik</th>
                <th className="px-5 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary font-medium">
              {summaries.map((s) => (
                <tr key={s.id} className="hover:bg-bg-subtle/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-text-primary">
                    <div className="font-bold">{s.facet.nameTr}</div>
                    <div className="text-[10px] text-text-tertiary font-mono">{s.facet.code}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div>{s.facet.construct.domain.nameTr}</div>
                    <div className="text-[10px] text-text-tertiary">{s.facet.construct.nameTr}</div>
                  </td>
                  <td className="px-5 py-4">
                    <EvidenceBadge level={s.overallTurkishEvidenceLevel} />
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-[11px] line-clamp-2 text-text-secondary">
                      {s.sampleDescription || 'Örneklem açıklaması mevcut değil'}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-[11px] font-mono">
                      {s.studyEvidences.length} Çalışma • {s.reliabilityEvidences.length} Güvenilirlik
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/validation/${s.facetId}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-1 hover:bg-bg-subtle text-text-primary font-semibold text-xs transition-colors shadow-xs"
                    >
                      Kanıt
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
          {summaries.map((s) => (
            <div key={s.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-text-primary">
                  {s.facet.nameTr}
                </span>
                <EvidenceBadge level={s.overallTurkishEvidenceLevel} size="sm" />
              </div>

              <p className="text-xs text-text-tertiary">
                {s.facet.construct.nameTr} ({s.facet.construct.domain.nameTr})
              </p>

              {s.sampleDescription && (
                <p className="text-xs text-text-secondary line-clamp-2">
                  {s.sampleDescription}
                </p>
              )}

              <div className="pt-2">
                <Link
                  href={`/admin/validation/${s.facetId}`}
                  className="flex items-center justify-center w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-2 text-xs font-semibold text-text-primary hover:bg-bg-subtle min-h-[44px]"
                >
                  Doğrulama Kanıtlarını İncele
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
