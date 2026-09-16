'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  validateAssessmentFormAction,
  publishAssessmentFormVersionAction,
} from '@/actions/scientificAdminActions';
import { PublicationValidationResult } from '@/lib/publicationValidator';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';

interface PublicationValidationPanelProps {
  formVersionId: string;
  versionCode: string;
}

export const PublicationValidationPanel: React.FC<PublicationValidationPanelProps> = ({
  formVersionId,
  versionCode,
}) => {
  const router = useRouter();
  const [validation, setValidation] = useState<PublicationValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const runValidation = useCallback(async () => {
    setIsValidating(true);
    setPublishError(null);
    try {
      const res = await validateAssessmentFormAction(formVersionId);
      if (res.success && res.data) {
        setValidation(res.data);
      } else {
        setPublishError(res.error || 'Doğrulama gerçekleştirilemedi.');
      }
    } catch (err: any) {
      setPublishError(err.message || 'Doğrulama sırasında beklenmedik bir hata oluştu.');
    } finally {
      setIsValidating(false);
    }
  }, [formVersionId]);

  useEffect(() => {
    runValidation();
  }, [runValidation]);

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishError(null);

    try {
      const res = await publishAssessmentFormVersionAction({ formVersionId });
      if (!res.success) {
        setPublishError(res.error || 'Yayınlama işlemi başarısız oldu.');
        setIsPublishing(false);
        return;
      }

      setIsModalOpen(false);
      setIsPublishing(false);
      router.refresh();
    } catch (err: any) {
      setPublishError(err.message || 'Yayınlama sırasında bir hata oluştu.');
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Validation Card */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                isValidating
                  ? 'bg-surface-2 text-text-tertiary'
                  : validation?.publishable
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {isValidating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : validation?.publishable ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-2">
                Yayınlama & Canlı Güvenlik Kontrolü
                {validation && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      validation.publishable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {validation.publishable ? 'Yayına Hazır' : `${validation.blockers.length} Engel Var`}
                  </span>
                )}
              </h3>
              <p className="text-xs text-text-tertiary mt-0.5">
                Psikometrik bütünlük, sıra kesintisizliği, lisans kısıtlamaları ve atomik sürüm değişimi kontrolü.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={runValidation}
              disabled={isValidating || isPublishing}
              className="inline-flex items-center px-3 py-2 rounded-xl bg-surface-2 hover:bg-bg-subtle text-text-primary font-semibold text-xs border border-border-subtle transition-colors shadow-xs disabled:opacity-50 min-h-[38px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isValidating ? 'animate-spin' : ''}`} />
              Yeniden Kontrol Et
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              disabled={isValidating || !validation?.publishable || isPublishing}
              className={`inline-flex items-center px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-xs min-h-[38px] ${
                validation?.publishable && !isValidating
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 shadow-md cursor-pointer'
                  : 'bg-surface-2 text-text-disabled cursor-not-allowed border border-border-subtle'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Yayına Al (Canlı Yap)
            </button>
          </div>
        </div>

        {/* Publish Error Notification */}
        {publishError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-bold">İşlem Başarısız Oldu</p>
              <p className="mt-0.5">{publishError}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isValidating && (
          <div className="p-8 text-center text-xs text-text-tertiary flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            <p className="font-medium">Psikometrik ve yasal doğrulama kuralları kontrol ediliyor...</p>
          </div>
        )}

        {/* Validation Results */}
        {!isValidating && validation && (
          <div className="space-y-4">
            {/* 1. Blockers List */}
            {validation.blockers.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 space-y-2.5">
                <div className="flex items-center space-x-2 text-rose-900 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Yayınlamayı Engelleyen Durumlar ({validation.blockers.length})</span>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc text-xs text-rose-800 font-medium">
                  {validation.blockers.map((b, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 2. Success Banner (when 0 blockers) */}
            {validation.blockers.length === 0 && (
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-emerald-950">
                    Tüm Kritik Kontroller Başarıyla Tamamlandı
                  </p>
                  <p className="text-emerald-800 leading-relaxed">
                    Formda bulunan {validation.details.itemCount} soru; kesintisiz sıralama, 5 puanlık Likert ölçek standartları, geçerli ontoloji haritalaması ve yasal lisans şartlarına tam uyumludur.
                  </p>
                </div>
              </div>
            )}

            {/* 3. Warnings List */}
            {validation.warnings.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2.5">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Dikkat Edilmesi Gereken Uyarılar ({validation.warnings.length})</span>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc text-xs text-amber-800">
                  {validation.warnings.map((w, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Info & Lifecycle Scope */}
            {validation.info.length > 0 && (
              <div className="p-4 rounded-xl bg-surface-2/70 border border-border-subtle space-y-2 text-xs text-text-secondary">
                <div className="flex items-center space-x-2 text-text-primary font-bold">
                  <Info className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Form Bilgisi & Yayın Kapsamı</span>
                </div>
                <div className="space-y-1 pl-6">
                  {validation.info.map((infoMsg, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {infoMsg}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Publication Confirmation Modal */}
      {isModalOpen && validation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface-1 border border-border-subtle rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-text-primary">
                  Formu Yayına Alma Onayı
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-text-tertiary hover:text-text-primary p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
              <p>
                <strong className="text-text-primary font-mono">{versionCode}</strong> taslak formunu{' '}
                <strong className="text-text-primary">{validation.details.moduleTitleTr}</strong> modülü için canlı değerlendirme formu olarak yayınlamak üzeresiniz.
              </p>

              <div className="p-3.5 rounded-xl bg-surface-2 border border-border-subtle space-y-2 font-medium">
                <div className="flex items-center justify-between text-text-primary">
                  <span>Yeni Canlı Form:</span>
                  <span className="font-mono font-bold text-emerald-700">{versionCode}</span>
                </div>
                <div className="flex items-center justify-between text-text-primary">
                  <span>Toplam Soru:</span>
                  <span className="font-bold">{validation.details.itemCount} Soru (Aktifleşecek)</span>
                </div>
                <div className="flex items-center justify-between text-text-primary">
                  <span>Önceki Canlı Form:</span>
                  <span className="font-mono font-bold text-amber-700">
                    {validation.details.existingPublishedVersionCode || 'Yok (İlk Yayın)'}
                  </span>
                </div>
              </div>

              {validation.details.existingPublishedVersionCode && (
                <p className="text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <strong>Önemli:</strong> Mevcut canlı form (
                  <span className="font-mono">{validation.details.existingPublishedVersionCode}</span>
                  ) otomatik olarak <strong>ARŞİV (ARCHIVED)</strong> durumuna geçirilecek ve yeni oturumlar yalnızca bu form üzerinden başlatılacaktır.
                </p>
              )}

              <p className="text-text-tertiary">
                Bu işlem atomik bir veritabanı işlemi olarak yürütülecek ve denetim günlüğüne (Scientific Audit Log) kaydedilecektir.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                disabled={isPublishing}
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-surface-2 hover:bg-bg-subtle text-text-primary font-semibold text-xs border border-border-subtle transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={isPublishing}
                onClick={handlePublish}
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Yayına Alınıyor...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Evet, Formu Canlıya Al
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
