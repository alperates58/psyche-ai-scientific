'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { addQuestionToFormDraftAction } from '@/actions/scientificAdminActions';
import { LifecycleBadge, LicenseBadge } from '@/components/admin/scientific/ScientificBadges';
import { Search, Plus, X, AlertCircle, Loader2, Database, ShieldAlert, Check } from 'lucide-react';

export interface EligibleQuestion {
  id: string; // ItemVersion ID
  versionNumber: number;
  promptTr: string;
  promptEn: string;
  status: string;
  validationStatus: string;
  authorType: string | null;
  normalizedInstrumentDecision: string;
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
        nameTr: string;
        domain: {
          nameTr: string;
        };
      };
    };
    instrument?: {
      name: string;
      licenseType: string;
    } | null;
  };
}

interface QuestionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  formVersionId: string;
  eligibleQuestions: EligibleQuestion[];
}

export const QuestionPickerModal: React.FC<QuestionPickerModalProps> = ({
  isOpen,
  onClose,
  formVersionId,
  eligibleQuestions,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacetId, setSelectedFacetId] = useState<string>('ALL');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Extract unique facets from eligible items for filtering
  const facetOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const q of eligibleQuestions) {
      if (!map.has(q.item.facet.id)) {
        map.set(q.item.facet.id, `${q.item.facet.construct.domain.nameTr} > ${q.item.facet.nameTr}`);
      }
    }
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [eligibleQuestions]);

  // Filter items
  const filtered = useMemo(() => {
    let result = eligibleQuestions;

    if (selectedFacetId !== 'ALL') {
      result = result.filter((q) => q.item.facet.id === selectedFacetId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.item.itemCode.toLowerCase().includes(q) ||
          item.promptTr.toLowerCase().includes(q) ||
          item.promptEn.toLowerCase().includes(q) ||
          item.item.facet.nameTr.toLowerCase().includes(q)
      );
    }

    return result;
  }, [eligibleQuestions, selectedFacetId, searchQuery]);

  if (!isOpen) return null;

  const handleAddQuestion = async (itemVersionId: string) => {
    setError(null);
    setAddingId(itemVersionId);

    try {
      const res = await addQuestionToFormDraftAction({
        formVersionId,
        itemVersionId,
      });

      if (!res.success) {
        setError(res.error || 'Madde eklenemedi.');
        setAddingId(null);
        return;
      }

      setSuccessId(itemVersionId);
      setTimeout(() => {
        setSuccessId(null);
        setAddingId(null);
        router.refresh();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
      setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[85vh] bg-surface-1 border border-border-subtle rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Forma Madde / Soru Ekle</h3>
              <p className="text-[11px] text-text-tertiary">
                Havuzdan seçilen madde sürümü bu taslak formun sonuna eklenecektir ({filtered.length} aday)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary p-1 rounded-lg hover:bg-surface-2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-border-subtle bg-surface-2/40 space-y-3 shrink-0">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Madde kodu veya soru metni ara..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-1 border border-border-subtle text-text-primary placeholder:text-text-tertiary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>

            <div>
              <select
                value={selectedFacetId}
                onChange={(e) => setSelectedFacetId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-1 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="ALL">Tüm Alt Boyutlar (Facet Filtresi Yok)</option>
                {facetOptions.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Item List Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-border-subtle p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-tertiary space-y-2">
              <Database className="w-8 h-8 mx-auto opacity-40 text-text-disabled" />
              <p className="font-semibold text-text-secondary">Eklenebilecek Uygun Madde Bulunamadı</p>
              <p>Mevcut arama kriterlerinize uyan veya henüz bu forma eklenmemiş madde yok.</p>
            </div>
          ) : (
            filtered.map((q) => {
              const isAdding = addingId === q.id;
              const isSuccess = successId === q.id;

              return (
                <div
                  key={q.id}
                  className="p-3.5 hover:bg-surface-2/60 transition-colors rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded text-[11px] border border-brand-200/60">
                        {q.item.itemCode}
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-text-tertiary bg-surface-2 px-1.5 py-0.5 rounded">
                        v{q.versionNumber}
                      </span>
                      <LifecycleBadge status={q.status} size="sm" />
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.item.isKeyed ? 'bg-emerald-50 text-emerald-800' : 'bg-purple-50 text-purple-800'
                        }`}
                      >
                        {q.item.isKeyed ? 'Düz (+)' : 'Ters (-)'}
                      </span>
                      {q.item.isAttentionCheck && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Dikkat Kontrolü
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-text-primary line-clamp-2">
                      {q.promptTr}
                    </p>
                    <p className="text-[11px] text-text-tertiary italic line-clamp-1">
                      {q.promptEn}
                    </p>

                    <div className="flex items-center space-x-2 text-[11px] text-text-tertiary pt-0.5">
                      <span>
                        {q.item.facet.construct.domain.nameTr} &gt; {q.item.facet.nameTr}
                      </span>
                      <span>•</span>
                      <LicenseBadge decision={q.normalizedInstrumentDecision} size="sm" />
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    <button
                      type="button"
                      disabled={isAdding || isSuccess}
                      onClick={() => handleAddQuestion(q.id)}
                      className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors min-h-[38px] ${
                        isSuccess
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50'
                      }`}
                    >
                      {isAdding ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      ) : isSuccess ? (
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      {isSuccess ? 'Eklendi' : 'Forma Ekle'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-border-subtle bg-surface-2/40 flex items-center justify-between shrink-0 text-xs text-text-tertiary">
          <span>Toplam {filtered.length} aday soru listeleniyor</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-border-subtle bg-surface-1 hover:bg-surface-2 text-text-primary font-semibold transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
