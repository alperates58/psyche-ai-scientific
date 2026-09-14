'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  FileCheck2,
  User,
  BookOpen,
  LayoutGrid,
  Clock,
  Layers,
  GitFork,
  Database,
  X
} from 'lucide-react';

export interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, onClose }) => {
  const pathname = usePathname();
  const [showResearchNav, setShowResearchNav] = React.useState<boolean>(
    process.env.NODE_ENV !== 'production'
  );

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      setShowResearchNav(true);
      return;
    }
    const hasAuthCookie = document.cookie
      .split(';')
      .some((c) => c.trim().startsWith('psyche_research_auth=1'));
    setShowResearchNav(hasAuthCookie);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/overview' && (pathname === '/' || pathname === '/overview')) return true;
    return pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const navItemClass = (active: boolean) =>
    `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 touch-manipulation ${
      active
        ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
    }`;

  const containerClass = isMobile
    ? 'w-full h-full bg-surface-1 flex flex-col select-none'
    : 'w-64 bg-surface-1 border-r border-border-subtle flex flex-col h-screen sticky top-0 select-none z-30';

  return (
    <aside className={containerClass} aria-label="Sol Gezinme Menüsü">
      {/* Brand logo & Mobile Close */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border-subtle shrink-0">
        <Link href="/overview" onClick={handleLinkClick} className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            Ψ
          </div>
          <div>
            <span className="font-bold text-base text-text-primary tracking-tight">PsycheAI</span>
            <span className="ml-1.5 text-[10px] font-semibold text-brand-600 uppercase tracking-widest bg-brand-50 px-1.5 py-0.5 rounded-md border border-brand-200/50">
              BİLİMSEL
            </span>
          </div>
        </Link>

        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Menüyü Kapat"
            className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-bg-subtle transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
            ANALİTİK
          </div>
          <nav className="space-y-1">
            <Link href="/overview" onClick={handleLinkClick} className={navItemClass(isActive('/overview'))}>
              <Compass className="w-4 h-4 mr-3 opacity-80 shrink-0" />
              Genel Bakış
            </Link>
            <Link href="/assessment" onClick={handleLinkClick} className={navItemClass(isActive('/assessment'))}>
              <FileCheck2 className="w-4 h-4 mr-3 opacity-80 shrink-0" />
              Değerlendirme
            </Link>
          </nav>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
            PROFİL BOYUTLARI
          </div>
          <nav className="space-y-1">
            <Link href="/profile/personality" onClick={handleLinkClick} className={navItemClass(isActive('/profile/personality'))}>
              <User className="w-4 h-4 mr-3 opacity-80 shrink-0" />
              Temel Kişilik
            </Link>
            <Link href="/profile/heatmap" onClick={handleLinkClick} className={navItemClass(isActive('/profile/heatmap'))}>
              <LayoutGrid className="w-4 h-4 mr-3 opacity-80 shrink-0" />
              Psikolojik Profil Haritası
            </Link>
          </nav>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
            İÇGÖRÜLER & KURAMLAR
          </div>
          <nav className="space-y-1">
            <Link href="/insights/context" onClick={handleLinkClick} className={navItemClass(isActive('/insights/context'))}>
              <GitFork className="w-4 h-4 mr-3 opacity-80 shrink-0" />
              Bağlamsal Değişimler
            </Link>
            <Link href="/insights/patterns" onClick={handleLinkClick} className={navItemClass(isActive('/insights/patterns'))}>
              <Layers className="w-4 h-4 mr-3 opacity-80 shrink-0" />
              Gerilimler & Sinerjiler
            </Link>
            <Link href="/theory-council" onClick={handleLinkClick} className={navItemClass(isActive('/theory-council'))}>
              <BookOpen className="w-4 h-4 mr-3 opacity-80 shrink-0" />
              Kuramlar Konseyi
            </Link>
          </nav>
        </div>

        {showResearchNav && (
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
              BİLİMSEL ARAŞTIRMA
            </div>
            <nav className="space-y-1">
              <Link href="/research/item-bank" onClick={handleLinkClick} className={navItemClass(isActive('/research/item-bank'))}>
                <Database className="w-4 h-4 mr-3 opacity-80 shrink-0" />
                Madde Bankası & Matris
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Progress Footer Card */}
      <div className="p-4 border-t border-border-subtle bg-surface-2/60 shrink-0">
        <div className="bg-surface-1 p-3.5 rounded-xl border border-border-subtle shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-text-primary mb-1.5">
            <span>Keşif Kapsamı</span>
            <span className="text-brand-600 font-bold">50%</span>
          </div>
          <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden mb-2 border border-border-subtle">
            <div className="bg-brand-500 h-full rounded-full transition-all duration-500" style={{ width: '50%' }} />
          </div>
          <div className="flex items-center text-[11px] text-text-tertiary justify-between">
            <span>42 / 84 Alt Boyut</span>
            <span className="inline-flex items-center text-amber-700 font-medium">
              <Clock className="w-3 h-3 mr-0.5" /> Ön Kalibrasyon
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
