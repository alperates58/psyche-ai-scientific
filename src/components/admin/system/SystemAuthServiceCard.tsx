import React from 'react';
import { SystemHealthReport } from '@/services/adminUserService';
import { ShieldCheck, CheckCircle2, XCircle, Globe, Laptop } from 'lucide-react';

export interface SystemAuthServiceCardProps {
  authService: SystemHealthReport['authService'];
  googleOAuth: SystemHealthReport['googleOAuth'];
}

export const SystemAuthServiceCard: React.FC<SystemAuthServiceCardProps> = ({
  authService,
  googleOAuth,
}) => {
  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-4">
      <div className="flex items-center space-x-2 border-b border-border-subtle pb-3">
        <ShieldCheck className="w-5 h-5 text-brand-600" />
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Kimlik & Oturum Güvenliği
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Session Registry */}
        <div className="p-3.5 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-text-primary flex items-center">
              <Laptop className="w-3.5 h-3.5 mr-1 text-brand-600" />
              Sunucu Oturum Sicili (auth_sessions)
            </span>
            {authService.sessionRegistryOperational ? (
              <span className="inline-flex items-center text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                Aktif
              </span>
            ) : (
              <span className="inline-flex items-center text-rose-700 font-semibold text-[10px] bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                <XCircle className="w-2.5 h-2.5 mr-1 text-rose-600" />
                Erişilemiyor
              </span>
            )}
          </div>
          <div className="text-[11px] text-text-secondary">
            Aktif Veritabanı Oturumu: <strong>{authService.activeSessionCount}</strong>
          </div>
        </div>

        {/* Google OAuth */}
        <div className="p-3.5 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-text-primary flex items-center">
              <Globe className="w-3.5 h-3.5 mr-1 text-blue-600" />
              Google OAuth 2.0
            </span>
            {googleOAuth.configured ? (
              <span className="inline-flex items-center text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                Yapılandırıldı
              </span>
            ) : (
              <span className="inline-flex items-center text-text-tertiary font-medium text-[10px] bg-bg-subtle px-1.5 py-0.2 rounded border border-border-subtle">
                Yapılandırılmadı
              </span>
            )}
          </div>
          <div className="text-[11px] text-text-secondary font-mono truncate">
            {googleOAuth.maskedClientId ? `Client ID: ${googleOAuth.maskedClientId}` : 'OAuth kapalı'}
          </div>
        </div>
      </div>
    </div>
  );
};
