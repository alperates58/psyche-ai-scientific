'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Compass,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  GitFork,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { AIInsightOutput } from '@/types/aiInsight';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';

interface AiInsightCardProps {
  initialInsights?: AIInsightOutput | null;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({
  initialInsights,
}) => {
  const [insights, setInsights] = useState<AIInsightOutput | null>(initialInsights || null);
  const [isLoading, setIsLoading] = useState(!initialInsights);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialInsights) {
      fetchInsights();
    }
  }, [initialInsights]);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/profile/ai-insights');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setInsights(data);
    } catch (e) {
      console.warn('Could not fetch AI insights via API, using fallback:', e);
      setError('İçgörüler yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface-1 p-6 rounded-panel border border-border-subtle shadow-xs animate-pulse space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-purple-100 rounded w-1/3" />
            <div className="h-3 bg-surface-2 rounded w-1/2" />
          </div>
        </div>
        <div className="h-16 bg-surface-2/60 rounded-xl" />
      </div>
    );
  }

  if (error || !insights) {
    return null;
  }

  return (
    <div className="bg-surface-1 p-5 sm:p-6 rounded-panel border border-purple-200/70 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-text-primary">
                {insights.headline}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                AI Destekli Sentez
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
              {insights.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Observations & Grounded Patterns */}
      {insights.observations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-600" />
            <span>Öne Çıkan Psikolojik Örüntüler</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.observations.map((obs, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-surface-2/50 border border-border-subtle space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] text-text-tertiary">
                  <span className="font-semibold text-brand-700">Gözlem #{idx + 1}</span>
                  <span className="font-mono">Güven: {obs.confidenceLevel}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {obs.observationTr}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Synergies and Tensions */}
      {(insights.synergies.length > 0 || insights.tensions.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Synergies */}
          {insights.synergies.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-2.5">
              <div className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Tespit Edilen Sinerjiler</span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-950">
                {insights.synergies.map((s, idx) => (
                  <li key={idx} className="leading-relaxed">
                    &bull; {s.synergyTr}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tensions */}
          {insights.tensions.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-2.5">
              <div className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                <GitFork className="w-4 h-4 text-amber-600" />
                <span>İçsel Gerilimler ve Fırsatlar</span>
              </div>
              <ul className="space-y-2 text-xs text-amber-950">
                {insights.tensions.map((t, idx) => (
                  <li key={idx} className="leading-relaxed">
                    &bull; {t.tensionTr}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Reflection Prompts */}
      {insights.reflectionQuestions.length > 0 && (
        <div className="p-4 rounded-2xl bg-surface-2/60 border border-border-subtle space-y-2.5">
          <div className="text-xs font-bold text-text-primary flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-brand-600" />
            <span>Öz-Farkındalık ve Düşünme Soruları</span>
          </div>
          <div className="space-y-2 text-xs text-text-secondary">
            {insights.reflectionQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-surface-1 border border-border-subtle/80 flex items-start space-x-2"
              >
                <span className="text-brand-600 font-bold shrink-0">{idx + 1}.</span>
                <span className="leading-relaxed">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Epistemic Boundaries & Scientific Limitations */}
      <div className="p-3.5 rounded-xl bg-surface-2/40 border border-border-subtle text-[11px] text-text-tertiary space-y-1">
        <div className="font-semibold text-text-secondary flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          <span>Bilimsel Sınırlar ve Yasal Uyarı</span>
        </div>
        <ul className="space-y-0.5">
          {insights.limitations.map((lim, idx) => (
            <li key={idx}>&bull; {lim}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
