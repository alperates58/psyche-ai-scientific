'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserActionModal } from './UserActionModal';
import {
  suspendUserAction,
  reactivateUserAction,
  disableUserAction,
} from '@/actions/adminUserActions';
import { ShieldAlert, AlertTriangle, CheckCircle2, Ban, Lock } from 'lucide-react';

export interface UserLifecycleActionsCardProps {
  userId: string;
  userName: string;
  userEmail: string | null;
  userEmailNormalized: string | null;
  status: string;
  emailVerified: Date | null;
  canManageUsers: boolean;
}

export const UserLifecycleActionsCard: React.FC<UserLifecycleActionsCardProps> = ({
  userId,
  userName,
  userEmail,
  userEmailNormalized,
  status,
  emailVerified,
  canManageUsers,
}) => {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<'suspend' | 'reactivate' | 'disable' | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSuspend = async (reason?: string) => {
    const res = await suspendUserAction({ userId, reason });
    if (res.success) {
      setFeedback({ type: 'success', message: 'Kullanıcı başarıyla askıya alındı ve tüm oturumları kapatıldı.' });
      router.refresh();
    } else {
      throw new Error(res.error || 'Askıya alma işlemi başarısız oldu.');
    }
  };

  const handleReactivate = async (reason?: string) => {
    const res = await reactivateUserAction({ userId, reason });
    if (res.success) {
      const restored = res.data?.status === 'ACTIVE' ? 'Aktif' : 'Doğrulama Bekliyor';
      setFeedback({
        type: 'success',
        message: `Kullanıcı başarıyla etkinleştirildi (Geri yüklenen durum: ${restored}).`,
      });
      router.refresh();
    } else {
      throw new Error(res.error || 'Etkinleştirme işlemi başarısız oldu.');
    }
  };

  const handleDisable = async (reason?: string, confirmText?: string) => {
    if (!confirmText) throw new Error('Onay metni zorunludur.');
    const res = await disableUserAction({
      userId,
      reason,
      confirmationText: confirmText,
    });
    if (res.success) {
      setFeedback({ type: 'success', message: 'Kullanıcı hesabı kalıcı olarak devre dışı bırakıldı.' });
      router.refresh();
    } else {
      throw new Error(res.error || 'Devre dışı bırakma işlemi başarısız oldu.');
    }
  };

  const expectedDisableConfirmation = userEmailNormalized || userEmail || 'DEVRE DIŞI BIRAK';

  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Hesap Yaşam Döngüsü & Güvenlik Eylemleri
          </h3>
        </div>

        {!canManageUsers && (
          <span className="inline-flex items-center text-xs font-medium text-text-tertiary bg-bg-subtle px-2.5 py-1 rounded-lg border border-border-subtle">
            <Lock className="w-3 h-3 mr-1 opacity-70" />
            Salt Okunur (USER_MANAGE Gerekli)
          </span>
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

      <p className="text-xs text-text-secondary leading-relaxed">
        Hesap yaşam döngüsü eylemleri sistem güvenliği, erişim sınırlandırma ve hesap yönetimi için kullanılır.
        Askıya alma ve devre dışı bırakma eylemleri kullanıcının tüm aktif oturumlarını derhal sonlandırır.
      </p>

      {canManageUsers && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Suspend Action (For ACTIVE or PENDING_VERIFICATION) */}
          {(status === 'ACTIVE' || status === 'PENDING_VERIFICATION') && (
            <button
              type="button"
              onClick={() => setActiveModal('suspend')}
              className="inline-flex items-center px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-xs transition-colors min-h-[44px] touch-manipulation shadow-xs"
            >
              <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600" />
              Hesabı Askıya Al
            </button>
          )}

          {/* Reactivate Action (Only for SUSPENDED) */}
          {status === 'SUSPENDED' && (
            <button
              type="button"
              onClick={() => setActiveModal('reactivate')}
              className="inline-flex items-center px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors min-h-[44px] touch-manipulation shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
              Hesabı Yeniden Etkinleştir
            </button>
          )}

          {/* Disable Action (For any non-DISABLED status) */}
          {status !== 'DISABLED' && (
            <button
              type="button"
              onClick={() => setActiveModal('disable')}
              className="inline-flex items-center px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold text-xs transition-colors min-h-[44px] touch-manipulation shadow-xs"
            >
              <Ban className="w-4 h-4 mr-1.5 text-rose-600" />
              Hesabı Devre Dışı Bırak
            </button>
          )}

          {status === 'DISABLED' && (
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
              Bu hesap kalıcı olarak devre dışı bırakılmıştır. Standart etkinleştirme yapılamaz.
            </span>
          )}
        </div>
      )}

      {/* Modals */}
      {activeModal === 'suspend' && (
        <UserActionModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onConfirm={handleSuspend}
          title="Kullanıcıyı Askıya Al"
          description={`'${userName}' kullanıcısını askıya almak üzeresiniz. Kullanıcının tüm aktif oturumları anında sonlandırılacak ve sisteme erişimi engellenecektir.`}
          confirmLabel="Hesabı Askıya Al"
          variant="warning"
          requiresReason={true}
        />
      )}

      {activeModal === 'reactivate' && (
        <UserActionModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onConfirm={handleReactivate}
          title="Kullanıcıyı Yeniden Etkinleştir"
          description={`'${userName}' kullanıcısının askı durumunu kaldırmak üzeresiniz. ${
            emailVerified
              ? 'Kullanıcının e-posta adresi doğrulanmış olduğundan durum AKTİF olarak ayarlanacaktır.'
              : 'Kullanıcının e-postası doğrulanmamış olduğundan durum DOĞRULAMA BEKLİYOR olarak ayarlanacaktır (Doğrulama atlanmaz).'
          }`}
          confirmLabel="Etkinleştir"
          variant="primary"
          requiresReason={false}
        />
      )}

      {activeModal === 'disable' && (
        <UserActionModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onConfirm={handleDisable}
          title="Kullanıcıyı Devre Dışı Bırak (Kritik Eylem)"
          description={`'${userName}' kullanıcısını devre dışı bırakmak üzeresiniz. Bu işlem kalıcıdır ve tüm oturumları derhal kapatılır.`}
          confirmLabel="Kalıcı Olarak Devre Dışı Bırak"
          variant="danger"
          requiresTextInput={true}
          expectedConfirmationText={expectedDisableConfirmation}
          textInputPlaceholder={expectedDisableConfirmation}
          requiresReason={true}
        />
      )}
    </div>
  );
};
