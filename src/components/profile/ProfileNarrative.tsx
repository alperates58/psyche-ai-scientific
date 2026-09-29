'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import { ProfileEvidenceBundleV2, buildProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';
import { generateStructuredPsychologicalReport } from '@/lib/profile/profileInterpretationGenerator';
import { DeepProfileInsightResultV2 } from '@/types/aiInsightV2';
import { generateEvidenceGroundedDeepFallback } from '@/lib/profile/deepProfileSynthesis';

interface ProfileNarrativeProps {
  profile: UnifiedPsychologicalProfileV2;
  evidenceBundle?: ProfileEvidenceBundleV2;
}

type DeepAnalysisState = 'idle' | 'generating' | 'completed' | 'failed' | 'fallback';

export const ProfileNarrative: React.FC<ProfileNarrativeProps> = ({ profile, evidenceBundle }) => {
  const [depthMode, setDepthMode] = useState<'quick' | 'detailed' | 'deep'>('detailed');
  const [deepState, setDeepState] = useState<DeepAnalysisState>('idle');
  const [deepResult, setDeepResult] = useState<DeepProfileInsightResultV2 | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    portrait: true,
    thinking: true,
    deciding: true,
    execution: true,
  });

  const reportSections = generateStructuredPsychologicalReport(profile);

  // Compute opaque, non-identifying cache key without PII or user IDs
  const bundle = evidenceBundle || buildProfileEvidenceBundleV2(profile);
  const facetSignature = bundle.measuredFacets.map((f) => `${f.facetId}:${f.score.toFixed(1)}`).sort().join(',');
  const cacheKey = `psycheai_deep_synth_v3_1_${facetSignature.length}_${bundle.generatedAt.slice(0, 10)}`;

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as DeepProfileInsightResultV2;
        if (parsed && parsed.headlineTr && parsed.executiveSummaryTr) {
          setDeepResult(parsed);
          setDeepState(parsed.isFallback ? 'fallback' : 'completed');
        }
      }
    } catch {
      // Storage unavailable or parse error
    }
  }, [cacheKey]);

  const handleGenerateDeepAnalysis = async () => {
    setDeepState('generating');
    setErrorMessage(null);

    try {
      // 1. Attempt authoritative API endpoint
      const response = await fetch('/api/profile/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = (await response.json()) as DeepProfileInsightResultV2;
        setDeepResult(data);
        setDeepState(data.isFallback ? 'fallback' : 'completed');
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch {
          // sessionStorage full or disabled
        }
        return;
      }
      
      // If API returns non-200 (e.g. mock session or offline test env), run deterministic synthesis
      const fallbackData = generateEvidenceGroundedDeepFallback(profile, bundle);
      setDeepResult(fallbackData);
      setDeepState('fallback');
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(fallbackData));
      } catch {
        // sessionStorage full or disabled
      }
    } catch {
      // Network or runtime issue: use deterministic synthesis
      try {
        const fallbackData = generateEvidenceGroundedDeepFallback(profile, bundle);
        setDeepResult(fallbackData);
        setDeepState('fallback');
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(fallbackData));
        } catch {
          // sessionStorage full or disabled
        }
      } catch (fallbackErr: any) {
        setDeepState('failed');
        setErrorMessage('Derin analiz oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      id="section-summary"
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
    >
      {/* Header & Depth Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Psikolojik Rapor ve Sentez
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ölçülen kanıtlarına dayanan 10 bölümlük kapsamlı psikolojik portren.
          </p>
        </div>

        {/* Depth Controls */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setDepthMode('quick')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              depthMode === 'quick'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Hızlı Özet
          </button>
          <button
            type="button"
            onClick={() => setDepthMode('detailed')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              depthMode === 'detailed'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Detaylı Rapor
          </button>
          <button
            type="button"
            onClick={() => setDepthMode('deep')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              depthMode === 'deep'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Derin Analiz
          </button>
        </div>
      </div>

      {/* QUICK SUMMARY VIEW */}
      {depthMode === 'quick' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
            <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
              Temel Psikolojik Özet:
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {reportSections.slice(0, 5).map((sec) => (
                <li key={sec.id} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">{sec.titleTr}:</strong>{' '}
                    {sec.narrativeParagraphs[0]}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* DETAILED REPORT VIEW: 10 Structured Sections */}
      {depthMode === 'detailed' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {reportSections.map((section) => {
            const isExpanded = expandedSections[section.id] !== false;

            return (
              <div
                key={section.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                      {section.titleTr}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      {section.subtitleTr}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-5 sm:px-5 space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {section.narrativeParagraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}

                    {/* Strengths / Balance Tags if present */}
                    {section.keyStrengths && section.keyStrengths.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {section.keyStrengths.map((str, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800"
                          >
                            ✓ {str}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* DEEP PROFILE ANALYSIS VIEW: Real Grounded AI Insight */}
      {depthMode === 'deep' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {deepState === 'idle' && (
            <div className="p-8 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 text-center space-y-4">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Derin Profil Analizi
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Tüm psikolojik alanların, bilişsel stratejilerin ve ölçülen alt boyutların çoklu etkileşim sentezini kanıt temelli oluşturur.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateDeepAnalysis}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md hover:shadow-indigo-500/20 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Derin Profil Analizi Oluştur</span>
              </button>
            </div>
          )}

          {deepState === 'generating' && (
            <div className="p-10 rounded-3xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 text-center space-y-4 animate-pulse">
              <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto animate-spin" />
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Kanıt Temelli Analiz Sentezleniyor...
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ölçülen {bundle.measuredFacets.length} boyut, bilişsel kalıplar ve etkileşim kuralları doğrulanıyor.
                </p>
              </div>
            </div>
          )}

          {deepState === 'failed' && (
            <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-center space-y-3">
              <AlertCircle className="w-7 h-7 text-rose-600 dark:text-rose-400 mx-auto" />
              <p className="text-xs font-semibold text-rose-900 dark:text-rose-200">
                {errorMessage || 'Analiz yüklenirken bir problemle karşılaşıldı.'}
              </p>
              <button
                type="button"
                onClick={handleGenerateDeepAnalysis}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-xs"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Tekrar Dene</span>
              </button>
            </div>
          )}

          {(deepState === 'completed' || deepState === 'fallback') && deepResult && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-slate-100 font-sans text-xs space-y-6 border border-indigo-950 shadow-xl">
              {/* Header Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-bold text-sm text-white">
                    {deepResult.headlineTr}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                      deepResult.isFallback
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                        : 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60'
                    }`}
                  >
                    {deepResult.isFallback ? 'Deterministik Kanıt Sentezi' : 'Yapay Zeka Destekli Derin Sentez'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateDeepAnalysis}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition-colors self-start sm:self-auto"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Yenile</span>
                </button>
              </div>

              {/* Executive Summary */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Yönetici Özeti
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {deepResult.executiveSummaryTr}
                </p>
              </div>

              {/* 6 Psychological Patterns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Thinking Style */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Düşünme ve Bilişsel Tarz
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {deepResult.thinkingStyle.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Decision Style */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Karar Alma ve Temkin
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {deepResult.decisionStyle.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Work Execution */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Çalışma ve İcra Disiplini
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {deepResult.workExecution.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Emotional Patterns */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    Duygusal Örüntüler ve Stres Yönetimi
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {deepResult.emotionalPatterns.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Relationship Patterns */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                    Kişilerarası Etkileşim ve İlişkiler
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {deepResult.relationshipPatterns.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Motivation Patterns */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Motivasyon ve İçsel İhtiyaçlar
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {deepResult.motivationPatterns.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Trait Interactions & Balance Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/80 pt-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-indigo-300 text-xs flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    Özellik Etkileşimleri ve Sinerjiler
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {deepResult.traitInteractions.map((inter, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{inter}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Denge Noktaları ve Durumsal Gerilimler
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {deepResult.balancePoints.map((bp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Reflection Questions */}
              {deepResult.reflectionQuestions && deepResult.reflectionQuestions.length > 0 && (
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 space-y-2.5">
                  <h4 className="font-bold text-indigo-300 text-xs flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Kişisel Yansıma Soruları
                  </h4>
                  <ul className="space-y-2 text-slate-300">
                    {deepResult.reflectionQuestions.map((q, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">{i + 1}.</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Methodological Guardrails & Limitations */}
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 text-[11px] text-slate-400">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  Metodolojik Sınırlar ve Güvenceler:
                </span>
                <ul className="space-y-1 list-disc list-inside">
                  {deepResult.limitations.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
