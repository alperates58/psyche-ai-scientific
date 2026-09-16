'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, Clock, PlusCircle } from 'lucide-react';

interface MissingDomainItem {
  domainId: string;
  code: string;
  nameTr: string;
  descriptionTr: string;
  whyItMattersTr: string;
  availableAssessmentTitleTr?: string;
  availableAssessmentUrl?: string;
  isAssessmentAvailable: boolean;
}

interface MissingDomainsCatalogueProps {
  unmeasuredDomains: MissingDomainItem[];
}

export const MissingDomainsCatalogue: React.FC<MissingDomainsCatalogueProps> = ({
  unmeasuredDomains,
}) => {
  if (unmeasuredDomains.length === 0) {
    return (
      <div className="bg-surface-1 p-5 rounded-panel border border-emerald-200 shadow-xs flex items-center space-x-3 text-emerald-900 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
        <span>Ontolojideki tüm temel alanlar ampirik olarak taranmıştır.</span>
      </div>
    );
  }

  return (
    <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-border-subtle shadow-xs space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-base sm:text-lg font-bold text-text-primary">
            Profilinde Henüz Eksik Olan Alanlar
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-2 text-text-tertiary border border-border-subtle">
            {unmeasuredDomains.length} ALAN
          </span>
        </div>
        <p className="text-xs text-text-secondary mt-1">
          Bilimsel dürüstlük ilkesi gereği, henüz ölçülmemiş psikolojik alanlar varsayımlarla doldurulmaz. Aşağıdaki alanlar profilinizi genişletmek için keşfedilebilir.
        </p>
      </div>

      {/* Grid of Unmeasured Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {unmeasuredDomains.map((domain) => (
          <div
            key={domain.domainId}
            className="p-4 rounded-2xl bg-surface-2/50 border border-border-subtle flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-text-primary">
                  {domain.nameTr}
                </h3>
                <span className="text-[10px] text-text-tertiary font-mono">
                  {domain.code}
                </span>
              </div>

              <p className="text-[11px] text-text-secondary leading-relaxed">
                {domain.whyItMattersTr}
              </p>
            </div>

            <div className="pt-2 border-t border-border-subtle">
              {domain.isAssessmentAvailable && domain.availableAssessmentUrl ? (
                <Link
                  href={domain.availableAssessmentUrl}
                  className="inline-flex items-center justify-between w-full text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <span className="truncate">
                    {domain.availableAssessmentTitleTr || 'Değerlendirmeye Başla'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 shrink-0" />
                </Link>
              ) : (
                <span className="text-[11px] text-text-tertiary italic">
                  Gelecek modüllerde yayınlanacaktır
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
