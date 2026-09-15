import React from 'react';
import Link from 'next/link';
import { UserDirectoryItem } from '@/services/adminUserService';
import { UserStatusBadge } from './UserStatusBadge';
import { UserRoleBadges } from './UserRoleBadges';
import { UserPagination } from './UserPagination';
import { ChevronRight, Key, Globe, User, Calendar, Activity } from 'lucide-react';

export interface UserDirectoryTableProps {
  users: UserDirectoryItem[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export const UserDirectoryTable: React.FC<UserDirectoryTableProps> = ({
  users,
  pagination,
}) => {
  if (users.length === 0) {
    return (
      <div className="bg-surface-1 rounded-2xl border border-border-subtle p-12 text-center shadow-xs">
        <User className="w-10 h-10 text-text-tertiary mx-auto mb-3 opacity-60" />
        <h3 className="text-base font-bold text-text-primary mb-1">Kullanıcı Bulunamadı</h3>
        <p className="text-xs text-text-secondary max-w-md mx-auto">
          Arama kriterlerinize veya seçilen filtrelere uygun kullanıcı kaydı bulunamadı. Lütfen filtrelerinizi sıfırlamayı deneyin.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs" aria-label="Kullanıcı Listesi">
          <thead className="bg-bg-subtle/80 text-text-tertiary uppercase text-[10px] tracking-wider border-b border-border-subtle select-none font-semibold">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Kullanıcı / Kimlik</th>
              <th className="py-3.5 px-4 font-semibold">Durum</th>
              <th className="py-3.5 px-4 font-semibold">Roller</th>
              <th className="py-3.5 px-4 font-semibold">Giriş Yöntemleri</th>
              <th className="py-3.5 px-4 font-semibold">Son Giriş</th>
              <th className="py-3.5 px-4 font-semibold">Kayıt Tarihi</th>
              <th className="py-3.5 px-4 text-center font-semibold">Ölçümler</th>
              <th className="py-3.5 px-4 text-right font-semibold">Eylemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle font-normal">
            {users.map((u) => {
              const displayEmail = u.email || u.emailMasked || 'E-posta Yok';
              const formattedLastLogin = u.lastLoginAt
                ? new Date(u.lastLoginAt).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—';
              const formattedCreatedAt = new Date(u.createdAt).toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });

              return (
                <tr
                  key={u.id}
                  className="hover:bg-bg-subtle/50 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="font-semibold text-text-primary hover:text-brand-600 transition-colors truncate block"
                        >
                          {u.name}
                        </Link>
                        <span className="text-[11px] text-text-tertiary font-mono truncate block">
                          {displayEmail}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <UserStatusBadge status={u.status} />
                  </td>

                  <td className="py-3 px-4">
                    <UserRoleBadges roles={u.roles} size="sm" />
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      {u.authMethods.includes('credentials') && (
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-2 text-text-secondary border border-border-subtle"
                          title="Şifre ile Giriş"
                        >
                          <Key className="w-2.5 h-2.5 mr-1 opacity-70" />
                          Şifre
                        </span>
                      )}
                      {u.authMethods.includes('google') && (
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
                          title="Google OAuth"
                        >
                          <Globe className="w-2.5 h-2.5 mr-1" />
                          Google
                        </span>
                      )}
                      {u.authMethods.length === 0 && (
                        <span className="text-[11px] text-text-tertiary">—</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-text-secondary text-[11px]">
                    {formattedLastLogin}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-text-secondary text-[11px]">
                    {formattedCreatedAt}
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-bg-subtle text-text-secondary border border-border-subtle"
                      title={`${u.assessmentCount} Değerlendirme Oturumu, ${u.snapshotCount} Profil Çıktısı`}
                    >
                      <Activity className="w-2.5 h-2.5 mr-1 text-brand-600" />
                      {u.assessmentCount} / {u.snapshotCount}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-border-subtle bg-surface-1 text-text-secondary hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50/40 transition-colors font-medium text-xs min-h-[36px] touch-manipulation"
                      aria-label={`${u.name} Detaylarını İncele`}
                    >
                      <span>Yönet</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (Visible on < lg screens) */}
      <div className="block lg:hidden divide-y divide-border-subtle">
        {users.map((u) => {
          const displayEmail = u.email || u.emailMasked || 'E-posta Yok';
          return (
            <div key={u.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {u.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="font-bold text-sm text-text-primary hover:text-brand-600 truncate block"
                    >
                      {u.name}
                    </Link>
                    <span className="text-xs text-text-tertiary font-mono truncate block">
                      {displayEmail}
                    </span>
                  </div>
                </div>
                <UserStatusBadge status={u.status} />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <UserRoleBadges roles={u.roles} size="sm" />
              </div>

              <div className="flex items-center justify-between text-xs text-text-secondary pt-2 border-t border-border-subtle/50">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-text-tertiary" />
                  <span>
                    {new Date(u.createdAt).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <Link
                  href={`/admin/users/${u.id}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-xl border border-brand-300 bg-brand-50 text-brand-700 font-semibold text-xs min-h-[44px] touch-manipulation"
                >
                  <span>Yönet</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Bar */}
      <UserPagination
        total={pagination.total}
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalPages={pagination.totalPages}
      />
    </div>
  );
};
