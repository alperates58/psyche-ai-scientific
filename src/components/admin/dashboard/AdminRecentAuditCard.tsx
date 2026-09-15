import React from 'react';
import { History, Shield, CheckCircle2, XCircle } from 'lucide-react';

export interface RecentAuditItem {
  id: string;
  eventType: string;
  actorName: string;
  actorEmailMasked: string | null;
  targetEmailMasked: string | null;
  success: boolean;
  createdAt: Date;
}

export interface AdminRecentAuditProps {
  recentAudits: RecentAuditItem[];
}

const EVENT_TYPE_LABELS: Record<string, { label: string; variant: string }> = {
  LOGIN_SUCCESS: { label: 'Giriş Başarılı', variant: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
  LOGIN_FAILURE: { label: 'Giriş Başarısız', variant: 'bg-red-50 text-red-700 border-red-200/60' },
  REGISTER_SUCCESS: { label: 'Kayıt Başarılı', variant: 'bg-brand-50 text-brand-700 border-brand-200/60' },
  REGISTER_ATTEMPT: { label: 'Kayıt Denemesi', variant: 'bg-amber-50 text-amber-800 border-amber-200/60' },
  PASSWORD_RESET_REQUEST: { label: 'Şifre Sıfırlama İstendi', variant: 'bg-blue-50 text-blue-700 border-blue-200/60' },
  PASSWORD_RESET_SUCCESS: { label: 'Şifre Sıfırlandı', variant: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
  EMAIL_VERIFICATION_SUCCESS: { label: 'E-posta Doğrulandı', variant: 'bg-teal-50 text-teal-700 border-teal-200/60' },
  ROLE_GRANTED: { label: 'Rol Verildi', variant: 'bg-purple-50 text-purple-700 border-purple-200/60' },
  ROLE_REVOKED: { label: 'Rol Geri Alındı', variant: 'bg-amber-50 text-amber-800 border-amber-200/60' },
  ACCOUNT_SUSPENDED: { label: 'Hesap Askıya Alındı', variant: 'bg-red-50 text-red-700 border-red-200/60' },
  ALL_SESSIONS_REVOKED: { label: 'Oturumlar İptal Edildi', variant: 'bg-red-50 text-red-700 border-red-200/60' },
  LOGOUT: { label: 'Çıkış Yapıldı', variant: 'bg-bg-subtle text-text-secondary border-border-subtle' },
};

export const AdminRecentAuditCard: React.FC<AdminRecentAuditProps> = ({ recentAudits }) => {
  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center space-x-2">
            <History className="w-4 h-4 text-brand-600" />
            <span>Son Güvenlik ve Denetim Olayları</span>
          </h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            Değişmez denetim sicilinden (auth_audit_events) son 8 kayıt — PII gizlilik korumalı
          </p>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-bg-subtle text-text-tertiary border border-border-subtle">
          Salt Okunur
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs text-text-secondary border-collapse">
          <thead>
            <tr className="border-b border-border-subtle text-text-tertiary font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Zaman</th>
              <th className="py-2.5 px-3">Olay Türü</th>
              <th className="py-2.5 px-3">Aktör</th>
              <th className="py-2.5 px-3">Hedef</th>
              <th className="py-2.5 px-3 text-right">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/60">
            {recentAudits.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-tertiary">
                  Henüz kaydedilmiş denetim olayı bulunmamaktadır.
                </td>
              </tr>
            ) : (
              recentAudits.map((item) => {
                const eventConfig = EVENT_TYPE_LABELS[item.eventType] || {
                  label: item.eventType,
                  variant: 'bg-bg-subtle text-text-secondary border-border-subtle',
                };
                const formattedDate = new Intl.DateTimeFormat('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }).format(new Date(item.createdAt));

                return (
                  <tr key={item.id} className="hover:bg-bg-subtle/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-text-tertiary whitespace-nowrap">
                      {formattedDate}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${eventConfig.variant}`}
                      >
                        {eventConfig.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-medium text-text-primary">
                      {item.actorName}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-text-tertiary font-mono">
                      {item.targetEmailMasked || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      {item.success ? (
                        <span className="inline-flex items-center text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Başarılı
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-700 font-semibold text-[11px]">
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Başarısız
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
