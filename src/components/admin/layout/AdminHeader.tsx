'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { Menu, LogOut, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';
import { AuthUser } from '@/lib/auth';

export interface AdminHeaderProps {
  user?: AuthUser | null;
  onToggleMobileMenu?: () => void;
  triggerButtonRef?: React.RefObject<HTMLButtonElement>;
  isMobileMenuOpen?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  onToggleMobileMenu,
  triggerButtonRef,
  isMobileMenuOpen = false,
}) => {
  const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <header className="h-16 bg-surface-1 border-b border-border-subtle px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs shrink-0">
      {/* Left Section: Mobile Drawer Trigger + Breadcrumbs */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={onToggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Admin Menüsünü Kapat' : 'Admin Menüsünü Aç'}
          aria-expanded={isMobileMenuOpen}
          className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <AdminBreadcrumbs />
        </div>
      </div>

      {/* Right Section: Environment Pill & Admin Actor Profile */}
      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
        {/* Environment Badge */}
        <div className="hidden md:inline-flex items-center space-x-1.5 bg-brand-50 border border-brand-200/60 px-2.5 py-1 rounded-full shrink-0">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
          <span className="text-[11px] font-semibold text-brand-700 tracking-wide uppercase">
            Kontrol Düzlemi Canlı
          </span>
        </div>

        {/* Epistemic deterministic reminder for admin */}
        <div className="hidden xl:flex items-center text-xs text-text-tertiary bg-bg-subtle px-3 py-1.5 rounded-lg border border-border-subtle max-w-sm">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-teal-600 shrink-0" />
          <span className="truncate">Yayınlanan formlar ve sürümler değişmezdir.</span>
        </div>

        {/* Admin Identity & Role Chip */}
        {user && (
          <div className="flex items-center space-x-2 pl-2 sm:pl-3 border-l border-border-subtle">
            <div
              className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs border border-brand-200 shrink-0"
              title={user.name || user.email || 'Admin'}
            >
              {userInitials}
            </div>
            <div className="hidden sm:block text-left max-w-[140px]">
              <div className="text-xs font-semibold text-text-primary leading-tight truncate">
                {user.name || 'Yönetici'}
              </div>
              <div className="flex items-center space-x-1 mt-0.5">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                    isSuperAdmin
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-brand-50 text-brand-700 border border-brand-200'
                  }`}
                >
                  {isSuperAdmin ? 'SUPER_ADMIN' : 'ADMIN'}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Güvenli Çıkış Yap"
              aria-label="Güvenli Çıkış Yap"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-xl text-text-tertiary hover:text-status-danger hover:bg-status-danger/10 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-danger/40"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
