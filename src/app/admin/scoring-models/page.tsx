import React from 'react';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth';
import { getScoringModelsList } from '@/services/scientificService';
import { Calculator, ChevronRight, Layers, Lock, ShieldCheck, HelpCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Puanlama Modelleri — PsycheAI Scientific Admin',
  description: 'Psikometrik puanlama algoritmaları, model sürümleri ve profil bağımlılıkları',
};

export default async function ScoringModelsPage() {
  await requirePermission('SCIENTIFIC_VIEW');

  const models = await getScoringModelsList();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Calculator className="w-6 h-6 text-brand-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Puanlama Modelleri
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Psikometrik kompozit skorlama algoritmaları ve profil çıktısı değişmezlik sicili
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle font-semibold text-text-secondary shadow-xs">
            Toplam: <strong className="text-brand-700">{models.length}</strong> Model Sürümü
          </span>
        </div>
      </div>

      {/* Models Table */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Kayıtlı Puanlama Algoritmaları ({models.length} Kayıt)
          </span>
          <span className="text-[11px] font-semibold text-text-tertiary">
            (Salt Okunur Görünüm)
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2/60 text-text-tertiary font-semibold uppercase tracking-wider border-b border-border-subtle">
              <tr>
                <th className="px-5 py-3">Model Kodu</th>
                <th className="px-5 py-3">Algoritma</th>
                <th className="px-5 py-3">Aşama / Durum</th>
                <th className="px-5 py-3">Kullanılan Profil Sayısı</th>
                <th className="px-5 py-3">Oluşturulma Tarihi</th>
                <th className="px-5 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary font-medium">
              {models.map((model) => (
                <tr key={model.id} className="hover:bg-bg-subtle/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-brand-700">
                    {model.code}
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-text-primary">
                    {model.algorithm}
                  </td>
                  <td className="px-5 py-4">
                    {model.isPreCalibration ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                        Ön Kalibrasyon (Standartlaştırılmamış)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Kalibre Edilmiş
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold text-text-primary">
                    {model._count.snapshots} Profil Çıktısı
                  </td>
                  <td className="px-5 py-4 text-text-tertiary text-[11px]">
                    {new Date(model.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/scoring-models/${model.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-1 hover:bg-bg-subtle text-text-primary font-semibold text-xs transition-colors shadow-xs"
                    >
                      Detay
                      <ChevronRight className="w-3.5 h-3.5 ml-1 text-text-tertiary" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-border-subtle">
          {models.map((model) => (
            <div key={model.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-brand-700">
                  {model.code}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  Ön Kalibrasyon
                </span>
              </div>

              <p className="text-xs text-text-secondary">
                {model.description}
              </p>

              <div className="flex items-center space-x-2 text-xs text-text-tertiary pt-1">
                <span className="font-mono">{model.algorithm}</span>
                <span>•</span>
                <span>{model._count.snapshots} Profil</span>
              </div>

              <div className="pt-2">
                <Link
                  href={`/admin/scoring-models/${model.id}`}
                  className="flex items-center justify-center w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-2 text-xs font-semibold text-text-primary hover:bg-bg-subtle min-h-[44px]"
                >
                  Model Detayını İncele
                  <ChevronRight className="w-4 h-4 ml-1 text-text-tertiary" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
