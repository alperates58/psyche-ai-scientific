import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth';
import { getNormDetail } from '@/services/scientificService';
import { Binary, ArrowLeft, AlertTriangle, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NormDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requirePermission('SCIENTIFIC_VIEW');

  const norm = await getNormDetail(params.id);
  if (!norm) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div>
        <Link
          href="/admin/norms"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-brand-600 transition-colors mb-3 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Tüm Norm Tablolarına Dön
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold shrink-0">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-mono tracking-tight">
                  {norm.code}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-surface-2 text-text-tertiary border border-border-subtle">
                  {norm.status}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {norm.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-calibration Alert Card */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 className="font-bold text-amber-900 text-sm">
            Ön Kalibrasyon Durumu & Bilimsel Kısıtlar
          </h2>
        </div>
        <p className="text-amber-800 leading-relaxed">
          Bu norm kaydı henüz ampirik olarak kalibre edilmemiştir (Örneklem boyutu N = {norm.sampleSize}). Kalibrasyon protokolü tamamlanmadan hiçbir kullanıcı profilinde persentil veya z-skoru gösterimi yapılamaz.
        </p>
      </div>

      {/* Calibration Protocol Checklist */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Ampirik Kalibrasyon Protokolü Gereksinimleri
          </h2>
        </div>

        <div className="p-5 space-y-3 text-xs">
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-surface-2/40 border border-border-subtle">
            <span className="w-5 h-5 rounded-full bg-surface-2 flex items-center justify-center font-bold text-[10px] text-text-tertiary shrink-0">1</span>
            <div>
              <span className="font-bold text-text-primary block">Temsili Örneklem Veri Seti</span>
              <p className="text-text-secondary mt-0.5">Hedef nüfustan toplanmış ve demografik tabakalandırılması yapılmış ampirik veri seti.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-surface-2/40 border border-border-subtle">
            <span className="w-5 h-5 rounded-full bg-surface-2 flex items-center justify-center font-bold text-[10px] text-text-tertiary shrink-0">2</span>
            <div>
              <span className="font-bold text-text-primary block">Doğrulayıcı Faktör Analizi (CFA) & Ölçüm Değişmezliği</span>
              <p className="text-text-secondary mt-0.5">Demografik alt gruplar arasında metrik ve skaler ölçüm değişmezliğinin kanıtlanması.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-surface-2/40 border border-border-subtle">
            <span className="w-5 h-5 rounded-full bg-surface-2 flex items-center justify-center font-bold text-[10px] text-text-tertiary shrink-0">3</span>
            <div>
              <span className="font-bold text-text-primary block">Süper Admin & Bilimsel Kurul Onayı</span>
              <p className="text-text-secondary mt-0.5">Kalibrasyon protokolünün resmi olarak onaylanıp NORM_ACTIVATE izniyle yürürlüğe alınması.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
