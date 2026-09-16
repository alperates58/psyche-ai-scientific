'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cloneAssessmentFormDraftAction } from '@/actions/scientificAdminActions';
import { Copy, X, AlertCircle, Loader2 } from 'lucide-react';

interface CloneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceForm: {
    id: string;
    versionCode: string;
    moduleCode: string;
    moduleTitleTr: string;
    itemCount: number;
    description?: string | null;
  };
}

export const CloneFormModal: React.FC<CloneFormModalProps> = ({
  isOpen,
  onClose,
  sourceForm,
}) => {
  const router = useRouter();
  const [newVersionCode, setNewVersionCode] = useState(`${sourceForm.versionCode}-draft`);
  const [description, setDescription] = useState(sourceForm.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await cloneAssessmentFormDraftAction({
        sourceFormVersionId: sourceForm.id,
        newVersionCode: newVersionCode.trim(),
        description: description.trim() || undefined,
      });

      if (!res.success) {
        setError(res.error || 'Form klonlanamadı.');
        setLoading(false);
        return;
      }

      onClose();
      router.push(`/admin/assessment-forms/${res.data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-surface-1 border border-border-subtle rounded-2xl shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
              <Copy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Formu Taslak Olarak Klonla</h3>
              <p className="text-[11px] text-text-tertiary">Kaynak: {sourceForm.versionCode} ({sourceForm.moduleTitleTr})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary p-1 rounded-lg hover:bg-surface-2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-surface-2/60 border border-border-subtle space-y-1">
            <div className="text-[11px] font-semibold text-text-tertiary uppercase">Kaynak Form Özeti</div>
            <div className="font-semibold text-text-primary">{sourceForm.moduleTitleTr}</div>
            <div className="text-text-secondary text-[11px]">
              {sourceForm.itemCount} adet madde ve mevcut soru dizilimi yeni taslak forma birebir aktarılacaktır.
            </div>
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1.5">
              Yeni Taslak Sürüm Kodu <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={newVersionCode}
              onChange={(e) => setNewVersionCode(e.target.value)}
              placeholder="Örn: v1.1.0-draft veya v2.0.0"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            <p className="text-[11px] text-text-tertiary mt-1">
              Alfanumerik karakterler, nokta, tire ve alt çizgi kullanılabilir.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1.5">
              Taslak Açıklaması / Değişiklik Notu
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bu taslakta yapılacak psikometrik revizyonlar..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-border-subtle bg-surface-1 hover:bg-surface-2 text-text-secondary font-semibold transition-colors min-h-[38px]"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-xs transition-colors disabled:opacity-50 min-h-[38px]"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
              Taslağı Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
