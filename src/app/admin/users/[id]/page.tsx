import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth';
import { hasPermission } from '@/lib/rbac';
import { getUserDetail } from '@/services/adminUserService';
import { UserIdentityCard } from '@/components/admin/users/detail/UserIdentityCard';
import { UserLifecycleActionsCard } from '@/components/admin/users/detail/UserLifecycleActionsCard';
import { UserRolesGovernanceCard } from '@/components/admin/users/detail/UserRolesGovernanceCard';
import { UserAuthCard } from '@/components/admin/users/detail/UserAuthCard';
import { UserSessionsCard } from '@/components/admin/users/detail/UserSessionsCard';
import { UserPsychologySummaryCard } from '@/components/admin/users/detail/UserPsychologySummaryCard';
import { UserAuditHistoryCard } from '@/components/admin/users/detail/UserAuditHistoryCard';
import { ArrowLeft, UserCog } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Kullanıcı Detayı & Yönetim — PsycheAI Admin',
  description: 'Kullanıcı Kimlik, Oturum, Rol ve Yaşam Döngüsü Kontrolü',
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Authoritative server-side permission check
  const actor = await requirePermission('USER_MANAGE');
  const canManageRoles = hasPermission(actor.roles, 'ROLE_MANAGE');

  const user = await getUserDetail(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back Link & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/users"
            className="inline-flex items-center text-xs font-semibold text-text-secondary hover:text-brand-600 transition-colors mb-1 min-h-[32px] touch-manipulation"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Kullanıcı Listesine Dön
          </Link>
          <div className="flex items-center space-x-2">
            <UserCog className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Kullanıcı Detayı & Yönetim
            </h1>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Identity, Lifecycle, Roles, Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <UserIdentityCard user={user} />

          <UserLifecycleActionsCard
            userId={user.id}
            userName={user.name}
            userEmail={user.email}
            userEmailNormalized={user.emailNormalized}
            status={user.status}
            emailVerified={user.emailVerified}
            canManageUsers={true}
          />

          <UserRolesGovernanceCard
            userId={user.id}
            userName={user.name}
            userStatus={user.status}
            currentRoles={user.roles}
            canManageRoles={canManageRoles}
            currentActorId={actor.id}
          />

          <UserSessionsCard
            userId={user.id}
            userName={user.name}
            sessions={user.sessions}
          />
        </div>

        {/* Right 1 Col: Auth, Psychology summary, Recent Audits */}
        <div className="space-y-6">
          <UserAuthCard auth={user.auth} />

          <UserPsychologySummaryCard summary={user.psychologySummary} />

          <UserAuditHistoryCard audits={user.recentAudits} />
        </div>
      </div>
    </div>
  );
}
