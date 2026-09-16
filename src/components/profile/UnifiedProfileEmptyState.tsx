'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, Layers, ShieldCheck, Sparkles } from 'lucide-react';

interface UnifiedProfileEmptyStateProps {
  userName: string;
  nextAssessmentUrl?: string;
  nextAssessmentTitle?: string;
}

export const UnifiedProfileEmptyState: React.FC<UnifiedProfileEmptyStateProps> = ({
  userName,
  nextAssessmentUrl = '/assessment',
  nextAssessmentTitle = 'Temel Kişilik Yapısı Değerlendirmesi',
}) => {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8 animate-in fade-in duration-200">
      <div className="bg-surface-1 p-8 sm:p-12 rounded-panel border border-border-subtle shadow-xs text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-600 shadow-xs">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-brand-700 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            <span>Psikolojik Profil Yolculuğu</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Henüz Tamamlanmış Bir Profiliniz Yok
          </h1>

          <p className="text-sm text-text-secondary leading-relaxed">
            PsycheAI, kişiliğinizi ve psikolojik boyutlarınızı ezbere kalıplarla değil; tamamladığınız yapılandırılmış, ampirik değerlendirmelerle adım adım haritalandırır.
          </p>
        </div>

        {/* Feature Pill Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-xl mx-auto pt-2">
          <div className="p-3.5 rounded-2xl bg-surface-2/60 border border-border-subtle space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-text-primary">
              <Layers className="w-3.5 h-3.5 text-brand-600" />
              <span>84 Alt Boyut</span>
            </div>
            <p className="text-[11px] text-text-tertiary">
              Kişilik, benlik ve duygusal süreçlerin kapsamlı haritası.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-2/60 border border-border-subtle space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-text-primary">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Bilimsel Dürüstlük</span>
            </div>
            <p className="text-[11px] text-text-tertiary">
              Ölçülmeyen alanlar varsayımlarla doldurulmaz.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-2/60 border border-border-subtle space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-text-primary">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Dinamik Etkileşimler</span>
            </div>
            <p className="text-[11px] text-text-tertiary">
              Boyutlar arası sinerji ve gerilim örüntüleri.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={nextAssessmentUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] min-h-[48px]"
          >
            <span>{nextAssessmentTitle ? `Başla: ${nextAssessmentTitle}` : 'İlk Değerlendirmene Başla'}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>

          <Link
            href="/assessments"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 rounded-2xl bg-surface-2 hover:bg-bg-subtle text-text-primary text-xs font-semibold border border-border-subtle transition-colors min-h-[48px]"
          >
            <span>Tüm Değerlendirmeleri Gör</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
