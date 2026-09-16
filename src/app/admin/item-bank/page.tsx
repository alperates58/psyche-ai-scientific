import React from 'react';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth';
import { getItemBankList } from '@/services/scientificService';
import { getOntologyCascade } from '@/services/scientificAdminService';
import { LifecycleBadge, LicenseBadge } from '@/components/admin/scientific/ScientificBadges';
import { normalizeInstrumentLicensingDecision } from '@/lib/licenseNormalization';
import { Database, Search, ChevronRight, Plus, Layers, Filter, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Madde Bankası — PsycheAI Scientific Admin',
  description: 'Canlı psikometrik maddeler, sürüm geçmişi ve araştırma madde havuzu',
};

export default async function ItemBankPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    domainId?: string;
    constructId?: string;
    facetId?: string;
    isKeyed?: string;
    isAttentionCheck?: string;
  };
}) {
  await requirePermission('SCIENTIFIC_VIEW');

  const ontologyCascade = await getOntologyCascade();

  const isKeyedFilter =
    searchParams.isKeyed === 'true' ? true : searchParams.isKeyed === 'false' ? false : undefined;
  const isAttentionCheckFilter =
    searchParams.isAttentionCheck === 'true' ? true : undefined;

  const { items, stats } = await getItemBankList({
    search: searchParams.search,
    domainId: searchParams.domainId,
    constructId: searchParams.constructId,
    facetId: searchParams.facetId,
    isKeyed: isKeyedFilter,
    isAttentionCheck: isAttentionCheckFilter,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Database className="w-6 h-6 text-brand-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Psikometrik Madde Bankası
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Canlı formlarda kullanılan dondurulmuş maddeler, sürümler ve araştırma havuzu ayrımı
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle font-semibold text-text-secondary shadow-xs">
            Canlı Madde: <strong className="text-brand-700">{stats.totalLiveItems}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-200/60 font-semibold text-brand-800 shadow-xs">
            Araştırma Havuzu: <strong>{stats.researchCandidateCount}</strong> Aday
          </span>
          <Link
            href="/admin/item-bank/new"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0 min-h-[38px]"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Yeni Madde Ekle
          </Link>
        </div>
      </div>

      {/* Multi-criteria Filter Bar */}
      <div className="p-4 sm:p-5 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-3">
        <form method="GET" className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="search"
                defaultValue={searchParams.search || ''}
                placeholder="Madde kodu, Türkçe/İngilizce önerme metni..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>

            {/* Keyed Filter */}
            <div className="sm:col-span-3">
              <select
                name="isKeyed"
                defaultValue={searchParams.isKeyed || ''}
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-medium"
              >
                <option value="">Tüm Puanlama Yönleri</option>
                <option value="true">Yalnızca Düz Puanlama (+)</option>
                <option value="false">Yalnızca Ters Puanlama (-)</option>
              </select>
            </div>

            {/* Attention Check Filter */}
            <div className="sm:col-span-3">
              <select
                name="isAttentionCheck"
                defaultValue={searchParams.isAttentionCheck || ''}
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-medium"
              >
                <option value="">Tüm Maddeler (Standart + Kontrol)</option>
                <option value="true">Yalnızca Dikkat Kontrolleri</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-text-tertiary">
              Listelenen: <strong>{items.length}</strong> kayıt
            </span>

            <div className="flex items-center space-x-2">
              <Link
                href="/admin/item-bank"
                className="px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-1 hover:bg-surface-2 text-text-secondary text-xs font-semibold transition-colors"
              >
                Filtreleri Temizle
              </Link>
              <button
                type="submit"
                className="px-5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                Filtrele
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Items Table / Card Grid */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Resmi Madde Sürümleri Listesi ({items.length} Madde)
          </span>
          <span className="text-[11px] font-semibold text-text-tertiary">
            (Araştırma Havuzundan Ayrılmış Resmi Maddeler)
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2/60 text-text-tertiary font-semibold uppercase tracking-wider border-b border-border-subtle">
              <tr>
                <th className="px-5 py-3">Madde Kodu</th>
                <th className="px-5 py-3">Türkçe Önerme Metni</th>
                <th className="px-5 py-3">Eşleşen Alt Boyut (Facet)</th>
                <th className="px-5 py-3">Kodlama</th>
                <th className="px-5 py-3">Durum</th>
                <th className="px-5 py-3">Lisans</th>
                <th className="px-5 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary font-medium">
              {items.map((item) => {
                const latestVersion = item.versions[0];
                const instDecision = normalizeInstrumentLicensingDecision(
                  item.instrument?.licensingDecision
                );

                return (
                  <tr key={item.id} className="hover:bg-bg-subtle/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-brand-700">{item.itemCode}</div>
                      {latestVersion && (
                        <div className="text-[10px] text-text-tertiary font-mono">
                          v{latestVersion.versionNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-md">
                      <div className="font-semibold text-text-primary line-clamp-2">
                        {latestVersion?.promptTr || '—'}
                      </div>
                      <div className="text-[10px] text-text-tertiary italic mt-0.5 line-clamp-1">
                        {latestVersion?.promptEn}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-text-primary">{item.facet.nameTr}</div>
                      <div className="text-[10px] text-text-tertiary font-mono">
                        {item.facet.construct.domain.nameTr}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col space-y-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold w-fit ${
                            item.isKeyed
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-purple-50 text-purple-800'
                          }`}
                        >
                          {item.isKeyed ? 'Düz (+)' : 'Ters (-)'}
                        </span>
                        {item.isAttentionCheck && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 w-fit">
                            Dikkat
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <LifecycleBadge status={latestVersion?.status || 'DRAFT'} />
                    </td>
                    <td className="px-5 py-4">
                      <LicenseBadge decision={instDecision} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/item-bank/${item.id}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-1 hover:bg-bg-subtle text-text-primary font-semibold text-xs transition-colors shadow-xs"
                      >
                        Detay & Sürümler
                        <ChevronRight className="w-3.5 h-3.5 ml-1 text-text-tertiary" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-border-subtle">
          {items.map((item) => {
            const latestVersion = item.versions[0];
            const instDecision = normalizeInstrumentLicensingDecision(
              item.instrument?.licensingDecision
            );

            return (
              <div key={item.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-brand-700">
                      {item.itemCode}
                    </span>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.isKeyed
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-purple-50 text-purple-800'
                      }`}
                    >
                      {item.isKeyed ? '+' : '-'}
                    </span>
                  </div>
                  <LifecycleBadge status={latestVersion?.status || 'DRAFT'} size="sm" />
                </div>

                <p className="text-xs font-semibold text-text-primary">
                  {latestVersion?.promptTr}
                </p>

                <div className="flex items-center justify-between text-xs text-text-tertiary pt-1">
                  <span>{item.facet.nameTr}</span>
                  <LicenseBadge decision={instDecision} size="sm" />
                </div>

                <div className="pt-2">
                  <Link
                    href={`/admin/item-bank/${item.id}`}
                    className="flex items-center justify-center w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-2 text-xs font-semibold text-text-primary hover:bg-bg-subtle min-h-[44px]"
                  >
                    Madde & Sürüm Detayları
                    <ChevronRight className="w-4 h-4 ml-1 text-text-tertiary" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
