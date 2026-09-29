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
  Layers,
  Activity,
  Brain,
  BookOpen,
  PenLine,
  Lightbulb,
  History,
  TrendingUp,
  MapPin,
  Calendar,
} from 'lucide-react';
import { HexacoRadarChart, HexacoTraitData } from '@/components/charts/HexacoRadarChart';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { getUserAssessmentJourney } from '@/services/assessmentJourneyService';
import { getJournalEntries } from '@/services/journalService';
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

  // 4. Fetch recent journal reflection if available
  let latestJournal = null;
  try {
    const entries = await getJournalEntries(user.id, { limit: 1 });
    if (entries && entries.length > 0) {
      latestJournal = entries[0];
    }
  } catch (err) {
    // Graceful fallback if journal table is empty
  }

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

  // Salient facet for "Son Eklenen İçgörü"
  const standoutFacet = measuredFacets.find(
    (f) => f.bandInfo?.band === 'HIGH' || f.bandInfo?.band === 'LOW'
  ) || measuredFacets[0];

  return (
    <PageContainer variant="wide" className="space-y-8 pb-16">
      {/* ========================================================================= */}
      {/* 1. BUGÜNKÜ PROFİL ÖZETİ & GREETING                                        */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-6 sm:p-10 text-white shadow-xl border border-indigo-900/50">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center space-x-2 text-xs text-indigo-300 font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kişisel Psikolojik Alanın</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Hoş geldin, {user.name || 'Gezgin'}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {isLiveProfile
              ? `Profilinde 11 psikolojik alandan ${profile.domains.filter(d => d.coverageRatio > 0).length} tanesi aktif olarak haritalanmış durumda. Ölçülen örüntülerin sana dair tutarlı bir resim çiziyor.`
              : 'Psikolojik profiliniz, tamamladığınız her yapılandırılmış değerlendirmeyle derinleşir ve netleşir.'}
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Link
              href="/profile"
              className="inline-flex items-center px-5 py-2.5 bg-white text-slate-900 text-xs font-bold rounded-xl shadow-md hover:bg-slate-100 transition-colors"
            >
              <Compass className="w-4 h-4 mr-2 text-indigo-600" />
              <span>Birleşik Profilimi İncele</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Link>

            <Link
              href="/profile/map"
              className="inline-flex items-center px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-indigo-300" />
              <span>Profil Haritası</span>
            </Link>

            <Link
              href="/assessments"
              className="inline-flex items-center px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <span>Değerlendirmeler ({journey.totalAvailableAssessments})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SON EKLENEN İÇGÖRÜ & SIRADAKİ DEĞERLENDİRME                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Son Eklenen İçgörü */}
        <div className="lg:col-span-5 rounded-3xl bg-surface-1 border border-border-default p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Son Eklenen İçgörü
              </span>
              <span className="text-[11px] text-text-tertiary">Ölçüm Özeti</span>
            </div>

            {standoutFacet ? (
              <div className="space-y-2">
                <h3 className="text-base font-bold text-text-primary">
                  {standoutFacet.nameTr}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {standoutFacet.scientificDefinitionTr ||
                    'Bu alt boyuttaki ölçümünüz, durumlara yaklaşımınızda karakteristik bir eğilimi yansıtmaktadır.'}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-text-primary">
                    Puan: {standoutFacet.score?.toFixed(2)} / 5.0
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-2 text-text-secondary border border-border-subtle">
                    {standoutFacet.bandInfo?.band === 'HIGH'
                      ? 'Ölçeğin Yüksek Ucu'
                      : standoutFacet.bandInfo?.band === 'LOW'
                      ? 'Ölçeğin Düşük Ucu'
                      : 'Dengeli Bölge'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-secondary leading-relaxed">
                Henüz tamamlanmış bir değerlendirmeniz bulunmuyor. İlk değerlendirmenizi tamamladığınızda öne çıkan içgörüler burada görüntülenecektir.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-border-subtle">
            <Link
              href="/profile/facets"
              className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center"
            >
              <span>Tüm 91 Alt Boyutu Keşfet</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

        {/* Sıradaki Değerlendirme (Next Best Step) */}
        <div className="lg:col-span-7 rounded-3xl bg-surface-1 border border-brand-primary/30 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                <Compass className="w-3.5 h-3.5 text-brand-primary" />
                Sıradaki Önerilen Değerlendirme
              </span>

              {nextAction?.status === 'IN_PROGRESS' && (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  %{nextAction.assessment.progressPercentage} Tamamlandı
                </span>
              )}
            </div>

            {nextAction ? (
              <div>
                <h3 className="text-xl font-bold text-text-primary tracking-tight">
                  {nextAction.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
                  {nextAction.reason}
                </p>

                <div className="flex items-center space-x-3 text-xs text-text-tertiary pt-2">
                  <span className="inline-flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-brand-primary" />
                    ~{nextAction.estimatedMinutes} dk
                  </span>
                  <span>•</span>
                  <span>{nextAction.assessment.itemCount} Soru</span>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-emerald-700">
                  Tüm Değerlendirmeler Tamamlandı
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Şu an için katalogdaki tüm psikometrik değerlendirmeleri tamamladınız.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
            <Link
              href={nextAction?.url || '/assessments'}
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold shadow-md shadow-brand-primary/20 transition-all"
            >
              <span>{nextAction?.ctaText || 'Değerlendirmelere Git'}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PROFİL KEŞİF İLERLEMESİ & SON TAMAMLANAN SONUÇ                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profil Keşif İlerlemesi */}
        <div className="bg-surface-1 p-6 rounded-3xl border border-border-default shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-wider">
              <Layers className="w-4 h-4 text-brand-primary" />
              <span>Profil Keşif İlerlemesi</span>
            </div>
            <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md border border-brand-primary/20">
              %{coverageMetrics.explorationPercentage}
            </span>
          </div>

          <div className="flex items-baseline space-x-3">
            <div className="text-3xl font-extrabold text-text-primary">
              {coverageMetrics.exploredFacetsCount}
              <span className="text-xs font-normal text-text-tertiary ml-1.5">
                / {coverageMetrics.totalOntologyFacets} Alt Boyut
              </span>
            </div>
            <div className="text-xs text-text-tertiary border-l border-border-default pl-3">
              11 Temel Psikoloji Alanı
            </div>
          </div>

          <div className="w-full bg-surface-2 h-2.5 rounded-full overflow-hidden border border-border-subtle">
            <div
              className="bg-brand-primary h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(5, coverageMetrics.explorationPercentage)}%` }}
            />
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            {isLiveProfile
              ? `Profilinde 91 alt boyuttan ${coverageMetrics.exploredFacetsCount} tanesi ampirik olarak haritalandı. Yeni değerlendirmeler çözdükçe haritan derinleşir.`
              : 'Henüz tamamlanmış alt boyut bulunmuyor. Profilinizi oluşturmak için yukarıdaki ilk değerlendirmeye başlayabilirsiniz.'}
          </p>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
            <Link
              href="/profile/map"
              className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center"
            >
              <span>Profil Haritasını Gör</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
            <Link
              href="/profile/facets"
              className="text-xs font-semibold text-text-tertiary hover:text-text-primary"
            >
              91 Alt Boyut Rehberi &rsaquo;
            </Link>
          </div>
        </div>

        {/* Son Tamamlanan Değerlendirme */}
        <div className="bg-surface-1 p-6 rounded-3xl border border-border-default shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Son Tamamlanan Değerlendirme</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                {journey.completedAssessmentsCount > 0 ? `${journey.completedAssessmentsCount} Tamamlandı` : 'Başlanmadı'}
              </span>
            </div>

            {profile.recentAssessments && profile.recentAssessments.length > 0 ? (
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-text-primary">
                  {profile.recentAssessments[0].moduleTitleTr}
                </h4>
                <p className="text-xs text-text-secondary">
                  Tamamlanma: <span suppressHydrationWarning>{new Date(profile.recentAssessments[0].completedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' })}</span>
                </p>
                <p className="text-xs text-text-tertiary leading-relaxed">
                  Bu testin sonuçları ve profiline eklediği boyutlar için sonuç raporunu görüntüleyebilirsin.
                </p>
              </div>
            ) : (
              <p className="text-xs text-text-secondary leading-relaxed">
                Henüz tamamlanmış bir değerlendirmeniz bulunmuyor. İlk değerlendirmenizi tamamladığınızda sonuç karnesi burada listelenecektir.
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
            <Link
              href={profile.recentAssessments && profile.recentAssessments.length > 0 ? (profile.recentAssessments[0].resultUrl || `/assessments/results/${profile.recentAssessments[0].sessionId}`) : '/assessments'}
              className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center"
            >
              <span>{profile.recentAssessments && profile.recentAssessments.length > 0 ? 'Sonuç Raporunu Aç' : 'Değerlendirmelere Başla'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
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

      {/* ========================================================================= */}
      {/* 4. KURAMSAL MERCEK ÖNERİSİ & YANSIMALARDAN SON TEMA                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kuramsal Mercek Önerisi */}
        <div className="bg-surface-1 p-6 rounded-3xl border border-border-default shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <BookOpen className="w-3.5 h-3.5" />
                Kuramsal Mercek Önerisi
              </span>
              <span className="text-[11px] text-text-tertiary">Konsil</span>
            </div>

            <div>
              <h4 className="text-base font-bold text-text-primary">
                Carl Rogers: Benlik Bütünlüğü ve İçsel Tutarlılık
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed mt-1">
                Ölçülen kişilik ve benlik boyutların, Rogers&apos;ın organizmik değerlendirme sürecinde zengin bir yansıma buluyor. Kendi deneyimlerine ne kadar güvendiğini kuramın gözünden keşfet.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
            <Link
              href="/theory-council/rogers"
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center"
            >
              <span>Rogers ile İncele</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
            <Link
              href="/theory-council"
              className="text-xs font-semibold text-text-tertiary hover:text-text-primary"
            >
              Tüm 10 Kuram &rsaquo;
            </Link>
          </div>
        </div>

        {/* Yansımalardan Son Tema / Günlük Farkındalık */}
        <div className="bg-surface-1 p-6 rounded-3xl border border-border-default shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                <PenLine className="w-3.5 h-3.5" />
                Yansımalardan Son Tema
              </span>
              <span className="text-[11px] text-text-tertiary">Farkındalık</span>
            </div>

            {latestJournal ? (
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-text-primary line-clamp-1">
                  {latestJournal.title || 'Son Günlük Notun'}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                  &ldquo;{latestJournal.body}&rdquo;
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-text-primary">
                  Günün Yansıtıcı Sorusu
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  &ldquo;Bugün stresli ya da belirsiz bir anla karşılaştığında ilk otomatik tepkin ne oldu? Bu tepkiyi profilindeki hangi boyutla ilişkilendirirsin?&rdquo;
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
            <Link
              href="/journal"
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center"
            >
              <span>{latestJournal ? 'Tüm Yansımalarını Gör' : 'Yeni Not Ekle'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
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

      {/* ========================================================================= */}
      {/* 5. HEXACO RADAR PREVIEW                                                   */}
      {/* ========================================================================= */}
      {isLiveProfile && (
        <div className="bg-surface-1 p-6 sm:p-8 rounded-3xl border border-border-default shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Temel Kişilik Radarı (HEXACO 6 Boyut)
              </h3>
              <p className="text-xs text-text-secondary">
                Ölçülen 6 ana kişilik ekseninin genel dağılımı
              </p>
            </div>
            <Link
              href="/profile/personality"
              className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center"
            >
              <span>Kişilik Alanını Gör</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="py-2">
            <HexacoRadarChart data={displayTraits} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. EPISTEMIC TRANSPARENCY NOTICE                                          */}
      {/* ========================================================================= */}
      <div className="bg-surface-1 p-5 rounded-2xl border border-border-default shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Epistemik Güven ve Bilimsel Metodoloji
            </h4>
            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed max-w-3xl">
              Skorlarınız deterministik psikometrik modellerle hesaplanır; yapay zeka puan üretmez veya tanı koymaz. Toplum normlarıyla karşılaştırma henüz sunulmamaktadır.
            </p>
          </div>
        </div>
        <Link
          href="/profile/science"
          className="text-xs font-bold text-brand-primary hover:underline whitespace-nowrap"
        >
          Bilimsel Standartlar &rsaquo;
        </Link>
      </div>
    </PageContainer>
  );
}
