'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShieldCheck, Info, Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useAppShell } from '@/components/layout/AppShell';

export const Header: React.FC = () => {
  const { isMobileMenuOpen, toggleMobileMenu, triggerButtonRef } = useAppShell();
  const { data: session, status } = useSession();

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : '??';

  return (
    <header className="h-16 bg-surface-1 border-b border-border-subtle px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs shrink-0">
      {/* Left side: Mobile Menu Trigger + Brand/Environment Badge */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {/* Mobile Hamburger Trigger (< lg) */}
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
          className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Icon for mobile (< lg) */}
        <Link href="/overview" className="lg:hidden flex items-center space-x-2 mr-1">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            Ψ
          </div>
        </Link>

        {/* Environment Badge */}
        <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-brand-50 border border-brand-200/60 px-2 sm:px-2.5 py-1 rounded-full shrink-0">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold text-brand-700 tracking-wide uppercase whitespace-nowrap">
            Canlı
          </span>
        </div>

        {/* Subtitle (tablet/desktop) */}
        <div className="hidden md:flex items-center text-xs text-text-tertiary truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 mr-1 shrink-0" />
          <span className="truncate">Bilimsel Psikometrik Profil Motoru</span>
        </div>
      </div>

      {/* Right side: Epistemic Note & User Profile */}
      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
        {/* Epistemic deterministic reminder (desktop >= xl) */}
        <div className="hidden xl:flex items-center text-xs text-text-tertiary bg-bg-subtle px-3 py-1.5 rounded-lg border border-border-subtle max-w-md">
          <Info className="w-3.5 h-3.5 mr-1.5 text-brand-600 shrink-0" />
          <span className="truncate">Puanlar deterministik hesaplanır; yapay zekâ puanları değiştiremez.</span>
        </div>

        {/* User avatar, identity & logout */}
        {status === 'authenticated' && user ? (
          <div className="flex items-center space-x-2 pl-2 sm:pl-3 border-l border-border-subtle">
            <div
              className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-xs border border-brand-200 shrink-0"
              title={user.name || user.email || 'Kullanıcı'}
            >
              {initials}
            </div>
            <div className="hidden sm:block text-left max-w-[130px]">
              <div className="text-xs font-semibold text-text-primary leading-tight truncate">
                {user.name || 'Kullanıcı'}
              </div>
              <div className="text-[10px] text-text-tertiary leading-tight truncate">
                {user.email}
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
        ) : status === 'unauthenticated' ? (
          <div className="flex items-center pl-2 sm:pl-3 border-l border-border-subtle">
            <Link
              href="/login"
              className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold text-brand-primary hover:bg-brand-primary/10 transition-colors inline-flex items-center"
            >
              <UserIcon className="w-4 h-4 mr-1.5" />
              Giriş Yap
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
};
