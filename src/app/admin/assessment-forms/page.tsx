import React from 'react';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth';
import { getAssessmentFormsList } from '@/services/scientificService';
import { LifecycleBadge } from '@/components/admin/scientific/ScientificBadges';
import { FileCheck2, ChevronRight, Layers, Users, Calendar, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Değerlendirme Formları — PsycheAI Scientific Admin',
  description: 'Bilimsel değerlendirme form sürümleri ve aktif intake yönetimi',
};

export default async function AssessmentFormsPage() {
  await requirePermission('SCIENTIFIC_VIEW');

  const forms = await getAssessmentFormsList();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <FileCheck2 className="w-6 h-6 text-brand-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Değerlendirme Formları
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Psikometrik form sürümleri, dondurulmuş madde listeleri ve canlı oturum dağılımı
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle font-semibold text-text-secondary shadow-xs">
            Toplam: <strong className="text-brand-700">{forms.length}</strong> Form Sürümü
          </span>
        </div>
      </div>

      {/* Forms Table / Card Grid */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Kayıtlı Form Sürümleri
            </span>
            <span className="text-[11px] font-semibold text-text-tertiary">
              (Modül Başına Azami 1 Aktif Yayında Form)
            </span>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2/60 text-text-tertiary font-semibold uppercase tracking-wider border-b border-border-subtle">
              <tr>
                <th className="px-5 py-3">Sürüm Kodu</th>
                <th className="px-5 py-3">İlişkili Modül</th>
                <th className="px-5 py-3">Durum</th>
                <th className="px-5 py-3">Madde Sayısı</th>
                <th className="px-5 py-3">Tamamlanan Oturum</th>
                <th className="px-5 py-3">Yayınlanma Tarihi</th>
                <th className="px-5 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary font-medium">
              {forms.map((form) => (
                <tr key={form.id} className="hover:bg-bg-subtle/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-text-primary">
                    {form.versionCode}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-text-primary">{form.moduleTitleTr}</div>
                    <div className="text-[10px] text-text-tertiary font-mono">{form.moduleCode}</div>
                  </td>
                  <td className="px-5 py-4">
                    <LifecycleBadge status={form.status} />
                  </td>
                  <td className="px-5 py-4 font-semibold text-text-primary">
                    {form.itemCount} Madde
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-2 font-mono text-[11px] text-text-secondary border border-border-subtle">
                      <Users className="w-3 h-3 mr-1 opacity-60" />
                      {form.sessionCount}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-text-tertiary text-[11px]">
                    {form.publishedAt ? new Date(form.publishedAt).toLocaleDateString('tr-TR') : '—'}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/assessment-forms/${form.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-1 hover:bg-bg-subtle text-text-primary font-semibold text-xs transition-colors shadow-xs"
                    >
                      İncele
                      <ChevronRight className="w-3.5 h-3.5 ml-1 text-text-tertiary" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Fallback */}
        <div className="md:hidden divide-y divide-border-subtle">
          {forms.map((form) => (
            <div key={form.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-sm text-text-primary">
                    {form.versionCode}
                  </span>
                  <p className="text-xs font-semibold text-text-secondary mt-0.5">
                    {form.moduleTitleTr}
                  </p>
                </div>
                <LifecycleBadge status={form.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-text-tertiary pt-1">
                <div>
                  <span className="block text-[10px] uppercase font-semibold">Maddeler</span>
                  <span className="font-bold text-text-primary">{form.itemCount} Madde</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-semibold">Oturumlar</span>
                  <span className="font-bold text-text-primary">{form.sessionCount} Oturum</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/admin/assessment-forms/${form.id}`}
                  className="flex items-center justify-center w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-2 text-xs font-semibold text-text-primary hover:bg-bg-subtle min-h-[44px]"
                >
                  Form Detaylarını İncele
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
