'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createNewItemVersionAction } from '@/actions/scientificAdminActions';
import { AlertCircle, Loader2, Save, ArrowLeft, History } from 'lucide-react';

interface ItemVersionAuthoringClientProps {
  itemId: string;
  itemCode: string;
  nextVersionNumber: number;
  latestVersion: {
    id: string;
    promptTr: string;
    promptEn: string;
    notes?: string | null;
  };
}

export const ItemVersionAuthoringClient: React.FC<ItemVersionAuthoringClientProps> = ({
  itemId,
  itemCode,
  nextVersionNumber,
  latestVersion,
}) => {
  const router = useRouter();
  const [promptTr, setPromptTr] = useState(latestVersion.promptTr);
  const [promptEn, setPromptEn] = useState(latestVersion.promptEn);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        authorType: 'ADMIN_AUTHORED',
      });

      if (!res.success) {
        setError(res.error || 'Yeni sürüm oluşturulamadı.');
        setLoading(false);
        return;
      }

      router.push(`/admin/item-bank/${itemId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 bg-surface-1 border border-border-subtle rounded-3xl shadow-xs space-y-5 text-xs"
    >
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-bold">Hata</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-surface-2/60 border border-border-subtle text-[11px] space-y-1">
        <div className="font-semibold text-text-primary">Tarihsel Bütünlük Koruması</div>
        <p className="text-text-secondary">
          Önceki sürümler dondurulmuş olarak korunur. Yeni sürüm v{nextVersionNumber} (DRAFT / RESEARCH_DRAFT) olarak başlatılacaktır.
        </p>
      </div>

      <div>
        <label className="block font-semibold text-text-primary mb-1.5">
          Revize Türkçe Önerme Metni (TR) <span className="text-rose-600">*</span>
        </label>
        <textarea
          required
          rows={3}
          value={promptTr}
          onChange={(e) => setPromptTr(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none font-medium"
        />
      </div>

      <div>
        <label className="block font-semibold text-text-primary mb-1.5">
          Revize İngilizce Önerme Metni (EN) <span className="text-rose-600">*</span>
        </label>
        <textarea
          required
          rows={3}
          value={promptEn}
          onChange={(e) => setPromptEn(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none italic"
        />
      </div>

      <div>
        <label className="block font-semibold text-text-primary mb-1.5">
          Revizyon Gerekçesi / Sürüm Notu
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Örn: Dil netliği için çeviri revize edildi."
          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-blue-900 text-[11px] flex items-center justify-between">
        <span>
          Yazar: <strong>ADMIN_AUTHORED</strong> • Durum: <strong>DRAFT / RESEARCH_DRAFT</strong>
        </span>
        <span className="text-blue-700 font-semibold">5'li Likert Ölçeği Önceki Sürümden Klonlanır</span>
      </div>

      <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
        <Link
          href={`/admin/item-bank/${itemId}`}
          className="px-4 py-2.5 rounded-xl border border-border-subtle bg-surface-1 hover:bg-surface-2 text-text-secondary font-semibold transition-colors min-h-[42px] flex items-center justify-center"
        >
          Vazgeç
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-xs transition-colors disabled:opacity-50 min-h-[42px]"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          v{nextVersionNumber} Sürümünü Yayın Taslağı Olarak Oluştur
        </button>
      </div>
    </form>
  );
};
