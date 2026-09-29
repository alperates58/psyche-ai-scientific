'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TheoryLensDefinition,
  TheoryLensId,
  TheoryComparisonResult,
} from '@/types/theoryLens';
import { EpistemicSegmentBadge } from './EpistemicSegmentBadge';
import {
  Scale,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  GitCompare,
  Layers,
  BookOpen,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

interface TheoryComparisonClientProps {
  allLenses: TheoryLensDefinition[];
  initialComparison?: TheoryComparisonResult | null;
}

interface CuratedQuestion {
  question: string;
  recommendedLensIds: TheoryLensId[];
  description: string;
}

const CURATED_QUESTIONS: CuratedQuestion[] = [
  {
    question: 'Kendimi neden bu kadar kontrol etmeye çalışıyorum?',
    recommendedLensIds: ['FREUD', 'BECK', 'ROGERS'],
    description: 'Bilinçdışı savunmalar (Freud), mükemmeliyetçi şemalar (Beck) ve koşullu öz-değer (Rogers) açısından kontrol ihtiyacını irdeler.',
  },
  {
    question: 'İlişkilerde kendimi nasıl konumlandırıyorum?',
    recommendedLensIds: ['ADLER', 'ROGERS', 'FRANKL'],
    description: 'Sosyal ilgi ve aidiyet (Adler), empatik yakınlık ve maskeler (Rogers) ile diğerleriyle sorumluluk bağı (Frankl).',
  },
  {
    question: 'Hedeflerimi ve motivasyonumu ne yönlendiriyor?',
    recommendedLensIds: ['MASLOW', 'ADLER', 'SKINNER'],
    description: 'Gereksinimler basamağı (Maslow), üstünlük ve telafi çabası (Adler) ile pekiştirme ve alışkanlık döngüleri (Skinner).',
  },
  {
    question: 'Kendime ve hatalarıma neden bu kadar sert davranıyorum?',
    recommendedLensIds: ['FREUD', 'BECK', 'ROGERS'],
    description: 'Cezalandırıcı süperego (Freud), felaketleştirici bilişsel çarpıtmalar (Beck) ve koşullu kabul yaraları (Rogers).',
  },
  {
    question: 'Karar verirken neden bu kadar çok yönlü düşünüyorum?',
    recommendedLensIds: ['GESTALT', 'WILLIAM_JAMES', 'BECK'],
    description: 'Bütünsel sezgi ve kapanış ihtiyacı (Gestalt), pragmatik bilinç akışı (James) ve kanıt tartma şemaları (Beck).',
  },
];

export const TheoryComparisonClient: React.FC<TheoryComparisonClientProps> = ({
  allLenses,
  initialComparison = null,
}) => {
  const [selectedLensIds, setSelectedLensIds] = useState<TheoryLensId[]>([
    'FREUD',
    'ROGERS',
  ]);
  const [topic, setTopic] = useState('Kendimi neden bu kadar kontrol etmeye çalışıyorum?');
  const [comparison, setComparison] = useState<TheoryComparisonResult | null>(
    initialComparison
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'question' | 'custom'>('question');

  // Handle URL query parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTopic = params.get('topic');
      const urlLenses = params.get('lenses');

      if (urlTopic) {
        setTopic(urlTopic);
      }
      if (urlLenses) {
        const ids = urlLenses.split(',').filter((id): id is TheoryLensId =>
          allLenses.some((l) => l.lensId === id)
        );
        if (ids.length >= 2 && ids.length <= 3) {
          setSelectedLensIds(ids);
        }
      }
    }
  }, [allLenses]);

  const toggleLens = (id: TheoryLensId) => {
    if (selectedLensIds.includes(id)) {
      if (selectedLensIds.length > 2) {
        setSelectedLensIds(selectedLensIds.filter((l) => l !== id));
      }
    } else {
      if (selectedLensIds.length < 3) {
        setSelectedLensIds([...selectedLensIds, id]);
      } else {
        setSelectedLensIds([selectedLensIds[0], selectedLensIds[1], id]);
      }
    }
  };

  const selectCuratedQuestion = (curated: CuratedQuestion) => {
    setTopic(curated.question);
    setSelectedLensIds(curated.recommendedLensIds.slice(0, 3));
  };

  const handleCompare = async () => {
    if (selectedLensIds.length < 2 || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/theory-council/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lensIds: selectedLensIds,
          topicOrDomain: topic,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.comparison) {
          setComparison(data.comparison);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Karşılaştırma üretilirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Comparison error:', err);
      alert('Karşılaştırma servisine bağlanırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/theory-council"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kuramsal Konsil Ana Sayfasına Dön
        </Link>
      </div>

      {/* Header */}
      <div className="p-8 rounded-3xl bg-slate-900 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white shadow-xl space-y-3 border border-indigo-900/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" />
          Kuramsal Karşılaştırma & Soru Masası
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Aynı Ölçülen Kanıtlar, Farklı Büyük Kuramlar
        </h1>
        <p className="text-slate-200 text-sm max-w-3xl leading-relaxed">
          Deterministik Master Model ile ölçülmüş tek bir profil kanıt setini 2 veya 3 farklı kuram açısından yan yana koyun; aynı psikolojik gerçeğe nasıl farklı anlamlar yüklendiğini keşfedin.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('question')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'question'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Bir Soruyu Farklı Kuramlarla İncele (Önerilen)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'custom'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          Serbest Kuram Seçimi
        </button>
      </div>

      {/* Interactive Setup Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        {/* If Question-First Tab is Active */}
        {activeTab === 'question' ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                Aşağıdaki sorulardan birini seçin:
              </h3>
              <p className="text-xs text-slate-500">
                Soruyu seçtiğinizde bu soruya en zengin bakışı sunan 2-3 kuram otomatik olarak eşleşir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CURATED_QUESTIONS.map((curated, idx) => {
                const isSelected = topic === curated.question;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectCuratedQuestion(curated)}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 dark:border-indigo-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        &ldquo;{curated.question}&rdquo;
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {curated.description}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-medium">Önerilen:</span>
                      {curated.recommendedLensIds.map((id) => (
                        <span
                          key={id}
                          className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold"
                        >
                          {id}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Step: Lens Selection */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Karşılaştırılacak Kuramlar (2 veya 3 Ekol):</span>
            </label>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {selectedLensIds.length} / 3 Seçildi
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {allLenses.map((lens) => {
              const isSelected = selectedLensIds.includes(lens.lensId);
              return (
                <button
                  key={lens.lensId}
                  type="button"
                  onClick={() => toggleLens(lens.lensId)}
                  className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 dark:border-indigo-500 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {lens.theoristName}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {lens.theoreticalTradition}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Topic Input if in custom tab */}
        {activeTab === 'custom' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Karşılaştırma Başlığı veya Odak Alanı:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Örn: Duygu Düzenleme ve Savunma Biçimleri..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="button"
            onClick={handleCompare}
            disabled={selectedLensIds.length < 2 || isLoading}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <GitCompare className="w-4 h-4" />
            )}
            <span>
              {isLoading
                ? 'Kuramsal Karşılaştırma Üretiliyor...'
                : `${selectedLensIds.length} Kuramı Yan Yana Kıyasla`}
            </span>
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6 pt-4">
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Konsil Kıyaslama Raporu
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {comparison.topicOrDomain}
              </h2>
              <p className="text-xs text-slate-500">
                Karşılaştırılan Ekoller: {comparison.comparedLensIds.join(', ')}
              </p>
            </div>

            {/* Synthesized Overview */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Bütüncül Kuramsal Sentez
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {comparison.integrativeSynthesisTr}
              </p>
            </div>

            {/* Perspectives Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {comparison.lenses.map((p) => {
                return (
                  <div
                    key={p.lensId}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {p.lensNameTr}
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {p.theoristName}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {p.coreViewTr}
                    </p>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Vurgulanan Kavramlar:
                      </span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {p.keyConceptsUsed.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {p.epistemicSegments && p.epistemicSegments.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                        {p.epistemicSegments.map((seg, idx) => (
                          <EpistemicSegmentBadge key={idx} segment={seg} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Consensus & Divergence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ortaklaştıkları / Uzlaştıkları Noktalar
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {comparison.consensusPointsTr.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
                <h4 className="font-bold text-purple-900 dark:text-purple-200 text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-600" />
                  Ayrıştıkları Temel Dinamikler
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {comparison.divergencePointsTr.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
