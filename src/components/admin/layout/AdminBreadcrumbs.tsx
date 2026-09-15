'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Shield } from 'lucide-react';

const ROUTE_LABELS: Record<string, string> = {
  admin: 'Kontrol Düzlemi',
  users: 'Kullanıcı Yönetimi',
  audit: 'Denetim Günlüğü',
  system: 'Sistem Durumu',
  'assessment-forms': 'Değerlendirme Formları',
  'item-bank': 'Madde Bankası',
  ontology: 'Ontoloji Haritası',
  sources: 'Kaynaklar',
  licenses: 'Lisanslar',
  validation: 'Doğrulama Matrisi',
  'scoring-models': 'Puanlama Modelleri',
  norms: 'Norm Tabloları',
  ai: 'Yapay Zekâ Konfigürasyonu',
  'feature-flags': 'Özellik Bayrakları',
  releases: 'Sürüm Yönetimi',
  research: 'Araştırma Yönetimi',
};

export const AdminBreadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // If we are at root /admin, render just "Kontrol Düzlemi"
  return (
    <nav aria-label="Admin Sayfa Konumu" className="flex items-center space-x-1.5 text-xs text-text-tertiary">
      <Link
        href="/admin"
        className="inline-flex items-center hover:text-brand-600 font-medium transition-colors touch-manipulation"
      >
        <Shield className="w-3.5 h-3.5 mr-1 text-brand-600 shrink-0" />
        <span>Admin</span>
      </Link>

      {segments.map((segment, index) => {
        if (segment === 'admin' && segments.length === 1) {
          return (
            <React.Fragment key="admin-root">
              <ChevronRight className="w-3.5 h-3.5 text-text-disabled shrink-0" />
              <span className="font-semibold text-text-primary">Genel Bakış</span>
            </React.Fragment>
          );
        }

        if (segment === 'admin') return null;

        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const label = ROUTE_LABELS[segment] || segment;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3.5 h-3.5 text-text-disabled shrink-0" />
            {isLast ? (
              <span className="font-semibold text-text-primary truncate max-w-[200px]" aria-current="page">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-brand-600 transition-colors truncate max-w-[150px] touch-manipulation"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
