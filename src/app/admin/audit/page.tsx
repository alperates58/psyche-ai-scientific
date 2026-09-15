import React from 'react';
import { requirePermission } from '@/lib/auth';
import { getAuditLogs } from '@/services/adminUserService';
import { AuditFiltersBar } from '@/components/admin/audit/AuditFiltersBar';
import { AuditExplorerTable } from '@/components/admin/audit/AuditExplorerTable';
import { History } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Denetim Günlüğü Gezgini — PsycheAI Admin',
  description: 'Güvenlik, Kimlik ve Yönetimsel Denetim Olayları İncelemesi',
};

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Authoritative server-side permission check
  await requirePermission('ADMIN_ACCESS');

  const eventType = typeof searchParams.eventType === 'string' ? searchParams.eventType : undefined;
  const actorUserId = typeof searchParams.actorUserId === 'string' ? searchParams.actorUserId : undefined;
  const userId = typeof searchParams.userId === 'string' ? searchParams.userId : undefined;
  const successParam = typeof searchParams.success === 'string' ? searchParams.success : undefined;
  const success = successParam === 'true' ? true : successParam === 'false' ? false : undefined;
  const startDate = typeof searchParams.startDate === 'string' ? searchParams.startDate : undefined;
  const endDate = typeof searchParams.endDate === 'string' ? searchParams.endDate : undefined;
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const pageSize = typeof searchParams.pageSize === 'string' ? parseInt(searchParams.pageSize, 10) : 10;

  const data = await getAuditLogs({
    eventType,
    actorUserId,
    userId,
    success,
    startDate,
    endDate,
    page,
    pageSize,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Denetim Günlüğü Gezgini
            </h1>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Sistemdeki tüm kimlik doğrulama, yetki değişiklikleri ve yönetimsel işlemleri güvenli şekilde inceleyin.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle font-semibold text-text-secondary shadow-xs">
            Toplam: <strong className="text-brand-700">{data.pagination.total}</strong> Olay Kaydı
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <AuditFiltersBar />

      {/* Table & Pagination */}
      <AuditExplorerTable events={data.events} pagination={data.pagination} />
    </div>
  );
}
