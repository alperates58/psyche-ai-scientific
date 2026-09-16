import React from 'react';
import { requirePermission } from '@/lib/auth';
import { getAssessmentModulesList } from '@/services/scientificAdminService';
import { getAssessmentFormsList } from '@/services/scientificService';
import { NewFormDraftClient } from '@/components/admin/forms/NewFormDraftClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Yeni Taslak Form — PsycheAI Scientific Admin',
  description: 'Yeni taslak değerlendirme formu oluşturma ve klonlama',
};

export default async function NewAssessmentFormPage() {
  await requirePermission('FORM_DRAFT_MANAGE');

  const [modules, forms] = await Promise.all([
    getAssessmentModulesList(),
    getAssessmentFormsList(),
  ]);

  return (
    <div className="py-4">
      <NewFormDraftClient
        modules={modules.map((m) => ({
          id: m.id,
          code: m.code,
          titleTr: m.titleTr,
          titleEn: m.titleEn,
          estimatedMinutes: m.estimatedMinutes,
        }))}
        existingForms={forms.map((f) => ({
          id: f.id,
          versionCode: f.versionCode,
          moduleCode: f.moduleCode,
          moduleTitleTr: f.moduleTitleTr,
          itemCount: f.itemCount,
          status: f.status,
        }))}
      />
    </div>
  );
}
