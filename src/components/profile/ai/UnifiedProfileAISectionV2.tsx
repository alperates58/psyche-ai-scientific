'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Compass,
  CheckCircle2,
  GitFork,
  Scale,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Zap,
  Layers,
  Heart,
} from 'lucide-react';
import {
  AIInsightV2,
  UnifiedProfileAISectionData,
  EvidenceTransparencyInfo,
} from '@/types/aiInsightV2';
import { ProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';
import { getEvidenceTransparencyInfo } from '@/lib/ai/evidence/evidenceTransparency';
import { EvidenceProvenanceDrawer } from './EvidenceProvenanceDrawer';

interface UnifiedProfileAISectionV2Props {
  data: UnifiedProfileAISectionData;
  bundle: ProfileEvidenceBundleV2;
}

export const UnifiedProfileAISectionV2: React.FC<UnifiedProfileAISectionV2Props> = ({
  data,
  bundle,
}) => {
  const [selectedInsightForDrawer, setSelectedInsightForDrawer] = useState<AIInsightV2 | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = (insight: AIInsightV2) => {
    setSelectedInsightForDrawer(insight);
    setDrawerOpen(true);
  };

  const drawerInfo: EvidenceTransparencyInfo | null = selectedInsightForDrawer
    ? getEvidenceTransparencyInfo(selectedInsightForDrawer, bundle)
    : null;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-text-primary tracking-tight">
                Profilinin Anlamı
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {data.isFallback ? 'Deterministik Kanıt Yorumu' : 'AI Destekli Yorum'}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
              Ölçülmüş psikolojik kanıtlarınız üzerinden pedagojik, şefkatli ve gelişim odaklı sentez.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Overview Narrative Card */}
      <div className="bg-surface-1 p-6 rounded-panel border border-border-subtle shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              1. BÜTÜNSEL ÖZET
            </span>
            <h3 className="text-base font-bold text-text-primary">
              {data.overviewInsight.titleTr}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => handleOpenDrawer(data.overviewInsight)}
            className="inline-flex items-center px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-2/60 hover:bg-surface-2 text-text-secondary hover:text-text-primary text-xs font-semibold transition-colors shrink-0 space-x-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Bu yorum neye dayanıyor?</span>
          </button>
        </div>

        <p className="text-sm text-text-primary font-medium leading-relaxed">
          {data.overviewInsight.summaryTr}
        </p>

        <div className="p-4 rounded-xl bg-surface-2/40 border border-border-subtle text-xs text-text-secondary leading-relaxed whitespace-pre-line">
          {data.overviewInsight.bodyTr}
        </div>

        {/* Reflection Prompts */}
        {data.overviewInsight.reflectionPrompts.length > 0 && (
          <div className="p-4 rounded-xl bg-brand-50/40 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-800/40 space-y-2">
            <div className="text-xs font-bold text-brand-900 dark:text-brand-200 flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-brand-600" />
              <span>Üzerine Düşünebileceğin Noktalar</span>
            </div>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              {data.overviewInsight.reflectionPrompts.map((p, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="font-bold text-brand-600 shrink-0">{idx + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 2. Prominent Patterns & Counterbalancing Traits */}
      {(data.prominentPatternInsights.length > 0 || data.counterbalancingInsights.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Prominent Patterns */}
          {data.prominentPatternInsights.length > 0 && (
            <div className="bg-surface-1 p-5 rounded-panel border border-border-subtle shadow-xs space-y-4">
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>2. Dikkat Çeken Örüntüler</span>
              </div>
              <div className="space-y-3">
                {data.prominentPatternInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-surface-2/40 border border-border-subtle space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary">
                        {insight.titleTr}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenDrawer(insight)}
                        className="text-[10px] text-brand-600 hover:text-brand-700 font-semibold"
                      >
                        Kanıtı Gör
                      </button>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {insight.summaryTr}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Counterbalancing Traits */}
          {data.counterbalancingInsights.length > 0 && (
            <div className="bg-surface-1 p-5 rounded-panel border border-border-subtle shadow-xs space-y-4">
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center space-x-1.5">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>3. Dengeleyici Özellikler</span>
              </div>
              <div className="space-y-3">
                {data.counterbalancingInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                        {insight.titleTr}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenDrawer(insight)}
                        className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold"
                      >
                        Kanıtı Gör
                      </button>
                    </div>
                    <p className="text-xs text-emerald-900/80 dark:text-emerald-300 leading-relaxed">
                      {insight.summaryTr}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Tensions & Synergies Grid */}
      {(data.tensionInsights.length > 0 || data.synergyInsights.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tensions */}
          {data.tensionInsights.length > 0 && (
            <div className="bg-surface-1 p-5 rounded-panel border border-border-subtle shadow-xs space-y-4">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                <GitFork className="w-4 h-4 text-amber-600" />
                <span>4. İçsel Gerginlikler ve Fırsatlar</span>
              </div>
              <div className="space-y-3">
                {data.tensionInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                        {insight.titleTr}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenDrawer(insight)}
                        className="text-[10px] text-amber-700 hover:text-amber-800 font-semibold"
                      >
                        Kanıtı Gör
                      </button>
                    </div>
                    <p className="text-xs text-amber-900/80 dark:text-amber-300 leading-relaxed">
                      {insight.summaryTr}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synergies */}
          {data.synergyInsights.length > 0 && (
            <div className="bg-surface-1 p-5 rounded-panel border border-border-subtle shadow-xs space-y-4">
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>5. Güçlendirici Sinerjiler</span>
              </div>
              <div className="space-y-3">
                {data.synergyInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                        {insight.titleTr}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenDrawer(insight)}
                        className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold"
                      >
                        Kanıtı Gör
                      </button>
                    </div>
                    <p className="text-xs text-emerald-900/80 dark:text-emerald-300 leading-relaxed">
                      {insight.summaryTr}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Evidence Transparency Drawer */}
      <EvidenceProvenanceDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        info={drawerInfo}
      />
    </div>
  );
};
