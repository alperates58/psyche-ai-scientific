'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TheoryLensDefinition } from '@/types/theoryLens';
import {
  Brain,
  Sparkles,
  Scale,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers,
  HelpCircle,
  Activity,
} from 'lucide-react';

interface TheoryCouncilLandingClientProps {
  lenses: TheoryLensDefinition[];
  coverageRatio?: number;
  measuredFacetCount?: number;
  totalFacetCount?: number;
}

export const TheoryCouncilLandingClient: React.FC<TheoryCouncilLandingClientProps> = ({
  lenses,
  coverageRatio = 0,
  measuredFacetCount = 0,
  totalFacetCount = 91,
}) => {
  const [selectedTradition, setSelectedTradition] = useState<string>('ALL');

  const traditions = [
    { id: 'ALL', label: 'Tüm Ekoller (10)' },
    { id: 'Psikanaliz', label: 'Psikanaliz & Analitik (Freud, Jung, Adler)' },
    { id: 'Hümanist', label: 'Hümanist & Varoluşçu (Rogers, Maslow, Frankl)' },
    { id: 'Bilişsel', label: 'Bilişsel & Davranışçı (Beck, Skinner)' },
    { id: 'Pragmatizm', label: 'Bütünsel & Süreç (Gestalt, William James)' },
  ];

  const filteredLenses = lenses.filter((lens) => {
    if (selectedTradition === 'ALL') return true;
    if (selectedTradition === 'Psikanaliz') {
      return ['FREUD', 'JUNG', 'ADLER'].includes(lens.lensId);
    }
    if (selectedTradition === 'Hümanist') {
      return ['ROGERS', 'MASLOW', 'FRANKL'].includes(lens.lensId);
    }
    if (selectedTradition === 'Bilişsel') {
      return ['BECK', 'SKINNER'].includes(lens.lensId);
    }
    if (selectedTradition === 'Pragmatizm') {
      return ['GESTALT', 'WILLIAM_JAMES'].includes(lens.lensId);
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-900 via-slate-900 to-purple-950 p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            FAZ 2.19 — Kanıta Dayalı Kuramsal Konsil
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Kuramsal Konsil: Psikolojinin 10 Büyük Merceği
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Deterministik Master Model (11 Alan, 37 Boyut, 91 Alt Boyut) ile ölçülmüş psikolojik profilinizi, psikoloji tarihinin en etkili 10 kuramsal çerçevesi üzerinden inceleyin ve yansıtıcı diyaloglar yürütün.
          </p>

          <div className="pt-2 flex items-center gap-4 flex-wrap">
            <Link
              href="/theory-council/compare"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-md hover:bg-slate-100 transition-all"
            >
              <Scale className="w-4 h-4 text-indigo-600" />
              Kuramları Karşılaştır (2-3 Ekol)
            </Link>
            <Link
              href="/profile/overview"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              <Compass className="w-4 h-4 text-indigo-300" />
              Birleşik Profilime Dön
            </Link>
          </div>
        </div>
      </div>

      {/* Coverage & Governance Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Coverage card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Profil Ölçüm Kapsamı
            </span>
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            %{Math.round(coverageRatio * 100)}
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({measuredFacetCount} / {totalFacetCount} Alt Boyut)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${Math.max(5, Math.min(100, coverageRatio * 100))}%` }}
            />
          </div>
        </div>

        {/* Epistemic Separation Notice */}
        <div className="md:col-span-2 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Bilimsel ve Epistemik Ayrım Güvencesi
            </h4>
            <p className="leading-relaxed">
              Kuramsal Konsil&apos;deki tüm ekoller, deterministik ölçüm verilerinize sadık kalarak yorumlama yapar. Kuramlar skor hesaplayamaz, puanlarınızı değiştiremez veya klinik teşhis koyamaz. Her yorum açıkça <strong>Ölçülen Veri</strong>, <strong>Kuramsal Çerçeve</strong> ve <strong>Yansıtıcı Hipotez</strong> olarak ayrıştırılır.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {traditions.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTradition(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedTradition === t.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Lens Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLenses.map((lens) => (
          <div
            key={lens.lensId}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all p-6 flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-1.5">
                    {lens.historicalPeriod}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {lens.displayNameTr}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {lens.theoristName} — <em>{lens.theoreticalTradition}</em>
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {lens.shortDescriptionTr}
              </p>

              {/* Core Concepts */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Temel Kavramlar:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {lens.coreConcepts.map((concept) => (
                    <span
                      key={concept.conceptId}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      {concept.nameTr}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>{lens.sourceIds.length} Eser</span>
              </div>

              <Link
                href={`/theory-council/${lens.lensId.toLowerCase()}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all shadow-xs"
              >
                <span>Merceği İncele</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
