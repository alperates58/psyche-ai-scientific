'use client';

import React from 'react';
import Link from 'next/link';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import {
  Brain,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ProfileOverviewCardV2Props {
  profile: UnifiedPsychologicalProfileV2;
}

export const ProfileOverviewCardV2: React.FC<ProfileOverviewCardV2Props> = ({ profile }) => {
  const { coverage, responseQuality, nextBestAssessment, recentAssessments } = profile;

  // Extract strongest observed patterns & underexplored areas
  const allMeasuredFacets = profile.facets.filter(
    (f) => f.measurementStatus === 'MEASURED_PRECALIBRATION' && f.score !== null
  );

  const highestFacets = [...allMeasuredFacets]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 3);

  const unmeasuredDomains = profile.domains.filter((d) => d.measuredFacetCount === 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60">
              <Sparkles className="w-3.5 h-3.5" />
              Master Psikolojik Model V2
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Ön Kalibrasyon
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Şu Ana Kadar Ne Ölçüldü?
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tamamladığınız bilimsel ölçekler üzerinden inşa edilen psikolojik profiliniz.
          </p>
        </div>

        {/* Response Quality Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-200">
              Yanıt Bütünlüğü: {responseQuality.overallFlag}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {responseQuality.totalAssessmentsAudited} oturum denetlendi
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Measured Facets */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Ölçülen Alt Boyut</span>
            <Brain className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {coverage.facetCoverage.measuredCount}
            <span className="text-sm font-normal text-slate-400 dark:text-slate-500 ml-1">
              / {coverage.facetCoverage.totalCount}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${coverage.facetCoverage.percentage}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            Model Kapsamı: %{coverage.facetCoverage.percentage}
          </div>
        </div>

        {/* Metric 2: Measured Constructs */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Psikolojik Boyut</span>
            <Layers className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {coverage.constructCoverage.measuredCount}
            <span className="text-sm font-normal text-slate-400 dark:text-slate-500 ml-1">
              / {coverage.constructCoverage.totalCount}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${coverage.constructCoverage.percentage}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            Boyut Kapsamı: %{coverage.constructCoverage.percentage}
          </div>
        </div>

        {/* Metric 3: Measured Domains */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Ana Alan</span>
            <Compass className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {coverage.domainCoverage.measuredCount}
            <span className="text-sm font-normal text-slate-400 dark:text-slate-500 ml-1">
              / {coverage.domainCoverage.totalCount}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-amber-600 dark:bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${coverage.domainCoverage.percentage}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            Alan Kapsamı: %{coverage.domainCoverage.percentage}
          </div>
        </div>

        {/* Metric 4: Completed Assessments */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Cevaplanan Madde</span>
            <CheckCircle2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {coverage.questionCoverage.answeredCount}
            <span className="text-sm font-normal text-slate-400 dark:text-slate-500 ml-1">
              / {coverage.questionCoverage.totalCount}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-sky-600 dark:bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${coverage.questionCoverage.percentage}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            {recentAssessments.length} modül tamamlandı
          </div>
        </div>
      </div>

      {/* Patterns & Underexplored Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Highest Observed Patterns */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Öne Çıkan Belirgin Eğilimler
          </h3>
          {highestFacets.length > 0 ? (
            <ul className="space-y-2">
              {highestFacets.map((facet) => (
                <li key={facet.facetId} className="flex items-center justify-between text-xs">
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {facet.nameTr}
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60">
                    {facet.score?.toFixed(2)} / 5.00
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Henüz yeterli veri bulunmuyor. Değerlendirmeleri tamamladıkça belirgin eğilimler listelenecektir.
            </p>
          )}
        </div>

        {/* Underexplored Areas */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            Henüz Taranmamış Alanlar
          </h3>
          {unmeasuredDomains.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {unmeasuredDomains.slice(0, 4).map((d) => (
                <span
                  key={d.domainId}
                  className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {d.nameTr}
                </span>
              ))}
              {unmeasuredDomains.length > 4 && (
                <span className="px-2 py-1 rounded-md text-[11px] text-slate-500 dark:text-slate-400">
                  +{unmeasuredDomains.length - 4} diğer alan
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Tüm 11 psikolojik alanda ölçüm başlatılmıştır!
            </p>
          )}
        </div>
      </div>

      {/* Suggested Next Assessment CTA */}
      {nextBestAssessment && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-950/30 dark:to-sky-950/30 border border-indigo-100 dark:border-indigo-900/40">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
              Önerilen Sıradaki Değerlendirme (Kapsam Bazlı)
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {nextBestAssessment.titleTr}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {nextBestAssessment.reasonTr} (~{nextBestAssessment.estimatedMinutes} dk)
            </div>
          </div>
          <Link
            href={nextBestAssessment.url}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-sm shrink-0"
          >
            {nextBestAssessment.ctaText}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
