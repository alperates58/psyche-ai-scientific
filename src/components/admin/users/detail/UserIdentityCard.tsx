import React from 'react';
import { UserDetailDTO } from '@/services/adminUserService';
import { UserStatusBadge } from '../UserStatusBadge';
import { User, Mail, Calendar, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export interface UserIdentityCardProps {
  user: UserDetailDTO;
}

export const UserIdentityCard: React.FC<UserIdentityCardProps> = ({ user }) => {
  const formattedCreatedAt = new Date(user.createdAt).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedLastLogin = user.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Henüz giriş yapılmadı';

  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            {user.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary tracking-tight">{user.name}</h2>
            <span className="text-xs text-text-tertiary font-mono">ID: {user.id}</span>
          </div>
        </div>
        <UserStatusBadge status={user.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-bg-subtle/70 border border-border-subtle space-y-1">
          <div className="flex items-center text-text-tertiary font-medium space-x-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>E-posta Adresi</span>
          </div>
          <div className="font-semibold text-text-primary font-mono text-sm break-all">
            {user.email || '—'}
          </div>
          <div className="flex items-center space-x-1 pt-1 text-[11px]">
            {user.emailVerified ? (
              <span className="inline-flex items-center text-emerald-700 font-medium">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                Doğrulandı ({new Date(user.emailVerified).toLocaleDateString('tr-TR')})
              </span>
            ) : (
              <span className="inline-flex items-center text-amber-700 font-medium">
                <Clock className="w-3 h-3 mr-1 text-amber-600" />
                Doğrulanmadı
              </span>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-bg-subtle/70 border border-border-subtle space-y-1">
          <div className="flex items-center text-text-tertiary font-medium space-x-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Normalize E-posta</span>
          </div>
          <div className="font-semibold text-text-primary font-mono text-sm break-all">
            {user.emailNormalized || '—'}
          </div>
          <div className="text-[11px] text-text-tertiary pt-1">
            {user.isDemoUser ? 'Demo Kullanıcı Hesabı' : 'Standart Kullanıcı Hesabı'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-bg-subtle/70 border border-border-subtle space-y-1">
          <div className="flex items-center text-text-tertiary font-medium space-x-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Kayıt Tarihi</span>
          </div>
          <div className="font-semibold text-text-primary">{formattedCreatedAt}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-bg-subtle/70 border border-border-subtle space-y-1">
          <div className="flex items-center text-text-tertiary font-medium space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Son Giriş</span>
          </div>
          <div className="font-semibold text-text-primary">{formattedLastLogin}</div>
        </div>
      </div>
    </div>
  );
};
