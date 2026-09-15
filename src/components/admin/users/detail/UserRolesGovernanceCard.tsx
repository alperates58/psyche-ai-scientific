'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role, ALL_ROLES } from '@/lib/rbac';
import { UserRoleBadges } from '../UserRoleBadges';
import { UserActionModal } from './UserActionModal';
import { grantUserRoleAction, revokeUserRoleAction } from '@/actions/adminRoleActions';
import { KeyRound, Plus, Trash2, ShieldAlert, Lock } from 'lucide-react';

export interface UserRolesGovernanceCardProps {
  userId: string;
  userName: string;
  userStatus: string;
  currentRoles: Array<{
    id: string;
    role: Role;
    grantedAt: Date;
    grantedBy: string | null;
  }>;
  canManageRoles: boolean; // actor has ROLE_MANAGE
  currentActorId: string;
}

export const UserRolesGovernanceCard: React.FC<UserRolesGovernanceCardProps> = ({
  userId,
  userName,
  userStatus,
  currentRoles,
  canManageRoles,
  currentActorId,
}) => {
  const router = useRouter();
  const [selectedRoleToGrant, setSelectedRoleToGrant] = useState<Role>('RESEARCHER');
  const [isGranting, setIsGranting] = useState(false);
  const [roleToRevoke, setRoleToRevoke] = useState<Role | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const existingRoleNames = currentRoles.map((r) => r.role);
  const availableRolesToGrant = ALL_ROLES.filter((r) => !existingRoleNames.includes(r));

  const handleGrant = async () => {
    if (!canManageRoles || !selectedRoleToGrant) return;
    setIsGranting(true);
    setFeedback(null);

    const res = await grantUserRoleAction({
      userId,
      role: selectedRoleToGrant,
    });

    setIsGranting(false);
    if (res.success) {
      setFeedback({ type: 'success', message: `'${selectedRoleToGrant}' rolü başarıyla atandı.` });
      router.refresh();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Rol atanırken hata oluştu.' });
    }
  };

  const handleConfirmRevoke = async () => {
    if (!roleToRevoke) return;

    const res = await revokeUserRoleAction({
      userId,
      role: roleToRevoke,
      confirmSelfDemotion: currentActorId === userId,
    });

    if (res.success) {
      setFeedback({ type: 'success', message: `'${roleToRevoke}' rolü başarıyla kaldırıldı.` });
      setRoleToRevoke(null);
      router.refresh();
    } else {
      throw new Error(res.error || 'Rol kaldırılırken hata oluştu.');
    }
  };

  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center space-x-2">
          <KeyRound className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Rol & Yetki Yönetimi (RBAC)
          </h3>
        </div>

        {!canManageRoles && (
          <span className="inline-flex items-center text-xs font-medium text-text-tertiary bg-bg-subtle px-2.5 py-1 rounded-lg border border-border-subtle">
            <Lock className="w-3 h-3 mr-1 opacity-70" />
            Salt Okunur (ROLE_MANAGE Gerekli)
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

      {/* Current Roles List */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-text-secondary">Tanımlı Roller:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentRoles.map((r) => {
            const isSuperAdminRole = r.role === 'SUPER_ADMIN';
            const isSelf = currentActorId === userId;

            return (
              <div
                key={r.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border-subtle bg-bg-subtle/50"
              >
                <div className="space-y-1">
                  <UserRoleBadges roles={[r.role]} size="md" />
                  <div className="text-[10px] text-text-tertiary">
                    Verilme: {new Date(r.grantedAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>

                {canManageRoles && (
                  <button
                    type="button"
                    onClick={() => setRoleToRevoke(r.role)}
                    className="p-2 text-text-tertiary hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
                    title={`${r.role} Rolünü Kaldır`}
                    aria-label={`${r.role} Rolünü Kaldır`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grant New Role Controls */}
      {canManageRoles && userStatus !== 'DISABLED' && availableRolesToGrant.length > 0 && (
        <div className="pt-3 border-t border-border-subtle space-y-2">
          <div className="text-xs font-semibold text-text-secondary">Yeni Rol Ata:</div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedRoleToGrant}
              onChange={(e) => setSelectedRoleToGrant(e.target.value as Role)}
              className="px-3 py-2 rounded-xl border border-border-subtle bg-bg-subtle text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/20 min-h-[44px] cursor-pointer"
              aria-label="Atanacak Rol"
            >
              {availableRolesToGrant.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleGrant}
              disabled={isGranting}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors min-h-[44px] touch-manipulation disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {isGranting ? 'Atanıyor...' : 'Rolü Ata'}
            </button>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      {roleToRevoke && (
        <UserActionModal
          isOpen={Boolean(roleToRevoke)}
          onClose={() => setRoleToRevoke(null)}
          onConfirm={handleConfirmRevoke}
          title={`Rolü Kaldır: ${roleToRevoke}`}
          description={`'${userName}' kullanıcısından '${roleToRevoke}' rolünü kaldırmak üzeresiniz. Bu işlem kullanıcının ilişkili erişim izinlerini derhal sınırlandıracaktır.`}
          confirmLabel="Rolü Kaldır"
          variant="danger"
          requiresTextInput={roleToRevoke === 'SUPER_ADMIN'}
          expectedConfirmationText={roleToRevoke === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : undefined}
          textInputPlaceholder="SUPER_ADMIN"
        />
      )}
    </div>
  );
};
