import React from 'react';
import { requirePermission } from '@/lib/auth';
import { getUserDirectory } from '@/services/adminUserService';
import { UserFiltersBar } from '@/components/admin/users/UserFiltersBar';
import { UserDirectoryTable } from '@/components/admin/users/UserDirectoryTable';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Kullanıcı Yönetimi — PsycheAI Admin',
  description: 'PsycheAI Kullanıcı Dizini ve Erişim Yönetimi',
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Authoritative server-side permission check
  await requirePermission('USER_MANAGE');

  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined;
  const role = typeof searchParams.role === 'string' ? searchParams.role : undefined;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined;
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const pageSize = typeof searchParams.pageSize === 'string' ? parseInt(searchParams.pageSize, 10) : 10;

  const data = await getUserDirectory({
    search,
    status,
    role,
    sort,
    page,
    pageSize,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Kullanıcı Yönetimi & Dizini
            </h1>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Kayıtlı kullanıcı hesaplarını inceleyin, durumları yönetin ve yetkilendirmeleri kontrol edin.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle font-semibold text-text-secondary shadow-xs">
            Toplam: <strong className="text-brand-700">{data.pagination.total}</strong> Kullanıcı
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <UserFiltersBar />

      {/* Table & Pagination */}
      <UserDirectoryTable users={data.users} pagination={data.pagination} />
    </div>
  );
}
