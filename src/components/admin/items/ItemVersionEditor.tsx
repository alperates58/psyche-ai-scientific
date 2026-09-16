'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateDraftItemVersionAction } from '@/actions/scientificAdminActions';
import { Save, AlertCircle, Loader2, CheckCircle2, Edit3 } from 'lucide-react';

interface VersionOption {
  id: string;
  value: number;
  labelTr: string;
  labelEn: string;
}

interface ItemVersionEditorProps {
  version: {
    id: string;
    versionNumber: number;
    promptTr: string;
    promptEn: string;
    notes?: string | null;
    status: string;
    options: VersionOption[];
  };
}

export const ItemVersionEditor: React.FC<ItemVersionEditorProps> = ({ version }) => {
  const router = useRouter();
  const [promptTr, setPromptTr] = useState(version.promptTr);
  const [promptEn, setPromptEn] = useState(version.promptEn);
  const [notes, setNotes] = useState(version.notes || '');
  const [options, setOptions] = useState<VersionOption[]>(version.options);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleOptionChange = (id: string, field: 'labelTr' | 'labelEn', val: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, [field]: val } : opt))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    setSuccess(false);

    try {
      const res = await updateDraftItemVersionAction({
        itemVersionId: version.id,
        promptTr: promptTr.trim(),
        promptEn: promptEn.trim(),
        notes: notes.trim() || undefined,
        options: options.map((opt) => ({
          id: opt.id,
          value: opt.value,
          labelTr: opt.labelTr.trim(),
          labelEn: opt.labelEn.trim(),
        })),
      });

      if (!res.success) {
        setError(res.error || 'Taslak sürüm güncellenemedi.');
        setSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
      setSaving(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="p-5 rounded-2xl bg-surface-1 border border-brand-200/80 space-y-4 text-xs shadow-xs">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center space-x-2">
          <Edit3 className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-text-primary text-sm">
            Taslak Sürümü Düzenle (v{version.versionNumber})
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            DRAFT — Değiştirilebilir
          </span>
        </div>

        {success && (
          <span className="text-emerald-600 font-semibold flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Başarıyla Kaydedildi
          </span>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Prompts */}
      <div className="space-y-3">
        <div>
          <label className="block font-semibold text-text-primary mb-1">
            Türkçe Önerme Metni (TR) <span className="text-rose-600">*</span>
          </label>
          <textarea
            required
            rows={2}
            value={promptTr}
            onChange={(e) => setPromptTr(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none font-medium"
          />
        </div>

        <div>
          <label className="block font-semibold text-text-primary mb-1">
            İngilizce Önerme Metni (EN) <span className="text-rose-600">*</span>
          </label>
          <textarea
            required
            rows={2}
            value={promptEn}
            onChange={(e) => setPromptEn(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none italic"
          />
        </div>

        <div>
          <label className="block font-semibold text-text-primary mb-1">
            Açıklama / Sürüm Notu
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
      </div>

      {/* Option Scale Labels */}
      <div className="space-y-2 pt-2">
        <span className="block font-bold text-text-primary uppercase tracking-wider text-[10px]">
          Likert Cevap Ölçeği Etiketleri (5 Puan)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {options.map((opt) => (
            <div key={opt.id} className="p-2.5 rounded-xl bg-surface-2/60 border border-border-subtle space-y-1.5">
              <span className="font-mono font-bold text-brand-700 text-[11px] block">
                {opt.value} Puan
              </span>
              <input
                type="text"
                value={opt.labelTr}
                onChange={(e) => handleOptionChange(opt.id, 'labelTr', e.target.value)}
                placeholder="TR Etiketi"
                className="w-full px-2 py-1 text-[11px] rounded-lg bg-surface-1 border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
              />
              <input
                type="text"
                value={opt.labelEn}
                onChange={(e) => handleOptionChange(opt.id, 'labelEn', e.target.value)}
                placeholder="EN Label"
                className="w-full px-2 py-1 text-[10px] rounded-lg bg-surface-1 border border-border-subtle text-text-secondary focus:outline-none focus:ring-1 focus:ring-brand-500 italic"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 flex items-center justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50 min-h-[38px]"
        >
          {saving && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
          Taslak Değişikliklerini Kaydet
        </button>
      </div>
    </form>
  );
};
