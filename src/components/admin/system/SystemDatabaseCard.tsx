import React from 'react';
import { SystemHealthReport } from '@/services/adminUserService';
import { Database, CheckCircle2, AlertTriangle, XCircle, Gauge } from 'lucide-react';

export interface SystemDatabaseCardProps {
  database: SystemHealthReport['database'];
}

export const SystemDatabaseCard: React.FC<SystemDatabaseCardProps> = ({ database }) => {
  const isHealthy = database.status === 'HEALTHY';

  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Veritabanı Katmanı
          </h3>
        </div>

        {isHealthy ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Çalışıyor (Sağlıklı)
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            Erişilemiyor
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1">
          <div className="text-[10px] text-text-tertiary font-semibold uppercase">Motor / Tür</div>
          <div className="font-bold text-text-primary text-sm">{database.engine}</div>
        </div>

        <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center text-text-tertiary font-semibold uppercase text-[10px] space-x-1">
            <Gauge className="w-3 h-3" />
            <span>Sorgu Gecikmesi (Latency)</span>
          </div>
          <div className="font-bold font-mono text-sm text-text-primary">
            {database.latencyMs} ms
          </div>
        </div>
      </div>
    </div>
  );
};
