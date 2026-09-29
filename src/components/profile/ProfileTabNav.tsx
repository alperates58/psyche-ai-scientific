'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Dna,
  Layers,
  Grid,
  Clock,
  BookOpen,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

export interface ProfileTabItem {
  id: string;
  labelTr: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export const PROFILE_TABS: ProfileTabItem[] = [
  {
    id: 'summary',
    labelTr: 'Özet',
    href: '/profile',
    icon: Sparkles,
    description: 'Profil Özeti ve Bütüncül Portre',
  },
  {
    id: 'map',
    labelTr: 'Haritam',
    href: '/profile/map',
    icon: Dna,
    description: 'Amiral Gemisi Görseller ve Haritalar',
  },
  {
    id: 'domains',
    labelTr: 'Alanlar',
    href: '/profile/personality',
    icon: Layers,
    description: '7 Temel Psikolojik Alan',
  },
  {
    id: 'facets',
    labelTr: 'Alt Boyutlar',
    href: '/profile/facets',
    icon: Grid,
    description: '91 Alt Boyut Kaşifi',
  },
  {
    id: 'timeline',
    labelTr: 'Zaman',
    href: '/profile/timeline',
    icon: Clock,
    description: 'Zaman İçinde Değişim ve Seyir',
  },
  {
    id: 'theories',
    labelTr: 'Kuramlar',
    href: '/theory-council',
    icon: BookOpen,
    description: '10 Kuramsal Mercek Analizi',
  },
];

export const DOMAIN_SUB_ROUTES = [
  { id: 'personality', labelTr: 'Kişilik (HEXACO)', href: '/profile/personality', color: 'text-purple-600' },
  { id: 'self', labelTr: 'Benlik & Öz-Düzenleme', href: '/profile/self', color: 'text-indigo-600' },
  { id: 'emotions', labelTr: 'Duygu İşleyişi', href: '/profile/emotions', color: 'text-rose-600' },
  { id: 'cognition', labelTr: 'Biliş & Karar', href: '/profile/cognition', color: 'text-blue-600' },
  { id: 'motivation', labelTr: 'Motivasyon & Değerler', href: '/profile/motivation', color: 'text-amber-600' },
  { id: 'relationships', labelTr: 'İlişkisel Tarz', href: '/profile/relationships', color: 'text-teal-600' },
  { id: 'resilience', labelTr: 'Stres & Dayanıklılık', href: '/profile/resilience', color: 'text-cyan-600' },
];

export const ProfileTabNav: React.FC = () => {
  const pathname = usePathname();
  const [showDomainDropdown, setShowDomainDropdown] = React.useState(false);

  const isTabActive = (tab: ProfileTabItem) => {
    if (tab.href === '/profile') {
      return pathname === '/profile';
    }
    if (tab.id === 'domains') {
      return (
        pathname.startsWith('/profile/personality') ||
        pathname.startsWith('/profile/self') ||
        pathname.startsWith('/profile/emotions') ||
        pathname.startsWith('/profile/cognition') ||
        pathname.startsWith('/profile/motivation') ||
        pathname.startsWith('/profile/relationships') ||
        pathname.startsWith('/profile/resilience')
      );
    }
    return pathname.startsWith(tab.href);
  };

  const isCurrentDomain = (href: string) => pathname === href;

  return (
    <div className="w-full space-y-2">
      {/* 6 Top-Level Profile Navigation Tabs */}
      <nav
        aria-label="Profil Ana Sekmeleri"
        className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 p-1.5 rounded-2xl bg-surface-1 border border-border-default shadow-xs overflow-x-auto no-scrollbar"
      >
        {PROFILE_TABS.map((tab) => {
          const active = isTabActive(tab);
          const Icon = tab.icon;

          if (tab.id === 'domains') {
            return (
              <div key={tab.id} className="relative shrink-0">
                <div className="flex items-center">
                  <Link
                    href={tab.href}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-brand-primary text-white shadow-xs'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-brand-primary'}`} />
                    <span>{tab.labelTr}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowDomainDropdown(!showDomainDropdown)}
                    aria-label="Alanları Listele"
                    aria-expanded={showDomainDropdown}
                    className={`p-1.5 rounded-lg -ml-1 text-xs transition-colors ${
                      active
                        ? 'text-white hover:bg-white/20'
                        : 'text-text-tertiary hover:text-text-primary hover:bg-bg-subtle'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {showDomainDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDomainDropdown(false)}
                    />
                    <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-surface-1 border border-border-default shadow-lg p-2 z-50 space-y-1">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                        Psikolojik Alanlar
                      </div>
                      {DOMAIN_SUB_ROUTES.map((domain) => (
                        <Link
                          key={domain.id}
                          href={domain.href}
                          onClick={() => setShowDomainDropdown(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                            isCurrentDomain(domain.href)
                              ? 'bg-brand-primary/10 text-brand-primary font-bold'
                              : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                          }`}
                        >
                          <span>{domain.labelTr}</span>
                          <span className={`w-2 h-2 rounded-full ${domain.color.replace('text-', 'bg-')}`} />
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                active
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-brand-primary'}`} />
              <span>{tab.labelTr}</span>
            </Link>
          );
        })}

        {/* Science secondary link */}
        <div className="ml-auto hidden sm:flex items-center pl-2">
          <Link
            href="/profile/science"
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              pathname === '/profile/science'
                ? 'text-brand-primary font-bold bg-brand-primary/10'
                : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-subtle'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Bilimsel Metodoloji</span>
          </Link>
        </div>
      </nav>

      {/* Domain Pills Bar (shown when on any domain route) */}
      {(pathname.startsWith('/profile/personality') ||
        pathname.startsWith('/profile/self') ||
        pathname.startsWith('/profile/emotions') ||
        pathname.startsWith('/profile/cognition') ||
        pathname.startsWith('/profile/motivation') ||
        pathname.startsWith('/profile/relationships') ||
        pathname.startsWith('/profile/resilience')) && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {DOMAIN_SUB_ROUTES.map((domain) => {
            const isCurrent = isCurrentDomain(domain.href);
            return (
              <Link
                key={domain.id}
                href={domain.href}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-surface-1 border border-border-strong text-text-primary shadow-2xs'
                    : 'bg-bg-subtle hover:bg-surface-1 text-text-tertiary hover:text-text-primary border border-transparent'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${domain.color.replace('text-', 'bg-')}`} />
                <span>{domain.labelTr}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
