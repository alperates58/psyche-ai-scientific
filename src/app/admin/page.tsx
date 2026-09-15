import React from 'react';
import { getAdminDashboardMetrics } from '@/services/adminService';
import { AdminMetricCard } from '@/components/admin/dashboard/AdminMetricCard';
import { AdminSystemStatusCard } from '@/components/admin/dashboard/AdminSystemStatusCard';
import { AdminOntologyStatusCard } from '@/components/admin/dashboard/AdminOntologyStatusCard';
import { AdminRecentAuditCard } from '@/components/admin/dashboard/AdminRecentAuditCard';
import { Users, UserCheck, Database, Layers, ShieldCheck, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Fetch real database-derived statistics and operational indicators
  const metrics = await getAdminDashboardMetrics();

  const activeUserPercentage =
    metrics.users.total > 0
      ? Math.round((metrics.users.active / metrics.users.total) * 100)
      : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Dashboard Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Yönetim Kontrol Paneli
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            PsycheAI bilimsel altyapı, kullanıcı hesapları ve operasyonel sistem durumu
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            FAZ 2.7A Canlı
          </span>
        </div>
      </div>

      {/* 4 High-Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminMetricCard
          title="Toplam Kullanıcı"
          value={metrics.users.total}
          subtitle={`${metrics.users.active} aktif hesap`}
          badgeText={`%${activeUserPercentage} Aktif`}
          badgeVariant="success"
          icon={Users}
        />

        <AdminMetricCard
          title="Bekleyen / Kısıtlı"
          value={metrics.users.pendingVerification + metrics.users.suspendedOrDisabled}
          subtitle={`${metrics.users.pendingVerification} doğrulama bekliyor`}
          badgeText={
            metrics.users.suspendedOrDisabled > 0
              ? `${metrics.users.suspendedOrDisabled} Kısıtlı`
              : 'Temiz'
          }
          badgeVariant={metrics.users.suspendedOrDisabled > 0 ? 'warning' : 'neutral'}
          icon={UserCheck}
        />

        <AdminMetricCard
          title="Canlı Form Maddesi"
          value={metrics.scientific.liveFormItemCount}
          subtitle={`Form: ${metrics.scientific.activeFormVersionCode || 'Yok'} (${metrics.scientific.totalBankItemCount} Banka)`}
          badgeText="Yayınlandı"
          badgeVariant="teal"
          icon={Database}
        />

        <AdminMetricCard
          title="Ontoloji Alt Boyutları"
          value={metrics.scientific.facetCount}
          subtitle={`${metrics.scientific.domainCount} Alan, ${metrics.scientific.constructCount} Yapı`}
          badgeText="84/84 Tam"
          badgeVariant="brand"
          icon={Layers}
        />
      </div>

      {/* Scientific Ontology & Measurement Engine Status */}
      <AdminOntologyStatusCard scientific={metrics.scientific} />

      {/* System Operational Health */}
      <AdminSystemStatusCard operational={metrics.operational} />

      {/* Recent Security & Administrative Audits */}
      <AdminRecentAuditCard recentAudits={metrics.recentAudits} />
    </div>
  );
}
