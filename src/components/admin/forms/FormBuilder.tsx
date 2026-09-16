'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  removeQuestionFromFormDraftAction,
  reorderFormDraftItemsAction,
  updateAssessmentFormDraftMetadataAction,
} from '@/actions/scientificAdminActions';
import { QuestionPickerModal, EligibleQuestion } from './QuestionPickerModal';
import { PublicationValidationPanel } from './PublicationValidationPanel';
import { LifecycleBadge, LicenseBadge } from '@/components/admin/scientific/ScientificBadges';
import { normalizeInstrumentLicensingDecision } from '@/lib/licenseNormalization';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Eye,
  FileCheck2,
  AlertCircle,
  Loader2,
  Save,
  Layers,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface FormBuilderItem {
  id: string; // AssessmentFormItem ID
  sortOrder: number;
  itemVersionId: string;
  itemVersion: {
    id: string;
    versionNumber: number;
    promptTr: string;
    promptEn: string;
    status: string;
    validationStatus: string;
    authorType: string | null;
    item: {
      id: string;
      itemCode: string;
      isKeyed: boolean;
      isAttentionCheck: boolean;
      itemType: string;
      facet: {
        id: string;
        nameTr: string;
        nameEn: string;
        construct: {
          id: string;
          nameTr: string;
          domain: {
            id: string;
            nameTr: string;
          };
        };
      };
      instrument?: {
        id: string;
        name: string;
        licenseType: string;
        licensingDecision: string;
      } | null;
    };
  };
}

