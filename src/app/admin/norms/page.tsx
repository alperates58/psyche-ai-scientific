import React from 'react';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth';
import { getNormsList } from '@/services/scientificService';
import { Binary, ChevronRight, AlertTriangle, ShieldCheck, HelpCircle, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Norm Tabloları — PsycheAI Scientific Admin',
  description: 'Ampirik standardizasyon norm tabloları ve kalibrasyon durumu',
};

export default async function NormsPage() {
  await requirePermission('SCIENTIFIC_VIEW');

  const norms = await getNormsList();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Binary className="w-6 h-6 text-brand-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Norm Tabloları & Standardizasyon
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Ampirik nüfus kalibrasyonu öncesi norm durumu ve bilimsel kısıtlar
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle font-semibold text-text-secondary shadow-xs">
            Toplam: <strong className="text-brand-700">{norms.length}</strong> Norm Kaydı
          </span>
        </div>
      </div>

      {/* Scientific Invariant Warning Notice */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
            Bilimsel İlke: Ön Kalibrasyon Evresi (Uydurma Norm İddiası Yasaktır)
          </span>
        </div>
        <p className="text-amber-800 leading-relaxed pl-6">
          PsycheAI ampirik kalibrasyon çalışması tamamlanana kadar hiçbir normatif yüzde (persentil), T-skoru, Z-skoru veya nüfus ortalaması uydurmaz. Mevcut tüm norm kayıtları strictly <strong>UNAVAILABLE</strong> durumundadır.
        </p>
      </div>

      {/* Norms Table */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Norm Tabloları Sicili ({norms.length} Kayıt)
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
                <th className="px-5 py-3">Norm Kodu</th>
                <th className="px-5 py-3">Örneklem Tanımı</th>
                <th className="px-5 py-3">Durum</th>
                <th className="px-5 py-3">Kalibre Edildi mi?</th>
                <th className="px-5 py-3">Örneklem Boyutu (N)</th>
                <th className="px-5 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary font-medium">
              {norms.map((norm) => (
                <tr key={norm.id} className="hover:bg-bg-subtle/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-brand-700">
                    {norm.code}
                  </td>
                  <td className="px-5 py-4 font-semibold text-text-primary">
                    {norm.name}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold text-[10px] bg-surface-2 text-text-tertiary border border-border-subtle">
                      {norm.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {norm.isCalibrated ? (
                      <span className="text-emerald-700 font-bold">Evet</span>
                    ) : (
                      <span className="text-text-tertiary font-medium">Hayır (Ön Kalibrasyon)</span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-text-primary">
                    N = {norm.sampleSize}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/norms/${norm.id}`}
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
          {norms.map((norm) => (
            <div key={norm.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-brand-700">
                  {norm.code}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-2 text-text-tertiary border border-border-subtle">
                  {norm.status}
                </span>
              </div>

              <p className="text-xs font-semibold text-text-primary">
                {norm.name}
              </p>

              <div className="flex items-center space-x-2 text-xs text-text-tertiary pt-1">
                <span>Kalibrasyon: {norm.isCalibrated ? 'Evet' : 'Hayır'}</span>
                <span>•</span>
                <span>N = {norm.sampleSize}</span>
              </div>

              <div className="pt-2">
                <Link
                  href={`/admin/norms/${norm.id}`}
                  className="flex items-center justify-center w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-2 text-xs font-semibold text-text-primary hover:bg-bg-subtle min-h-[44px]"
                >
                  Norm Detayını İncele
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
