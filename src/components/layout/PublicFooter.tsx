import React from 'react';
import Link from 'next/link';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full bg-surface-1 border-t border-border-subtle py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-xs">
            Ψ
          </div>
          <span className="font-bold text-sm text-text-primary">PsycheAI</span>
          <span className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} Bilimsel Dijital Psikolojik Profil Platformu.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-text-tertiary">
          <Link href="/how-it-works" className="hover:text-text-primary transition-colors">
            Nasıl Çalışır?
          </Link>
          <Link href="/science" className="hover:text-text-primary transition-colors">
            Bilimsel Yaklaşım
          </Link>
          <Link href="/privacy" className="hover:text-text-primary transition-colors">
            Gizlilik Politikası
          </Link>
          <Link href="/terms" className="hover:text-text-primary transition-colors">
            Kullanım Koşulları
          </Link>
        </div>
      </div>
    </footer>
  );
};
