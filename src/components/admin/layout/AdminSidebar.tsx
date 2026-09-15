'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  KeyRound,
  History,
  FileCheck2,
  Database,
  Network,
  BookMarked,
  Scale,
  Calculator,
  Binary,
  Bot,
  Flag,
  Activity,
  GitMerge,
  FlaskConical,
  ArrowLeft,
  X,
  Lock,
} from 'lucide-react';

export interface AdminSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  disabled?: boolean;
  phaseBadge?: string;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

const ADMIN_NAVIGATION: NavCategory[] = [
  {
    title: 'GENEL BAKIŞ',
    items: [
      {
        label: 'Kontrol Paneli',
        href: '/admin',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'ERİŞİM & GÜVENLİK',
    items: [
      {
        label: 'Kullanıcı Yönetimi',
        icon: Users,
        disabled: true,
        phaseBadge: 'FAZ 2.7B',
      },
      {
        label: 'Roller & Yetkiler',
        icon: KeyRound,
        disabled: true,
        phaseBadge: 'FAZ 2.7B',
      },
      {
        label: 'Denetim Günlüğü',
        icon: History,
        disabled: true,
        phaseBadge: 'FAZ 2.7B',
      },
    ],
  },
  {
    title: 'BİLİMSEL KONTROL',
    items: [
      {
        label: 'Değerlendirme Formları',
        icon: FileCheck2,
        disabled: true,
        phaseBadge: 'FAZ 2.7C',
      },
      {
        label: 'Madde Bankası',
        icon: Database,
        disabled: true,
        phaseBadge: 'FAZ 2.7C',
      },
      {
        label: 'Ontoloji Haritası',
        icon: Network,
        disabled: true,
        phaseBadge: 'FAZ 2.7C',
      },
      {
        label: 'Kaynaklar & Lisanslar',
        icon: BookMarked,
        disabled: true,
        phaseBadge: 'FAZ 2.7C',
      },
      {
        label: 'Doğrulama Matrisi',
        icon: Scale,
        disabled: true,
        phaseBadge: 'FAZ 2.7C',
      },
      {
        label: 'Puanlama Modelleri',
        icon: Calculator,
        disabled: true,
        phaseBadge: 'FAZ 2.7C',
      },
      {
        label: 'Norm Tabloları',
        icon: Binary,
        disabled: true,
        phaseBadge: 'FAZ 2.7C',
      },
    ],
  },
  {
    title: 'PLATFORM & ALTYAPI',
    items: [
      {
        label: 'Yapay Zekâ Konfigürasyonu',
        icon: Bot,
        disabled: true,
        phaseBadge: 'FAZ 2.7D',
      },
      {
        label: 'Özellik Bayrakları',
        icon: Flag,
        disabled: true,
        phaseBadge: 'FAZ 2.7D',
      },
      {
        label: 'Sistem Durumu',
        icon: Activity,
        disabled: true,
        phaseBadge: 'FAZ 2.7B',
      },
      {
        label: 'Sürüm Yönetimi',
        icon: GitMerge,
        disabled: true,
        phaseBadge: 'FAZ 2.7D',
      },
    ],
  },
  {
    title: 'ARAŞTIRMA',
    items: [
      {
        label: 'Araştırma Yönetimi',
        icon: FlaskConical,
        disabled: true,
        phaseBadge: 'FAZ 2.7D',
      },
    ],
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isMobile = false, onClose }) => {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const containerClass = isMobile
    ? 'w-full h-full bg-surface-1 flex flex-col select-none'
    : 'w-64 bg-surface-1 border-r border-border-subtle flex flex-col h-screen sticky top-0 select-none z-30 shrink-0';

  return (
    <aside className={containerClass} aria-label="Admin Gezinme Menüsü">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border-subtle shrink-0">
        <Link href="/admin" onClick={handleLinkClick} className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            Ψ
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base text-text-primary tracking-tight">PsycheAI</span>
              <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200/60">
                ADMIN
              </span>
            </div>
            <span className="text-[10px] text-text-tertiary font-medium block">
              Kontrol Düzlemi v2.7A
            </span>
          </div>
        </Link>

        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Admin Menüsünü Kapat"
            className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-bg-subtle transition-colors touch-manipulation min-h-[44px] min-w-[44px] inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {ADMIN_NAVIGATION.map((section) => (
          <div key={section.title}>
            <div className="px-3 mb-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
              {section.title}
            </div>
            <nav className="space-y-1" aria-label={section.title}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = item.href ? (item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)) : false;

                if (item.disabled || !item.href) {
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xl text-text-disabled bg-transparent cursor-not-allowed select-none min-h-[44px]"
                      title={`${item.label} (${item.phaseBadge} aşamasında aktifleşecektir)`}
                      aria-disabled="true"
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-2">
                        <Icon className="w-4 h-4 opacity-40 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.phaseBadge && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wide bg-bg-subtle text-text-tertiary border border-border-subtle shrink-0">
                          <Lock className="w-2.5 h-2.5 mr-0.5 opacity-60" />
                          {item.phaseBadge}
                        </span>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 touch-manipulation min-h-[44px] ${
                      active
                        ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand-600' : 'opacity-80'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer Switch to Public / User App */}
      <div className="p-4 border-t border-border-subtle bg-surface-2/60 shrink-0">
        <Link
          href="/overview"
          onClick={handleLinkClick}
          className="flex items-center justify-center space-x-2 w-full px-3 py-2.5 rounded-xl border border-border-subtle bg-surface-1 text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-brand-300 hover:bg-brand-50/50 transition-all duration-150 shadow-xs min-h-[44px] touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600" />
          <span>Kullanıcı Uygulamasına Dön</span>
        </Link>
      </div>
    </aside>
  );
};
