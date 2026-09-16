'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AssessmentFormListItem } from '@/services/scientificService';
import { LifecycleBadge } from '@/components/admin/scientific/ScientificBadges';
import { CloneFormModal } from './CloneFormModal';
import { Users, ChevronRight, Copy, Lock, FileCheck2, Plus } from 'lucide-react';

interface AssessmentFormsListTableProps {
  forms: AssessmentFormListItem[];
}

export const AssessmentFormsListTable: React.FC<AssessmentFormsListTableProps> = ({ forms }) => {
  const [cloningForm, setCloningForm] = useState<AssessmentFormListItem | null>(null);

  return (
    <>
      {/* Forms Table / Card Grid */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Kayıtlı Değerlendirme Formları ({forms.length} Sürüm)
            </span>
          </div>

          <Link
            href="/admin/assessment-forms/new"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0 min-h-[38px]"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Yeni Taslak Form Oluştur
          </Link>
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
                <th className="px-5 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary font-medium">
              {forms.map((form) => {
                const isDraft = form.status === 'DRAFT';

                return (
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
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setCloningForm(form)}
                          title="Bu Formu Klonla"
                          className="inline-flex items-center px-2.5 py-1.5 rounded-xl border border-border-subtle bg-surface-1 hover:bg-surface-2 text-text-secondary font-semibold text-xs transition-colors shadow-xs"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1 text-text-tertiary" />
                          Klonla
                        </button>

                        <Link
                          href={`/admin/assessment-forms/${form.id}`}
                          className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors shadow-xs ${
                            isDraft
                              ? 'border-brand-300 bg-brand-50 hover:bg-brand-100 text-brand-700'
                              : 'border-border-subtle bg-surface-1 hover:bg-surface-2 text-text-primary'
                          }`}
                        >
                          {isDraft ? 'Düzenle' : 'İncele'}
                          <ChevronRight className="w-3.5 h-3.5 ml-1 text-text-tertiary" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCloningForm(form)}
                  className="flex items-center justify-center px-3 py-2 rounded-xl border border-border-subtle bg-surface-2 text-xs font-semibold text-text-secondary hover:bg-bg-subtle min-h-[44px]"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Klonla
                </button>

                <Link
                  href={`/admin/assessment-forms/${form.id}`}
                  className="flex items-center justify-center px-3 py-2 rounded-xl border border-border-subtle bg-surface-1 text-xs font-semibold text-text-primary hover:bg-bg-subtle min-h-[44px]"
                >
                  {form.status === 'DRAFT' ? 'Düzenle' : 'İncele'}
                  <ChevronRight className="w-4 h-4 ml-1 text-text-tertiary" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clone Modal */}
      {cloningForm && (
        <CloneFormModal
          isOpen={!!cloningForm}
          onClose={() => setCloningForm(null)}
          sourceForm={{
            id: cloningForm.id,
            versionCode: cloningForm.versionCode,
            moduleCode: cloningForm.moduleCode,
            moduleTitleTr: cloningForm.moduleTitleTr,
            itemCount: cloningForm.itemCount,
          }}
        />
      )}
    </>
  );
};
