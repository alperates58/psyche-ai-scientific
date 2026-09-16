import React from 'react';
import { requirePermission } from '@/lib/auth';
import { getOntologyCascade } from '@/services/scientificAdminService';
import { getLicensesList } from '@/services/scientificService';
import { ItemAuthoringForm } from '@/components/admin/items/ItemAuthoringForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Yeni Madde Yazımı — PsycheAI Scientific Admin',
  description: 'Psikometrik madde ve ilk taslak sürüm oluşturma',
};

export default async function NewItemPage() {
  await requirePermission('ITEM_AUTHOR');

  const [ontologyCascade, licenses] = await Promise.all([
    getOntologyCascade(),
    getLicensesList(),
  ]);

  return (
    <div className="py-4">
      <ItemAuthoringForm
        ontologyCascade={ontologyCascade}
        instruments={licenses.map((inst) => ({
          id: inst.id,
          code: inst.code,
          name: inst.name,
          licenseType: inst.licenseType,
        }))}
      />
    </div>
  );
}
