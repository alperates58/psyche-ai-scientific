'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserDetailDTO } from '@/services/adminUserService';
import { UserActionModal } from './UserActionModal';
import { revokeUserSessionsAction } from '@/actions/adminUserActions';
import { ShieldCheck, LogOut, Laptop, CheckCircle2, XCircle, Clock } from 'lucide-react';

export interface UserSessionsCardProps {
  userId: string;
  userName: string;
  sessions: UserDetailDTO['sessions'];
}

export const UserSessionsCard: React.FC<UserSessionsCardProps> = ({
  userId,
  userName,
  sessions,
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const activeSessions = sessions.filter((s) => s.revokedAt === null && new Date(s.expires) > new Date());

  const handleRevokeAll = async (reason?: string) => {
    const res = await revokeUserSessionsAction({
      userId,
      reason,
    });

    if (res.success) {
      setFeedback({ type: 'success', message: 'Tüm aktif oturumlar başarıyla sonlandırıldı.' });
      router.refresh();
    } else {
      throw new Error(res.error || 'Oturumlar sonlandırılırken hata oluştu.');
    }
  };

  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-3">
        <div className="flex items-center space-x-2">
          <Laptop className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Oturum Yönetimi ({activeSessions.length} Aktif Oturum)
          </h3>
        </div>

        {activeSessions.length > 0 && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors min-h-[44px] touch-manipulation"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Tüm Oturumları Kapat
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="p-6 text-center text-xs text-text-tertiary">
          Kullanıcıya ait kayıtlı oturum geçmişi bulunamadı.
        </div>
      ) : (
        <div className="divide-y divide-border-subtle">
          {sessions.map((s) => {
            const isRevoked = s.revokedAt !== null;
            const isExpired = new Date(s.expires) <= new Date();
            const isActive = !isRevoked && !isExpired;

            return (
              <div key={s.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] font-semibold text-text-primary bg-bg-subtle px-1.5 py-0.5 rounded border border-border-subtle">
                      ID: {s.id.substring(0, 10)}...
                    </span>
                    {isActive ? (
                      <span className="inline-flex items-center text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                        Aktif
                      </span>
                    ) : isRevoked ? (
                      <span className="inline-flex items-center text-rose-700 font-medium text-[10px] bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                        <XCircle className="w-2.5 h-2.5 mr-1 text-rose-600" />
                        Sonlandırıldı
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-text-tertiary font-medium text-[10px] bg-bg-subtle px-1.5 py-0.2 rounded border border-border-subtle">
                        <Clock className="w-2.5 h-2.5 mr-1" />
                        Süresi Doldu
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-text-secondary truncate max-w-md">
                    {s.userAgent || 'Bilinmeyen Tarayıcı / Cihaz'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-text-tertiary">
                    <span>Oluşturulma: {new Date(s.createdAt).toLocaleDateString('tr-TR')}</span>
                    <span>Bitiş: {new Date(s.expires).toLocaleDateString('tr-TR')}</span>
                    {s.ipHash && <span>IP Hash: {s.ipHash.substring(0, 8)}...</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <UserActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleRevokeAll}
        title="Tüm Oturumları Kapat"
        description={`'${userName}' kullanıcısının veritabanındaki tüm aktif oturumlarını derhal sonlandırmak üzeresiniz. Kullanıcının açık olan tüm cihazlardaki oturumu düşecektir.`}
        confirmLabel="Oturumları Sonlandır"
        variant="warning"
      />
    </div>
  );
};
