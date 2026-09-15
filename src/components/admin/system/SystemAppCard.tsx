import React from 'react';
import { SystemHealthReport } from '@/services/adminUserService';
import { Server, Clock, Cpu, Code } from 'lucide-react';

export interface SystemAppCardProps {
  app: SystemHealthReport['application'];
}

export const SystemAppCard: React.FC<SystemAppCardProps> = ({ app }) => {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} gün`);
    if (hours > 0) parts.push(`${hours} saat`);
    if (minutes > 0) parts.push(`${minutes} dk`);
    parts.push(`${secs} sn`);
    return parts.join(' ');
  };

  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-4">
      <div className="flex items-center space-x-2 border-b border-border-subtle pb-3">
        <Server className="w-5 h-5 text-brand-600" />
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Uygulama & Çalışma Zamanı
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center text-text-tertiary font-medium space-x-1">
            <Code className="w-3.5 h-3.5" />
            <span>Ortam (Environment)</span>
          </div>
          <div className="font-mono font-bold text-text-primary uppercase text-sm">
            {app.environment}
          </div>
        </div>

        <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center text-text-tertiary font-medium space-x-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Sürüm & Platform</span>
          </div>
          <div className="font-mono font-semibold text-text-primary text-xs">
            v{app.appVersion} ({app.nodeVersion})
          </div>
        </div>

        <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1 col-span-2">
          <div className="flex items-center text-text-tertiary font-medium space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>İşlem Çalışma Süresi (Uptime)</span>
          </div>
          <div className="font-semibold text-text-primary">
            {formatUptime(app.uptimeSeconds)}
          </div>
        </div>
      </div>
    </div>
  );
};
