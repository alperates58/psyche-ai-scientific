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
  TrendingUp,
} from 'lucide-react';
import { HexacoRadarChart, HexacoTraitData } from '@/components/charts/HexacoRadarChart';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getLatestProfileSnapshotForUser } from '@/services/profileService';
import { getUserAssessmentJourney } from '@/services/assessmentJourneyService';
import { PageContainer } from '@/components/ui/PageContainer';

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
  if (journey.currentStage === 'ONBOARDING_NOT_STARTED') {
    redirect('/onboarding');
  }

  const latestSnapshot = await getLatestProfileSnapshotForUser(user.id);
  const isLiveProfile = !!latestSnapshot;

  const traitMapping = [
    { id: 'honesty_humility', name: 'Honesty-Humility', name_tr: 'Dürüstlük-Alçakgönüllülük' },
    { id: 'emotionality', name: 'Emotionality', name_tr: 'Duygusallık' },
    { id: 'extraversion', name: 'Extraversion', name_tr: 'Dışadönüklük' },
    { id: 'agreeableness', name: 'Agreeableness', name_tr: 'Uyumluluk' },
    { id: 'conscientiousness', name: 'Conscientiousness', name_tr: 'Sorumluluk' },
    { id: 'openness', name: 'Openness to Experience', name_tr: 'Deneyime Açıklık' },
  ];

  let displayTraits: HexacoTraitData[] = [];
  let overallIntegrityLabel = 'Henüz Değerlendirme Yapılmadı';
  let isIntegrityGood = false;

  if (latestSnapshot && latestSnapshot.constructScores.length > 0) {
    const constructMap = new Map<string, number>();
    for (const cs of latestSnapshot.constructScores) {
      constructMap.set(cs.constructId, cs.compositeScore);
    }

    displayTraits = traitMapping.map((t) => {
      const rawScore = constructMap.get(t.id);
      // Strictly handle missing constructs as null: NEVER use midpoint imputation (?? 3.0)
      const normalizedScore =
        typeof rawScore === 'number' ? Math.round(((rawScore - 1) / 4) * 100) : null;

      return {
        name: t.name,
        name_tr: t.name_tr,
        score: normalizedScore,
        standardError: null,
        ci95: null,
        facetCount: 4,
        coverage: typeof rawScore === 'number' ? 100 : 0,
      };
    });

    overallIntegrityLabel =
      latestSnapshot.overallIntegrity === 'EXCELLENT'
        ? 'Yanıt Bütünlüğü: Temiz'
        : latestSnapshot.overallIntegrity === 'ACCEPTABLE'
        ? 'Belirgin Kalite Sorunu Saptanmadı'
        : latestSnapshot.overallIntegrity === 'QUESTIONABLE'
        ? 'İncelenmesi Önerilir'
        : 'Düşük Veri Kalitesi';

    isIntegrityGood =
      latestSnapshot.overallIntegrity === 'EXCELLENT' ||
      latestSnapshot.overallIntegrity === 'ACCEPTABLE';
  } else {
    displayTraits = traitMapping.map((t) => ({
      name: t.name,
      name_tr: t.name_tr,
      score: null,
      standardError: null,
      ci95: null,
      facetCount: 4,
      coverage: 0,
    }));
  }

  const coverageMetrics = journey.coverage;
  const nextAction = journey.nextAction;

  return (
    <PageContainer variant="wide" className="space-y-8 pb-12">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-brand-700 font-semibold tracking-wide uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            <span>Dijital Psikolojik Profil</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            İyi günler, {user.name}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Psikolojik profiliniz, tamamladığınız her yapılandırılmış değerlendirmeyle derinleşir.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/profile"
            className="inline-flex items-center px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <span>Profilimi Gör</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
          <Link
            href="/assessments"
            className="inline-flex items-center px-4 py-2.5 bg-surface-2 hover:bg-bg-subtle text-text-primary text-xs font-semibold rounded-xl border border-border-subtle shadow-xs transition-colors"
          >
            <span>Değerlendirmeler ({journey.totalAvailableAssessments})</span>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DOMINANT HERO SECTION: "SIRADAKİ ADIM" & JOURNEY TRACKER */}
      {/* ========================================================= */}
      <div className="space-y-4">
        {/* Core Profile Ready Milestone Banner */}
        {journey.coreProfileReady && journey.milestoneMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-900 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-emerald-950 text-sm">
                Temel Psikolojik Profilin Hazır!
              </p>
              <p className="text-emerald-800 leading-relaxed">
                {journey.milestoneMessage}
              </p>
            </div>
          </div>
        )}

        {/* Hero Card: Next Best Assessment */}
        {nextAction ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-surface-1 border border-brand-200/80 shadow-sm relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Sıradaki Adım</span>
                </span>

                <span className="text-xs font-medium text-text-tertiary">
                  {nextAction.assessment.classification === 'REQUIRED'
                    ? 'Zorunlu Başlangıç'
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
                  <Clock className="w-3.5 h-3.5 mr-1 text-brand-600" />
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
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] min-h-[50px]"
              >
                <span>{nextAction.ctaText}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        ) : (
          /* All available assessments completed */
          <div className="p-6 rounded-3xl bg-surface-1 border border-emerald-200/80 shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Tüm Mevcut Değerlendirmeler Tamamlandı</span>
              </div>
              <p className="text-xs text-text-secondary">
                Şu anda erişilebilir olan tüm psikometrik modülleri bitirdiniz. Profilinizi aşağıdan detaylı inceleyebilirsiniz.
              </p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <span>Profilimi Gör</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        )}

        {/* Guided Core Sequence Stepper (when in progress) */}
        {!journey.coreProfileReady && journey.requiredAssessments.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-1 border border-border-subtle shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-text-primary uppercase tracking-wider">
                Başlangıç Profil Yolculuğu
              </span>
              <span className="font-semibold text-brand-700">
                {journey.completedAssessmentsCount} / {journey.requiredAssessments.length} Tamamlandı
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {journey.requiredAssessments.map((reqItem, idx) => {
                const isDone = reqItem.status === 'COMPLETED';
                const isInProg = reqItem.status === 'IN_PROGRESS';
                const isNext = nextAction?.assessment.moduleId === reqItem.moduleId;

                return (
                  <div
                    key={reqItem.moduleId}
                    className={`p-3 rounded-xl border text-xs flex items-center space-x-2.5 ${
                      isDone
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950 font-semibold'
                        : isNext
                        ? 'bg-brand-50/50 border-brand-300 text-brand-950 font-bold ring-1 ring-brand-500/20'
                        : 'bg-surface-2/60 border-border-subtle text-text-tertiary'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isNext
                          ? 'bg-brand-600 text-white'
                          : 'bg-surface-2 text-text-tertiary border border-border-subtle'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className="truncate">{reqItem.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Progressive Disclosure: 2 Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Coverage Card */}
        <div className="bg-surface-1 p-5 rounded-card border border-border-subtle shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              Profil Kapsamı ve Ölçüm Derinliği
            </span>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/50">
              %{coverageMetrics.explorationPercentage} Keşfedildi
            </span>
          </div>
          <div className="flex items-baseline space-x-3 mb-2">
            <div className="text-2xl font-bold text-text-primary">
              {coverageMetrics.exploredFacetsCount}{' '}
              <span className="text-xs font-normal text-text-tertiary">
                / {coverageMetrics.totalOntologyFacets} Alt Boyut
              </span>
            </div>
            <div className="text-xs text-text-tertiary border-l border-border-subtle pl-3">
              Ölçüm Derinliği:{' '}
              <span className="font-semibold text-text-primary">
                %{coverageMetrics.measurementDepthPercentage}
              </span>{' '}
              (Hedef: 6 Madde/Boyut)
            </div>
          </div>
          <div className="w-full bg-bg-subtle h-2.5 rounded-full overflow-hidden mb-3 border border-border-subtle">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${coverageMetrics.explorationPercentage}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {isLiveProfile
              ? `Ön kalibrasyon formundaki ${latestSnapshot.facetScores.length} alt boyut başlangıç seviyesinde taranmıştır. Tek maddeli tarama yüksek ölçüm hassasiyeti taşımaz; boylamsal modüllerle geliştirilmektedir.`
              : 'Henüz tamamlanmış alt boyut bulunmuyor. Profilinizi oluşturmak için değerlendirme modülüne başlayın.'}
          </p>
        </div>

        {/* Measurement Quality / Integrity Card */}
        <div className="bg-surface-1 p-5 rounded-card border border-border-subtle shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Ölçüm Kalitesi ve Geçerlilik
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                  isLiveProfile
                    ? isIntegrityGood
                      ? 'text-teal-700 bg-teal-50 border-teal-200/60'
                      : 'text-amber-700 bg-amber-50 border-amber-200/60'
                    : 'text-text-tertiary bg-surface-2 border-border-subtle'
                }`}
              >
                {isLiveProfile ? 'CANLI VERİ KAYDI (ÖN KALİBRASYON)' : 'ÖLÇÜM BEKLENİYOR'}
              </span>
            </div>
            <div className="flex items-baseline space-x-2 mb-2">
              <div className="text-3xl font-bold text-text-primary">
                {isLiveProfile ? 'Ön Kalibrasyon' : 'Henüz Veri Yok'}
              </div>
              <span className="text-xs text-text-tertiary">
                {isLiveProfile ? '(Nüfus Normu Hariç)' : '(Değerlendirme Bekleniyor)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-3">
            <div className="bg-surface-2 p-2.5 rounded-lg border border-border-subtle/80">
              <div className="text-[11px] text-text-tertiary">Örneklem Durumu</div>
              <div className="font-semibold text-text-primary mt-0.5">
                {isLiveProfile ? 'TR-Ön-Kalibrasyon' : 'Veri Yok'}
              </div>
            </div>
            <div className="bg-surface-2 p-2.5 rounded-lg border border-border-subtle/80">
              <div className="text-[11px] text-text-tertiary">Yanıt Bütünlüğü</div>
              <div className="font-semibold text-text-primary mt-0.5 truncate">
                {overallIntegrityLabel}
              </div>
            </div>
          </div>
          <div className="flex items-center text-[11px] text-text-tertiary">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 mr-1.5 flex-shrink-0" />
            <span>
              {isLiveProfile
                ? 'Çoklu telemetri bütünlük takibi aktif (yanıt süresi, düz yanıtlama ve doğrulama maddesi).'
                : 'Değerlendirme tamamlandığında telemetri ve yanıt kalitesi analiz edilir.'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Core Personality Radar + Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: HEXACO Radar Card (7 Columns) */}
        <div className="lg:col-span-7 bg-surface-1 p-6 rounded-card border border-border-subtle shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-subtle">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-text-primary">Temel Kişilik Yapısı</h2>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isLiveProfile
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                      : 'bg-surface-2 text-text-tertiary border-border-subtle'
                  }`}
                >
                  {isLiveProfile ? 'ÖN KALİBRASYON (v1.0.0)' : 'HENÜZ ÖLÇÜLMEDİ'}
                </span>
              </div>
              <p className="text-xs text-text-tertiary mt-0.5">
                {isLiveProfile
                  ? 'HEXACO boyutları genelinde geçici betimsel bileşik puanlar (Ön kalibrasyon modeli)'
                  : 'HEXACO boyutları değerlendirme tamamlandıkça bilimsel algoritmalarla hesaplanır.'}
              </p>
            </div>
            <Link
              href="/profile/personality"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center transition-colors"
            >
              <span>Alt Boyutları İncele</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Radar Chart Component or Empty State */}
          {!isLiveProfile ? (
            <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-4 bg-surface-2/30 rounded-xl border border-dashed border-border-subtle my-2">
              <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600">
                <Compass className="w-6 h-6" />
              </div>
              <div className="max-w-md space-y-1.5">
                <div className="text-sm font-bold text-text-primary">
                  Henüz kişilik ölçümü bulunmuyor.
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  İlk değerlendirmenizi tamamladığınızda HEXACO boyutlarınız burada görüntülenecek.
                </p>
              </div>
              <Link
                href={nextAction?.url || '/assessment'}
                className="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors duration-150"
              >
                <span>Değerlendirmeye Başla</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          ) : (
            <div className="py-2">
              <HexacoRadarChart data={displayTraits} />
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center">
            {displayTraits.map((t) => (
              <div
                key={t.name}
                className="p-2 rounded-lg bg-surface-2 border border-border-subtle flex flex-col justify-between"
              >
                <div className="min-h-[30px] flex items-center justify-center text-[9.5px] font-medium text-text-tertiary leading-tight break-words text-center">
                  {t.name_tr || t.name}
                </div>
                <div className="text-sm font-bold text-text-primary mt-1">
                  {typeof t.score === 'number' ? t.score : '—'}
                </div>
                <div className="text-[9px] text-text-tertiary font-mono">
                  {typeof t.score === 'number' ? 'Geçici Bileşik' : 'Ölçülmedi'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Key Synthesized Insights (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary flex items-center">
              <Sparkles className="w-4 h-4 text-brand-600 mr-2" />
              Öne Çıkan Psikolojik Örüntüler
            </h2>
            <Link
              href="/insights/context"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="space-y-3.5">
            <div className="bg-surface-1 p-5 rounded-card border border-border-subtle shadow-xs space-y-3">
              <div className="text-xs font-bold text-text-primary">
                {isLiveProfile ? 'Temel Profil Analizi' : 'Henüz yeterli veri yok.'}
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {isLiveProfile
                  ? 'İlk profil ölçümünüz başarıyla tamamlandı. Bağlamsal değişimler ve kuramsal karşılaştırmalar için sonraki modüllere geçebilirsiniz.'
                  : 'Psikolojik örüntüler, tamamlanan değerlendirmelerden elde edilen ölçümlere göre oluşturulur.'}
              </p>
              <Link
                href={nextAction?.url || '/assessments'}
                className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                <span>{nextAction ? nextAction.ctaText : 'Tüm Değerlendirmeler'}</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Epistemic Transparency Callout */}
      <div className="bg-surface-1 p-5 rounded-panel border border-border-subtle shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Epistemik Ayrım İlkesi
              </h3>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
                Aktif Standart
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-3xl">
              PsycheAI, ampirik psikometrik ölçüm ile kuramsal/tarihsel yorumlamayı kesin sınırlarla birbirinden ayırır.
              Grafiklerde ve alt boyutlarda sunulan skorlar psychometric algoritmalar tarafından hesaplanır; hiçbir yapay zekâ veya kuramcı merceği ham puanınızı değiştiremez.
            </p>
          </div>
        </div>

        <Link
          href="/theory-council"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-border-default hover:bg-surface-2 text-xs font-semibold text-text-secondary transition-colors whitespace-nowrap min-h-[44px]"
        >
          <span>Kuramcılar Konseyi’ni İncele</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </PageContainer>
  );
}