interface FormBuilderProps {
  form: {
    id: string;
    versionCode: string;
    status: string;
    description: string | null;
    module: {
      code: string;
      titleTr: string;
      estimatedMinutes: number;
    };
    items: FormBuilderItem[];
  };
  eligibleQuestions: EligibleQuestion[];
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  form,
  eligibleQuestions,
}) => {
  const router = useRouter();
  const [items, setItems] = useState<FormBuilderItem[]>(form.items);
  const [description, setDescription] = useState(form.description || '');
  const [isDescSaving, setIsDescSaving] = useState(false);
  const [descSuccess, setDescSuccess] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Sync state if form prop updates
  React.useEffect(() => {
    setItems(form.items);
  }, [form.items]);

  // Coverage statistics (descriptive only)
  const stats = React.useMemo(() => {
    const facetSet = new Set<string>();
    const constructSet = new Set<string>();
    const domainSet = new Set<string>();

    let regularCount = 0;
    let reverseCount = 0;
    let attentionCount = 0;

    for (const fi of items) {
      const itm = fi.itemVersion.item;
      facetSet.add(itm.facet.id);
      constructSet.add(itm.facet.construct.id);
      domainSet.add(itm.facet.construct.domain.id);

      if (itm.isKeyed) regularCount++;
      else reverseCount++;

      if (itm.isAttentionCheck) attentionCount++;
    }

    return {
      totalItems: items.length,
      distinctFacets: facetSet.size,
      distinctConstructs: constructSet.size,
      distinctDomains: domainSet.size,
      regularCount,
      reverseCount,
      attentionCount,
    };
  }, [items]);

  const handleSaveDescription = async () => {
    setError(null);
    setIsDescSaving(true);
    setDescSuccess(false);

    try {
      const res = await updateAssessmentFormDraftMetadataAction({
        formVersionId: form.id,
        description,
      });

      if (!res.success) {
        setError(res.error || 'Açıklama kaydedilemedi.');
        setIsDescSaving(false);
        return;
      }

      setDescSuccess(true);
      setTimeout(() => setDescSuccess(false), 2000);
      setIsDescSaving(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
      setIsDescSaving(false);
    }
  };

  const handleMove = async (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    setError(null);
    setIsReordering(true);

    const reordered = [...items];
    const temp = reordered[currentIndex];
    reordered[currentIndex] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Optimistic UI update
    setItems(reordered);

    try {
      const res = await reorderFormDraftItemsAction({
        formVersionId: form.id,
        orderedFormItemIds: reordered.map((i) => i.id),
      });

      if (!res.success) {
        setError(res.error || 'Sıralama kaydedilemedi.');
        // Revert to server prop
        setItems(form.items);
        setIsReordering(false);
        return;
      }

      setIsReordering(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
      setItems(form.items);
      setIsReordering(false);
    }
  };

  const handleRemove = async (formItemId: string) => {
    if (!confirm('Bu soruyu taslak formdan çıkarmak istediğinizden emin misiniz? (Madde havuzdan silinmez)')) {
      return;
    }

    setError(null);
    setRemovingId(formItemId);

    try {
      const res = await removeQuestionFromFormDraftAction({
        formVersionId: form.id,
        formItemId,
      });

      if (!res.success) {
        setError(res.error || 'Madde çıkarılamadı.');
        setRemovingId(null);
        return;
      }

      setRemovingId(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-bold">İşlem Başarısız Oldu</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Publication Validation & Safe Publish Control Plane */}
      <PublicationValidationPanel
        formVersionId={form.id}
        versionCode={form.versionCode}
      />

      {/* Metadata & Controls Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Description & Save */}
        <div className="lg:col-span-2 p-5 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Taslak Form Bilgileri & Notlar
            </span>
            {descSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Kaydedildi
              </span>
            )}
          </div>

          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Bu taslak sürüm hakkında açıklama veya psikometrik revizyon notları..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-text-tertiary">
              Tahmini Yanıtlama: ~{form.module.estimatedMinutes} dk (5 Seçenekli Likert)
            </span>
            <button
              type="button"
              onClick={handleSaveDescription}
              disabled={isDescSaving}
              className="inline-flex items-center px-4 py-1.5 rounded-xl bg-surface-2 hover:bg-bg-subtle text-text-primary font-semibold text-xs border border-border-subtle transition-colors shadow-xs"
            >
              {isDescSaving ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-brand-600" />
              ) : (
                <Save className="w-3.5 h-3.5 mr-1.5 text-text-tertiary" />
              )}
              Notu Kaydet
            </button>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="p-5 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1">
              Hızlı İşlemler
            </span>
            <p className="text-[11px] text-text-tertiary">
              Soru ekleyin veya formu katılımcı gözünden önizleyin.
            </p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors shadow-xs min-h-[42px]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Havuzdan Soru Ekle
            </button>

            <Link
              href={`/admin/assessment-forms/${form.id}/preview`}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-surface-2 hover:bg-bg-subtle text-text-primary font-semibold text-xs border border-border-subtle transition-colors shadow-xs min-h-[42px]"
            >
              <Eye className="w-4 h-4 mr-2 text-brand-600" />
              Taslak Formu Önizle
            </Link>
          </div>
        </div>
      </div>

      {/* Coverage Summary (Purely descriptive) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
        <div className="p-3.5 bg-surface-1 border border-border-subtle rounded-xl shadow-xs">
          <span className="text-[10px] uppercase font-bold text-text-tertiary block">Toplam Soru</span>
          <span className="text-lg font-bold text-text-primary mt-0.5 block">{stats.totalItems}</span>
        </div>

        <div className="p-3.5 bg-surface-1 border border-border-subtle rounded-xl shadow-xs">
          <span className="text-[10px] uppercase font-bold text-text-tertiary block">Alt Boyut (Facet)</span>
          <span className="text-lg font-bold text-brand-700 mt-0.5 block">{stats.distinctFacets}</span>
        </div>

        <div className="p-3.5 bg-surface-1 border border-border-subtle rounded-xl shadow-xs">
          <span className="text-[10px] uppercase font-bold text-text-tertiary block">Ana Yapı (Construct)</span>
          <span className="text-lg font-bold text-text-primary mt-0.5 block">{stats.distinctConstructs}</span>
        </div>

        <div className="p-3.5 bg-surface-1 border border-border-subtle rounded-xl shadow-xs">
          <span className="text-[10px] uppercase font-bold text-text-tertiary block">Alan (Domain)</span>
          <span className="text-lg font-bold text-text-primary mt-0.5 block">{stats.distinctDomains}</span>
        </div>

        <div className="p-3.5 bg-surface-1 border border-border-subtle rounded-xl shadow-xs">
          <span className="text-[10px] uppercase font-bold text-text-tertiary block">Düz Kodlama (+)</span>
          <span className="text-lg font-bold text-emerald-700 mt-0.5 block">{stats.regularCount}</span>
        </div>

        <div className="p-3.5 bg-surface-1 border border-border-subtle rounded-xl shadow-xs">
          <span className="text-[10px] uppercase font-bold text-text-tertiary block">Ters Kodlama (-)</span>
          <span className="text-lg font-bold text-purple-700 mt-0.5 block">{stats.reverseCount}</span>
        </div>

        <div className="p-3.5 bg-surface-1 border border-border-subtle rounded-xl shadow-xs">
          <span className="text-[10px] uppercase font-bold text-text-tertiary block">Dikkat Kontrolü</span>
          <span className="text-lg font-bold text-amber-700 mt-0.5 block">{stats.attentionCount}</span>
        </div>
      </div>

      {/* Ordered Question List */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-text-primary tracking-tight">
              Soru Dizilimi ({items.length} Soru)
            </h2>
            <p className="text-xs text-text-tertiary mt-0.5">
              Katılımcılara gösterilecek sıra. Yukarı/Aşağı okları ile sıralamayı güvenle değiştirebilirsiniz.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs border border-brand-200/60 transition-colors shadow-xs shrink-0 self-start sm:self-auto min-h-[38px]"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Soru Ekle
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center text-xs text-text-tertiary space-y-3">
            <BookOpen className="w-10 h-10 mx-auto opacity-40 text-text-disabled" />
            <div>
              <p className="font-bold text-text-secondary text-sm">Bu Taslak Formda Henüz Soru Yok</p>
              <p className="mt-1">Havuzdan madde ekleyerek taslak formunuzu oluşturmaya başlayın.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              İlk Soruyu Ekle
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {items.map((formItem, index) => {
              const itm = formItem.itemVersion.item;
              const ver = formItem.itemVersion;
              const instDecision = normalizeInstrumentLicensingDecision(itm.instrument?.licensingDecision);
              const isRemoving = removingId === formItem.id;

              return (
                <div
                  key={formItem.id}
                  className="p-4 sm:p-5 hover:bg-surface-2/40 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs"
                >
                  {/* Left: Sequence badge & details */}
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-surface-2 border border-border-subtle font-mono text-xs font-bold text-text-primary flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>

                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Item Badges Bar */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded text-[11px] border border-brand-200/60">
                          {itm.itemCode}
                        </span>
                        <span className="font-mono text-[10px] font-semibold text-text-tertiary bg-surface-2 px-1.5 py-0.5 rounded">
                          v{ver.versionNumber}
                        </span>
                        <LifecycleBadge status={ver.status} size="sm" />
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            itm.isKeyed ? 'bg-emerald-50 text-emerald-800' : 'bg-purple-50 text-purple-800'
                          }`}
                        >
                          {itm.isKeyed ? 'Düz Kodlama (+)' : 'Ters Kodlama (-)'}
                        </span>
                        {itm.isAttentionCheck && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            Dikkat Kontrolü
                          </span>
                        )}
                        <LicenseBadge decision={instDecision} size="sm" />
                      </div>

                      {/* Prompts */}
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-text-primary">
                          {ver.promptTr}
                        </p>
                        <p className="text-xs text-text-tertiary italic">
                          {ver.promptEn}
                        </p>
                      </div>

                      {/* Hierarchy path */}
                      <div className="text-[11px] text-text-tertiary">
                        {itm.facet.construct.domain.nameTr} &gt; {itm.facet.construct.nameTr} &gt;{' '}
                        <strong className="text-text-primary">{itm.facet.nameTr}</strong>
                        {itm.instrument && (
                          <span className="ml-2">• Envanter: {itm.instrument.name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Reorder & Remove Actions */}
                  <div className="flex items-center justify-end space-x-1.5 shrink-0 pt-2 sm:pt-0 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={index === 0 || isReordering}
                      onClick={() => handleMove(index, 'up')}
                      title="Yukarı Taşı"
                      className="p-2 rounded-xl border border-border-subtle bg-surface-1 hover:bg-surface-2 text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      disabled={index === items.length - 1 || isReordering}
                      onClick={() => handleMove(index, 'down')}
                      title="Aşağı Taşı"
                      className="p-2 rounded-xl border border-border-subtle bg-surface-1 hover:bg-surface-2 text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      disabled={isRemoving}
                      onClick={() => handleRemove(formItem.id)}
                      title="Formdan Çıkar"
                      className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 disabled:opacity-30 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                    >
                      {isRemoving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Question Picker Drawer / Modal */}
      <QuestionPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        formVersionId={form.id}
        eligibleQuestions={eligibleQuestions}
      />
    </div>
  );
};
