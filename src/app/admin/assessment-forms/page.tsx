import React from 'react';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth';
import { getAssessmentFormsList } from '@/services/scientificService';
import { AssessmentFormsListTable } from '@/components/admin/forms/AssessmentFormsListTable';
import { FileCheck2, Plus, Layers, ShieldCheck, HelpCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Değerlendirme Formları — PsycheAI Scientific Admin',
  description: 'Psikometrik form sürümleri, taslak oluşturma ve soru dizilimi yönetimi',
};

export default async function AssessmentFormsPage() {
  await requirePermission('SCIENTIFIC_VIEW');

  const forms = await getAssessmentFormsList();

  const publishedCount = forms.filter((f) => f.status === 'PUBLISHED').length;
  const draftCount = forms.filter((f) => f.status === 'DRAFT').length;

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
            Psikometrik form sürümleri, taslak yönetimi, dondurulmuş madde listeleri ve canlı oturumlar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle font-semibold text-text-secondary shadow-xs">
            Toplam: <strong className="text-brand-700">{forms.length}</strong> Form
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 font-semibold text-emerald-800 shadow-xs">
            Yayında: <strong>{publishedCount}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 font-semibold text-amber-800 shadow-xs">
            Taslak: <strong>{draftCount}</strong>
          </span>
        </div>
      </div>

      {/* Forms Table with Client Actions (Create, Clone, Builder) */}
      <AssessmentFormsListTable forms={forms} />
    </div>
  );
}
