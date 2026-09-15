import React from 'react';
import { Database, ShieldCheck, Mail, Globe, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export interface AdminSystemStatusProps {
  operational: {
    dbHealthy: boolean;
    dbLatencyMs: number;
    googleOAuthConfigured: boolean;
    smtpConfigured: boolean;
    researchGateConfigured: boolean;
    nodeEnv: string;
  };
}

export const AdminSystemStatusCard: React.FC<AdminSystemStatusProps> = ({ operational }) => {
  const statusItems = [
    {
      title: 'PostgreSQL Veritabanı',
      status: operational.dbHealthy ? 'Sağlıklı' : 'Hata',
      detail: `${operational.dbLatencyMs} ms yanıt süresi`,
      isHealthy: operational.dbHealthy,
      icon: Database,
    },
    {
      title: 'Sunucu Oturum Sicili',
      status: 'Aktif',
      detail: 'auth_sessions çift katmanlı kontrol',
      isHealthy: true,
      icon: ShieldCheck,
    },
    {
      title: 'Google OAuth',
      status: operational.googleOAuthConfigured ? 'Yapılandırıldı' : 'Devre Dışı',
      detail: operational.googleOAuthConfigured ? 'Giriş ve senkronizasyon hazır' : 'AUTH_GOOGLE_* eksik',
      isHealthy: operational.googleOAuthConfigured,
      icon: Globe,
    },
    {
      title: 'SMTP E-posta Servisi',
      status: operational.smtpConfigured ? 'Yapılandırıldı' : 'Geliştirme / Pasif',
      detail: operational.smtpConfigured ? 'Doğrulama e-postaları aktif' : 'Geliştirme modunda simüle',
      isHealthy: operational.smtpConfigured,
      icon: Mail,
    },
    {
      title: 'Araştırma Kapısı (Research Gate)',
      status: operational.researchGateConfigured ? 'Korumalı' : 'Açık / Test',
      detail: operational.researchGateConfigured ? 'Erişim anahtarı zorunlu' : 'Geliştirme ortamı',
      isHealthy: true,
      icon: Cpu,
    },
  ];

  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-text-primary">
            Sistem Operasyonel Durumu
          </h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            Canlı altyapı bileşenleri ve konfigürasyon sağlığı
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse" />
          {operational.nodeEnv.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {statusItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-4 rounded-xl bg-bg-subtle border border-border-subtle flex items-start space-x-3"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.isHealthy
                    ? 'bg-emerald-100/60 text-emerald-700 border border-emerald-200/50'
                    : 'bg-amber-100/60 text-amber-700 border border-amber-200/50'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-text-primary truncate">
                    {item.title}
                  </p>
                  {item.isHealthy ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />
                  )}
                </div>
                <p
                  className={`text-xs font-semibold mt-0.5 ${
                    item.isHealthy ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {item.status}
                </p>
                <p className="text-[11px] text-text-tertiary mt-0.5 truncate">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
