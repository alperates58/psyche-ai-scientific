'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Info, Menu } from 'lucide-react';
import { useAppShell } from '@/components/layout/AppShell';

export const Header: React.FC = () => {
  const { isMobileMenuOpen, toggleMobileMenu, triggerButtonRef } = useAppShell();

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
            Önizleme
          </span>
        </div>

        {/* Subtitle (tablet/desktop) */}
        <div className="hidden md:flex items-center text-xs text-text-tertiary truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 mr-1 shrink-0" />
          <span className="truncate">Tanı Amaçlı Olmayan Psikolojik Profil Motoru (v1.0-alfa)</span>
        </div>
      </div>

      {/* Right side: Epistemic Note & User Profile */}
      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
        {/* Epistemic deterministic reminder (desktop >= xl) */}
        <div className="hidden xl:flex items-center text-xs text-text-tertiary bg-bg-subtle px-3 py-1.5 rounded-lg border border-border-subtle max-w-md">
          <Info className="w-3.5 h-3.5 mr-1.5 text-brand-600 shrink-0" />
          <span className="truncate">Puanlar deterministik hesaplanır; yapay zekâ puanları değiştiremez.</span>
        </div>

        {/* User avatar and identity */}
        <div className="flex items-center space-x-2.5 pl-2 sm:pl-3 border-l border-border-subtle">
          <div
            className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-xs border border-brand-200 shrink-0"
            title="Alex Mercer (Araştırma Katılımcısı)"
          >
            AL
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-text-primary leading-tight">Alex Mercer</div>
            <div className="text-[10px] text-text-tertiary leading-tight">Katılımcı</div>
          </div>
        </div>
      </div>
    </header>
  );
};
