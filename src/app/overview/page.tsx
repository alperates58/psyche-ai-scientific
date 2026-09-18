import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  Layers,
  ChevronRight,
  Activity,
  Heart,
  Brain,
  BookOpen,
  PenLine,
  SlidersHorizontal,
  Target,
  FileCheck2,
} from 'lucide-react';
import { HexacoRadarChart, HexacoTraitData } from '@/components/charts/HexacoRadarChart';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { getUserAssessmentJourney } from '@/services/assessmentJourneyService';
import { PageContainer } from '@/components/ui/PageContainer';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/overview');
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  // 1. Fetch deterministic user assessment journey
  const journey = await getUserAssessmentJourney(user.id);

  // 2. If new user with 0 history, redirect to calm onboarding
  if (
    journey.currentStage === 'ONBOARDING' &&
    journey.completedAssessmentsCount === 0 &&
    journey.inProgressAssessmentsCount === 0
  ) {
    redirect('/onboarding');
  }

  // 3. Fetch authoritative Master Model Unified Psychological Profile V2
  const profile = await resolveUnifiedPsychologicalProfileV2(user.id);
  const isLiveProfile = profile.hasAssessments;

  const personalityDomain = profile.domains.find((d) => d.code === 'core_personality');
  const displayTraits: HexacoTraitData[] = (personalityDomain?.constructs || []).map((c) => ({
    name: c.nameEn,
    name_tr: c.nameTr,
    score: c.normalizedVisualCoordinate,
    standardError: null,
    ci95: null,
    facetCount: c.totalFacetCount,
    coverage: Math.round(c.coverageRatio * 100),
  }));

  const coverageMetrics = journey.coverage;
  const nextAction = journey.nextAction;

  // Filter measured facets for glance summary
  const measuredFacets = profile.facets.filter(
    (f) => f.measurementStatus === 'MEASURED_PRECALIBRATION' && f.score !== null
  );

  return (
    <PageContainer variant="wide" className="space-y-8 pb-16">
      {/* 1. TOP BANNER / WELCOME & JOURNEY STAGE */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-brand-primary font-semibold tracking-wide uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span>Kişisel Psikolojik Haritam</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Hoş geldin, {user.name || 'Gezgin'}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Psikolojik profiliniz, tamamladığınız her yapılandırılmış değerlendirmeyle derinleşir ve netleşir.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/profile"
            className="inline-flex items-center px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <span>Profilimi İncele</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
          <Link
            href="/assessments"
            className="inline-flex items-center px-4 py-2.5 bg-surface-1 hover:bg-bg-subtle text-text-primary text-xs font-semibold rounded-xl border border-border-default shadow-xs transition-colors"
          >
            <span>Değerlendirmeler ({journey.totalAvailableAssessments})</span>
          </Link>
        </div>
      </div>

      {/* 2. HERO: "ŞİMDİ NE YAPMALIYIM?" / NEXT BEST STEP */}
      <div className="space-y-4">
        {journey.coreProfileReady && journey.milestoneMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-900 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-emerald-950 text-sm">
                Temel Psikolojik Profiliniz Oluştu!
              </p>
              <p className="text-emerald-800 leading-relaxed">
                {journey.milestoneMessage}
              </p>
            </div>
          </div>
        )}

        {nextAction ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-surface-1 border border-brand-primary/30 shadow-sm relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-full border border-brand-primary/20">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Sıradaki Önerilen Adım</span>
                </span>

                <span className="text-xs font-medium text-text-tertiary">
                  {nextAction.assessment.classification === 'REQUIRED'
                    ? 'Temel Başlangıç'
                    : 'Önerilen Modül'}
                </span>

                {nextAction.status === 'IN_PROGRESS' && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    %{nextAction.assessment.progressPercentage} Tamamlandı
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                  {nextAction.title}
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
                  {nextAction.reason}
                </p>
              </div>

              <div className="flex items-center space-x-4 text-xs text-text-tertiary pt-1">
                <span className="inline-flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-brand-primary" />
                  Tahmini Süre: ~{nextAction.estimatedMinutes} dk
                </span>
                <span>•</span>
                <span>{nextAction.assessment.itemCount} Maddeli Değerlendirme</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center shrink-0">
              <Link
                href={nextAction.url}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-bold shadow-md shadow-brand-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] min-h-[50px]"
              >
                <span>{nextAction.ctaText}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-surface-1 border border-emerald-200 shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Tüm Mevcut Değerlendirmeler Tamamlandı</span>
              </div>
              <p className="text-xs text-text-secondary">
                Şu anda erişilebilir olan tüm psikometrik modülleri tamamladınız. Profilinizi aşağıdan detaylı inceleyebilirsiniz.
              </p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <span>Profilimi Gör</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        )}
      </div>

      {/* 3. PROFILE DISCOVERY & COVERAGE PROGRESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Coverage Progress Card */}
        <div className="bg-surface-1 p-5 rounded-2xl border border-border-default shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              Profil Keşif İlerlemesi
            </span>
            <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md border border-brand-primary/20">
              %{coverageMetrics.explorationPercentage} Keşfedildi
            </span>
          </div>
          <div className="flex items-baseline space-x-3">
            <div className="text-2xl font-bold text-text-primary">
              {coverageMetrics.exploredFacetsCount}{' '}
              <span className="text-xs font-normal text-text-tertiary">
                / {coverageMetrics.totalOntologyFacets} Alt Boyut
              </span>
            </div>
            <div className="text-xs text-text-tertiary border-l border-border-default pl-3">
              11 Temel Psikoloji Alanı
            </div>
          </div>
          <div className="w-full bg-bg-subtle h-2.5 rounded-full overflow-hidden border border-border-subtle">
            <div
              className="bg-brand-primary h-full rounded-full transition-all duration-700"
              style={{ width: `${coverageMetrics.explorationPercentage}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {isLiveProfile
              ? `Profilinizde ${coverageMetrics.exploredFacetsCount} alt boyut ampirik olarak haritalanmıştır. Yeni modüller tamamlandıkça profilinizin derinliği artacaktır.`
              : 'Henüz tamamlanmış alt boyut bulunmuyor. Profilinizi oluşturmak için yukarıdaki ilk değerlendirmeye başlayabilirsiniz.'}
          </p>
        </div>

        {/* Recently Completed Result or Quick Links */}
        <div className="bg-surface-1 p-5 rounded-2xl border border-border-default shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Son Tamamlanan Değerlendirme
              </span>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                {journey.completedAssessmentsCount > 0 ? `${journey.completedAssessmentsCount} Tamamlandı` : 'Başlanmadı'}
              </span>
            </div>
            {journey.recentAssessments && journey.recentAssessments.length > 0 ? (
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-text-primary">
                  {journey.recentAssessments[0].moduleTitleTr}
                </h4>
                <p className="text-xs text-text-secondary">
                  Tamamlanma: {new Date(journey.recentAssessments[0].completedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ) : (
              <p className="text-xs text-text-secondary">
                Henüz tamamlanmış bir değerlendirmeniz bulunmuyor.
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
            <Link
              href={journey.recentAssessments && journey.recentAssessments.length > 0 ? `/assessments/results/${journey.recentAssessments[0].sessionId}` : '/assessments'}
              className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center"
            >
              <span>{journey.recentAssessments && journey.recentAssessments.length > 0 ? 'Sonucu İncele' : 'Tüm Değerlendirmeler'}</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
            <Link
              href="/profile/timeline"
              className="text-xs font-semibold text-text-tertiary hover:text-text-primary"
            >
              Zaman Çizelgesi &rsaquo;
            </Link>
          </div>
        </div>
      </div>

      {/* 4. MAIN PROFILE SNAPSHOT: HEXACO RADAR & STANDOUT TRAITS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: HEXACO Radar Profile */}
        <div className="lg:col-span-7 bg-surface-1 p-6 rounded-3xl border border-border-default shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div>
              <h3 className="text-base font-bold text-text-primary">Temel Kişilik Yapısı (HEXACO)</h3>
              <p className="text-xs text-text-secondary">Ölçülen 6 ana kişilik ekseninin genel dağılımı</p>
            </div>
            <Link
              href="/profile/personality"
              className="text-xs font-semibold text-brand-primary hover:underline inline-flex items-center"
            >
              <span>Ayrıntılar</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {!isLiveProfile ? (
            <div className="py-10 px-4 text-center space-y-3 bg-bg-subtle rounded-2xl border border-dashed border-border-default">
              <Compass className="w-10 h-10 text-brand-primary mx-auto opacity-70" />
              <div className="text-sm font-bold text-text-primary">Kişilik radarı ölçüm bekliyor</div>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                İlk değerlendirmenizi tamamladığınızda 6 boyutlu kişilik yapınız burada görselleştirilir.
              </p>
            </div>
          ) : (
            <div className="py-2">
              <HexacoRadarChart data={displayTraits} />
            </div>
          )}

          {/* Construct scale positions */}
          <div className="pt-3 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
            {displayTraits.map((t) => {
              const pos = resolveConsumerScalePosition(t.score);
              return (
                <div key={t.name} className="p-2.5 rounded-xl bg-bg-subtle border border-border-subtle space-y-0.5">
                  <div className="text-[11px] font-bold text-text-primary truncate">{t.name_tr || t.name}</div>
                  <div className="text-sm font-extrabold text-brand-primary">{t.score ? t.score.toFixed(2) : '—'}</div>
                  <div className="text-[10px] text-text-tertiary">{pos.labelTr}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Prominent Measured Traits / Insights */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span>Öne Çıkan Eğilimleriniz</span>
            </h3>
            <Link href="/profile" className="text-xs font-semibold text-brand-primary hover:underline">
              Tümünü Gör
            </Link>
          </div>

          {measuredFacets.length > 0 ? (
            <div className="space-y-3">
              {measuredFacets.slice(0, 4).map((f) => {
                const pos = resolveConsumerScalePosition(f.score);
                return (
                  <div
                    key={f.facetId}
                    className="p-4 rounded-2xl bg-surface-1 border border-border-default shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-text-primary">{f.nameTr}</h4>
                      <span className="text-xs font-extrabold text-brand-primary">
                        {f.score?.toFixed(2)} <span className="text-[10px] font-normal text-text-tertiary">/ 5</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-text-secondary">{f.domainNameTr}</span>
                      <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {pos.labelTr}
                      </span>
                    </div>
                    {f.scientificDefinitionTr && (
                      <p className="text-[11px] text-text-tertiary leading-relaxed pt-1 line-clamp-2">
                        {f.scientificDefinitionTr}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-surface-1 border border-border-default text-center space-y-2">
              <Brain className="w-8 h-8 text-text-tertiary mx-auto" />
              <p className="text-xs text-text-secondary">
                Henüz tamamlanmış bir alt boyut bulunmuyor. Değerlendirmeleri tamamladıkça öne çıkan eğilimleriniz burada listelenecektir.
              </p>
            </div>
          )}

          {/* Theory Council Quick CTA */}
          {isLiveProfile && (
            <div className="p-5 rounded-2xl bg-purple-900/10 border border-purple-200 shadow-xs space-y-2">
              <div className="flex items-center space-x-2 text-purple-900 font-bold text-xs">
                <BookOpen className="w-4 h-4 text-purple-700" />
                <span>Kuramlar Konseyi ile Derinleş</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ölçülen profilinizi Freud, Jung, Adler, Rogers, Maslow ve Beck'in kuramsal pencerelerinden inceleyebilirsiniz.
              </p>
              <div className="pt-1">
                <Link
                  href="/theory-council"
                  className="inline-flex items-center text-xs font-bold text-purple-700 hover:underline"
                >
                  <span>Konseyi Ziyaret Et</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. EPISTEMIC TRANSPARENCY NOTICE */}
      <div className="bg-surface-1 p-5 rounded-2xl border border-border-default shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Epistemik Güven ve Ölçüm Şeffaflığı
            </h4>
            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed max-w-3xl">
              Skorlarınız psikometrik algoritmalarla deterministik olarak hesaplanır; yapay zekâ puanlarınızı değiştiremez veya sahte yüzdelikler üretemez.
            </p>
          </div>
        </div>
        <Link
          href="/science"
          className="text-xs font-bold text-brand-primary hover:underline whitespace-nowrap"
        >
          Bilimsel Standartlar &rsaquo;
        </Link>
      </div>
    </PageContainer>
  );
}
