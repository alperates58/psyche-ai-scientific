'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ItemVersionEditor } from './ItemVersionEditor';
import { NewVersionModal } from './NewVersionModal';
import { LifecycleBadge, LicenseBadge } from '@/components/admin/scientific/ScientificBadges';
import { checkItemVersionMutability } from '@/lib/scientificImmutability';
import {
  History,
  Plus,
  Lock,
  Edit3,
  Layers,
  FileCheck2,
  Users,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

interface VersionOption {
  id: string;
  value: number;
  labelTr: string;
  labelEn: string;
  sortOrder: number;
}

interface FormUsage {
  id: string;
  sortOrder: number;
  formVersion: {
    id: string;
    versionCode: string;
    status: string;
    isPublished: boolean;
    module: {
      titleTr: string;
    };
  };
}

interface ItemVersionDetail {
  id: string;
  versionNumber: number;
  promptTr: string;
  promptEn: string;
  notes: string | null;
  status: string;
  validationStatus: string;
  authorType: string | null;
  createdAt: Date | string;
  options: VersionOption[];
  formItems: FormUsage[];
  _count?: {
    responses: number;
  };
}

interface ItemDetailClientProps {
  item: {
    id: string;
    itemCode: string;
    isKeyed: boolean;
    isAttentionCheck: boolean;
    itemType: string;
    versions: ItemVersionDetail[];
    _count: {
      responses: number;
    };
  };
}

export const ItemDetailClient: React.FC<ItemDetailClientProps> = ({ item }) => {
  const [isNewVersionModalOpen, setIsNewVersionModalOpen] = useState(false);
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);

  const latestVersion = item.versions[0];

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center">
            <History className="w-4 h-4 mr-2 text-brand-600" />
            Sürüm Geçmişi & Yönetimi ({item.versions.length} Kayıtlı Sürüm)
          </h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            Dondurulmuş sürümler değiştirilemez; yeni bir sürüm (v{latestVersion ? latestVersion.versionNumber + 1 : 2}) oluşturabilirsiniz.
          </p>
        </div>

        {latestVersion && (
          <button
            type="button"
            onClick={() => setIsNewVersionModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0 min-h-[38px]"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Yeni Sürüm Oluştur (v{latestVersion.versionNumber + 1})
          </button>
        )}
      </div>

      {/* Version Cards List */}
      <div className="space-y-4">
        {item.versions.map((ver) => {
          const mutability = checkItemVersionMutability({
            status: ver.status,
            isActive: ver.status === 'ACTIVE',
            formItems: ver.formItems,
            _count: ver._count,
          });

          const isEditing = editingVersionId === ver.id;

          return (
            <div
              key={ver.id}
              className="p-5 sm:p-6 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-4 text-xs"
            >
              {/* Version Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-surface-2 text-text-primary border border-border-subtle">
                    Sürüm v{ver.versionNumber}
                  </span>
                  <LifecycleBadge status={ver.status} />
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-2 text-text-tertiary">
                    Yazar: {ver.authorType || 'LEGACY_UNSPECIFIED'}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-2 text-text-tertiary">
                    Geçerlik: {ver.validationStatus}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-text-tertiary text-xs">
                  <span>Oluşturulma: {new Date(ver.createdAt).toLocaleDateString('tr-TR')}</span>
                  {mutability.isMutable ? (
                    <button
                      type="button"
                      onClick={() => setEditingVersionId(isEditing ? null : ver.id)}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs border border-brand-200 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1" />
                      {isEditing ? 'Düzenlemeyi Kapat' : 'Taslağı Düzenle'}
                    </button>
                  ) : (
                    <span className="inline-flex items-center text-amber-700 font-medium text-[11px]">
                      <Lock className="w-3 h-3 mr-1" />
                      Dondurulmuş
                    </span>
                  )}
                </div>
              </div>

              {/* Editable form or Display */}
              {isEditing ? (
                <ItemVersionEditor
                  version={{
                    id: ver.id,
                    versionNumber: ver.versionNumber,
                    promptTr: ver.promptTr,
                    promptEn: ver.promptEn,
                    notes: ver.notes,
                    status: ver.status,
                    options: ver.options,
                  }}
                />
              ) : (
                <>
                  {/* Prompts Display */}
                  <div className="space-y-2 p-4 rounded-xl bg-bg-subtle/50 border border-border-subtle">
                    <div>
                      <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block">
                        Türkçe Önerme Metni (TR)
                      </span>
                      <p className="text-sm font-semibold text-text-primary mt-0.5">
                        {ver.promptTr}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block">
                        İngilizce Önerme Metni (EN)
                      </span>
                      <p className="text-xs text-text-secondary italic mt-0.5">
                        {ver.promptEn}
                      </p>
                    </div>

                    {ver.notes && (
                      <div>
                        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block">
                          Not / Açıklama
                        </span>
                        <p className="text-xs text-text-tertiary mt-0.5">{ver.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Likert 5 Options Scale */}
                  <div>
                    <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider block mb-2">
                      Cevap Seçenekleri ({ver.options.length} Seviyeli Likert)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {ver.options.map((opt) => (
                        <div
                          key={opt.id}
                          className="p-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-xs"
                        >
                          <div className="font-bold text-brand-700 font-mono text-[11px]">
                            {opt.value} Puan
                          </div>
                          <div className="font-semibold text-text-primary text-[11px] mt-0.5">
                            {opt.labelTr}
                          </div>
                          <div className="text-[10px] text-text-tertiary italic mt-0.5">
                            {opt.labelEn}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form usages */}
                  {ver.formItems.length > 0 && (
                    <div className="p-3 rounded-xl bg-surface-2/40 border border-border-subtle text-xs text-text-tertiary flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-text-secondary">Kullanıldığı Formlar:</span>
                      {ver.formItems.map((fi) => (
                        <Link
                          key={fi.id}
                          href={`/admin/assessment-forms/${fi.formVersion.id}`}
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-1 hover:bg-surface-2 border border-border-subtle font-mono text-brand-700 font-semibold transition-colors"
                        >
                          <FileCheck2 className="w-3 h-3 mr-1 opacity-70" />
                          {fi.formVersion.versionCode} (Sıra: {fi.sortOrder}) [{fi.formVersion.status}]
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* New Version Modal */}
      {latestVersion && (
        <NewVersionModal
          isOpen={isNewVersionModalOpen}
          onClose={() => setIsNewVersionModalOpen(false)}
          itemId={item.id}
          itemCode={item.itemCode}
          latestVersion={{
            id: latestVersion.id,
            versionNumber: latestVersion.versionNumber,
            promptTr: latestVersion.promptTr,
            promptEn: latestVersion.promptEn,
            notes: latestVersion.notes,
            options: latestVersion.options,
          }}
        />
      )}
    </div>
  );
};
