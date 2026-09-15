import React from 'react';
import { UserDetailDTO } from '@/services/adminUserService';
import { History, ShieldCheck, ShieldAlert } from 'lucide-react';

export interface UserAuditHistoryCardProps {
  audits: UserDetailDTO['recentAudits'];
}

export const UserAuditHistoryCard: React.FC<UserAuditHistoryCardProps> = ({ audits }) => {
  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-4">
      <div className="flex items-center space-x-2 border-b border-border-subtle pb-3">
        <History className="w-5 h-5 text-brand-600" />
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          İlişkili Denetim Geçmişi (Son 10 Olay)
        </h3>
      </div>

      {audits.length === 0 ? (
        <div className="p-6 text-center text-xs text-text-tertiary">
          Bu kullanıcıya ait henüz bir denetim olayı kaydedilmemiş.
        </div>
      ) : (
        <div className="divide-y divide-border-subtle text-xs">
          {audits.map((a) => (
            <div key={a.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-[11px] text-text-primary">
                    {a.eventType}
                  </span>
                  {a.success ? (
                    <span className="inline-flex items-center text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      <ShieldCheck className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                      Başarılı
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-rose-700 font-semibold text-[10px] bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                      <ShieldAlert className="w-2.5 h-2.5 mr-1 text-rose-600" />
                      Başarısız
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-text-tertiary">
                  İşlemi Yapan:{' '}
                  <span className="font-mono text-text-secondary">
                    {a.actorUserId ? `Admin (${a.actorUserId.substring(0, 8)}...)` : 'Sistem'}
                  </span>
                </div>

                {a.metadata && (
                  <pre className="p-2 rounded-lg bg-bg-subtle/80 text-[10px] font-mono text-text-secondary overflow-x-auto max-h-24">
                    {JSON.stringify(a.metadata, null, 2)}
                  </pre>
                )}
              </div>

              <div className="text-[10px] text-text-tertiary whitespace-nowrap">
                {new Date(a.createdAt).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
