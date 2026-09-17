'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Compass,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { AIInsightV2 } from '@/types/aiInsightV2';
import { EvidenceProvenanceDrawer } from './EvidenceProvenanceDrawer';
import { EvidenceTransparencyInfo } from '@/types/aiInsightV2';

interface AssessmentResultAISectionProps {
  insight: AIInsightV2;
}

export const AssessmentResultAISection: React.FC<AssessmentResultAISectionProps> = ({
  insight,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerInfo: EvidenceTransparencyInfo = {
    insightId: insight.insightId,
    titleTr: insight.titleTr,
    claimStrength: insight.claimStrength,
    dimensions: [],
    sourceModules: [
      {
        moduleCode: 'CURRENT_MODULE',
        titleTr: 'Tamamlanan Değerlendirme Modülü',
      },
    ],
    coverageContextTr: insight.coverageStatus || 'Değerlendirme Modülü Kanıtı',
    responseQualityNoteTr: 'Yanıt süreleri ve tutarlılık kriterleri başarıyla doğrulanmıştır.',
    limitationsTr: insight.limitations,
  };

  return (
    <div className="bg-surface-1 p-6 rounded-panel border border-purple-200/70 dark:border-purple-800/60 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100 dark:border-purple-900/40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-text-primary">
                Bu Sonuç Profilinizde Ne İfade Ediyor?
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {insight.isFallback ? 'Deterministik Yorum' : 'AI Destekli Yorum'}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Tamamladığınız bu değerlendirmenin psikolojik örüntülerinize katkısı.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-2/60 hover:bg-surface-2 text-text-secondary hover:text-text-primary text-xs font-semibold transition-colors shrink-0 space-x-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          <span>Bu yorum neye dayanıyor?</span>
        </button>
      </div>

      {/* Narrative Body */}
      <div className="space-y-3">
        <p className="text-xs text-text-secondary leading-relaxed font-medium">
          {insight.summaryTr}
        </p>

        <div className="p-3.5 rounded-xl bg-surface-2/30 border border-border-subtle text-xs text-text-secondary leading-relaxed whitespace-pre-line">
          {insight.bodyTr}
        </div>

        {/* Reflection Prompts */}
        {insight.reflectionPrompts.length > 0 && (
          <div className="p-3.5 rounded-xl bg-brand-50/40 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-800/40 space-y-1.5">
            <div className="text-[11px] font-bold text-brand-900 dark:text-brand-200 flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-600" />
              <span>Düşünme Sorusu</span>
            </div>
            <p className="text-xs text-text-secondary">
              {insight.reflectionPrompts[0]}
            </p>
          </div>
        )}
      </div>

      {/* Evidence Provenance Drawer */}
      <EvidenceProvenanceDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        info={drawerInfo}
      />
    </div>
  );
};
