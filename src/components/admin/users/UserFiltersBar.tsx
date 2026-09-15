'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react';

export const UserFiltersBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status') || '';
  const currentRole = searchParams.get('role') || '';
  const currentSort = searchParams.get('sort') || 'createdAt_desc';

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); // Reset to page 1 on filter changes

    for (const [key, value] of Object.entries(newParams)) {
      if (value === null || value === '' || value === 'ALL') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm.trim() });
  };

  const handleReset = () => {
    setSearchTerm('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = Boolean(currentSearch || currentStatus || currentRole || currentSort !== 'createdAt_desc');

  return (
    <div className="bg-surface-1 p-4 rounded-2xl border border-border-subtle shadow-xs mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="İsim veya e-posta ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle bg-bg-subtle text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors min-h-[44px]"
          />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
            <select
              value={currentStatus}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="px-3 py-2 rounded-xl border border-border-subtle bg-bg-subtle text-xs font-medium text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500/20 min-h-[44px] cursor-pointer"
              aria-label="Durum Filtresi"
            >
              <option value="">Tüm Durumlar</option>
              <option value="ACTIVE">Aktif</option>
              <option value="PENDING_VERIFICATION">Doğrulama Bekliyor</option>
              <option value="SUSPENDED">Askıya Alındı</option>
              <option value="DISABLED">Devre Dışı</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-1.5">
            <select
              value={currentRole}
              onChange={(e) => updateFilters({ role: e.target.value })}
              className="px-3 py-2 rounded-xl border border-border-subtle bg-bg-subtle text-xs font-medium text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500/20 min-h-[44px] cursor-pointer"
              aria-label="Rol Filtresi"
            >
              <option value="">Tüm Roller</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="ADMIN">ADMIN</option>
              <option value="RESEARCHER">RESEARCHER</option>
              <option value="EXPERT_REVIEWER">EXPERT_REVIEWER</option>
              <option value="USER">USER</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center space-x-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
            <select
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="px-3 py-2 rounded-xl border border-border-subtle bg-bg-subtle text-xs font-medium text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500/20 min-h-[44px] cursor-pointer"
              aria-label="Sıralama Ölçütü"
            >
              <option value="createdAt_desc">En Yeni Kayıt</option>
              <option value="createdAt_asc">En Eski Kayıt</option>
              <option value="lastLogin_desc">Son Giriş Tarihi</option>
              <option value="name_asc">İsim (A-Z)</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center px-3 py-2 rounded-xl border border-border-subtle text-xs font-medium text-text-tertiary hover:text-text-primary hover:bg-bg-subtle transition-colors min-h-[44px]"
              title="Filtreleri Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Sıfırla
            </button>
          )}
        </div>
      </div>

      {isPending && (
        <div className="h-0.5 w-full bg-brand-100 overflow-hidden rounded">
          <div className="h-full bg-brand-600 animate-pulse w-1/3"></div>
        </div>
      )}
    </div>
  );
};
