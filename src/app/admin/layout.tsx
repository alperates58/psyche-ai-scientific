import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { hasPermission } from '@/lib/rbac';
import { AdminShell } from '@/components/admin/layout/AdminShell';

export const metadata = {
  title: 'PsycheAI — Yönetim ve Kontrol Düzlemi (Admin)',
  description: 'PsycheAI Bilimsel ve Operasyonel Yönetim Merkezi',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Authoritative server-side identity & session revocation registry check
  const user = await getCurrentUserOrNull();

  if (!user) {
    redirect('/login?callbackUrl=/admin');
  }

  // 2. Authoritative permission-based access boundary (ADMIN_ACCESS permission)
  if (!hasPermission(user.roles, 'ADMIN_ACCESS')) {
    redirect('/overview');
  }

  return (
    <AdminShell user={user}>
      {children}
    </AdminShell>
  );
}
