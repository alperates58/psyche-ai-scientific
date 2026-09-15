import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth';
import { getScoringModelDetail } from '@/services/scientificService';
import { Calculator, ArrowLeft, Lock, ShieldCheck, FileCheck2, Users, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ScoringModelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requirePermission('SCIENTIFIC_VIEW');

  const model = await getScoringModelDetail(params.id);
  if (!model) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div>
        <Link
          href="/admin/scoring-models"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-brand-600 transition-colors mb-3 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Tüm Puanlama Modellerine Dön
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-mono tracking-tight">
                  {model.code}
                </h1>
                {model.isPreCalibration && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    Ön Kalibrasyon
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {model.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Specification Card */}
      <div className="p-5 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-3">
        <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider block">
          Algoritma & Matematiksel Spesifikasyon
        </span>
        <div className="text-xs text-text-secondary space-y-1.5 font-mono">
          <p><strong>Algoritma:</strong> {model.algorithm}</p>
          <p><strong>Hesaplama:</strong> Düz maddeler (1..5), Ters maddeler (6 - değer). Facet ham ortalama = Sum(maddeler) / N. Construct & Domain bileşik ortalamaları = Unweighted Aritmetik Ortalama.</p>
          <p><strong>Norm İddiası:</strong> KESİNLİKLE YOK (normStatus = 'UNAVAILABLE', standardError = null, ci95 = null).</p>
        </div>
      </div>

      {/* Snapshot Usage */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Bağlı Profil Çıktıları ({model._count.snapshots} Toplam Kullanım)
          </h2>
          <span className="text-[11px] font-semibold text-text-tertiary">
            (onDelete: Restrict ile Korunmaktadır)
          </span>
        </div>

        {model.snapshots.length === 0 ? (
          <div className="p-6 text-center text-xs text-text-tertiary">
            Bu model henüz herhangi bir kullanıcı profilinde kullanılmamıştır.
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {model.snapshots.map((snap) => (
              <div key={snap.id} className="p-4 flex items-center justify-between hover:bg-bg-subtle/40 text-xs">
                <div>
                  <span className="font-bold text-text-primary font-mono block">{snap.id}</span>
                  <span className="text-[10px] text-text-tertiary">Kullanıcı: {snap.user.name}</span>
                </div>
                <span className="font-mono text-text-tertiary">
                  {new Date(snap.createdAt).toLocaleString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
