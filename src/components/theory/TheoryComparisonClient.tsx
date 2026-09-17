'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

interface TheoryComparisonClientProps {
  allLenses: TheoryLensDefinition[];
  initialComparison?: TheoryComparisonResult | null;
}

export const TheoryComparisonClient: React.FC<TheoryComparisonClientProps> = ({
  allLenses,
  initialComparison = null,
}) => {
  const [selectedLensIds, setSelectedLensIds] = useState<TheoryLensId[]>([
    'FREUD',
    'ROGERS',
  ]);
  const [topic, setTopic] = useState('Kişilik Yapısı ve İçsel Dinamikler');
  const [comparison, setComparison] = useState<TheoryComparisonResult | null>(
    initialComparison
  );
  const [isLoading, setIsLoading] = useState(false);

  const predefinedTopics = [
    'Kişilik Yapısı ve İçsel Dinamikler',
    'Duygu Düzenleme ve Savunma Biçimleri',
    'Öz-Değer, İrade ve Hedef Yönelimi',
    'İlişkisel Boyutlar ve Sosyal İlgi',
    'Anlam İstenci ve Zorluklarla Başa Çıkma',
  ];

  const toggleLens = (id: TheoryLensId) => {
    if (selectedLensIds.includes(id)) {
      if (selectedLensIds.length > 2) {
        setSelectedLensIds(selectedLensIds.filter((l) => l !== id));
      }
    } else {
      if (selectedLensIds.length < 3) {
        setSelectedLensIds([...selectedLensIds, id]);
      } else {
        // replace the last one
        setSelectedLensIds([selectedLensIds[0], selectedLensIds[1], id]);
      }
    }
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
          Kuramsal Karşılaştırma Masası
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Aynı Ölçülen Kanıtlar, Farklı Büyük Kuramlar
        </h1>
        <p className="text-slate-200 text-sm max-w-3xl leading-relaxed">
          Deterministik Master Model ile ölçülmüş tek bir profil kanıt setini 2 veya 3 farklı psikolojik kuram açısından yan yana koyun; uzlaşma ve ayrışma noktalarını keşfedin.
        </p>
      </div>

      {/* Selector Controls */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        {/* Step 1: Lens Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>1. Karşılaştırılacak Kuramları Seçin (2 veya 3 Ekol):</span>
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

        {/* Step 2: Topic Selection */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="text-sm font-bold text-slate-900 dark:text-white block">
            2. Odak Konu / Tema Seçin:
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {predefinedTopics.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  topic === t
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleCompare}
            disabled={selectedLensIds.length < 2 || isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <GitCompare className="w-4 h-4" />
            )}
            <span>Seçilen Kuramları Karşılaştır</span>
          </button>
        </div>
      </div>

      {/* Comparison Output */}
      {comparison && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Side by side perspectives */}
          <div
            className={`grid grid-cols-1 md:grid-cols-${Math.min(
              3,
              comparison.lenses.length
            )} gap-6`}
          >
            {comparison.lenses.map((view) => (
              <div
                key={view.lensId}
                className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                      {view.theoristName} Merceği
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {view.lensNameTr}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {view.coreViewTr}
                  </p>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Kullanılan Temel Kavramlar:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {view.keyConceptsUsed.map((k, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {view.epistemicSegments && view.epistemicSegments.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {view.epistemicSegments.map((seg, i) => (
                      <EpistemicSegmentBadge key={i} segment={seg} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Consensus and Divergence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Consensus Points */}
            <div className="p-6 sm:p-8 rounded-3xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-4">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Uzlaşma Noktaları (Consensus)</span>
              </div>
              <ul className="space-y-2.5">
                {comparison.consensusPointsTr.map((pt, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-900/40 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium"
                  >
                    • {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Divergence Points */}
            <div className="p-6 sm:p-8 rounded-3xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-4">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-base">
                <GitCompare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Ayrışma ve Odak Farklılıkları (Divergence)</span>
              </div>
              <ul className="space-y-2.5">
                {comparison.divergencePointsTr.map((pt, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/40 text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed font-medium"
                  >
                    • {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Integrative Synthesis */}
          <div className="p-6 sm:p-8 rounded-3xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 space-y-3">
            <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-bold text-base">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Bütünleştirici Sentez (Integrative Synthesis)</span>
            </div>
            <p className="text-sm sm:text-base text-purple-950 dark:text-purple-200 leading-relaxed font-medium">
              {comparison.integrativeSynthesisTr}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
