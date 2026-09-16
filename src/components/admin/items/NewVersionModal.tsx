'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNewItemVersionAction } from '@/actions/scientificAdminActions';
import { PlusCircle, X, AlertCircle, Loader2, History, Layers } from 'lucide-react';

interface OptionToClone {
  value: number;
  labelTr: string;
  labelEn: string;
}

interface NewVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemCode: string;
  latestVersion: {
    id: string;
    versionNumber: number;
    promptTr: string;
    promptEn: string;
    notes?: string | null;
    options: OptionToClone[];
  };
}

export const NewVersionModal: React.FC<NewVersionModalProps> = ({
  isOpen,
  onClose,
  itemId,
  itemCode,
  latestVersion,
}) => {
  const router = useRouter();
  const nextVersionNum = latestVersion.versionNumber + 1;

  const [promptTr, setPromptTr] = useState(latestVersion.promptTr);
  const [promptEn, setPromptEn] = useState(latestVersion.promptEn);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await createNewItemVersionAction({
        itemId,
        promptTr: promptTr.trim(),
        promptEn: promptEn.trim(),
        notes: notes.trim() || undefined,
        cloneOptionsFromVersionId: latestVersion.id,
      });

      if (!res.success) {
        setError(res.error || 'Yeni sürüm oluşturulamadı.');
        setLoading(false);
        return;
      }

      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-surface-1 border border-border-subtle rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Yeni Madde Sürümü Oluştur (v{nextVersionNum})</h3>
              <p className="text-[11px] text-text-tertiary">Madde: {itemCode}</p>
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

          <div className="p-3 rounded-xl bg-surface-2/60 border border-border-subtle text-[11px] space-y-1">
            <div className="font-semibold text-text-primary">Tarihsel Bütünlük Koruması</div>
            <p className="text-text-secondary">
              Önceki sürümler (v1..v{latestVersion.versionNumber}) dondurulmuş olarak kalır. Yeni sürüm v{nextVersionNum} (DRAFT) olarak başlatılacaktır.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Revize Türkçe Önerme Metni (TR) <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={promptTr}
              onChange={(e) => setPromptTr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Revize İngilizce Önerme Metni (EN) <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={promptEn}
              onChange={(e) => setPromptEn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none italic"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Revizyon Gerekçesi / Sürüm Notu
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: İfade netliği için Türkçe çeviri revize edildi."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-border-subtle flex items-center justify-end space-x-3">
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
              v{nextVersionNum} Sürümünü Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
