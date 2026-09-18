'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowRight, Sparkles, User } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-surface-1/90 backdrop-blur-md border-b border-border-subtle sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center text-white font-bold text-sm shadow-xs">
            Ψ
          </div>
          <span className="font-extrabold text-lg text-text-primary tracking-tight">PsycheAI</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-text-secondary">
          <Link href="/how-it-works" className="hover:text-text-primary transition-colors">
            Nasıl Çalışır?
          </Link>
          <Link href="/science" className="hover:text-text-primary transition-colors">
            Bilimsel Yaklaşım
          </Link>
          <Link href="/privacy" className="hover:text-text-primary transition-colors">
            Gizlilik
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {session?.user ? (
            <Link
              href="/overview"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold shadow-xs transition-all"
            >
              <User className="w-3.5 h-3.5 mr-1.5" />
              <span>Profilime Git</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold shadow-xs transition-all"
              >
                <span>Profilimi Keşfet</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
