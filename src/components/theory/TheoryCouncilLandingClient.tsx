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
  HelpCircle,
  Activity,
  Layers,
  Lightbulb,
} from 'lucide-react';

interface TheoryCouncilLandingClientProps {
  lenses: TheoryLensDefinition[];
  coverageRatio?: number;
  measuredFacetCount?: number;
  totalFacetCount?: number;
}

interface CanonicalTraditionGroup {
  id: string;
  name: string;
  theorists: string;
  description: string;
  lensIds: string[];
}

const CANONICAL_TRADITIONS: CanonicalTraditionGroup[] = [
  {
    id: 'psychoanalytic',
    name: 'Psikanalitik Gelenek',
    theorists: 'Sigmund Freud, Carl Jung, Alfred Adler',
    description: 'Bilinçdışı motivasyonlar, arketipler, savunma mekanizmaları ve aşağılık-üstünlük dinamikleri.',
    lensIds: ['FREUD', 'JUNG', 'ADLER'],
  },
  {
    id: 'humanistic',
    name: 'Hümanist Gelenek',
    theorists: 'Carl Rogers, Abraham Maslow',
    description: 'Kendini gerçekleştirme, benlik tutarlılığı, koşulsuz kabul ve ihtiyaçlar hiyerarşisi.',
    lensIds: ['ROGERS', 'MASLOW'],
  },
  {
    id: 'existential',
    name: 'Varoluşçu Gelenek',
    theorists: 'Viktor Frankl',
    description: 'Anlam istenci, sorumluluk, varoluşsal boşluk ve zorluklar karşısında tutumsal özgürlük.',
    lensIds: ['FRANKL'],
  },
  {
    id: 'cognitive_behavioral',
    name: 'Bilişsel ve Davranışçı Gelenek',
    theorists: 'Aaron Beck, B.F. Skinner',
    description: 'Bilişsel şemalar, otomatik düşünceler, pekiştirme örüntüleri ve çevresel koşullanma.',
    lensIds: ['BECK', 'SKINNER'],
  },
  {
    id: 'holistic_process',
    name: 'Bütünsel ve Süreç Odaklı Gelenek',
    theorists: 'Fritz Perls (Gestalt), William James',
    description: 'Şimdi ve burada farkındalığı, kapanmamış gestaltlar, bilinç akışı ve pragmatik irade.',
    lensIds: ['GESTALT', 'WILLIAM_JAMES'],
  },
];

