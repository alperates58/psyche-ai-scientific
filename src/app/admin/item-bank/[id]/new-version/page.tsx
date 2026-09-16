import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { requirePermission } from '@/lib/auth';
import { getItemDetail } from '@/services/scientificService';
import { ItemVersionAuthoringClient } from '@/components/admin/items/ItemVersionAuthoringClient';
import { ArrowLeft, Database } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Yeni Sürüm Oluştur — PsycheAI Scientific Admin',
  description: 'Mevcut madde için yeni sürüm (vN+1) yazımı',
};

export default async function NewItemVersionPage({
  params,
}: {
  params: { id: string };
}) {
  await requirePermission('ITEM_AUTHOR');

  const item = await getItemDetail(params.id);
  if (!item) notFound();

  const latestVersion = item.versions[0];
  if (!latestVersion) {
    redirect(`/admin/item-bank/${item.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6 animate-in fade-in duration-200">
      <div>
        <Link
          href={`/admin/item-bank/${item.id}`}
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-brand-600 transition-colors mb-3 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Madde Detayına Dön ({item.itemCode})
        </Link>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Yeni Madde Sürümü Yazımı (v{latestVersion.versionNumber + 1})
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Madde Kodu: <strong>{item.itemCode}</strong> • {item.facet.nameTr}
            </p>
          </div>
        </div>
      </div>

      <ItemVersionAuthoringClient
        itemId={item.id}
        itemCode={item.itemCode}
        nextVersionNumber={latestVersion.versionNumber + 1}
        latestVersion={{
          id: latestVersion.id,
          promptTr: latestVersion.promptTr,
          promptEn: latestVersion.promptEn,
          notes: latestVersion.notes,
        }}
      />
    </div>
  );
}
