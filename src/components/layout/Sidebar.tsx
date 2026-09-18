'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Compass,
  FileCheck2,
  User,
  BookOpen,
  LayoutGrid,
  Clock,
  Layers,
  PenLine,
  Settings,
  Database,
  LogOut,
  X,
  Sparkles,
} from 'lucide-react';

export interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

interface CoverageState {
  exploredFacetsCount: number;
  totalOntologyFacets: number;
  explorationPercentage: number;
  measurementDepthPercentage: number;
  isAssessed: boolean;
}

const ZERO_COVERAGE: CoverageState = {
  exploredFacetsCount: 0,
  totalOntologyFacets: 91,
  explorationPercentage: 0,
  measurementDepthPercentage: 0,
  isAssessed: false,
};

export const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, onClose }) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showResearchNav, setShowResearchNav] = React.useState<boolean>(
    process.env.NODE_ENV !== 'production'
  );
  const [coverage, setCoverage] = React.useState<CoverageState>(ZERO_COVERAGE);
  const currentUserId = session?.user?.id;

  // Safe authenticated coverage fetcher
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      setCoverage(ZERO_COVERAGE);
      return;
    }

    if (status === 'loading') {
      return;
    }

    const abortController = new AbortController();

    async function fetchCoverage() {
      try {
        const res = await fetch('/api/profile/coverage', {
          signal: abortController.signal,
          cache: 'no-store',
        });
        if (!res.ok) {
          setCoverage(ZERO_COVERAGE);
          return;
        }
        const data = await res.json();
        if (!abortController.signal.aborted) {
          setCoverage({
            exploredFacetsCount: Number(data.exploredFacetsCount) || 0,
            totalOntologyFacets: Number(data.totalOntologyFacets) || 91,
            explorationPercentage: Number(data.explorationPercentage) || 0,
            measurementDepthPercentage: Number(data.measurementDepthPercentage) || 0,
            isAssessed: Boolean(data.isAssessed),
          });
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setCoverage(ZERO_COVERAGE);
        }
      }
    }

    fetchCoverage();

    return () => {
      abortController.abort();
    };
  }, [status, currentUserId, pathname]);

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
    if (path === '/overview' && pathname === '/overview') return true;
    if (path === '/profile') return pathname === '/profile' || pathname === '/profile/heatmap' || pathname === '/profile/personality';
    return pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const navItemClass = (active: boolean) =>
    `flex items-center px-3 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 touch-manipulation ${
      active
        ? 'bg-brand-primary/10 text-brand-primary font-bold shadow-2xs'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
    }`;

  const containerClass = isMobile
    ? 'w-full h-full bg-surface-1 flex flex-col select-none'
    : 'w-64 bg-surface-1 border-r border-border-default flex flex-col h-screen sticky top-0 select-none z-30';

  return (
    <aside className={containerClass} aria-label="Sol Gezinme Menüsü">
      {/* Brand logo & Mobile Close */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border-default shrink-0">
        <Link href="/overview" onClick={handleLinkClick} className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center text-white font-bold text-sm shadow-xs">
            Ψ
          </div>
          <div>
            <span className="font-extrabold text-base text-text-primary tracking-tight">PsycheAI</span>
          </div>
        </Link>

        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Menüyü Kapat"
            className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-bg-subtle transition-colors touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Grouped Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* GROUP 1: ANA SAYFA */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
            ANA SAYFA
          </div>
          <nav className="space-y-1">
            <Link href="/overview" onClick={handleLinkClick} className={navItemClass(isActive('/overview'))}>
              <Compass className="w-4 h-4 mr-3 opacity-80 shrink-0 text-brand-primary" />
              Genel Bakış
            </Link>
          </nav>
        </div>

        {/* GROUP 2: KEŞFET */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
            KEŞFET
          </div>
          <nav className="space-y-1">
            <Link href="/assessments" onClick={handleLinkClick} className={navItemClass(isActive('/assessments'))}>
              <FileCheck2 className="w-4 h-4 mr-3 opacity-80 shrink-0 text-brand-primary" />
              Değerlendirmeler
            </Link>
            <Link href="/profile" onClick={handleLinkClick} className={navItemClass(isActive('/profile'))}>
              <User className="w-4 h-4 mr-3 opacity-80 shrink-0 text-brand-primary" />
              Psikolojik Profilim
            </Link>
          </nav>
        </div>

        {/* GROUP 3: DERİNLEŞ */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
            DERİNLEŞ
          </div>
          <nav className="space-y-1">
            <Link href="/theory-council" onClick={handleLinkClick} className={navItemClass(isActive('/theory-council'))}>
              <BookOpen className="w-4 h-4 mr-3 opacity-80 shrink-0 text-brand-primary" />
              Kuramlar Konseyi
            </Link>
            <Link href="/profile/timeline" onClick={handleLinkClick} className={navItemClass(isActive('/profile/timeline'))}>
              <Clock className="w-4 h-4 mr-3 opacity-80 shrink-0 text-brand-primary" />
              Zaman İçinde Ben
            </Link>
            <Link href="/journal" onClick={handleLinkClick} className={navItemClass(isActive('/journal'))}>
              <PenLine className="w-4 h-4 mr-3 opacity-80 shrink-0 text-brand-primary" />
              Yansımalarım
            </Link>
          </nav>
        </div>

        {/* GROUP 4: HESAP */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
            HESAP
          </div>
          <nav className="space-y-1">
            <Link href="/settings" onClick={handleLinkClick} className={navItemClass(isActive('/settings'))}>
              <Settings className="w-4 h-4 mr-3 opacity-80 shrink-0 text-brand-primary" />
              Ayarlar & Gizlilik
            </Link>
          </nav>
        </div>

        {/* RESEARCH (Only if enabled) */}
        {showResearchNav && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
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
      <div className="p-4 border-t border-border-default bg-bg-subtle shrink-0 space-y-3">
        <div className="bg-surface-1 p-3 rounded-2xl border border-border-default shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-text-primary mb-1.5">
            <span>Keşif İlerlemesi</span>
            <span className="text-brand-primary font-bold">%{coverage.explorationPercentage}</span>
          </div>
          <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden mb-2 border border-border-subtle">
            <div
              className="bg-brand-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${coverage.explorationPercentage}%` }}
            />
          </div>
          <div className="flex items-center text-[11px] text-text-tertiary justify-between">
            <span>
              {coverage.exploredFacetsCount} / {coverage.totalOntologyFacets} Boyut
            </span>
            <span className="text-brand-primary font-medium">11 Alan</span>
          </div>
        </div>

        {isMobile && session?.user && (
          <div className="pt-2 border-t border-border-default flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="text-xs font-semibold text-text-primary truncate">
                {session.user.name || 'Kullanıcı'}
              </div>
              <div className="text-[10px] text-text-tertiary truncate">
                {session.user.email}
              </div>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-xl text-text-tertiary hover:text-status-danger hover:bg-status-danger/10 transition-colors"
              title="Çıkış Yap"
              aria-label="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
