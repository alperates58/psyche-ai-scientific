import React from 'react';
import { requirePermission } from '@/lib/auth';
import { getSystemHealthReport } from '@/services/adminUserService';
import { getSystemMailSettings } from '@/services/systemSettingsService';
import { SystemAppCard } from '@/components/admin/system/SystemAppCard';
import { SystemDatabaseCard } from '@/components/admin/system/SystemDatabaseCard';
import { SystemAuthServiceCard } from '@/components/admin/system/SystemAuthServiceCard';
import { SystemIntegrationCard } from '@/components/admin/system/SystemIntegrationCard';
import { SystemScientificStateCard } from '@/components/admin/system/SystemScientificStateCard';
import { SystemMailSettingsCard } from '@/components/admin/system/SystemMailSettingsCard';
import { Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sistem Durumu & Sağlık — PsycheAI Admin',
  description: 'Operasyonel, Altyapı ve Bilimsel Durum Göstergeleri',
};

export default async function AdminSystemPage() {
  // Authoritative server-side permission check (Requires SYSTEM_CONFIG)
  await requirePermission('SYSTEM_CONFIG');

  const [report, mailSettings] = await Promise.all([
    getSystemHealthReport(),
    getSystemMailSettings(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Sistem Durumu & Sağlık
            </h1>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Altyapı servislerinin çalışma sağlığını, kimlik sicilini ve canlı bilimsel ontoloji durumunu izleyin.
          </p>
        </div>

        <div className="text-xs text-text-tertiary">
          Son Güncelleme: <span className="font-mono">{report.application.timestamp.toLocaleTimeString('tr-TR')}</span>
        </div>
      </div>

      {/* Interactive Mail & Verification Integration Settings */}
      <SystemMailSettingsCard initialSettings={mailSettings} />

      {/* Grid of Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SystemDatabaseCard database={report.database} />
        <SystemAppCard app={report.application} />
        <SystemAuthServiceCard
          authService={report.authService}
          googleOAuth={report.googleOAuth}
        />
        <SystemIntegrationCard
          emailService={report.emailService}
          researchGate={report.researchGate}
        />
      </div>

      {/* Scientific State Card */}
      <SystemScientificStateCard scientificState={report.scientificState} />
    </div>
  );
}
