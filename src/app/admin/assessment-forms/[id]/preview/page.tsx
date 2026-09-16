import React from 'react';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth';
import { getAssessmentFormDetail } from '@/services/scientificService';
import { DraftFormPreviewer } from '@/components/admin/preview/DraftFormPreviewer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Taslak Form Önizleme — PsycheAI Scientific Admin',
  description: 'Değerlendirme formu soru akışı güvenli taslak önizleme',
};

export default async function AssessmentFormPreviewPage({
  params,
}: {
  params: { id: string };
}) {
  await requirePermission('SCIENTIFIC_VIEW');

  const form = await getAssessmentFormDetail(params.id);
  if (!form) notFound();

  return (
    <div className="py-4">
      <DraftFormPreviewer
        form={{
          id: form.id,
          versionCode: form.versionCode,
          description: form.description,
          status: form.status,
          module: {
            titleTr: form.module.titleTr,
            code: form.module.code,
            estimatedMinutes: form.module.estimatedMinutes,
          },
          items: form.items.map((fi) => ({
            id: fi.id,
            sortOrder: fi.sortOrder,
            itemVersion: {
              id: fi.itemVersion.id,
              versionNumber: fi.itemVersion.versionNumber,
              promptTr: fi.itemVersion.promptTr,
              promptEn: fi.itemVersion.promptEn,
              options: fi.itemVersion.options.map((opt) => ({
                id: opt.id,
                value: opt.value,
                labelTr: opt.labelTr,
                labelEn: opt.labelEn,
              })),
              item: {
                itemCode: fi.itemVersion.item.itemCode,
                isKeyed: fi.itemVersion.item.isKeyed,
                isAttentionCheck: fi.itemVersion.item.isAttentionCheck,
                facet: {
                  nameTr: fi.itemVersion.item.facet.nameTr,
                  construct: {
                    nameTr: fi.itemVersion.item.facet.construct.nameTr,
                    domain: {
                      nameTr: fi.itemVersion.item.facet.construct.domain.nameTr,
                    },
                  },
                },
              },
            },
          })),
        }}
      />
    </div>
  );
}
