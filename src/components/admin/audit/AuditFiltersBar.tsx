'use client';

import React, { useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, RotateCcw } from 'lucide-react';

const COMMON_EVENT_TYPES = [
  'LOGIN_SUCCESS',
  'LOGIN_FAILURE',
  'REGISTER_SUCCESS',
  'USER_SUSPENDED',
  'USER_REACTIVATED',
  'USER_DISABLED',
  'USER_SESSIONS_REVOKED',
  'ROLE_GRANTED',
  'ROLE_REVOKED',
  'PASSWORD_RESET_SUCCESS',
  'EMAIL_VERIFICATION_SUCCESS',
  'ADMIN_SECURITY_ALERT',
];

export const AuditFiltersBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentEventType = searchParams.get('eventType') || '';
  const currentSuccess = searchParams.get('success') || '';

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

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

  const handleReset = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = Boolean(currentEventType || currentSuccess);

  return (
    <div className="bg-surface-1 p-4 rounded-2xl border border-border-subtle shadow-xs mb-6 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
            <select
              value={currentEventType}
              onChange={(e) => updateFilters({ eventType: e.target.value })}
              className="px-3 py-2 rounded-xl border border-border-subtle bg-bg-subtle text-xs font-medium text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500/20 min-h-[44px] cursor-pointer"
              aria-label="Olay Türü Filtresi"
            >
              <option value="">Tüm Olay Türleri</option>
              {COMMON_EVENT_TYPES.map((et) => (
                <option key={et} value={et}>
                  {et}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <select
              value={currentSuccess}
              onChange={(e) => updateFilters({ success: e.target.value })}
              className="px-3 py-2 rounded-xl border border-border-subtle bg-bg-subtle text-xs font-medium text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500/20 min-h-[44px] cursor-pointer"
              aria-label="Başarı Durumu Filtresi"
            >
              <option value="">Tüm Sonuçlar</option>
              <option value="true">Yalnızca Başarılı</option>
              <option value="false">Yalnızca Başarısız</option>
            </select>
          </div>

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
