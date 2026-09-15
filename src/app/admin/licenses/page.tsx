import React from 'react';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth';
import { getLicensesList } from '@/services/scientificService';
import { LicenseBadge } from '@/components/admin/scientific/ScientificBadges';
import { KeyRound, Search, ChevronRight, ShieldCheck, AlertTriangle, Layers, Database } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Lisans Kayıtları — PsycheAI Scientific Admin',
  description: 'Psikometrik envanterler, telif hakları ve hukuki uyum kayıtları',
};

export default async function LicensesPage() {
  await requirePermission('SCIENTIFIC_VIEW');

  const instruments = await getLicensesList();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <KeyRound className="w-6 h-6 text-brand-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Envanter & Lisans Sicili
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Psikometrik ölçeklerin ticari, açık kaynak ve akademik telif hakları uygunluk durumu
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle font-semibold text-text-secondary shadow-xs">
            Toplam: <strong className="text-brand-700">{instruments.length}</strong> Envanter
          </span>
        </div>
      </div>

      {/* Licenses Table */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Kayıtlı Psikometrik Envanterler ({instruments.length} Kayıt)
          </span>
          <span className="text-[11px] font-semibold text-text-tertiary">
            (Hukuki Haklar Bağımsız Boyuttur)
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2/60 text-text-tertiary font-semibold uppercase tracking-wider border-b border-border-subtle">
              <tr>
                <th className="px-5 py-3">Envanter Kodu</th>
                <th className="px-5 py-3">Envanter Adı</th>
                <th className="px-5 py-3">Lisans Türü</th>
                <th className="px-5 py-3">Hukuki Karar</th>
                <th className="px-5 py-3">Bağlı Madde</th>
                <th className="px-5 py-3">Bağlı Facet</th>
                <th className="px-5 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary font-medium">
              {instruments.map((inst) => (
                <tr key={inst.id} className="hover:bg-bg-subtle/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-brand-700">
                    {inst.code}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-text-primary">{inst.name}</div>
                    {inst.fullName && (
                      <div className="text-[10px] text-text-tertiary">{inst.fullName}</div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-text-primary">
                    {inst.licenseType}
                  </td>
                  <td className="px-5 py-4">
                    <LicenseBadge decision={inst.normalizedDecision} />
                  </td>
                  <td className="px-5 py-4 font-semibold text-text-primary">
                    {inst._count.items} Madde
                  </td>
                  <td className="px-5 py-4 font-semibold text-text-primary">
                    {inst._count.facets} Facet
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/licenses/${inst.id}`}
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
          {instruments.map((inst) => (
            <div key={inst.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-brand-700">
                  {inst.code}
                </span>
                <LicenseBadge decision={inst.normalizedDecision} size="sm" />
              </div>

              <p className="text-xs font-semibold text-text-primary">
                {inst.name}
              </p>

              <div className="flex items-center space-x-2 text-xs text-text-tertiary pt-1">
                <span>Tür: {inst.licenseType}</span>
                <span>•</span>
                <span>{inst._count.items} Canlı Madde</span>
              </div>

              <div className="pt-2">
                <Link
                  href={`/admin/licenses/${inst.id}`}
                  className="flex items-center justify-center w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-2 text-xs font-semibold text-text-primary hover:bg-bg-subtle min-h-[44px]"
                >
                  Lisans Detayını İncele
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
