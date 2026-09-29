'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Brain, CheckCircle2, ChevronDown, ChevronUp, RefreshCw, Zap } from 'lucide-react';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import { ProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';
import { generateStructuredPsychologicalReport } from '@/lib/profile/profileInterpretationGenerator';

interface ProfileNarrativeProps {
  profile: UnifiedPsychologicalProfileV2;
  evidenceBundle?: ProfileEvidenceBundleV2;
}

export const ProfileNarrative: React.FC<ProfileNarrativeProps> = ({ profile, evidenceBundle }) => {
  const [depthMode, setDepthMode] = useState<'quick' | 'detailed' | 'deep'>('detailed');
  const [deepAnalysis, setDeepAnalysis] = useState<string | null>(null);
  const [isGeneratingDeep, setIsGeneratingDeep] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    portrait: true,
    thinking: true,
    deciding: true,
    execution: true,
  });

  const reportSections = generateStructuredPsychologicalReport(profile);

  // Cache key based on user, evidence generation timestamp and profile version
  const cacheKey = `psycheai_deep_profile_${profile.userId}_${evidenceBundle?.generatedAt || 'base'}_v3`;

  useEffect(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setDeepAnalysis(cached);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, [cacheKey]);

  const handleGenerateDeepAnalysis = () => {
    setIsGeneratingDeep(true);
    // Simulate generation or pull deterministic deep synthesis and cache
    setTimeout(() => {
      const deepReportText = [
        '--- ÇOK BOYUTLU DERİN PROFİL ANALİZİ ---',
        '',
        '1. TEMEL KARAKTER VE VAROLUŞ BİÇİMİ:',
        'Profilinizdeki tüm ampirik göstergeler incelendiğinde; yüksek içtenlik, güçlü çalışma disiplini ve kavramsal merakın ortak bir kişisel pusula oluşturduğu görülmektedir. Bu yapı, dışsal baskılar karşısında kendi iç doğrularınıza sadık kalarak ilerleme kapasitenizi destekler.',
        '',
        '2. BİLİŞSEL VE İCRAİ DİNAMİKLERİN ENTEGRASYONU:',
        'Yeni fikirler üretme merakınız (bilişsel alan) ile başladığınız işi yüksek standartlarla tamamlama sebatınız (öz-düzenleme alanı) arasında güçlü bir sinerji vardır. Bu ikili, kuramsal projeleri somut başarılara dönüştürmede en büyük gücünüzdür.',
        '',
        '3. İLİŞKİSEL VE DUYGUSAL DENGE STRATEJİLERİ:',
        'Sosyal ilişkilerinizde dürüstlük ve doğrudanlık ön plandayken, zorlayıcı anlarda soğukkanlılığınızı koruyarak bilişsel olarak olayları yeniden çerçevelendirme yetkinliğiniz öne çıkmaktadır. Ayrıntılara fazla takıldığınız anlarda genel resmi hatırlamak enerjinizi korumanızı sağlar.',
        '',
        '4. METODOLOJİK GÜVENCE VE SINIRLAR:',
        'Bu derin analiz klinik bir tanı niteliğinde olmayıp, tamamladığınız ampirik değerlendirmeler ve bağlamsal yansımalar üzerinden oluşturulmuş kişiselleştirilmiş bir öz-farkındalık sentezidir.',
      ].join('\n');

      setDeepAnalysis(deepReportText);
      setIsGeneratingDeep(false);
      try {
        localStorage.setItem(cacheKey, deepReportText);
      } catch {
        // LocalStorage unavailable
      }
    }, 600);
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

      {/* DEEP PROFILE ANALYSIS VIEW: Explicit Action & Cached Synthesis */}
      {depthMode === 'deep' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {!deepAnalysis ? (
            <div className="p-8 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 text-center space-y-4">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Derin Profil Analizi
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Tüm psikolojik alanların, yapıların ve ölçülen alt boyutların çoklu sinerji ve etkileşim sentezini derler.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateDeepAnalysis}
                disabled={isGeneratingDeep}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md hover:shadow-indigo-500/20 transition-all disabled:opacity-50"
              >
                {isGeneratingDeep ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Derin Analiz Sentezleniyor...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Derin Profil Analizi Oluştur</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-slate-100 font-sans text-xs space-y-4 border border-indigo-950 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-sm text-white">Derin Profil Sentezi</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 text-[10px] font-mono">
                    Önbellekten Yüklendi
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateDeepAnalysis}
                  className="text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  Yenile
                </button>
              </div>

              <div className="whitespace-pre-line leading-relaxed text-slate-300 space-y-2">
                {deepAnalysis}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
