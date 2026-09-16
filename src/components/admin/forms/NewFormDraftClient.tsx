'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  createAssessmentFormDraftAction,
  cloneAssessmentFormDraftAction,
} from '@/actions/scientificAdminActions';
import {
  FileCheck2,
  Copy,
  Plus,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ModuleOption {
  id: string;
  code: string;
  titleTr: string;
  titleEn: string;
  estimatedMinutes: number;
}

interface FormOption {
  id: string;
  versionCode: string;
  moduleCode: string;
  moduleTitleTr: string;
  itemCount: number;
  status: string;
}

interface NewFormDraftClientProps {
  modules: ModuleOption[];
  existingForms: FormOption[];
}

export const NewFormDraftClient: React.FC<NewFormDraftClientProps> = ({
  modules,
  existingForms,
}) => {
  const router = useRouter();
  const [mode, setMode] = useState<'BLANK' | 'CLONE'>('BLANK');

  // Blank mode fields
  const [moduleId, setModuleId] = useState(modules[0]?.id || '');
  const [versionCode, setVersionCode] = useState('v1.1.0-draft');
  const [description, setDescription] = useState('');

  // Clone mode fields
  const [sourceFormId, setSourceFormId] = useState(existingForms[0]?.id || '');
  const [cloneVersionCode, setCloneVersionCode] = useState(
    existingForms[0] ? `${existingForms[0].versionCode}-draft` : 'v1.1.0-draft'
  );
  const [cloneDescription, setCloneDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSourceFormChange = (formId: string) => {
    setSourceFormId(formId);
    const form = existingForms.find((f) => f.id === formId);
    if (form) {
      setCloneVersionCode(`${form.versionCode}-draft`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'BLANK') {
        const res = await createAssessmentFormDraftAction({
          moduleId,
          versionCode: versionCode.trim(),
          description: description.trim() || undefined,
        });

        if (!res.success) {
          setError(res.error || 'Taslak form oluşturulamadı.');
          setLoading(false);
          return;
        }

        router.push(`/admin/assessment-forms/${res.data.id}`);
        router.refresh();
      } else {
        const res = await cloneAssessmentFormDraftAction({
          sourceFormVersionId: sourceFormId,
          newVersionCode: cloneVersionCode.trim(),
          description: cloneDescription.trim() || undefined,
        });

        if (!res.success) {
          setError(res.error || 'Form klonlanamadı.');
          setLoading(false);
          return;
        }

        router.push(`/admin/assessment-forms/${res.data.id}`);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div>
        <Link
          href="/admin/assessment-forms"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-brand-600 transition-colors mb-3 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Form Listesine Dön
        </Link>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Yeni Taslak Değerlendirme Formu
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Sıfırdan boş bir taslak oluşturun veya mevcut bir formu maddeleriyle birlikte klonlayın
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-surface-2/60 border border-border-subtle text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMode('BLANK')}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 ${
            mode === 'BLANK'
              ? 'bg-surface-1 text-brand-700 shadow-xs border border-border-subtle font-bold'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Boş Taslak Form Oluştur</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('CLONE')}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 ${
            mode === 'CLONE'
              ? 'bg-surface-1 text-brand-700 shadow-xs border border-border-subtle font-bold'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Copy className="w-4 h-4" />
          <span>Mevcut Formu Klonla</span>
        </button>
      </div>

      {/* Form Container */}
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

        {mode === 'BLANK' ? (
          <>
            {/* Blank Form Fields */}
            <div>
              <label className="block font-semibold text-text-primary mb-1.5">
                Hedef Değerlendirme Modülü <span className="text-rose-600">*</span>
              </label>
              <select
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-medium"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.titleTr} ({m.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1.5">
                Taslak Sürüm Kodu <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={versionCode}
                onChange={(e) => setVersionCode(e.target.value)}
                placeholder="Örn: v1.1.0-draft veya v2.0.0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
              <p className="text-[11px] text-text-tertiary mt-1">
                Form başlangıçta DRAFT (Taslak) durumunda ve 0 soru ile oluşturulacaktır.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1.5">
                Taslak Açıklaması & Notlar
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Bu değerlendirme formu sürümünün amacı ve kapsamı..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
              />
            </div>
          </>
        ) : (
          <>
            {/* Clone Form Fields */}
            <div>
              <label className="block font-semibold text-text-primary mb-1.5">
                Klonlanacak Kaynak Form <span className="text-rose-600">*</span>
              </label>
              <select
                value={sourceFormId}
                onChange={(e) => handleSourceFormChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-medium"
              >
                {existingForms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.versionCode} — {f.moduleTitleTr} ({f.itemCount} Madde) [{f.status}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1.5">
                Yeni Taslak Sürüm Kodu <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={cloneVersionCode}
                onChange={(e) => setCloneVersionCode(e.target.value)}
                placeholder="Örn: v1.1.0-draft"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
              <p className="text-[11px] text-text-tertiary mt-1">
                Kaynak formdaki tüm sorular ve sıra dizilimi yeni taslağa aktarılır. Kaynak form değişmez.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1.5">
                Klon Açıklaması & Notlar
              </label>
              <textarea
                rows={3}
                value={cloneDescription}
                onChange={(e) => setCloneDescription(e.target.value)}
                placeholder="Bu klon üzerinde yapılacak revizyonlar..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
              />
            </div>
          </>
        )}

        <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
          <Link
            href="/admin/assessment-forms"
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
            {mode === 'BLANK' ? 'Boş Taslağı Oluştur' : 'Formu Klonla ve Taslak Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
};
