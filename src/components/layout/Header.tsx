'use client';

import React from 'react';
import { ShieldCheck, Info, Sparkles, User, Bell } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-surface-1 border-b border-border-subtle px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center space-x-3">
        <div className="inline-flex items-center space-x-2 bg-brand-50 border border-brand-200/60 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
          <span className="text-xs font-semibold text-brand-700 tracking-wide uppercase">
            Önizleme Ortamı
          </span>
        </div>
        <div className="hidden md:flex items-center text-xs text-text-tertiary">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 mr-1" />
          <span>Tanı Amaçlı Olmayan Psikolojik Profil Motoru (v1.0-alfa)</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden lg:flex items-center text-xs text-text-tertiary bg-bg-subtle px-3 py-1.5 rounded-lg border border-border-subtle">
          <Info className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
          <span>Puanlar deterministik olarak hesaplanır. Yapay zekâ puanları değiştirmeden yalnızca yorumlar.</span>
        </div>

        <div className="flex items-center space-x-3 pl-2 border-l border-border-subtle">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-xs border border-brand-200">
            AL
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-text-primary">Alex Mercer</div>
            <div className="text-[11px] text-text-tertiary">Araştırma Katılımcısı</div>
          </div>
        </div>
      </div>
    </header>
  );
};