export const TheoryCouncilLandingClient: React.FC<TheoryCouncilLandingClientProps> = ({
  lenses,
  coverageRatio = 0,
  measuredFacetCount = 0,
  totalFacetCount = 91,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Evidence-grounded 3 recommended lenses
  const recommendedLensIds = ['ROGERS', 'JUNG', 'BECK'];
  const recommendedLenses = recommendedLensIds
    .map((id) => lenses.find((l) => l.lensId === id))
    .filter((l): l is TheoryLensDefinition => Boolean(l));

  const recommendationReasons: Record<string, string> = {
    ROGERS: 'Benlik tutarlılığı ve öz-yeterlik boyutlarındaki örüntün, Rogers’ın organizmik değerlendirme modeliyle güçlü bir yansıma sunuyor.',
    JUNG: 'İçedönüklük/dışadönüklük ve yaratıcılık eğilimlerin, Jung’un bireyleşme ve psikolojik tipler haritasında derin bir karşılık buluyor.',
    BECK: 'Duygusal tepkisellik ve karar verme süreçlerindeki yapı, Beck’in bilişsel şema ve otomatik düşünce analizi için zengin bir zemin oluşturuyor.',
  };

  const curatedQuestions = [
    {
      q: 'Kendimi neden bu kadar kontrol etmeye çalışıyorum?',
      lenses: ['FREUD', 'BECK', 'ROGERS'],
    },
    {
      q: 'İlişkilerde kendimi nasıl konumlandırıyorum?',
      lenses: ['ADLER', 'ROGERS', 'FRANKL'],
    },
    {
      q: 'Hedeflerimi ve motivasyonumu ne yönlendiriyor?',
      lenses: ['MASLOW', 'ADLER', 'SKINNER'],
    },
    {
      q: 'Kendime ve hatalarıma neden bu kadar sert davranıyorum?',
      lenses: ['FREUD', 'BECK', 'ROGERS'],
    },
    {
      q: 'Karar verirken neden bu kadar çok yönlü düşünüyorum?',
      lenses: ['GESTALT', 'WILLIAM_JAMES', 'BECK'],
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-8 sm:p-12 text-white shadow-xl border border-indigo-900/50">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Kuramsal Konsil — 10 Büyük Psikoloji Merceği
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Profiline farklı psikoloji merceklerinden bak
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Ölçülen psikolojik örüntülerini 10 büyük kuramsal okulun kavramlarıyla incele. Kuramlar yeni bir skor üretmez; mevcut ölçümlerine derinlikli, yansıtıcı ve felsefi bakış açıları sunar.
          </p>

          {/* Quick Nav Pills */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <a
              href="#recommended"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
              Önerilen Mercekler
            </a>
            <a
              href="#all-lenses"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-300" />
              Tüm Kuramlar
            </a>
            <a
              href="#question-first"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-300" />
              Soruyla Keşfet
            </a>
            <Link
              href="/theory-council/compare"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-all"
            >
              <Scale className="w-3.5 h-3.5 text-amber-300" />
              Kuramları Karşılaştır
            </Link>
          </div>
        </div>
      </div>

      {/* Epistemic Guardrail Notice & Coverage Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Daha fazla değerlendirme tamamlandıkça kuramsal analizler zenginleşir.
          </p>
        </div>

        <div className="md:col-span-2 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Epistemik Ayrım Güvencesi: Kuram ve Ölçüm Birbirine Karışmaz
            </h4>
            <p className="leading-relaxed">
              Kuramsal Konsil&apos;deki tüm ekoller, deterministik ölçüm verilerinize sadık kalarak yorumlama yapar. Kuramlar skor hesaplayamaz, puanlarınızı değiştiremez veya tanı koyamaz. Her yorum açıkça <strong>Ölçülen Veri</strong>, <strong>Kuramsal Çerçeve</strong> ve <strong>Yansıtıcı Hipotez</strong> katmanlarına ayrılır.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. RECOMMENDATION-FIRST SECTION                                           */}
      {/* ========================================================================= */}
      <section id="recommended" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Sana Şu Anda En Anlamlı Olabilecek Mercekler
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Mevcut ölçüm örüntülerine ve en belirgin kişilik boyutlarına göre seçilmiş 3 öncelikli kuram.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedLenses.map((lens) => (
            <div
              key={lens.lensId}
              className="rounded-3xl border-2 border-indigo-200 dark:border-indigo-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Önerilen Mercek
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {lens.historicalPeriod}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {lens.displayNameTr}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {lens.theoristName} — <em>{lens.theoreticalTradition}</em>
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 space-y-1">
                  <div className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Neden bu mercek öneriliyor?
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {recommendationReasons[lens.lensId] || lens.shortDescriptionTr}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {lens.shortDescriptionTr}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">
                  {lens.coreConcepts.length} Ana Kavram
                </span>
                <Link
                  href={`/theory-council/${lens.lensId.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>Bu Mercekle İncele</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. QUESTION-FIRST DISCOVERY FLOW TEASER                                   */}
      {/* ========================================================================= */}
      <section
        id="question-first"
        className="rounded-3xl bg-surface-1 border border-border-default p-6 sm:p-8 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800">
              <HelpCircle className="w-3.5 h-3.5" />
              Soru Odaklı Keşif
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Bir soruyu farklı kuramlarla incele
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Hangi kuramı seçeceğini bilemiyorsan, kafandaki sorudan başla. Konsil kuramları bu soru etrafında kıyaslar.
            </p>
          </div>

          <Link
            href="/theory-council/compare"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shrink-0 shadow-xs"
          >
            <Scale className="w-4 h-4" />
            <span>Tüm Soruları Gör & Karşılaştır</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {curatedQuestions.slice(0, 3).map((item, idx) => (
            <Link
              key={idx}
              href={`/theory-council/compare?topic=${encodeURIComponent(item.q)}&lenses=${item.lenses.slice(0, 2).join(',')}`}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all space-y-2 group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                &ldquo;{item.q}&rdquo;
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>Önerilen Mercekler:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {item.lenses.join(', ')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. GROUPED 5 CANONICAL TRADITIONS (10 LENSES TOTAL)                       */}
      {/* ========================================================================= */}
      <section id="all-lenses" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              5 Kanonik Ekol & 10 Psikoloji Merceği
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Psikoloji tarihinin 10 büyük kuramı 5 ana gelenek altında gruplandırılmıştır.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-surface-2 hover:bg-surface-3 text-text-secondary border border-border-default'
              }`}
            >
              Tümü (10)
            </button>
            {CANONICAL_TRADITIONS.map((trad) => (
              <button
                key={trad.id}
                type="button"
                onClick={() => setActiveFilter(trad.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === trad.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-surface-2 hover:bg-surface-3 text-text-secondary border border-border-default'
                }`}
              >
                {trad.name.replace(' Gelenek', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Traditions list */}
        <div className="space-y-10">
          {CANONICAL_TRADITIONS.filter(
            (trad) => activeFilter === 'ALL' || activeFilter === trad.id
          ).map((trad) => {
            const groupLenses = trad.lensIds
              .map((id) => lenses.find((l) => l.lensId === id))
              .filter((l): l is TheoryLensDefinition => Boolean(l));

            return (
              <div
                key={trad.id}
                className="space-y-4 p-6 sm:p-8 rounded-3xl bg-surface-1 border border-border-default"
              >
                <div className="border-b border-border-subtle pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-text-primary">
                      {trad.name}
                    </h3>
                    <span className="text-xs text-text-tertiary font-medium">
                      {trad.theorists}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {trad.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {groupLenses.map((lens) => (
                    <div
                      key={lens.lensId}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all p-5 flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {lens.historicalPeriod}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {lens.sourceIds.length} Eser
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {lens.displayNameTr}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {lens.theoristName}
                          </p>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {lens.shortDescriptionTr}
                        </p>

                        <div className="flex items-center gap-1 flex-wrap pt-1">
                          {lens.coreConcepts.slice(0, 3).map((concept) => (
                            <span
                              key={concept.conceptId}
                              className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800"
                            >
                              {concept.nameTr}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                        <Link
                          href={`/theory-council/${lens.lensId.toLowerCase()}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all shadow-xs"
                        >
                          <span>Merceği İncele</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
